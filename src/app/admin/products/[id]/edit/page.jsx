import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import ProductForm from "@/components/Admin/ProductForm";
import { saveProduct } from "../../../actions";

export const dynamic = "force-dynamic";

export default async function EditProduct({ params }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    db.product.findUnique({ where: { id }, include: { brand: true, images: { orderBy: { sortOrder: "asc" } } } }),
    db.category.findMany({ include: { subcategories: { orderBy: { name: "asc" } } }, orderBy: { name: "asc" } }),
  ]);
  if (!product) notFound();

  const value = {
    product_id: product.id, product_name: product.name, slug: product.slug, sku: product.sku,
    brand: product.brand?.name, manufacturer: product.manufacturer,
    category: product.categoryId, subcategory: product.subcategoryId, category_status: product.categoryStatus, pack_size: product.packSize ?? product.pack,
    unit: product.unit, country_of_origin: product.countryOfOrigin, prescriptionRequired: String(product.prescriptionRequired),
    mrp: product.mrp?.toString(), selling_price: product.price?.toString(), discount: product.discount?.toString(),
    stock_status: product.stockStatus, stock: String(product.stock),
    short_description: product.shortDescription, description: product.description,
    image_url: product.imageUrl, gallery_images: product.images.map(image => image.url),
    meta_title: product.seoTitle, meta_description: product.seoDescription, meta_keywords: product.metaKeywords,
    source_url: product.sourceUrl, category_source_url: product.categorySourceUrl,
    active: product.active, created_at: product.createdAt?.toISOString(), updated_at: product.updatedAt.toISOString(),
  };
  return <ProductForm key={id} categories={categories} action={saveProduct} product={value} />;
}
