import { randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { readSheet } from "read-excel-file/node";
import { maxProductFileBytes, readProductRows, validateProductRows } from "./productImport.js";
import { slugifyProduct, suggestedProductSlug } from "./productWizard.js";
import { lockProductCreation, reserveProductIds } from "./productIdentity.js";
import { mergeColumns, normalizeProductName, planProductImport } from "./productImportMerge.js";

async function generateImportSlugs(tx, rows, productIds) {
  const bases = rows.map(({ data }, index) => suggestedProductSlug(data.name, productIds[index]));
  const collisions = await tx.product.findMany({ where: { slug: { in: bases } }, select: { slug: true } });
  if (!collisions.length) return bases;

  const variants = await tx.product.findMany({
    where: { OR: collisions.map(({ slug }) => ({ slug: { startsWith: slug + "-" } })) },
    select: { slug: true },
  });
  const used = new Set([...collisions, ...variants].map(({ slug }) => slug));
  return bases.map(base => {
    let slug = base;
    for (let suffix = 2; used.has(slug); suffix++) slug = base + "-" + suffix;
    used.add(slug);
    return slug;
  });
}

async function findExistingProducts(tx, rows) {
  const names = [...new Set(rows.map(({ values }) => normalizeProductName(values.product_name)).filter(Boolean))];
  const skus = [...new Set(rows.map(({ values }) => values.sku).filter(Boolean))];
  const named = names.length ? await tx.$queryRaw`
    SELECT id FROM "Product"
    WHERE lower(btrim(regexp_replace(name, '[[:space:]]+', ' ', 'g'))) IN (${Prisma.join(names)})
  ` : [];
  return tx.product.findMany({
    where: { OR: [{ id: { in: named.map(({ id }) => id) } }, { sku: { in: skus } }] },
    include: { brand: { select: { name: true } }, images: { take: 1, select: { url: true } } },
  });
}

async function fillExistingProducts(tx, updates, brandIds) {
  if (!updates.length) return;
  const entries = updates.map(entry => {
    const patch = { ...entry.patch };
    if (!entry.data.brandId && entry.brand) patch.brandId = brandIds.get(slugifyProduct(entry.brand));
    return { id: entry.id, updatedAt: entry.updatedAt.toISOString(), patch };
  });
  // Compare updatedAt so a concurrent admin change cannot be overwritten by a stale import plan.
  const assignments = Prisma.join(Object.entries(mergeColumns).map(([key, [column, type]]) =>
    Prisma.sql`${Prisma.raw('"' + column + '"')} = CASE WHEN incoming.patch ? ${key} THEN (incoming.patch ->> ${key})::${Prisma.raw(type)} ELSE p.${Prisma.raw('"' + column + '"')} END`
  ));
  const count = await tx.$executeRaw`
    UPDATE "Product" AS p
    SET ${assignments}, "updatedAt" = clock_timestamp() AT TIME ZONE 'UTC'
    FROM jsonb_to_recordset(${JSON.stringify(entries)}::jsonb) AS incoming(id text, "updatedAt" timestamp(3), patch jsonb)
    WHERE p.id = incoming.id AND p."updatedAt" = incoming."updatedAt"
  `;
  if (count !== updates.length) throw Object.assign(new Error("Product changed during import"), { code: "IMPORT_CHANGED" });
}

export async function importProductWorkbook(db, file, commit) {
  if (!file || typeof file.arrayBuffer !== "function" || !/\.xlsx$/i.test(file.name ?? "") || !file.size) {
    return { message: "Choose an Excel workbook (.xlsx)." };
  }
  if (file.size > maxProductFileBytes) return { message: "The workbook must be 2 MB or smaller." };

  let sheet;
  try {
    sheet = await readSheet(await file.arrayBuffer(), 1, { trim: false });
  } catch {
    return { message: "Could not read the first sheet. Open the workbook in Excel and save it as .xlsx." };
  }
  const parsed = readProductRows(sheet);
  if (!parsed.rows) return parsed;

  async function checkAndSave(tx) {
    if (commit) await lockProductCreation(tx);
    const [categories, existing] = await Promise.all([
      tx.category.findMany({ select: { id: true, slug: true, name: true, active: true, subcategories: { select: { id: true, slug: true, name: true, active: true } } } }),
      findExistingProducts(tx, parsed.rows),
    ]);
    const rows = validateProductRows(parsed.rows, categories);
    const errors = rows.filter(row => Object.keys(row.errors).length).map(row => ({ row: row.number, fields: row.errors }));
    if (errors.length) return { total: rows.length, errors };
    const { creates, updates, skipped, warnings } = planProductImport(rows, existing, categories);
    for (const { row, data } of creates) {
      if (data.price == null) errors.push({ row, fields: { selling_price: "Enter a selling price for this new product." } });
    }
    const counts = { imported: creates.length, updated: updates.length, skipped };
    // Preview counts are separate from the saved result, even for a browser tab on an older UI.
    if (errors.length || !commit) return { total: rows.length, preview: counts, warnings, errors };
    const completed = { completed: true, ...counts, warnings };
    if (!creates.length && !updates.length) return completed;
    const productIds = creates.length ? await reserveProductIds(tx, creates.length) : [];
    const slugs = creates.length ? await generateImportSlugs(tx, creates, productIds) : [];

    const brands = new Map();
    for (const { brand, data } of [...creates, ...updates]) {
      if (brand && !data.brandId) {
        const slug = slugifyProduct(brand);
        if (!brands.has(slug)) brands.set(slug, brand);
      }
    }
    const brandIds = new Map();
    if (brands.size) {
      await tx.brand.createMany({ data: [...brands].map(([slug, name]) => ({ slug, name })), skipDuplicates: true });
      const accounts = await tx.brand.findMany({ where: { slug: { in: [...brands.keys()] } }, select: { slug: true, id: true } });
      for (const { slug, id } of accounts) brandIds.set(slug, id);
    }
    await fillExistingProducts(tx, updates, brandIds);
    if (creates.length) {
      await tx.product.createMany({
        data: creates.map(({ data, brand }, index) => ({
          ...data, id: productIds[index], sku: data.sku || "AUTO-" + randomUUID().toUpperCase(),
          slug: slugs[index], brandId: brandIds.get(slugifyProduct(brand)) ?? null,
        })),
      });
    }
    const images = [
      ...creates.flatMap((entry, index) => entry.gallery.map((url, sortOrder) => ({ productId: productIds[index], url, sortOrder }))),
      ...updates.filter(entry => !entry.hasGallery).flatMap(entry => entry.gallery.map((url, sortOrder) => ({ productId: entry.id, url, sortOrder }))),
    ];
    if (images.length) await tx.productImage.createMany({ data: images });
    return completed;
  }

  try {
    if (!commit) return await checkAndSave(db);
    const options = { timeout: 30000, isolationLevel: "ReadCommitted" };
    try {
      return await db.$transaction(checkAndSave, options);
    } catch (error) {
      if (error.code !== "P2002" || !String(error.meta?.target).includes("slug")) throw error;
      return await db.$transaction(checkAndSave, options);
    }
  } catch (error) {
    if (error.code === "IMPORT_CHANGED") return { message: "A product changed while importing. Check the workbook again before saving." };
    if (error.code === "P2002") return { message: "Another product used a SKU or slug during import. Check the workbook again. No rows were imported." };
    return { message: commit ? "The import could not finish. Try checking the workbook again." : "Could not check the workbook. Please try again." };
  }
}
