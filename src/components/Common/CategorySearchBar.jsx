"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useStore } from "@/lib/store";

export default function CategorySearchBar() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [categories,setCategories] = useState([]);
  const { catalog } = useStore();
  const ref = useRef(null);

  useEffect(() => {
    fetch("/api/catalog/categories", { cache: "force-cache" }).then(r=>r.json()).then(setCategories).catch(()=>setCategories([]));
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const prods = useMemo(() => catalog.filter(p=>p.name.toLowerCase().includes(q.toLowerCase())||p.brand.toLowerCase().includes(q.toLowerCase())).slice(0,5), [q,catalog]);
  const cats = useMemo(() => categories.filter(c=>c.name.toLowerCase().includes(q.toLowerCase())).slice(0,3), [q,categories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div className="w-full pt-4 pb-2" ref={ref}>
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center w-full bg-white rounded-full border border-[#E2E4E8] shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:border-[#CBD5E1] focus-within:border-[#FF6B5A] focus-within:shadow-[0_2px_12px_rgba(255,107,90,0.15)] transition-all h-[52px] sm:h-[58px] px-3 sm:px-4"
      >
        {/* Red Search Icon */}
        <div className="flex items-center pl-1 pr-2 sm:pr-3 text-[#FF6B5A] shrink-0">
          <Search size={22} className="stroke-[2.5]" />
        </div>

        {/* Thin Vertical Divider */}
        <div className="h-5 w-[1px] bg-[#E2E4E8] mr-3 sm:mr-4 shrink-0" />

        {/* Text Input */}
        <input
          type="text"
          className="flex-1 bg-transparent text-[14px] sm:text-[15px] text-[#171725] placeholder:text-[#94A3B8] font-normal outline-none border-none ring-0 focus:ring-0 px-0 min-w-0"
          placeholder="Search for Healthcare Products"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          aria-label="Search for Healthcare Products"
        />

        {/* Red Pill Search Button */}
        <button
          type="submit"
          className="bg-[#FF6B5A] hover:bg-[#e05646] active:scale-[0.98] text-white text-[13px] sm:text-[14px] font-bold rounded-full px-5 sm:px-7 py-2 sm:py-2.5 transition-all shadow-xs shrink-0 cursor-pointer"
        >
          Search
        </button>
      </form>

      {/* Live Search Suggestions Dropdown */}
      {open && q.trim() && (
        <div className="relative">
          <div className="absolute top-2 left-0 right-0 z-50 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] overflow-hidden max-h-[380px] overflow-y-auto">
            {cats.length > 0 && (
              <div className="p-2 border-b border-[#F1F5F9]">
                <p className="px-3 py-1 text-[11px] font-bold uppercase text-[#94A3B8] tracking-wider">
                  Categories
                </p>
                {cats.map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    className="w-full text-left px-3 py-2 hover:bg-[#FFF5F4] rounded-lg text-[13px] transition-colors flex items-center justify-between group"
                    onClick={() => {
                      setOpen(false);
                      router.push(`/category/${c.slug}`);
                    }}
                  >
                    <span className="text-[#171725] group-hover:text-[#FF6B5A] font-medium">
                      {c.name}
                    </span>
                    <span className="text-[11px] text-[#94A3B8]">in categories</span>
                  </button>
                ))}
              </div>
            )}

            {prods.length > 0 && (
              <div className="p-2">
                <p className="px-3 py-1 text-[11px] font-bold uppercase text-[#94A3B8] tracking-wider">
                  Products
                </p>
                {prods.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className="w-full text-left px-3 py-2 hover:bg-[#FFF5F4] rounded-lg text-[13px] transition-colors flex items-center justify-between group"
                    onClick={() => {
                      setOpen(false);
                      router.push(`/products/${p.slug}`);
                    }}
                  >
                    <span className="text-[#171725] group-hover:text-[#FF6B5A] font-medium truncate max-w-[80%]">
                      {p.name}
                    </span>
                    <span className="text-[12px] font-bold text-[#FF6B5A] shrink-0">
                      ₹{p.price}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {cats.length === 0 && prods.length === 0 && (
              <div className="py-6 text-center text-[13px] text-[#94A3B8]">
                No matching products or categories found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
