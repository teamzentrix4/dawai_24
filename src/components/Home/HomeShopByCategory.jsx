"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomeShopByCategory({ categories = [] }) {
  if (!categories.length) return null;

  return (
    <section data-slot="shop-by-categories" data-testid="home-categories" className="bg-white py-8 md:py-12">
      <div className="container-x">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between md:mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF6B5A]">Browse our range</p>
            <h2 data-testid="home-categories-heading" className="mt-1 text-[24px] font-bold text-[#171725] md:text-[30px]">Shop by Category</h2>
          </div>
          <p className="text-sm text-[#696974]">Choose a category to explore its subcategories</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 md:gap-5">
          {categories.map((category, index) => {
            const image = category.imageUrl || `/img/cat-main-${index % 6}.${index % 6 === 5 ? "svg" : "png"}`;
            return (
              <Link key={category.id || category.slug} href={`/category/${category.slug}`} className="group overflow-hidden rounded-2xl border border-[#E7EAF0] bg-white transition-all duration-200 hover:-translate-y-1 hover:border-[#FF6B5A]/40 hover:shadow-lg">
                <div className="flex h-28 items-center justify-center bg-[#F8FAFC] p-4 sm:h-32 md:h-36">
                  <img src={image} alt={category.name} className="h-full max-w-full object-contain transition-transform duration-200 group-hover:scale-105" onError={(event) => { event.currentTarget.style.display = "none"; }} />
                </div>
                <div className="min-h-24 p-4">
                  <h3 className="line-clamp-2 text-sm font-bold uppercase leading-5 text-[#171725]">{category.name}</h3>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#FF6B5A]">Explore <ArrowRight size={15} aria-hidden="true" /></span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
