import { categoryVerificationOptions, isPendingCategory, validateProduct } from "./productWizard.js";

export const requiredProductColumns = ["product_name"];
export const optionalProductColumns = [
  "selling_price", "sku", "brand", "manufacturer", "category", "subcategory", "category_status", "mrp", "discount", "stock_status", "pack_size", "unit", "country_of_origin", "stock",
  "prescription_required", "short_description", "description", "image_url", "gallery_images", "meta_title",
  "meta_description", "meta_keywords", "source_url", "category_source_url",
];
export const maxProductRows = 500;
export const maxProductFileBytes = 2 * 1024 * 1024;
const columns = [...requiredProductColumns, ...optionalProductColumns];
const aliases = { name: "product_name", price: "selling_price", stock_quantity: "stock", main_image_url: "image_url", prescriptionrequired: "prescription_required" };
const cellText = value => value == null || value instanceof Date ? "" : String(value).trim();
const missingMrp = /^(?:[-–—]|n\s*\/?\s*a|not available|not listed|null)$/i;

function workbookPrice(value) {
  const amount = value.replace(/^(?:₹|INR\b|Rs\.?)\s*/i, "");
  if (/^(?:-?\d{1,3}(?:,\d{3})+|-?\d{1,2}(?:,\d{2})+,\d{3})(?:\.\d+)?$/.test(amount)) return amount.replaceAll(",", "");
  return amount || value;
}

export function readProductRows(sheet) {
  const [header = [], ...data] = sheet;
  const positions = new Map();
  for (const [index, cell] of header.entries()) {
    const key = cellText(cell).toLowerCase().replace(/[\s-]+/g, "_");
    const column = Object.hasOwn(aliases, key) ? aliases[key] : key;
    if (!columns.includes(column)) continue;
    if (positions.has(column)) return { message: "Column " + column + " appears more than once." };
    positions.set(column, index);
  }
  const missing = requiredProductColumns.filter(key => !positions.has(key));
  if (missing.length) return { message: "Missing required headings in row 1: " + missing.join(", ") + "." };

  const rows = [];
  const productCells = [...positions.values()];
  for (const [index, cells] of data.entries()) {
    if (!productCells.some(position => cells[position] instanceof Date || cellText(cells[position]))) continue;
    if (rows.length === maxProductRows) return { message: "Upload at most " + maxProductRows + " product rows at a time." };
    const errors = {};
    const values = Object.fromEntries(columns.map(key => {
      const value = cells[positions.get(key)];
      if (value instanceof Date) errors[key] = "Use a text or number cell instead of an Excel date.";
      return [key, cellText(value)];
    }));
    const prescription = values.prescription_required.toLowerCase();
    if (prescription && !["true", "false", "yes", "no", "1", "0"].includes(prescription)) errors.prescription_required = "Use Yes or No.";
    values.prescriptionRequired = prescription ? String(["true", "yes", "1"].includes(prescription)) : "";
    values.mrp = missingMrp.test(values.mrp) ? "" : workbookPrice(values.mrp);
    values.selling_price = workbookPrice(values.selling_price);
    values.discount = values.discount.replace(/%$/, "").trim();
    values.slug = "";
    values.gallery_images = values.gallery_images.split(/[|\r\n]+/).map(value => value.trim()).filter(Boolean);
    rows.push({ number: index + 2, values, errors });
  }
  return rows.length ? { rows } : { message: "Add at least one product below the header row." };
}

export function resolveItem(items, lookup) {
  const key = lookup.toLowerCase();
  const exact = items.find(item => item.id === lookup || item.slug.toLowerCase() === key);
  if (exact) return exact;
  const names = items.filter(item => item.name.trim().toLowerCase() === key);
  return names.length === 1 ? names[0] : undefined;
}

export function validateProductRows(rows, categories) {
  const catalogue = categories.filter(category => !isPendingCategory(category));
  return rows.map(row => {
    const values = { ...row.values };
    const category = resolveItem(catalogue, values.category);
    const subcategory = resolveItem(category?.subcategories.filter(item => !isPendingCategory(item)) ?? [], values.subcategory);
    values.category = category?.id ?? "";
    values.subcategory = subcategory?.id ?? "";
    const warnings = {};
    if (!category) warnings.category = row.values.category ? "Pending review: " + row.values.category.slice(0, 120) : "No category supplied. Pending review.";
    if (row.values.subcategory && !subcategory) warnings.subcategory = "Pending review: " + row.values.subcategory.slice(0, 120);
    if (!values.mrp && !row.errors.mrp) warnings.mrp = "MRP left blank.";
    const errors = validateProduct({ ...values, stock: values.stock || "0" }, category ? [category] : []);
    return { ...row, values, source: row.values, warnings, errors: { ...errors, ...row.errors } };
  });
}

export const pendingVerification = categoryVerificationOptions[0];
