"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Crosshair,
  Search,
  X,
  Loader2,
  AlertCircle,
  Check,
  Building2,
  Sparkles,
  ArrowRight,
  Navigation
} from "lucide-react";
import { useLocation } from "@/lib/locationContext";
import { useStore } from "@/lib/store";

export default function LocationModal() {
  const {
    location,
    isLocationModalOpen,
    closeLocationModal,
    detectCurrentLocation,
    setLocation,
    isDetecting,
    error,
    setError,
  } = useLocation();

  const { setPin, toast } = useStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [popularLocations, setPopularLocations] = useState([]);
  const inputRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Focus input when opened
  useEffect(() => {
    if (isLocationModalOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      // Fetch popular locations
      fetch("/api/location/search")
        .then((r) => r.json())
        .then((data) => {
          if (data?.results) setPopularLocations(data.results.slice(0, 6));
        })
        .catch(() => {});
    } else {
      setSearchQuery("");
      setResults([]);
      setError(null);
    }
  }, [isLocationModalOpen, setError]);

  // Handle Search Input with debounce
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setError(null);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/location/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("Failed to fetch suggestions:", err);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  const handleSelectLocation = (loc) => {
    const selected = {
      city: loc.city || "Bengaluru",
      state: loc.state || "",
      pincode: loc.pincode || "",
      area: loc.area || loc.city,
      formattedAddress: loc.formattedAddress || `${loc.area}, ${loc.city}`,
      lat: loc.lat || 12.9716,
      lng: loc.lng || 77.5946,
    };

    setLocation(selected, "MANUAL");

    // Also sync with legacy store's PIN if available
    if (selected.pincode) {
      setPin(selected.pincode);
    }

    if (toast) {
      toast(`Location set to ${selected.area || selected.city}`);
    }

    closeLocationModal();
  };

  const handleGpsDetect = async () => {
    const res = await detectCurrentLocation();
    if (res?.success && res.location) {
      if (res.location.pincode) {
        setPin(res.location.pincode);
      }
      if (toast) {
        toast(`Location detected: ${res.location.area || res.location.city}`);
      }
    }
  };

  if (!isLocationModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Subtle backdrop with blur */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={closeLocationModal}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 fade-in duration-200">
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF1EF] text-[#FF6B5A] flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <MapPin size={22} className="stroke-[2.2]" />
            </div>
            <div>
              <h2
                id="modal-title"
                className="text-xl font-bold text-slate-900 tracking-tight"
              >
                Select Your Location
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5 leading-relaxed">
                We need your location to show you relevant products, services and availability near you.
              </p>
            </div>
          </div>
          <button
            onClick={closeLocationModal}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {/* Prominent Current Location Button */}
          <button
            type="button"
            onClick={handleGpsDetect}
            disabled={isDetecting}
            className="w-full group flex items-center justify-between p-4 rounded-xl border-2 border-[#FF6B5A]/20 bg-[#FFF8F7] hover:bg-[#FFF1EF] hover:border-[#FF6B5A]/40 transition-all cursor-pointer text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#FF6B5A] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
                {isDetecting ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Crosshair size={20} className="stroke-[2.5]" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm sm:text-base text-slate-900">
                    {isDetecting ? "Detecting location..." : "Use My Current Location"}
                  </span>
                  <span className="bg-[#FF6B5A]/15 text-[#FF6B5A] text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    GPS
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  {isDetecting
                    ? "Requesting browser permission and accurate coordinates..."
                    : "Automatically detect area using GPS and reverse geocoding"}
                </p>
              </div>
            </div>
            <ArrowRight size={18} className="text-[#FF6B5A] group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
          </button>

          {/* Error notice if detection fails */}
          {error && (
            <div className="p-3.5 bg-red-50/90 border border-red-200/80 rounded-xl flex items-start gap-3 text-red-700 text-xs sm:text-sm animate-in fade-in">
              <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-600" />
              <div className="flex-1">
                <span className="font-semibold block">Location Detection Notice</span>
                <p className="mt-0.5 text-red-600 leading-normal">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-700 p-0.5"
              >
                <X size={15} />
              </button>
            </div>
          )}

          {/* Divider with "OR" */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200" />
            <span className="flex-shrink mx-3 text-slate-400 text-xs font-bold uppercase tracking-wider">
              Or search manually
            </span>
            <div className="flex-grow border-t border-slate-200" />
          </div>

          {/* Search Input Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by City, Locality, Area or 6-digit PIN code..."
              className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#FF6B5A] focus:bg-white rounded-xl text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 shadow-xs"
            />
            {isSearching ? (
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
                <Loader2 size={16} className="animate-spin text-slate-400" />
              </div>
            ) : searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setResults([]);
                }}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            ) : null}
          </div>

          {/* Search Autocomplete Suggestions */}
          {searchQuery.trim() !== "" && (
            <div className="space-y-1 max-h-56 overflow-y-auto rounded-xl border border-slate-100 p-1.5 bg-slate-50/50">
              {results.length > 0 ? (
                results.map((item, idx) => (
                  <button
                    key={item.id || idx}
                    type="button"
                    onClick={() => handleSelectLocation(item)}
                    className="w-full flex items-start gap-3 p-2.5 rounded-lg text-left hover:bg-white hover:shadow-xs transition-all cursor-pointer group"
                  >
                    <div className="p-1.5 rounded-md bg-white border border-slate-200 text-slate-500 group-hover:text-[#FF6B5A] group-hover:border-[#FF6B5A]/30 mt-0.5 shrink-0 transition-colors">
                      <MapPin size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-800 group-hover:text-[#FF6B5A] truncate transition-colors">
                          {item.area || item.city}
                        </span>
                        {item.pincode && (
                          <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                            {item.pincode}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {item.city}, {item.state}
                      </p>
                    </div>
                  </button>
                ))
              ) : !isSearching ? (
                <div className="p-6 text-center text-slate-400 text-sm">
                  <p>No locations found matching &quot;{searchQuery}&quot;.</p>
                  <p className="text-xs mt-1 text-slate-400">
                    Try searching with another pincode, city, or area name.
                  </p>
                </div>
              ) : null}
            </div>
          )}

          {/* Current Saved Info Badge */}
          {location?.formattedAddress && (
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
              <Navigation size={13} className="text-slate-400 shrink-0" />
              <span className="truncate">
                Saved location: <span className="font-medium text-slate-700">{location.formattedAddress}</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
