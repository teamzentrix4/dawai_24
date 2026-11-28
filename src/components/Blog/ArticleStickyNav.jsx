"use client";

import { useEffect, useState } from "react";

export default function ArticleStickyNav({ sections = [] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id || "");

  useEffect(() => {
    if (!sections.length) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const offset = 180;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollY >= top - offset) {
            setActiveId(sections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  if (!sections || sections.length === 0) return null;

  return (
    <div
      data-testid="article-section-nav"
      data-slot="article-section-nav"
      className="scrollbar-none bg-[#F1F5F9] sticky top-16 z-30 flex overflow-x-auto rounded-full px-2 py-1.5 md:top-24 gap-1.5 max-w-full my-4 select-none"
    >
      {sections.map((sec) => {
        const isActive = activeId === sec.id;
        return (
          <button
            key={sec.id}
            type="button"
            tabIndex={0}
            data-slot="button"
            data-testid={`article-section-nav-${sec.id}`}
            onClick={() => {
              const el = document.getElementById(sec.id);
              if (el) {
                const yOffset = -120;
                const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: "smooth" });
                setActiveId(sec.id);
              }
            }}
            className={`group/button cursor-pointer inline-flex items-center justify-center rounded-full border border-transparent bg-clip-padding whitespace-nowrap transition-all outline-none text-xs md:text-sm font-medium h-8 md:h-10 shrink-0 px-4 md:px-5 ${
              isActive
                ? "bg-[#1E293B] text-white shadow-xs font-semibold"
                : "bg-transparent text-[#475569] hover:bg-white/80 hover:text-[#0F172A]"
            }`}
          >
            {sec.title}
          </button>
        );
      })}
    </div>
  );
}
