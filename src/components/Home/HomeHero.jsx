"use client";

import SearchBox from "@/components/Search/SearchBox";

export default function HomeHero({ content }) {
  if (!content) return null;
  const badges = (content.body || "").split("\n").filter(Boolean);

  return (
    <section data-slot="hero-section" className="relative w-full">
      <div className="relative bg-[linear-gradient(274deg,#4762CB_-8.35%,#253C94_86.89%)] max-md:overflow-hidden md:h-75">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden max-md:hidden">
          <div className="container-x relative h-full">
            <div className="absolute -left-50 -top-55 size-105 overflow-hidden opacity-50">
              <img
                alt=""
                src="/img/prx-blue-transparent.webp"
                className="h-full w-full object-contain brightness-0 invert"
              />
            </div>
          </div>
        </div>

        <div className="container-x relative max-md:py-8 md:h-full">
          <div className="relative flex max-w-2xl flex-col text-white md:h-full md:justify-center">
            <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
              {content.title}
            </h1>

            <div className="mt-4 flex flex-wrap gap-2.5">
              {badges.map((label) => (
                <div key={label} className="flex w-fit items-center gap-2 rounded-full bg-white px-3.5 py-1.5 shadow-xs">
                  <span className="flex size-5 items-center justify-center rounded-full bg-[#24a148] text-sm font-black text-white">
                    ✓
                  </span>
                  <p className="text-xs font-semibold text-[#171725] sm:text-[13px]">{label}</p>
                </div>
              ))}
            </div>

            {/* Desktop Hero Search Bar with Live Suggestions */}
            <div className="mt-6 hidden w-full max-w-lg md:block relative z-40">
              <SearchBox
                placeholder="Search medicines, salts, brands..."
                inputClassName="h-12 w-full rounded-full border border-transparent bg-white px-4 pl-11 pr-10 text-sm text-[#171725] shadow-sm outline-none focus:border-[#FF6B5A] focus:ring-2 focus:ring-[#FF6B5A]/20"
              />
            </div>

          </div>

          <div className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-[min(42vw,440px)] max-w-[440px] overflow-hidden md:block">
            <img alt={content.title} src={content.imageUrl} className="h-full w-full object-contain object-bottom" />
          </div>
        </div>
      </div>
    </section>
  );
}
