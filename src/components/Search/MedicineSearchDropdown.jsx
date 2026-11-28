"use client";

import React from "react";
import { useRouter } from "next/navigation";

/**
 * Highlights matching characters anywhere they appear within the string (prefix, middle, end).
 */
function HighlightMatch({ text = "", query = "" }) {
  if (!text) return null;
  const trimmed = query.trim();
  if (!trimmed) return <span>{text}</span>;

  // Escape regex special characters
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);

  return (
    <span className="truncate">
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span
            key={i}
            className="font-bold text-[#171725] bg-[#E8F5E9] text-[#2E7D32] px-0.5 rounded-[2px]"
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

export default function MedicineSearchDropdown({
  query,
  suggestions = [],
  isOpen = false,
  selectedIndex = -1,
  onClose,
  onSelectResult,
  className = ""
}) {
  const router = useRouter();

  if (!isOpen || !query || !query.trim() || suggestions.length === 0) {
    return null;
  }

  const handleSelect = (item) => {
    onClose?.();
    if (onSelectResult) {
      onSelectResult(item);
    } else {
      router.push(`/products/${item.slug}`);
    }
  };

  return (
    <div
      role="listbox"
      aria-label="Search suggestions"
      className={`absolute left-0 right-0 top-[calc(100%+6px)] z-[100] bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-[#E2E8F0] overflow-hidden text-left py-1.5 animate-in fade-in duration-100 ${className}`}
    >
      <div className="max-h-[320px] overflow-y-auto overscroll-contain">
        {suggestions.map((item, idx) => {
          const isSelected = selectedIndex === idx;
          return (
            <button
              key={item.id || idx}
              type="button"
              role="option"
              aria-selected={isSelected}
              onClick={() => handleSelect(item)}
              className={`w-full text-left px-4 py-2.5 text-xs sm:text-[13px] font-medium transition-colors flex items-center justify-between cursor-pointer ${
                isSelected
                  ? "bg-[#F1F5F9] text-[#0F172A]"
                  : "text-[#1E293B] hover:bg-[#F8FAFC]"
              }`}
            >
              <HighlightMatch text={item.name} query={query} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
