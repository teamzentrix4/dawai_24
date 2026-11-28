"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

/**
 * Highlights matching characters anywhere within the name.
 */
function HighlightMatch({ text = "", query = "" }) {
  if (!text) return null;
  const trimmed = query.trim();
  if (!trimmed) return <span>{text}</span>;

  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);

  return (
    <span className="truncate">
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span
            key={i}
            className="font-bold text-[#171725] bg-[#FEE2E2] text-[#DC2626] px-0.5 rounded-[2px]"
          >
            {part}
          </span>
        ) : (
          <span key={i} className="text-[#334155]">{part}</span>
        )
      )}
    </span>
  );
}

export default function BrandSearchBar({ initialQuery = "" }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const q = query.trim();
    if (q.length >= 1) {
      timeoutRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`/api/medicines/search?q=${encodeURIComponent(q)}`);
          if (res.ok) {
            const data = await res.json();
            setSuggestions(data.suggestions || []);
            setIsOpen(true);
          }
        } catch {
          setSuggestions([]);
        }
      }, 250);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query]);

  const handleSelect = (item) => {
    setIsOpen(false);
    setQuery(item.name);
    router.push(`/products/${item.slug}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      handleSelect(suggestions[selectedIndex]);
      return;
    }
    setIsOpen(false);
    if (query.trim()) {
      router.push(`/brands?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push(`/brands`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      return;
    }
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < suggestions.length ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[selectedIndex]);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md mt-5">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim().length >= 1 && suggestions.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search brands or medicines..."
          autoComplete="off"
          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-9 text-sm outline-none focus:border-[#fc5a5a] focus:ring-2 focus:ring-[#fc5a5a]/10 transition-all"
        />
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Search size={16} />
        </div>
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSuggestions([]);
              setIsOpen(false);
              router.push("/brands");
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
          >
            <X size={14} />
          </button>
        )}
      </form>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-slate-200 overflow-hidden py-1.5 animate-in fade-in duration-100">
          <div className="max-h-60 overflow-y-auto">
            {suggestions.map((item, idx) => (
              <button
                key={item.id || idx}
                type="button"
                onClick={() => handleSelect(item)}
                className={`w-full text-left px-4 py-2.5 text-xs sm:text-[13px] font-medium transition-colors flex items-center justify-between cursor-pointer ${
                  selectedIndex === idx
                    ? "bg-[#F1F5F9] text-[#0F172A]"
                    : "text-[#1E293B] hover:bg-[#F8FAFC]"
                }`}
              >
                <HighlightMatch text={item.name} query={query} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
