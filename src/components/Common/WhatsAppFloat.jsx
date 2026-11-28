"use client";

import { useState } from "react";
import { SITE_CONFIG } from "@/lib/config";

export default function WhatsAppFloat() {
  const [isHovered, setIsHovered] = useState(false);

  const phoneNumber = SITE_CONFIG.whatsappNumber;
  const message = SITE_CONFIG.whatsappDefaultMessage;
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div
      className="fixed bottom-6 right-6 z-[9990] flex items-center group pointer-events-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip (Desktop & Hover) */}
      <div
        className={`hidden sm:flex items-center gap-1.5 absolute right-[68px] bg-[#171725] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap transition-all duration-200 pointer-events-none select-none ${
          isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
        }`}
      >
        <span>Chat with us on WhatsApp</span>
        {/* Subtle arrow pointer pointing right */}
        <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#171725] rotate-45" />
      </div>

      {/* Main WhatsApp Circular Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        title="Chat with us on WhatsApp"
        className="relative flex size-14 sm:size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_16px_rgba(37,211,102,0.35)] transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(37,211,102,0.5)] active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40 cursor-pointer"
      >
        {/* Subtle ping pulse animation around icon */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping -z-10 group-hover:hidden" />

        {/* Official WhatsApp SVG Icon */}
        <svg
          viewBox="0 0 32 32"
          className="size-7 sm:size-7 fill-current transition-transform duration-200 group-hover:scale-105"
          aria-hidden="true"
        >
          <path d="M16.02 3C8.85 3 3.02 8.81 3.02 15.96c0 2.28.6 4.51 1.73 6.48L3 29l6.74-1.76a13.1 13.1 0 0 0 6.27 1.6h.01C23.19 28.84 29 23.03 29 15.88A12.9 12.9 0 0 0 16.02 3Zm0 23.63a10.8 10.8 0 0 1-5.5-1.5l-.4-.23-4 1.05 1.07-3.9-.26-.42a10.75 10.75 0 0 1-1.65-5.67c0-5.93 4.83-10.75 10.76-10.75 2.87 0 5.57 1.12 7.6 3.15a10.7 10.7 0 0 1 3.15 7.6c0 5.93-4.83 10.75-10.77 10.75Zm5.9-8.05c-.32-.16-1.9-.94-2.2-1.04-.3-.11-.51-.16-.73.16-.21.32-.84 1.04-1.03 1.25-.19.21-.38.24-.7.08-.32-.16-1.36-.5-2.59-1.6-.96-.85-1.61-1.9-1.8-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.38.48-.57.16-.19.21-.32.32-.54.1-.21.05-.4-.03-.56-.08-.16-.73-1.75-1-2.4-.26-.63-.53-.54-.73-.55h-.62c-.22 0-.57.08-.87.4-.3.32-1.14 1.1-1.14 2.68s1.17 3.1 1.33 3.31c.16.21 2.3 3.5 5.58 4.91.78.34 1.38.55 1.85.7.78.25 1.49.21 2.05.13.63-.1 1.9-.78 2.17-1.53.27-.75.27-1.39.19-1.53-.08-.14-.3-.22-.62-.38Z" />
        </svg>
      </a>
    </div>
  );
}
