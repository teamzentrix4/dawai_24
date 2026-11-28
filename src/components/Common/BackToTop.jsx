"use client";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  if (!show) return null;
  return (
    <button
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-22 right-6 z-40 rounded-full bg-brand-700 text-white p-3 shadow-lg hover:bg-brand-900 transition-all hover:scale-105 active:scale-95"
    >
      <ArrowUp size={18} />
    </button>
  );
}
