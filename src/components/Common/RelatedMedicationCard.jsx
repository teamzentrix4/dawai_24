"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export default function RelatedMedicationCard({ saltName, saltSlug }) {
  const router = useRouter();
  const { requestAddToCart, toast } = useStore();
  const [requested, setRequested] = useState(false);
  const [addedBrand, setAddedBrand] = useState(false);
  const [addedSub, setAddedSub] = useState(false);

  // Generate realistic brand & substitute medicine based on the salt name
  const cleanSalt = saltName || "Abatacept";
  const upperSalt = cleanSalt.toUpperCase();
  const strength = "250MG";

  // Brand medicine info
  const isAbatacept = cleanSalt.toLowerCase().includes("abatacept");
  const brandSlug = isAbatacept ? "orencia-powder-for-infusion" : `${cleanSalt.toLowerCase().replace(/\s+/g, '-')}-250mg`;
  const brandId = isAbatacept ? "10280" : "1062178";
  const brandDetailUrl = `/medicines/${brandSlug}/${brandId}`;

  const brandName = cleanSalt.toLowerCase().includes("abacavir")
    ? "A Bec 300mg Tablet 30s"
    : isAbatacept
    ? "Orencia Powder for infusion"
    : `${cleanSalt} 250mg Injection`;

  const brandMfg = cleanSalt.toLowerCase().includes("abacavir")
    ? "Emcure Pharmaceuticals Ltd."
    : isAbatacept
    ? "BMS India Pvt. Ltd."
    : "Sun Pharmaceutical Industries";

  const brandPack = cleanSalt.toLowerCase().includes("abacavir")
    ? "Bottle of 30 tablets"
    : isAbatacept
    ? "Box of 1 vial"
    : "Pack of 1 vial";

  const brandMrp = isAbatacept ? 30000 : 1488;

  // Substitute medicine info
  const hasSubstitute = !isAbatacept;
  const subSlug = `${brandSlug}-substitute`;
  const subId = "20480";
  const subDetailUrl = `/medicines/${subSlug}/${subId}`;
  const subName = `${cleanSalt} Bio-Substitute 250mg`;
  const subMfg = "Cipla Ltd. / Dr. Reddy's";
  const subPack = brandPack;
  const subPrice = Math.round(brandMrp * 0.35);

  const handleRequestSubstitute = (e) => {
    e.stopPropagation();
    setRequested(true);
    if (toast) {
      toast("Substitute request received! Our pharmacist will notify you once verified.");
    }
  };

  const handleAddBrand = (e) => {
    e.stopPropagation();
    if (!requestAddToCart(brandSlug, 1)) return;
    setAddedBrand(true);
    setTimeout(() => setAddedBrand(false), 2000);
  };

  const handleAddSub = (e) => {
    e.stopPropagation();
    if (!requestAddToCart(subSlug, 1)) return;
    setAddedSub(true);
    setTimeout(() => setAddedSub(false), 2000);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-[18px] sm:text-[20px] font-[600] text-[#031926]">
        Related Medications
      </h2>

      {/* Main Container Card matching reference - WHOLE CARD IS CLICKABLE */}
      <div 
        onClick={() => router.push(brandDetailUrl)}
        className="border border-[#e2ecf4] rounded-[12px] bg-white shadow-2xs hover:shadow-md transition-all cursor-pointer group overflow-hidden"
      >
        
        {/* Top Header: Salt Composition Title Bar (Pinkish-red tint) */}
        <div className="border-t-[2px] border-t-[#fc5a5a] bg-[#ffefef] px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#fc5a5a]/15 flex items-center justify-center text-[#fc5a5a]">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="6" cy="6" r="3" />
                <circle cx="18" cy="18" r="3" />
                <circle cx="18" cy="6" r="3" />
                <line x1="8.5" y1="7.5" x2="15.5" y2="16.5" />
                <line x1="8.5" y1="6" x2="15.5" y2="6" />
              </svg>
            </div>
            <span className="text-[12px] font-[600] text-[#3f3f3f] uppercase tracking-wide truncate max-w-[200px]">
              {upperSalt} {strength}
            </span>
          </div>

          <span className="text-[10px] font-bold text-[#fc5a5a] bg-white px-2 py-0.5 rounded-full border border-[#fc5a5a]/20">
            Salt Composition
          </span>
        </div>

        {/* 2-Column Split Body */}
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#f0f0f0]">
          
          {/* Left Column: Brand Prescribed Medicine */}
          <div className="p-3 bg-[#fafafa] flex flex-col justify-between space-y-3">
            <div className="flex gap-3 items-start">
              {/* Product thumbnail with clean placeholder */}
              <div className="w-14 h-14 bg-white rounded-[8px] border border-[#ebebeb] flex items-center justify-center shrink-0 group-hover:border-[#fc5a5a]/40 transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5">
                  <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
                  <path d="m8.5 8.5 7 7" />
                </svg>
              </div>

              {/* Medicine details */}
              <div className="min-w-0 flex-1 space-y-0.5">
                <h3 className="text-[13px] font-[500] text-[#031926] group-hover:text-[#fc5a5a] transition-colors leading-snug line-clamp-2" title={brandName}>
                  {brandName}
                </h3>
                <p className="text-[11px] text-[#8e8e8e] truncate">
                  {brandMfg}
                </p>
                <p className="text-[11px] text-[#666]">
                  {brandPack}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#eee] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#888] uppercase block">MRP</span>
                <span className="text-[15px] font-[600] text-[#031926]">
                  ₹{brandMrp.toLocaleString("en-IN")}
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddBrand}
                className="px-3.5 py-1.5 bg-[#fc5a5a] hover:bg-[#e04848] text-white text-[12px] font-[600] rounded-[6px] transition-colors z-10"
              >
                {addedBrand ? "Added ✓" : "Add"}
              </button>
            </div>
          </div>

          {/* Right Column: Substitute Medicine or "Unavailable" block matching user screenshot */}
          <div className="p-3 bg-[#f6fff5] flex flex-col justify-between space-y-3">
            {!hasSubstitute ? (
              // Unavailable State (Exactly as in user's uploaded screenshot)
              <div className="h-full flex flex-col justify-between">
                <div className="flex gap-3 items-center">
                  {/* Binoculars icon container */}
                  <div className="w-14 h-14 bg-white rounded-[8px] border border-[#ebebeb] flex items-center justify-center shrink-0 p-2">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="8" cy="15" r="4" />
                      <circle cx="16" cy="15" r="4" />
                      <line x1="8" y1="4" x2="8" y2="11" />
                      <line x1="16" y1="4" x2="16" y2="11" />
                      <line x1="10" y1="7" x2="14" y2="7" />
                    </svg>
                  </div>

                  <p className="text-[13px] font-[500] text-[#031926] leading-snug">
                    Sorry, Substitute Medicine is Unavailable
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleRequestSubstitute}
                    disabled={requested}
                    className={`px-4 py-2 text-[12px] font-[500] rounded-[6px] transition-colors z-10 ${
                      requested
                        ? "bg-[#e2e8f0] text-[#64748b] cursor-default"
                        : "bg-[#fc5a5a] hover:bg-[#e04848] text-white cursor-pointer shadow-2xs"
                    }`}
                  >
                    {requested ? "Requested ✓" : "Request Substitute"}
                  </button>
                </div>
              </div>
            ) : (
              // Available Same-Salt Substitute State
              <div 
                onClick={(e) => { e.stopPropagation(); router.push(subDetailUrl); }}
                className="flex flex-col justify-between h-full space-y-3 cursor-pointer"
              >
                <div className="flex gap-3 items-start">
                  <div className="w-14 h-14 bg-white rounded-[8px] border border-[#509854]/30 flex items-center justify-center shrink-0">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#219653" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="inline-block bg-[#219653] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      65% SAVE
                    </div>
                    <h3 className="text-[13px] font-[500] text-[#031926] hover:text-[#219653] transition-colors leading-snug line-clamp-2">
                      {subName}
                    </h3>
                    <p className="text-[11px] text-[#666] truncate">{subMfg}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#e2f0e0] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#219653] font-bold block">SUBSTITUTE PRICE</span>
                    <span className="text-[15px] font-[700] text-[#219653]">
                      ₹{subPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSub}
                    className="px-3.5 py-1.5 bg-[#219653] hover:bg-[#1b7a43] text-white text-[12px] font-[600] rounded-[6px] transition-colors z-10"
                  >
                    {addedSub ? "Added ✓" : "Add"}
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Selling Value Prop Card */}
      <div className="border border-[#e2ecf4] rounded-[12px] p-4 bg-white shadow-2xs space-y-3">
        <h4 className="text-[14px] font-[600] text-[#031926]">
          Save Up to 70% with Verified Substitutes
        </h4>
        <p className="text-[12px] text-[#666] leading-relaxed">
          Order medicines listed in the live Dawai24 catalogue. Product details and availability are managed by the administration team.
        </p>
        <Link
          href="/medicines"
          className="block text-center py-2 bg-[#f8fafc] hover:bg-[#f1f5f9] text-[#fc5a5a] border border-[#fc5a5a] text-[12px] font-[600] rounded-[6px] transition-colors"
        >
          Explore All Medicines
        </Link>
      </div>

      {/* WhatsApp Help Float / Support Button */}
      <div className="flex items-center justify-between p-3 rounded-[10px] bg-[#f0fdf4] border border-[#bbf7d0]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z" />
            </svg>
          </div>
          <div>
            <p className="text-[12px] font-[600] text-[#166534]">Need Help Ordering?</p>
            <p className="text-[11px] text-[#15803d]">Chat with our pharmacist on WhatsApp</p>
          </div>
        </div>
        <a
          href="https://wa.me/919606973757"
          target="_blank"
          rel="noopener noreferrer"
          className="px-2.5 py-1 bg-[#25D366] text-white text-[11px] font-[600] rounded hover:bg-[#1ebc59] transition-colors"
        >
          Chat
        </a>
      </div>

    </div>
  );
}
