export const productSteps = [
  { title: "Basic information", fields: { product_name: "Product name", brand: "Brand", manufacturer: "Manufacturer", sku: "SKU", slug: "Product URL slug", product_id: "Product ID" } },
  { title: "Category & packaging", fields: { category: "Category", subcategory: "Subcategory", category_status: "Category verification", pack_size: "Pack size", unit: "Unit", country_of_origin: "Country of origin", prescriptionRequired: "Prescription" } },
  { title: "Price & stock", fields: { mrp: "MRP", selling_price: "Selling price", discount: "Discount (%)", stock_status: "Stock status", stock: "Stock quantity" } },
  { title: "Product description", fields: { short_description: "Short description", description: "Full description" } },
  { title: "Product images", fields: { image_url: "Main image URL", gallery_images: "Gallery images" } },
  { title: "SEO & source references", fields: { meta_title: "Meta title", meta_description: "Meta description", meta_keywords: "Meta keywords", source_url: "Source reference URL", category_source_url: "Category source URL" } },
  { title: "Review & save", fields: { created_at: "Created at", updated_at: "Updated at" } },
];

export const slugifyProduct = value => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const suggestedProductSlug = (name, id) => [slugifyProduct(name), id?.toLowerCase()].filter(Boolean).join("-");
export const categoryVerificationOptions = [
  "Needs product-level confirmation", "Listed by PlatinumRx", "Suggested from product name",
];
export const productStockOptions = ["Out of stock", "Low stock", "In stock"];
const pendingCategorySlugs = ["category-pending-review", "subcategory-pending-review"];
export const isPendingCategory = item => Boolean(item && [item.name, item.slug].some(value => pendingCategorySlugs.includes(slugifyProduct(value ?? ""))));
export const publicCategoryFilter = {
  active: true,
  NOT: [{ name: { in: ["Category pending review", "Subcategory pending review"], mode: "insensitive" } }, { slug: { in: pendingCategorySlugs, mode: "insensitive" } }],
};
export const publicProductFilter = {
  active: true, category: { is: publicCategoryFilter }, mrp: { not: null }, price: { not: null }, sku: { not: null },
  OR: [{ subcategoryId: null }, { subcategory: { is: publicCategoryFilter } }],
};
export function canPublishProduct(product) {
  const { category, subcategory, sku, mrp, price } = product;
  return Boolean(sku?.trim() && category?.active && !isPendingCategory(category)
    && (!subcategory || (subcategory.active && !isPendingCategory(subcategory)))
    && mrp != null && price != null && Number(price) >= 0 && Number(mrp) >= Number(price));
}
export const stockStatus = quantity => Number(quantity) === 0 ? "Out of stock" : Number(quantity) <= 5 ? "Low stock" : "In stock";
export const discountPercent = (mrp, price) => Number(mrp) > 0 && price !== "" && Number(price) >= 0 && Number(price) <= Number(mrp)
  ? String(Math.round((1 - Number(price) / Number(mrp)) * 100)) : "";

export function validProductUrl(value, allowLocal = false) {
  if (allowLocal && /^\/(?![\\/])[^\\\s]*$/.test(value)) return true;
  if (!/^https?:\/\//i.test(value)) return false;
  try {
    const url = new URL(value);
    return Boolean(url.hostname && !url.username && !url.password);
  } catch {
    return false;
  }
}

export function validateProduct(values, categories, { publishing = false, existingSlug = "" } = {}) {
  const errors = {};
  if (!values.product_name.trim()) errors.product_name = "Enter a product name.";
  if (publishing && !values.sku.trim()) errors.sku = "Enter a SKU.";
  if (values.slug.trim() && values.slug !== existingSlug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.slug.trim())) errors.slug = "Use lowercase letters, numbers and single hyphens.";
  if (values.brand.trim() && !slugifyProduct(values.brand)) errors.brand = "Enter a brand with at least one letter or number.";
  const category = categories.find(item => item.id === values.category);
  const subcategory = category?.subcategories.find(item => item.id === values.subcategory);
  if (!category && (values.category || publishing)) errors.category = "Select a category.";
  else if (publishing && (!category.active || isPendingCategory(category))) errors.category = "Select an active catalogue category to publish.";
  if (values.subcategory && !subcategory) errors.subcategory = "Select a subcategory from the chosen category.";
  else if (publishing && subcategory && (!subcategory.active || isPendingCategory(subcategory))) errors.subcategory = "Select an active subcategory or leave this blank.";

  for (const field of ["mrp", "selling_price"]) {
    if (!values[field].trim() && !publishing) continue;
    if (!/^\d+(?:\.\d{1,2})?$/.test(values[field].trim()) || Number(values[field]) > 99999999.99) {
      errors[field] = "Enter a non-negative price with up to two decimal places.";
    }
  }
  if (!errors.mrp && !errors.selling_price && values.mrp.trim() && values.selling_price.trim() && Number(values.selling_price) > Number(values.mrp)) errors.selling_price = "Selling price cannot exceed MRP.";
  if (values.discount && (!/^\d+(?:\.\d{1,2})?$/.test(values.discount) || Number(values.discount) > 100)) errors.discount = "Enter a percentage from 0 to 100.";
  if (values.category_status && !categoryVerificationOptions.includes(values.category_status)) errors.category_status = "Select a supported category verification value.";
  if (values.stock_status && !productStockOptions.includes(values.stock_status)) errors.stock_status = "Select a supported stock status.";
  if (!/^\d+$/.test(values.stock.trim()) || Number(values.stock) > 2147483647) errors.stock = "Enter a non-negative whole number.";

  for (const field of ["image_url", "source_url", "category_source_url"]) {
    if (values[field].trim() && !validProductUrl(values[field].trim(), field === "image_url")) errors[field] = "Enter a valid HTTP or HTTPS URL.";
  }
  values.gallery_images.forEach((value, index) => {
    if (value.trim() && !validProductUrl(value.trim(), true)) errors[`gallery_images.${index}`] = "Enter a valid HTTP or HTTPS image URL.";
  });
  return errors;
}

export function productData(values, brandId, active) {
  const optional = key => values[key] || null;
  return {
    name: values.product_name, sku: optional("sku"), slug: values.slug, brandId,
    manufacturer: optional("manufacturer"), categoryId: optional("category"), subcategoryId: optional("subcategory"),
    categoryStatus: optional("category_status"),
    packSize: optional("pack_size"), unit: optional("unit"),
    pack: /^\d+(?:\.\d+)?$/.test(values.pack_size) && values.unit ? values.pack_size + " " + values.unit : optional("pack_size") ?? optional("unit"),
    countryOfOrigin: optional("country_of_origin"), prescriptionRequired: values.prescriptionRequired === "true",
    mrp: optional("mrp"), price: optional("selling_price"), discount: optional("discount"),
    stock: Number(values.stock), stockStatus: optional("stock_status"),
    shortDescription: optional("short_description"), description: optional("description"), imageUrl: optional("image_url"),
    seoTitle: optional("meta_title"), seoDescription: optional("meta_description"), metaKeywords: optional("meta_keywords"),
    sourceUrl: optional("source_url"), categorySourceUrl: optional("category_source_url"), active,
  };
}
