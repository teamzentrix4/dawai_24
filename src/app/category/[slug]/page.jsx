import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Boxes, Grid2X2, HeartPulse, Package, Sparkles, Stethoscope } from "lucide-react";
import Breadcrumbs from "@/components/Common/Breadcrumbs";
import CategorySearchBar from "@/components/Common/CategorySearchBar";
import { db } from "@/lib/db";
import { isPendingCategory, publicCategoryFilter } from "@/lib/productWizard";

export const dynamic = "force-dynamic";

const subcategoryIcons = [Boxes, Package, Stethoscope, HeartPulse, Grid2X2, Sparkles];

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = await db.category.findUnique({
    where: { slug },
    include: { subcategories: { where: publicCategoryFilter, orderBy: { sortOrder: "asc" } } },
  });

  if (!category || !category.active || isPendingCategory(category)) notFound();

  return (
    <main className="container-x pb-16 pt-5 md:pt-8 space-y-4">
      {/* Search Bar for this category */}
      <CategorySearchBar />

      <Link href="/categories" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#233A5E] hover:text-[#FF6B5A]">
        <ArrowLeft size={16} aria-hidden="true" /> Back to all categories
      </Link>
      <Breadcrumbs className="!px-0 !pb-0 !pt-3" items={[{ label: "Categories", href: "/categories" }, { label: category.name }]} />
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF6B5A]">Explore {category.name}</p>
          <h1 className="mt-1 text-2xl font-black text-[#171725] md:text-3xl">{category.name} Subcategories</h1>
        </div>
        <p className="text-sm text-[#696974]">Pick a subcategory to see products</p>
      </div>

      {category.subcategories.length ? (
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 md:gap-5">
          {category.subcategories.map((subcategory, index) => {
            const Icon = subcategoryIcons[index % subcategoryIcons.length];
            return (
              <Link key={subcategory.id} href={`/category/${category.slug}/${subcategory.slug}`} className="group overflow-hidden rounded-2xl border border-[#E7EAF0] bg-white transition-all duration-200 hover:-translate-y-1 hover:border-[#FF6B5A]/40 hover:shadow-lg">
                <div className="relative flex h-28 items-center justify-center overflow-hidden bg-[#EDF6FF] sm:h-32 md:h-36">
                  <div className="absolute -right-7 -top-8 h-28 w-28 rounded-full bg-white/40" />
                  <Icon className="relative text-[#2389DF]" size={42} strokeWidth={1.8} aria-hidden="true" />
                </div>
                <div className="min-h-25 p-3.5">
                  <h2 className="line-clamp-2 text-xs font-bold uppercase leading-4 text-[#171725]">{subcategory.name}</h2>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#FF6B5A]">Explore products <ArrowRight size={13} aria-hidden="true" /></span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-500">No subcategories are available in {category.name} yet.</div>
      )}
    </main>
  );
}
