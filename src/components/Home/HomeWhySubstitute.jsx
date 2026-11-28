
"use client";

import Link from "next/link";

export default function HomeWhySubstitute({ features = [] }) {
  if (!features.length) return null;

  const [hero, ...items] = features;

  return (
    <section
      data-slot="choose-substitute"
      className="container-x py-3 sm:py-4"
    >
      <h2 className="text-[20px] sm:text-[24px] md:text-[26px] font-bold capitalize text-[#171725] mb-3">
        Why Choose Substitute
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-stretch">


        <Link
          href={hero.linkUrl || "/blogs/understanding-the-perception-of-generic-medicine-online-quality"}
          className="
    group relative block overflow-hidden
    md:col-span-7
    h-[230px] sm:h-[290px] md:h-[320px] lg:h-[350px]
    rounded-2xl md:rounded-3xl
    border border-[#E2E8F0]
    bg-white shadow-2xs
    cursor-pointer
  "
        >
          <img
            src={hero.imageUrl}
            alt={hero.title || "Why Choose Substitute"}
            className="
      absolute inset-0
      w-full max-w-none
      h-full
      object-fill
      block
    "
          />
        </Link>


        {/* Right Feature Cards */}
        <div
          className="
            md:col-span-5
            flex flex-col
            gap-2.5
            md:h-[320px] lg:h-[350px]
            min-h-0
          "
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="
                flex flex-1 min-h-0
                items-center gap-3
                rounded-xl md:rounded-2xl
                border border-[#E2E8F0]
                bg-white
                px-3 sm:px-3.5
                py-2
                shadow-2xs
                hover:shadow-xs
                hover:border-[#2E7D32]/20
                transition-all
              "
            >
              {/* Icon */}
              <div
                className="
                  flex size-9 sm:size-10
                  shrink-0 items-center justify-center
                  rounded-xl
                  border border-[#E2E8F0]
                  bg-[#FAFBFD]
                  p-1.5
                "
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Text Content */}
              <div className="min-w-0 flex-1">
                <span
                  className="
                    block
                    text-xs sm:text-[13px] md:text-[14px]
                    font-bold text-[#171725]
                    leading-tight
                  "
                >
                  {item.title}
                </span>

                <p
                  className="
                    mt-0.5
                    text-[11px] sm:text-xs
                    text-[#696974]
                    leading-snug
                    line-clamp-2
                  "
                >
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
