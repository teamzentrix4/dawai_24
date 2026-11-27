"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const LocationContext = createContext(null);

export const LOCATION_STORAGE_KEY = "dawai24_user_location";
export const LOCATION_PROMPTED_KEY = "dawai24_location_prompted";

const DEFAULT_LOCATION = {
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560102",
  area: "HSR Layout",
  formattedAddress: "HSR Layout, Bengaluru, Karnataka 560102",
  lat: 12.9121,
  lng: 77.6446,
  method: "DEFAULT", // "GPS" | "MANUAL" | "DEFAULT"
  selectedAt: null,
};

export function LocationProvider({ children }) {
  const [location, setLocationState] = useState(DEFAULT_LOCATION);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage safely on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCATION_STORAGE_KEY);
      const prompted = localStorage.getItem(LOCATION_PROMPTED_KEY);

      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && (parsed.city || parsed.pincode)) {
            setLocationState(parsed);
          }
        } catch (e) {
          console.error("Failed to parse stored location:", e);
        }
      } else if (!prompted) {
        // First-time visitor: auto-open popup after slight delay for smooth render
        const timer = setTimeout(() => {
          setIsLocationModalOpen(true);
        }, 900);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.warn("localStorage unavailable:", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Update location and persist to localStorage
  const setLocation = useCallback((newLocationData, method = "MANUAL") => {
    setError(null);
    const updated = {
      ...newLocationData,
      method,
      selectedAt: new Date().toISOString(),
    };

    setLocationState(updated);

    try {
      localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(updated));
      localStorage.setItem(LOCATION_PROMPTED_KEY, "true");
    } catch (e) {
      console.warn("Failed to save location to localStorage:", e);
    }
  }, []);

  // Browser Geolocation Detection using HTML5 Geolocation API + Reverse Geocoding
  const detectCurrentLocation = useCallback(async () => {
    setError(null);
    setIsDetecting(true);

    if (typeof window === "undefined" || !navigator.geolocation) {
      setIsDetecting(false);
      const err = "Geolocation is not supported by your browser. Please search your location manually.";
      setError(err);
      return { success: false, error: err };
    }

    return new Promise((resolve) => {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;

            // Call reverse geocoding internal API
            const response = await fetch(
              `/api/location/reverse-geocode?lat=${latitude}&lng=${longitude}`
            );

            if (!response.ok) {
              throw new Error("Unable to reverse geocode location");
            }

            const data = await response.json();

            const newLoc = {
              lat: latitude,
              lng: longitude,
              city: data.city || "Bengaluru",
              state: data.state || "Karnataka",
              pincode: data.pincode || "",
              area: data.area || data.city || "Current Location",
              formattedAddress:
                data.formattedAddress ||
                `${data.area || data.city}, ${data.city}, ${data.state}`,
            };

            setLocation(newLoc, "GPS");
            setIsDetecting(false);
            setIsLocationModalOpen(false);
            resolve({ success: true, location: newLoc });
          } catch (err) {
            console.error("Reverse geocoding error:", err);
            // Fallback gracefully with coords
            const fallbackLoc = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              city: "Current Location",
              state: "",
              pincode: "",
              area: "Near You",
              formattedAddress: `Near (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})`,
            };
            setLocation(fallbackLoc, "GPS");
            setIsDetecting(false);
            setIsLocationModalOpen(false);
            resolve({ success: true, location: fallbackLoc });
          }
        },
        (geoError) => {
          setIsDetecting(false);
          let message = "Unable to retrieve your location.";
          switch (geoError.code) {
            case geoError.PERMISSION_DENIED:
              message =
                "Location permission was denied. Please allow location access in your browser settings or search manually below.";
              break;
            case geoError.POSITION_UNAVAILABLE:
              message =
                "Location information is currently unavailable. Please select your location manually.";
              break;
            case geoError.TIMEOUT:
              message =
                "Location request timed out. Please try again or select manually.";
              break;
            default:
              message = "An unknown error occurred while detecting location.";
              break;
          }
          setError(message);
          resolve({ success: false, error: message });
        },
        options
      );
    });
  }, [setLocation]);

  const openLocationModal = useCallback(() => {
    setError(null);
    setIsLocationModalOpen(true);
  }, []);

  const closeLocationModal = useCallback(() => {
    setIsLocationModalOpen(false);
    // Mark as prompted so it doesn't pop up again even if closed
    try {
      localStorage.setItem(LOCATION_PROMPTED_KEY, "true");
    } catch {}
  }, []);

  // Format label for display (e.g., "HSR Layout, Bengaluru" or "Bengaluru, 560102")
  const displayLocation = location.area
    ? `${location.area}, ${location.city}`
    : location.city
    ? `${location.city}${location.pincode ? `, ${location.pincode}` : ""}`
    : "Select Location";

  return (
    <LocationContext.Provider
      value={{
        location,
        displayLocation,
        isLocationModalOpen,
        openLocationModal,
        closeLocationModal,
        detectCurrentLocation,
        setLocation,
        isDetecting,
        error,
        setError,
        isInitialized,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}
