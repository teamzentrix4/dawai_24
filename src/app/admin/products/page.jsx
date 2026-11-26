import Link from "next/link";
import { Upload } from "lucide-react";
import { db } from "@/lib/db";
import { isPendingCategory } from "@/lib/productWizard";
import PageHeader from "@/components/Admin/PageHeader";
import ProductTable from "@/components/Admin/ProductTable";
import PublishAllProducts from "@/components/Admin/PublishAllProducts";
import { deleteProduct, publishAllProducts, toggleProduct } from "../actions";

export const dynamic = "force-dynamic";

export default async function Products() {
  const rows = await db.product.findMany({
    include: { category: true, subcategory: true, brand: true },
    orderBy: { createdAt: "desc" },
  });
  const draftCount = rows.filter(product => !product.active).length;
  const products = rows.map(product => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku ?? "",
    imageUrl: product.imageUrl,
    brand: product.brand?.name || "",
    category: !product.category || isPendingCategory(product.category) ? "Pending review" : product.category.name,
    subcategory: isPendingCategory(product.subcategory) ? "Pending review" : product.subcategory?.name || "",
    price: product.price == null ? null : Number(product.price),
    mrp: product.mrp == null ? null : Number(product.mrp),
    stock: product.stock,
    active: product.active,
  }));

  return <section>
    <PageHeader
      title="Products"
      description="Search, publish and manage every product shown on the storefront."
      actionLabel="Add product"
      actionHref="/admin/products/new"
      secondaryAction={<>
        <Link href="/admin/products/import" className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-[#7b2cbf] hover:bg-violet-50">
          <Upload size={16} />Import Excel
        </Link>
        <PublishAllProducts action={publishAllProducts} draftCount={draftCount} />
      </>}
    />
    {products.length ? (
      <ProductTable products={products} deleteAction={deleteProduct} toggleAction={toggleProduct} />
    ) : (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <h2 className="text-lg font-extrabold">Your catalogue is empty</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">Add the first product after creating its category. Published products appear on the customer website immediately.</p>
        <Link href="/admin/products/new" className="mt-5 inline-flex rounded-xl bg-[#7b2cbf] px-5 py-3 text-sm font-bold text-white">Add first product</Link>
      </div>
    )}
  </section>;
}
