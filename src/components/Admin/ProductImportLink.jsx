import Link from "next/link";
import { Upload } from "lucide-react";

export default function ProductImportLink() {
  return <Link href="/admin/products/import" className="inline-flex h-11 items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 text-sm font-bold text-[#7b2cbf] hover:bg-violet-100">
    <Upload size={17} aria-hidden="true" />
    Bulk upload (Excel)
  </Link>;
}
