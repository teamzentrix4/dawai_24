"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { money } from "@/lib/catalog";
import ProductImage from "@/components/Common/ProductImage";

export default function ProductCard({ product: p }) {
  const { requestAddToCart, cart } = useStore();
  const inCart = (cart || []).some((item) => (item.id === p.id || item.productId === p.id));

  return (
    <div className="bg-white rounded-2xl border border-[#ECEEF2] p-4 flex flex-col justify-between h-full relative hover:shadow-md transition-shadow">
      
      {/* Top Section: Image with Scalloped Green Ribbon Discount Badge */}
      <div className="relative mb-3 flex justify-center">
        {p.discount > 0 && (
          <div className="absolute -top-1 -right-1 z-10">
            {/* Scalloped badge matching reference image */}
            <div className="bg-[#489E37] text-white text-[10px] font-black px-2 py-1.5 rounded-b-lg rounded-tl-lg shadow-sm flex flex-col items-center leading-none tracking-tight">
              <span>{p.discount}%</span>
              <span className="text-[9px] font-bold">OFF</span>
            </div>
          </div>
        )}

        <Link href={`/products/${p.slug}`} className="block w-full max-w-[205px] h-24 sm:h-28 mx-auto overflow-hidden rounded-xl">
          <ProductImage 
            product={p} 
            className="w-full h-full" 
          />
        </Link>
      </div>

      {/* Middle Section: Title, Manufacturer/Brand, Pack details */}
      <div className="flex-1 flex flex-col justify-start">
        {/* Title */}
        <Link 
          href={`/products/${p.slug}`} 
          className="font-bold text-[14px] text-[#171725] line-clamp-2 hover:text-[#FF6B5A] transition-colors mb-1.5 leading-snug tracking-tight"
          title={p.name}
        >
          {p.name}
        </Link>

        {/* Brand / Company in bold Indigo/Navy blue */}
        <p className="text-[12px] font-bold text-[#233A5E] mb-1 truncate">
          {p.brand || ""}
        </p>

        {/* Pack specification */}
        <p className="text-[12px] text-[#696974] font-normal mb-2">
          {p.pack || ""}
        </p>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-[16px] font-black text-[#171725]">
            {money(p.price)}
          </span>
          {p.mrp > p.price && (
            <span className="text-[12px] text-[#92929D] line-through font-normal">
              {money(p.mrp)}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Section: Add to Cart button matching reference */}
      <button
        onClick={() => {
          requestAddToCart(p.id);
        }}
        className={`w-full h-10 rounded-xl text-[13px] font-semibold transition-all flex items-center justify-center cursor-pointer border ${
          inCart
            ? "bg-[#EBF7EE] text-emerald-700 border-emerald-300 font-bold"
            : "bg-[#FFF1EF] text-[#FF6B5A] hover:bg-[#FF6B5A] hover:text-white border-[#FFAEA3]"
        }`}
      >
        {inCart ? "Added to Cart" : "Add to Cart"}
      </button>
    </div>
  );
}
