import { pendingVerification, resolveItem } from "./productImport.js";
import { isPendingCategory, productData, slugifyProduct } from "./productWizard.js";

export const normalizeProductName = value => (value ?? "").trim().replace(/\s+/g, " ").toLowerCase();

// Only these fields can be filled on a match. IDs, names, slugs and visibility stay as they are.
export const mergeColumns = {
  sku: ["sku", "text"], manufacturer: ["manufacturer", "text"],
  categoryId: ["categoryId", "text"], subcategoryId: ["subcategoryId", "text"], categoryStatus: ["category_status", "text"],
  brandId: ["brandId", "text"], packSize: ["pack_size", "text"], pack: ["pack", "text"], unit: ["unit", "text"],
  countryOfOrigin: ["country_of_origin", "text"], mrp: ["mrp", "numeric"], price: ["price", "numeric"],
  discount: ["discount", "numeric"], stock: ["stock", "integer"], stockStatus: ["stock_status", "text"],
  prescriptionRequired: ["prescriptionRequired", "boolean"], shortDescription: ["short_description", "text"],
  description: ["description", "text"], imageUrl: ["imageUrl", "text"], seoTitle: ["seoTitle", "text"],
  seoDescription: ["seoDescription", "text"], metaKeywords: ["meta_keywords", "text"],
  sourceUrl: ["source_url", "text"], categorySourceUrl: ["category_source_url", "text"],
};
const specific = new Set(["categoryId", "subcategoryId", "categoryStatus", "categorySourceUrl", "brandId", "packSize", "pack", "mrp", "price", "discount"]);
const missing = value => value == null || (typeof value === "string" && value.trim() === "");
const compatible = (one, two, normalize = normalizeProductName) => missing(one) || missing(two) || normalize(one) === normalize(two);
const manualSku = sku => sku && !sku.startsWith("AUTO-");

function keepExisting(entry, incoming, row, categories, warnings) {
  const data = entry.data;
  const set = (key, value) => {
    if (Object.is(data[key], value)) return;
    data[key] = value;
    if (entry.id) entry.patch[key] = value;
  };
  const fill = (key, value) => {
    if (missing(data[key]) && !missing(value)) set(key, value);
  };

  for (const key of Object.keys(mergeColumns)) {
    if (!specific.has(key)) fill(key, incoming[key]);
  }
  if (!entry.brand && row.values.brand) entry.brand = row.values.brand;
  if (!entry.gallery.length && row.values.gallery_images.length) entry.gallery = row.values.gallery_images;
  if (compatible(data.pack, incoming.pack)) {
    fill("packSize", incoming.packSize);
    fill("pack", incoming.pack);
  }

  const oldCategory = categories.get(data.categoryId);
  const oldSubcategory = oldCategory?.subcategories.find(item => item.id === data.subcategoryId);
  if (incoming.categoryId && (!data.categoryId || isPendingCategory(oldCategory))
      && (!data.subcategoryId || isPendingCategory(oldSubcategory))) {
    set("categoryId", incoming.categoryId);
    if (data.subcategoryId) set("subcategoryId", null);
  }
  const current = categories.get(data.categoryId);
  const sameCategory = !row.source.category || incoming.categoryId === current?.id;
  if (sameCategory) {
    fill("categoryStatus", incoming.categoryStatus);
    fill("categorySourceUrl", incoming.categorySourceUrl);
  }
  if (current && !isPendingCategory(current)) {
    if (!row.source.category) delete warnings.category;
    const subcategory = sameCategory && resolveItem(current.subcategories.filter(item => !isPendingCategory(item)), row.source.subcategory);
    if (subcategory) {
      const old = current.subcategories.find(item => item.id === data.subcategoryId);
      if (!data.subcategoryId || isPendingCategory(old)) set("subcategoryId", subcategory.id);
      delete warnings.subcategory;
    }
  }
  if (data.mrp != null) delete warnings.mrp;

  if (incoming.mrp != null && (data.price == null || Number(incoming.mrp) >= Number(data.price))) fill("mrp", incoming.mrp);
  else if (data.mrp == null && incoming.mrp != null) warnings.mrp = "Excel MRP is below the saved selling price.";
  if (incoming.price != null && (data.mrp == null || Number(incoming.price) <= Number(data.mrp))) fill("price", incoming.price);
  else if (data.price == null && incoming.price != null) warnings.selling_price = "Excel selling price exceeds the saved MRP.";
  if (data.mrp != null && Number(data.mrp) > 0) fill("discount", incoming.discount);
}

