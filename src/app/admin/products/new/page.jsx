import { db } from "@/lib/db";
import ProductForm from "@/components/Admin/ProductForm";
import ProductImportLink from "@/components/Admin/ProductImportLink";
import { saveProduct } from "../../actions";

export const dynamic = "force-dynamic";

export default async function NewProduct() {
  const categories = await db.category.findMany({ include: { subcategories: { orderBy: { name: "asc" } } }, orderBy: { name: "asc" } });
  return <ProductForm categories={categories} action={saveProduct} headerAction={<ProductImportLink />} />;
}
