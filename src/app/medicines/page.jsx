import Link from "next/link";
import ProductListing from "@/components/Products/ProductListing";
import CategorySearchBar from "@/components/Common/CategorySearchBar";
import { getActiveProducts } from "@/lib/dbCatalog";

export const metadata = { title: "Buy Medicines Online | Dawai24" };
export const dynamic = "force-dynamic";

export default async function MedicinesPage({ searchParams }) {
  const sp = await searchParams;
  const q = sp?.q?.trim();
  const where = q ? {
    OR: [
      { name: { contains: q, mode: "insensitive" } },
      { sku: { contains: q, mode: "insensitive" } },
      { shortDescription: { contains: q, mode: "insensitive" } },
      { manufacturer: { contains: q, mode: "insensitive" } },
      { brand: { is: { name: { contains: q, mode: "insensitive" } } } }
    ]
  } : {};

  const products = await getActiveProducts(where);

  return (
    <div className="min-h-screen bg-white pb-16">
      <div className="container-x py-3">
        <nav className="flex gap-2 text-xs sm:text-sm text-[#696974]">
          <Link href="/" className="hover:text-[#171725]">Home</Link>
          <span>/</span>
          <span className="font-semibold text-[#FF6B5A]">Medicines</span>
        </nav>
      </div>

      <main className="container-x space-y-6">
        {/* Customer-facing medicine search bar */}
        <CategorySearchBar />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#F0F2F5] pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#171725] tracking-tight">
              {q ? `Search Results for "${q}"` : "All Medicines"}
            </h1>
            <p className="text-xs sm:text-sm text-[#696974] mt-0.5">
              Showing authentic medicines and verified bioequivalent substitutes.
            </p>
          </div>
          <span className="text-xs font-bold text-[#2E7D32] bg-[#F0FDF4] border border-[#2E7D32]/20 px-3 py-1.5 rounded-full w-fit">
            {products.length} products available
          </span>
        </div>

        <ProductListing products={products} />
      </main>
    </div>
  );
}
