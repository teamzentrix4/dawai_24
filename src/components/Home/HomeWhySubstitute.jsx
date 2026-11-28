import Link from "next/link";

const DEFAULT_SUBSTITUTE_FEATURES = [
  {
    id: "why-hero",
    title: "Why Choose Substitute",
    imageUrl: "/img/why-substitute-hero.png",
    linkUrl: "/substitute/how-it-works",
  },
  {
    id: "same-composition",
    title: "Same Composition",
    body: "Same salt, same strength as your prescribed medicine",
    imageUrl: "/img/same-composition.webp",
  },
  {
    id: "certified-manufacturers",
    title: "Certified Manufacturers",
    body: "Made by GMP certified Indian manufacturers",
    imageUrl: "/img/certified-mfg.webp",
  },
  {
    id: "savings-60",
    title: "Savings up to 60%",
    body: "Save up to 60% on your monthly medicine bill",
    imageUrl: "/img/savings-60.webp",
  },
];

export default function HomeWhySubstitute({ features = [] }) {
  const data = features && features.length ? features : DEFAULT_SUBSTITUTE_FEATURES;
  const [hero, ...items] = data;
  const targetLink = "/substitute/how-it-works";

  return (
    <section data-slot="choose-substitute" className="container-x py-3 sm:py-4 md:py-5">
      {/* Section Heading */}
      <div className="flex items-center justify-between mb-2.5 sm:mb-3">
        <h2 className="text-[19px] sm:text-[21px] md:text-[23px] font-bold text-[#171725] tracking-tight">
          Why Choose Substitute
        </h2>
        <Link
          href={targetLink}
          className="text-xs sm:text-[13px] font-semibold text-[#2E7D32] hover:text-[#1B5E20] hover:underline transition-colors"
        >
          See How Substitute Work &rarr;
        </Link>
      </div>

      {/* Two-Column Grid: Balanced height keeping full image visible */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 lg:gap-5 items-stretch">
        
        {/* Left Column: Full Promotional Image (100% visible, no cropping, perfectly filling the container) */}
        <div className="md:col-span-7 flex">
          <Link
            href={targetLink}
            aria-label="See How Substitute Works"
            className="group relative w-full h-[260px] sm:h-[320px] md:h-[380px] flex items-center justify-center overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-xs hover:shadow-md transition-all duration-300"
          >
            <img
              src={hero?.imageUrl || "/img/why-substitute-hero.png"}
              alt={hero?.title || "Why Choose Substitute"}
              className="w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-[1.01]"
              loading="lazy"
            />
          </Link>
        </div>

        {/* Right Column: 3 Compact Cards (Total height exactly matches left column 380px on desktop) */}
        <div className="md:col-span-5 flex flex-col justify-between gap-2.5 md:gap-3 md:h-[380px]">
          {items.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="flex-1 flex items-center gap-3 sm:gap-3.5 rounded-xl sm:rounded-2xl border border-[#E2E8F0] bg-white px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-xs hover:border-[#2E7D32]/30 hover:shadow-sm transition-all"
            >
              {/* Icon Container */}
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#EDF2F7] bg-[#F8FAFC] p-2 shadow-2xs">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="size-2 rounded-full bg-[#2E7D32]" />
                )}
              </div>

              {/* Text Info: vertically centered */}
              <div className="min-w-0 flex-1">
                <h3 className="text-[13px] sm:text-[14px] md:text-[14.5px] font-bold text-[#171725] leading-snug">
                  {item.title}
                </h3>
                <p className="mt-0.5 text-[11px] sm:text-xs text-[#696974] leading-normal line-clamp-2">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
