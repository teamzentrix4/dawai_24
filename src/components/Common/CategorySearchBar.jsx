"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useMedicineSearch } from "@/lib/useMedicineSearch";
import MedicineSearchDropdown from "@/components/Search/MedicineSearchDropdown";

export default function CategorySearchBar({
  placeholder = "Search for Medicines, Healthcare Products, Salts...",
  className = ""
}) {
  const router = useRouter();
  const {
    query,
    setQuery,
    suggestions,
    isOpen,
    setIsOpen,
    clear
  } = useMedicineSearch();

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [query, suggestions]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  const executeSelection = (item) => {
    setIsOpen(false);
    if (!item) {
      if (query.trim()) {
        router.push(`/medicines?q=${encodeURIComponent(query.trim())}`);
      }
      return;
    }

    setQuery(item.name);
    router.push(`/products/${item.slug}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setSelectedIndex(-1);
      return;
    }

    if (!isOpen || suggestions.length === 0) {
      if (e.key === "Enter" && query.trim()) {
        e.preventDefault();
        setIsOpen(false);
        router.push(`/medicines?q=${encodeURIComponent(query.trim())}`);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < suggestions.length ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        executeSelection(suggestions[selectedIndex]);
      } else if (query.trim()) {
        setIsOpen(false);
        router.push(`/medicines?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      executeSelection(suggestions[selectedIndex]);
      return;
    }
    if (!query.trim()) return;
    setIsOpen(false);
    router.push(`/medicines?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className={`w-full pt-4 pb-2 relative z-30 ${className}`} ref={containerRef}>
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center w-full bg-white rounded-full border border-[#E2E4E8] shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:border-[#CBD5E1] focus-within:border-[#FF6B5A] focus-within:shadow-[0_2px_12px_rgba(255,107,90,0.15)] transition-all h-[52px] sm:h-[58px] px-3 sm:px-4"
      >
        {/* Search Icon */}
        <div className="flex items-center pl-1 pr-2 sm:pr-3 text-[#FF6B5A] shrink-0">
          <Search size={22} className="stroke-[2.5]" />
        </div>

        {/* Thin Vertical Divider */}
        <div className="h-5 w-[1px] bg-[#E2E4E8] mr-3 sm:mr-4 shrink-0" />

        {/* Text Input */}
        <input
          ref={inputRef}
          type="search"
          className="flex-1 bg-transparent text-[14px] sm:text-[15px] text-[#171725] placeholder:text-[#94A3B8] font-normal outline-none border-none ring-0 focus:ring-0 px-0 min-w-0"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim().length >= 1) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          aria-label="Search for Healthcare Products"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              clear();
              inputRef.current?.focus();
            }}
            className="text-[#94A3B8] hover:text-[#171725] p-1.5 mr-2 cursor-pointer rounded-full transition-colors"
            aria-label="Clear search input"
          >
            <X size={16} />
          </button>
        )}

        {/* Search Button */}
        <button
          type="submit"
          className="bg-[#FF6B5A] hover:bg-[#e05646] active:scale-[0.98] text-white text-[13px] sm:text-[14px] font-bold rounded-full px-5 sm:px-7 py-2 sm:py-2.5 transition-all shadow-xs shrink-0 cursor-pointer"
        >
          Search
        </button>
      </form>

      {/* Clean Minimal Suggestions Dropdown */}
      <MedicineSearchDropdown
        query={query}
        suggestions={suggestions}
        isOpen={isOpen}
        selectedIndex={selectedIndex}
        onClose={() => setIsOpen(false)}
        onSelectResult={(item) => executeSelection(item)}
      />
    </div>
  );
}
