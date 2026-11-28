import Link from "next/link";
import { db } from "@/lib/db";
import BrandSearchBar from "@/components/Search/BrandSearchBar";

export const dynamic = "force-dynamic";
export const metadata = { title: "Medicine Brands | Dawai24" };

export default async function Brands({ searchParams }) {
  const sp = await searchParams;
  const q = sp?.q?.trim();
  const rows = await db.brand.findMany({
    where: {
      active: true,
      ...(q ? { name: { contains: q, mode: "insensitive" } } : {})
    },
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: { name: "asc" }
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-[4.5%] my-[1.25%] flex gap-2 text-sm lg:mx-[8%]">
        <Link href="/">Home</Link>
        <span>/</span>
        <span className="text-[#fc5a5a]">Brands</span>
      </div>
      <main className="mx-[4.5%] rounded-xl border p-[4%] lg:mx-[8%] lg:p-[2%_4%]">
        <h1 className="text-2xl font-semibold">Medicine Brands</h1>
        <p className="mt-2 text-slate-500">
          Brands are created automatically when products are added from administration.
        </p>
        <BrandSearchBar initialQuery={q || ""} />
        {rows.length ? (
          <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {rows.map((x) => (
              <Link
                key={x.id}
                href={`/brands/${x.slug}`}
                className="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#fc5a5a] transition-colors"
              >
                {x.name}
                <span className="ml-2 text-xs text-slate-400">
                  {x._count.products}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="py-14 text-center text-sm text-slate-500">
            No brands found for &quot;{q}&quot;.
          </p>
        )}
      </main>
    </div>
  );
}
