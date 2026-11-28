"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Star } from "lucide-react";

export default function HomeTestimonials({ reviews = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const timerRef = useRef(null);
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

  // Responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return;
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const total = reviews.length;

  // We clone items for seamless infinite looping without sudden jumps
  // If we have at least 1 review:
  const extendedReviews = total > 0 ? [...reviews, ...reviews, ...reviews] : [];

  // Start in the middle set of cloned items so user can cycle backwards or forwards smoothly
  useEffect(() => {
    if (total > 0) {
      setCurrentIndex(total);
    }
  }, [total]);

  const handleNext = useCallback(() => {
    if (total === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, [total]);

  const handlePrevious = useCallback(() => {
    if (total === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, [total]);

  // Handle transition end for seamless infinite loop reset
  const handleTransitionEnd = () => {
    if (total === 0) return;
    if (currentIndex >= total * 2) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - total);
    } else if (currentIndex < total) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + total);
    }
  };

  // Re-enable transition after teleporting index without animation
  useEffect(() => {
    if (!isTransitioning) {
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isTransitioning]);

  // Automatic sliding every 2 seconds
  useEffect(() => {
    if (isPaused || total === 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      handleNext();
    }, 2000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, total, handleNext]);

  // Touch swipe support for mobile
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartXRef.current - touchEndXRef.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrevious();
      }
    }
    setIsPaused(false);
  };

  if (!total) return null;

  // Normalized active dot index (0 to total - 1)
  const activeDotIndex = ((currentIndex % total) + total) % total;

  return (
    <section
      data-slot="testimonials"
      className="container-x py-8 md:py-14 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Customer Reviews & Testimonials"
    >
      {/* Header with Title and Navigation Buttons */}
      <div className="mb-6 flex items-center justify-between md:mb-8">
        <div>
          <h2 className="text-[22px] font-bold text-[#171725] sm:text-[26px] md:text-[28px]">
            Trusted by <span className="text-[#FF6B5A]">10L+</span> Customers
          </h2>
          <p className="mt-1 text-[13px] text-[#696974] sm:text-sm">
            Real experiences from patients saving on monthly medicines
          </p>
        </div>

        {/* Previous / Next Arrow Controls */}
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handlePrevious}
            aria-label="Previous review"
            className="flex size-10 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#171725] shadow-xs transition-all hover:bg-[#F8FAFC] hover:border-[#CBD5E1] active:scale-95 cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next review"
            className="flex size-10 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#171725] shadow-xs transition-all hover:bg-[#F8FAFC] hover:border-[#CBD5E1] active:scale-95 cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Overflow container */}
      <div className="overflow-hidden py-3 -my-3">
        <div
          onTransitionEnd={handleTransitionEnd}
          className={`-mx-2 flex md:-mx-3 will-change-transform ${
            isTransitioning ? "transition-transform duration-500 ease-in-out" : ""
          }`}
          style={{
            transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`
          }}
        >
          {extendedReviews.map((review, i) => (
            <div
              key={`${review.id}-${i}`}
              className="w-full shrink-0 px-2 sm:w-1/2 lg:w-1/3 md:px-3"
            >
              <div
                className="group flex h-full flex-col justify-between rounded-[20px] border border-[#E9ECEF] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] hover:border-[#CBD5E1] hover:bg-[#FAFBFD]/60 cursor-default"
              >
                <div>
                  <div className="mb-3.5 flex items-center justify-between">
                    <div className="flex text-amber-400">
                      {[0, 1, 2, 3, 4].map((starIdx) => (
                        <Star key={starIdx} size={16} fill="currentColor" />
                      ))}
                    </div>
                    {review.badge && (
                      <span className="flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-[#24a148]">
                        <CheckCircle2 size={12} />
                        {review.badge}
                      </span>
                    )}
                  </div>
                  <p className="line-clamp-4 text-[13px] italic leading-relaxed text-[#475569] md:text-sm group-hover:text-[#1E293B] transition-colors">
                    &ldquo;{review.body}&rdquo;
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-3 border-t border-[#F1F5F9] pt-4">
                  <div className="flex size-10 items-center justify-center rounded-full bg-[#FFF1EF] text-sm font-bold text-[#FF6B5A] group-hover:scale-105 transition-transform">
                    {review.title.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#171725]">{review.title}</h4>
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

      {/* Navigation Indicators / Dots */}
      {total > 1 && (
        <div className="mt-7 flex justify-center items-center gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIsTransitioning(true);
                setCurrentIndex(total + i);
              }}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeDotIndex === i
                  ? "w-6 bg-[#FF6B5A]"
                  : "w-2 bg-[#E2E8F0] hover:bg-[#CBD5E1]"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
