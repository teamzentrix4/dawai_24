"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export function useMedicineSearch(initialQuery = "") {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const abortControllerRef = useRef(null);
  const timeoutRef = useRef(null);

  const fetchSuggestions = useCallback(async (searchTerm) => {
    const trimmed = searchTerm.trim();
    if (trimmed.length < 1) {
      setSuggestions([]);
      setLoading(false);
      setHasSearched(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/medicines/search?q=${encodeURIComponent(trimmed)}`, {
        signal: abortControllerRef.current.signal
      });

      if (!res.ok) throw new Error("Search request failed");
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Search error:", err);
        setSuggestions([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced input watcher (250ms delay per requirements)
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (query.trim().length >= 1) {
      timeoutRef.current = setTimeout(() => {
        fetchSuggestions(query);
      }, 250);
    } else {
      setSuggestions([]);
      setLoading(false);
      setHasSearched(false);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query, fetchSuggestions]);

  const clear = useCallback(() => {
    setQuery("");
    setSuggestions([]);
    setIsOpen(false);
    setHasSearched(false);
  }, []);

  return {
    query,
    setQuery,
    suggestions,
    loading,
    isOpen,
    setIsOpen,
    hasSearched,
    clear,
    fetchSuggestions
  };
}
