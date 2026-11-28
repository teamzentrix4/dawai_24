
"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Pill, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomeHero({ content }) {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  if (!content) return null;

  const badges = (content.body || "")
    .split("\n")
    .filter(Boolean);

  // Fetch medicine suggestions
  useEffect(() => {
    const searchMedicine = async () => {
      if (!query.trim()) {
        setSuggestions([]);
        setShowSuggestions(false);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const response = await fetch(
          `/api/medicines/search?q=${encodeURIComponent(query.trim())}`
        );

        if (!response.ok) {
          throw new Error("Search failed");
        }

        const data = await response.json();

        setSuggestions(
          Array.isArray(data) ? data : data.medicines || []
        );

        setShowSuggestions(true);
      } catch (error) {
        console.error("Medicine search error:", error);
        setSuggestions([]);
        setShowSuggestions(true);
      } finally {
        setLoading(false);
      }
    };

    clearTimeout(debounceRef.current);

    if (query.trim().length >= 2) {
      debounceRef.current = setTimeout(searchMedicine, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setLoading(false);
    }

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // Submit search
  const submit = (e) => {
    e.preventDefault();

    if (query.trim()) {
      setShowSuggestions(false);

      router.push(
        `/medicines?q=${encodeURIComponent(query.trim())}`
      );
    }
  };

  // Select medicine
  const selectMedicine = (medicine) => {
    setQuery(medicine.name || medicine.title || "");
    setShowSuggestions(false);

    if (medicine.slug) {
      router.push(`/medicines/${medicine.slug}`);
    } else {
      router.push(
        `/medicines?q=${encodeURIComponent(
          medicine.name || medicine.title || query
        )}`
      );
    }
  };

  return (
    <section
      data-slot="hero-section"
      className="relative w-full"
    >
      <div className="relative bg-[linear-gradient(274deg,#4762CB_-8.35%,#253C94_86.89%)] max-md:overflow-hidden md:h-75">

        {/* Background Decoration */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden max-md:hidden"
        >
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

            {/* Badges */}
            <div className="mt-4 flex flex-wrap gap-2.5">
              {badges.map((label) => (
                <div
                  key={label}
                  className="flex w-fit items-center gap-2 rounded-full bg-white px-3.5 py-1.5 shadow-xs"
                >
                  <span className="flex size-5 items-center justify-center rounded-full bg-[#24a148] text-sm font-black text-white">
                    ✓
                  </span>

                  <p className="text-xs font-semibold text-[#171725] sm:text-[13px]">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* Medicine Search */}
            <form
              onSubmit={submit}
              ref={searchRef}
              className="relative mt-6 hidden w-full max-w-lg md:block"
            >
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-[#878792]" />

                <input
                  type="search"
                  placeholder="Search your Medicines"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => {
                    if (query.trim().length >= 2) {
                      setShowSuggestions(true);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setShowSuggestions(false);
                    }
                  }}
                  autoComplete="off"
                  className="h-12 w-full rounded-full border border-transparent bg-white px-4 pl-11 pr-11 text-sm text-[#171725] shadow-sm outline-none focus:border-[#FF6B5A]"
                />

                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setSuggestions([]);
                      setShowSuggestions(false);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    <X size={17} />
                  </button>
                )}
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && (
                <div className="absolute left-0 top-full z-50 mt-2 max-h-80 w-full overflow-y-auto rounded-2xl border border-gray-100 bg-white py-2 text-[#171725] shadow-xl">

                  {loading ? (
                    <div className="px-5 py-5 text-center text-sm text-gray-500">
                      Searching medicines...
                    </div>
                  ) : suggestions.length > 0 ? (
                    <>
                      <p className="px-5 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Suggested Medicines
                      </p>

                      {suggestions.map((medicine, index) => (
                        <button
                          type="button"
                          key={medicine.id || medicine.slug || index}
                          onClick={() => selectMedicine(medicine)}
                          className="flex w-full items-center gap-3 px-5 py-3 text-left transition hover:bg-[#F1F4FF]"
                        >
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF1FF] text-[#334FA8]">
                            <Pill size={19} />
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold">
                              {medicine.name || medicine.title}
                            </span>

                            {medicine.manufacturer && (
                              <span className="mt-0.5 block truncate text-xs text-gray-500">
                                {medicine.manufacturer}
                              </span>
                            )}
                          </span>

                          <ArrowRight
                            size={16}
                            className="shrink-0 text-gray-400"
                          />
                        </button>
                      ))}
                    </>
                  ) : (
                    <div className="px-5 py-5 text-center">
                      <Pill className="mx-auto mb-2 text-gray-300" size={25} />

                      <p className="text-sm font-semibold text-gray-700">
                        No medicines found
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Try searching with another medicine name.
                      </p>
                    </div>
                  )}

                  <div className="border-t border-gray-100 px-5 py-2.5">
                    <p className="text-xs text-gray-400">
                      Press Enter to see all search results
                    </p>
                  </div>
                </div>
              )}
            </form>

          </div>

          {/* Hero Image */}
          <div className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-[min(42vw,440px)] max-w-[440px] overflow-hidden md:block">
            <img
              alt={content.title}
              src={content.imageUrl}
              className="h-full w-full object-contain object-bottom"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
