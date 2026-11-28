"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useMedicineSearch } from "@/lib/useMedicineSearch";
import MedicineSearchDropdown from "./MedicineSearchDropdown";

export default function SearchBox({
  className = "",
  inputClassName = "",
  placeholder = "Search medicines, salts, brands...",
  autoFocus = false,
  onSelect
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

  // Reset keyboard selection whenever suggestions or query changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [query, suggestions]);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
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
    if (onSelect) {
      onSelect(item);
    } else {
      router.push(`/products/${item.slug}`);
    }
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
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit} role="search" className="flex items-center relative w-full">
        <input
          ref={inputRef}
          type="search"
          autoFocus={autoFocus}
          className={
            inputClassName ||
            "w-full bg-[#FAFBFD] border border-[#CBD5E1] rounded-full h-11 pl-11 pr-10 text-xs sm:text-sm text-[#171725] placeholder:text-[#94A3B8] outline-none focus:border-[#2E7D32] focus:bg-white focus:ring-2 focus:ring-[#2E7D32]/10 transition-all shadow-3xs"
          }
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
          aria-label="Search medicines"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />
        
        {/* Left Search Icon */}
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">
          <Search size={18} />
        </div>

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={() => {
              clear();
              inputRef.current?.focus();
            }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#171725] p-1 rounded-full cursor-pointer transition-colors"
            aria-label="Clear search"
          >
            <X size={15} />
          </button>
        )}
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
