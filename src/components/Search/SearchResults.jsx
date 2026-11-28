"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SearchX, Loader2 } from "lucide-react";
import ProductListing from "@/components/Products/ProductListing";
import { useEffect, useState } from "react";

export default function SearchResults() {
  const q = (useSearchParams().get("q") || "").trim();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!q) {
      setProducts([]);
      return;
    }

    setLoading(true);
    fetch(`/api/medicines/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.medicines || []);
        setCategories(data.categories || []);
      })
      .catch((err) => {
        console.error("Search fetch failed:", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [q]);

  if (!q) {
    return (
      <div className="card p-10 text-center bg-white border border-[#E2E8F0] rounded-3xl">
        <SearchX size={40} className="mx-auto text-[#FF6B5A]" />
        <h1 className="font-bold text-lg mt-3 text-[#171725]">Search Dawai24 Medicines</h1>
        <p className="text-sm text-[#696974] mt-1">
          Type a medicine name, active salt composition, or brand above.
        </p>
        <div className="mt-4">
          <Link href="/medicines" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#2E7D32] text-white text-xs font-bold hover:bg-[#256628] transition-colors">
            Browse All Medicines
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#F0F2F5] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#171725] tracking-tight">
            Results for &ldquo;{q}&rdquo;
          </h1>
          <p className="text-xs sm:text-sm text-[#696974] mt-0.5">
            Matching medicine names, brand manufacturers, and active salt compositions.
          </p>
        </div>
        {!loading && (
          <span className="text-xs font-bold text-[#2E7D32] bg-[#F0FDF4] border border-[#2E7D32]/20 px-3 py-1.5 rounded-full w-fit">
            {products.length} products found
          </span>
        )}
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#171725]">Matching Categories:</span>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="text-xs font-semibold px-3 py-1 bg-[#F8FAFC] border border-[#E2E8F0] text-[#171725] hover:border-[#2E7D32] hover:text-[#2E7D32] rounded-full transition-colors"
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center space-y-3">
          <Loader2 size={32} className="animate-spin text-[#2E7D32] mx-auto" />
          <p className="text-xs sm:text-sm text-[#696974] font-medium">
            Searching medicine database...
          </p>
        </div>
      ) : products.length === 0 ? (
        <div className="card p-10 text-center bg-white border border-[#E2E8F0] rounded-3xl space-y-3">
          <SearchX size={40} className="mx-auto text-gray-400" />
          <p className="font-bold text-base text-[#171725]">
            No medicines found for &ldquo;{q}&rdquo;
          </p>
          <p className="text-xs sm:text-sm text-[#696974] max-w-sm mx-auto">
            Try checking the spelling, searching by active chemical salt (e.g. Paracetamol, Pantoprazole), or browsing our catalog.
          </p>
          <div className="pt-2">
            <Link href="/medicines" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#2E7D32] text-white text-xs font-bold hover:bg-[#256628] transition-colors">
              Browse All Medicines
            </Link>
          </div>
        </div>
      ) : (
        <ProductListing key={q} products={products} />
      )}
    </div>
  );
}
