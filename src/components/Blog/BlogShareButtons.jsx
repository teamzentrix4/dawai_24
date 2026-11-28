"use client";

import { useState } from "react";
import { MessageCircle, Check, Link2 } from "lucide-react";

export default function BlogShareButtons({ title }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsApp = () => {
    if (typeof window !== "undefined") {
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `${title} - Read on Dawai24: ${window.location.href}`
      )}`;
      window.open(url, "_blank");
    }
  };

  const handleTwitter = () => {
    if (typeof window !== "undefined") {
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        title
      )}&url=${encodeURIComponent(window.location.href)}`;
      window.open(url, "_blank");
    }
  };

  return (
    <div className="flex items-center gap-1">
      {/* Twitter / X */}
      <div
        aria-label="Share on X"
        role="button"
        tabIndex={0}
        onClick={handleTwitter}
        className="text-[#1E293B] inline-flex size-8 cursor-pointer items-center justify-center rounded-full transition-all duration-200 ease-out hover:bg-[#F1F5F9] hover:scale-110 active:scale-95"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 21L10.5484 13.4516M21 3L13.4516 10.5484M13.4516 10.5484L8 3H3L10.5484 13.4516M13.4516 10.5484L21 21H16L10.5484 13.4516" />
        </svg>
      </div>

      {/* WhatsApp */}
      <div
        aria-label="Share on WhatsApp"
        role="button"
        tabIndex={0}
        onClick={handleWhatsApp}
        className="text-[#1E293B] inline-flex size-8 cursor-pointer items-center justify-center rounded-full transition-all duration-200 ease-out hover:bg-[#E8F8F0] hover:text-[#128C7E] hover:scale-110 active:scale-95"
      >
        <MessageCircle size={17} />
      </div>

      {/* Copy Link */}
      <div
        aria-label="Copy link"
        role="button"
        tabIndex={0}
        onClick={handleCopy}
        className="text-[#1E293B] inline-flex size-8 cursor-pointer items-center justify-center rounded-full transition-all duration-200 ease-out hover:bg-[#FFF1EF] hover:text-[#FF6B5A] hover:scale-110 active:scale-95"
      >
        {copied ? <Check size={16} className="text-[#22C55E]" /> : <Link2 size={16} />}
      </div>
    </div>
  );
}