export function planProductImport(rows, existing, catalogue) {
  const categories = new Map(catalogue.map(category => [category.id, category]));
  const byName = new Map();
  const bySku = new Map();
  const creates = [];
  const matched = new Set();
  const warnings = [];

  function index(entry) {
    const key = normalizeProductName(entry.data.name);
    if (!byName.has(key)) byName.set(key, []);
    byName.get(key).push(entry);
    if (entry.data.sku) bySku.set(entry.data.sku, entry);
  }
  for (const product of existing) {
    const { brand, images, ...data } = product;
    index({ id: product.id, data, brand: brand?.name ?? "", gallery: images.map(image => image.url), hasGallery: images.length > 0, patch: {}, updatedAt: product.updatedAt });
  }

  for (const row of rows) {
    const notes = { ...row.warnings };
    const { values } = row;
    const incoming = productData(values, null, false);
    // Blank cells should not look like explicit zero stock or "No" in a batch with repeated rows.
    incoming.stock = values.stock === "" ? null : incoming.stock;
    incoming.prescriptionRequired = values.prescriptionRequired === "" ? null : incoming.prescriptionRequired;
    const name = normalizeProductName(values.product_name);
    const skuMatch = incoming.sku && bySku.get(incoming.sku);
    const sameVariant = entry => compatible(entry.brand, values.brand, slugifyProduct)
      && compatible(entry.data.pack, incoming.pack)
      && compatible(entry.data.unit, incoming.unit);
    const matches = byName.get(name)?.filter(entry => sameVariant(entry)
      && (!manualSku(entry.data.sku) || !manualSku(incoming.sku) || entry.data.sku === incoming.sku)
    ) ?? [];

    if (skuMatch && (normalizeProductName(skuMatch.data.name) !== name || !sameVariant(skuMatch))) {
      notes.duplicate = "Skipped because this SKU belongs to a product with a different name, brand or pack.";
    } else if (!skuMatch && matches.length > 1) {
      notes.duplicate = "Skipped because more than one product matches. Add the correct SKU to identify it.";
    } else {
      const entry = skuMatch || matches[0];
      if (entry) {
        keepExisting(entry, incoming, row, categories, notes);
        if (entry.data.sku) bySku.set(entry.data.sku, entry);
        if (entry.id) matched.add(entry);
      } else {
        const newEntry = { data: incoming, brand: values.brand, gallery: values.gallery_images, row: row.number };
        newEntry.pendingSubcategory = Boolean(notes.subcategory);
        creates.push(newEntry);
        index(newEntry);
      }
    }
    if (Object.keys(notes).length) warnings.push({ row: row.number, fields: notes });
  }
  const updates = [...matched].filter(entry => Object.keys(entry.patch).length || (!entry.data.brandId && entry.brand) || (!entry.hasGallery && entry.gallery.length));
  for (const entry of creates) {
    entry.data.stock ??= 0;
    entry.data.prescriptionRequired ??= false;
    if (!entry.data.categoryStatus && (!entry.data.categoryId || (entry.pendingSubcategory && !entry.data.subcategoryId))) {
      entry.data.categoryStatus = pendingVerification;
    }
    if (!entry.data.mrp || Number(entry.data.mrp) <= 0) entry.data.discount = null;
  }
  return { creates, updates, skipped: rows.length - creates.length - updates.length, warnings };
}
