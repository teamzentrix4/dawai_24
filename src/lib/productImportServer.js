import { randomUUID } from "node:crypto";
import { readSheet } from "read-excel-file/node";
import { maxProductFileBytes, readProductRows, validateProductRows } from "./productImport.js";
import { productData, slugifyProduct } from "./productWizard.js";
import { reserveProductIds } from "./productIdentity.js";

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

  const reservedSkus = new Set(parsed.rows.map(({ values }) => values.sku).filter(Boolean));
  for (const { values, errors } of parsed.rows) {
    if (values.sku || errors.sku) continue;
    let sku;
    do {
      sku = "AUTO-" + randomUUID().toUpperCase();
    } while (reservedSkus.has(sku));
    values.sku = sku;
    reservedSkus.add(sku);
  }

  async function checkAndSave(tx) {
    const [categories, existing] = await Promise.all([
      tx.category.findMany({ select: { id: true, slug: true, name: true, active: true, subcategories: { select: { id: true, slug: true, name: true, active: true } } } }),
      tx.product.findMany({
        where: { OR: [{ sku: { in: parsed.rows.map(row => row.values.sku) } }, { slug: { in: parsed.rows.map(row => row.values.slug) } }] },
        select: { sku: true, slug: true },
      }),
    ]);
    const rows = validateProductRows(parsed.rows, categories, existing);
    const errors = rows.filter(row => Object.keys(row.errors).length).map(row => ({ row: row.number, fields: row.errors }));
    const warnings = rows.filter(row => Object.keys(row.warnings).length).map(row => ({ row: row.number, fields: row.warnings }));
    if (errors.length || !commit) return { total: rows.length, errors, warnings };
    const productIds = await reserveProductIds(tx, rows.length);

    const brands = new Map();
    for (const { values } of rows) {
      if (values.brand) {
        const slug = slugifyProduct(values.brand);
        if (!brands.has(slug)) brands.set(slug, values.brand);
      }
    }
    const brandIds = new Map();
    if (brands.size) {
      await tx.brand.createMany({ data: [...brands].map(([slug, name]) => ({ slug, name })), skipDuplicates: true });
      const accounts = await tx.brand.findMany({ where: { slug: { in: [...brands.keys()] } }, select: { slug: true, id: true } });
      for (const { slug, id } of accounts) brandIds.set(slug, id);
    }
    const products = await tx.product.createManyAndReturn({
      data: rows.map(({ values }, index) => ({ ...productData(values, brandIds.get(slugifyProduct(values.brand)) ?? null, false), id: productIds[index] })),
      select: { id: true, sku: true },
    });
    const ids = new Map(products.map(product => [product.sku, product.id]));
    const images = rows.flatMap(({ values }) => values.gallery_images.map((url, sortOrder) => ({
      productId: ids.get(values.sku), url, sortOrder,
    })));
    if (images.length) await tx.productImage.createMany({ data: images });
    return { imported: products.length, warnings };
  }

  try {
    return commit ? await db.$transaction(checkAndSave, { timeout: 30000, isolationLevel: "ReadCommitted" }) : await checkAndSave(db);
  } catch (error) {
    if (error.code === "P2002") return { message: "Another product used a SKU or slug during import. Check the workbook again. No rows were imported." };
    return { message: commit ? "The import could not finish. Try checking the workbook again." : "Could not check the workbook. Please try again." };
  }
}
