"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Star } from "lucide-react";

export default function HomeTestimonials({ reviews = [] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(3);
  const timer = useRef(null);

  // Responsive items count per view
  useEffect(() => {
    const resize = () => {
      setVisible(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const max = Math.max(0, reviews.length - visible);

  // 2-Second Auto-Slide Timer: Automatically slides every 2000ms when not hovered
  useEffect(() => {
    if (!paused && reviews.length > 0) {
      timer.current = setInterval(() => {
        setIndex((prev) => (prev >= max ? 0 : prev + 1));
      }, 2000);
    }
    return () => clearInterval(timer.current);
  }, [paused, max, reviews.length]);

  useEffect(() => {
    setIndex((prev) => Math.min(prev, max));
  }, [max]);

  if (!reviews.length) return null;

  const next = () => setIndex((prev) => (prev >= max ? 0 : prev + 1));
  const previous = () => setIndex((prev) => (prev <= 0 ? max : prev - 1));

  return (
    <section
      data-slot="testimonials"
      className="container-x py-8 md:py-14"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between md:mb-8">
        <div>
          <h2 className="text-[22px] font-bold text-[#171725] sm:text-[26px] md:text-[28px]">
            Trusted by <span className="text-[#FF6B5A]">10L+</span> Customers
          </h2>
          <p className="mt-1 text-[13px] text-[#696974] sm:text-sm">
            Real experiences from patients saving on monthly medicines
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-2">
          <button
            onClick={previous}
            aria-label="Previous review"
            className="flex size-10 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#171725] shadow-xs hover:border-[#FF6B5A] hover:bg-[#FFF8F7] hover:text-[#FF6B5A] active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            aria-label="Next review"
            className="flex size-10 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#171725] shadow-xs hover:border-[#FF6B5A] hover:bg-[#FFF8F7] hover:text-[#FF6B5A] active:scale-95 transition-all cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Testimonials Carousel Track */}
      <div className="overflow-hidden">
        <div
          className="-mx-2 flex transition-transform duration-500 ease-out md:-mx-3"
          style={{ transform: `translateX(-${index * (100 / visible)}%)` }}
        >
          {reviews.map((review) => (
            <div
              key={review.id}
              className="w-full shrink-0 px-2 sm:w-1/2 lg:w-1/3 md:px-3 py-2"
            >
              {/* Card with Rich Hover Effects: elevation shadow, subtle lift, border color transition */}
              <div className="group flex h-full flex-col justify-between rounded-[20px] border border-[#E2E8F0] bg-white p-6 shadow-xs hover:shadow-xl hover:border-[#FF6B5A]/40 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
                <div>
                  {/* Rating Stars and Badge */}
                  <div className="mb-3.5 flex items-center justify-between">
                    <div className="flex text-amber-400 gap-0.5 group-hover:scale-105 transition-transform origin-left">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </div>
                    {review.badge && (
                      <span className="flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-[#24a148] group-hover:bg-emerald-100/70 transition-colors">
                        <CheckCircle2 size={12} />
                        {review.badge}
                      </span>
                    )}
                  </div>

                  {/* Review Text */}
                  <p className="line-clamp-4 text-[13px] italic leading-relaxed text-[#475569] md:text-sm group-hover:text-[#1e293b] transition-colors">
                    “{review.body}”
                  </p>
                </div>

                {/* Author Info */}
                <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                  <div className="flex size-10 items-center justify-center rounded-full bg-[#FFF1EF] text-sm font-bold text-[#FF6B5A] group-hover:bg-[#FF6B5A] group-hover:text-white transition-colors">
                    {review.title.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#171725] group-hover:text-[#FF6B5A] transition-colors">
                      {review.title}
                    </h4>
                    <p className="text-xs text-[#696974]">
                      {review.subtitle ? `${review.subtitle} • ` : ""}Verified Buyer
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="mt-6 flex justify-center gap-1.5">
        {Array.from({ length: max + 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              index === i ? "w-6 bg-[#FF6B5A]" : "w-2 bg-[#E2E8F0] hover:bg-slate-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
