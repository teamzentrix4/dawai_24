import Link from "next/link";
import PageHeader from "@/components/Admin/PageHeader";
import ProductImportForm from "@/components/Admin/ProductImportForm";
import { importProducts } from "./actions";

export default function ProductImportPage() {
  return <section>
    <PageHeader title="Import products" parent="Products" description="Upload an Excel workbook to add products as drafts." />
    <ProductImportForm action={importProducts} />
    <Link href="/admin/products" className="mt-5 inline-flex text-sm font-bold text-[#7b2cbf] hover:underline">Back to products</Link>
  </section>;
}
