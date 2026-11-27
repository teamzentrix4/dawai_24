"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useStore } from "@/lib/store";

export default function SearchBox({ className = "" }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [categories,setCategories] = useState([]);
  const { catalog } = useStore();
  const ref = useRef(null);

  useEffect(() => {
    fetch("/api/catalog/categories", { cache: "force-cache" }).then(r=>r.json()).then(setCategories).catch(()=>setCategories([]));
    const off = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", off);
    return () => document.removeEventListener("mousedown", off);
  }, []);

  const prods = useMemo(() => catalog.filter(p=>p.name.toLowerCase().includes(q.toLowerCase())||p.brand.toLowerCase().includes(q.toLowerCase())).slice(0,5), [q,catalog]);
  const cats = useMemo(() => categories.filter(c=>c.name.toLowerCase().includes(q.toLowerCase())).slice(0,3), [q,categories]);

  const submit = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <form onSubmit={submit} role="search" className="flex">
        <input
          className="input !rounded-r-none !border-r-0"
          placeholder="Search medicines, brands, categories"
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          aria-label="Search"
        />
        <button className="btn btn-primary !rounded-l-none" aria-label="Submit search"><Search size={18} /></button>
      </form>
      {open && q.trim() && (
        <div className="absolute z-50 mt-1 w-full card shadow-xl overflow-hidden anim-fade">
          {cats.map((c) => (
            <button key={c.slug} className="w-full text-left px-4 py-2 hover:bg-brand-50 text-sm" onClick={() => { setOpen(false); router.push(`/category/${c.slug}`); }}>
              <span className="text-brand-700 font-semibold">{c.name}</span> <span className="text-slate-400">in categories</span>
            </button>
          ))}
          {prods.map((p) => (
            <button key={p.id} className="w-full text-left px-4 py-2 hover:bg-brand-50 text-sm" onClick={() => { setOpen(false); router.push(`/products/${p.slug}`); }}>
              {p.name} <span className="text-slate-400">· {p.brand}</span>
            </button>
          ))}
          {!prods.length && !cats.length && <p className="px-4 py-3 text-sm text-slate-500">No suggestions for “{q}”.</p>}
          <button className="w-full text-left px-4 py-2 text-sm font-semibold text-brand-700 border-t hover:bg-brand-50" onClick={submit}>
            See all results for “{q}”
          </button>
        </div>
      )}
    </div>
  );
}
