"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Heart, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Check, 
  Sparkles,
  FileText
} from "lucide-react";
import ProductImage from "@/components/Common/ProductImage";
import QtyControl from "@/components/Common/QtyControl";
import { useStore } from "@/lib/store";
import { money } from "@/lib/catalog";
import { validPin } from "@/components/Header/PinModal";

const tabs = ["Salt & Composition", "Description & Uses", "Dosage & Side Effects", "Delivery & Returns"];

export default function ProductDetail({ product: p }) {
  const router = useRouter();
  const { requestAddToCart, wishlist, toggleWish, toast, pin, setPin } = useStore();
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState(0);
  const [pinIn, setPinIn] = useState(pin || "560102");
  const [pinMsg, setPinMsg] = useState("");
  const liked = wishlist.includes(p.id);

  const checkPin = () => {
    if (!validPin(pinIn)) return setPinMsg("Enter a valid 6-digit PIN code");
    setPin(pinIn);
    setPinMsg(`Standard delivery to ${pinIn} available within 24-48 hours`);
  };

  const handleBuyNow = () => {
    if (requestAddToCart(p.id, qty)) router.push("/checkout");
  };

  return (
    <div className="space-y-8">
      {/* Top Main Details Section */}
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 bg-white rounded-3xl p-6 sm:p-8 border border-[#ECEEF2] shadow-xs">
        
        {/* Left: Product Image & Badges */}
        <div className="relative self-start space-y-4">
          <div className="bg-[#FAFBFD] rounded-2xl border border-[#F0F2F5] p-6 relative overflow-hidden flex items-center justify-center">
            {p.discount > 0 && (
              <span className="absolute left-4 top-4 bg-[#FFF1EF] text-[#FF6B5A] text-[12px] font-bold px-3 py-1 rounded-full border border-[#FEE2E2]">
                {p.discount}% OFF
              </span>
            )}
            <button
              onClick={() => {
                toggleWish(p.id);
                toast(liked ? "Removed from wishlist" : "Saved to wishlist", "info");
              }}
              className="absolute right-4 top-4 w-9 h-9 rounded-full bg-white shadow-xs flex items-center justify-center text-gray-400 hover:text-[#FF6B5A] transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={18} className={liked ? "fill-[#FF6B5A] text-[#FF6B5A]" : ""} />
            </button>
            <ProductImage product={p} className="w-full max-w-[380px] aspect-square object-contain" />
          </div>

          {/* Davai24 Quality Assurance Badge */}
          <div className="rounded-2xl bg-[#F8F9FB] border border-[#EAECEF] p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-[#171725]">100% Genuine Branded Medicine</h4>
              <p className="text-[12px] text-[#696974]">Direct from authorized pharmaceutical distributors</p>
            </div>
          </div>
        </div>

        {/* Right: Info, Price, Substitute Comparison, Actions */}
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[12px] font-bold text-[#FF6B5A] bg-[#FFF1EF] px-2.5 py-0.5 rounded-full">
                {p.brand}
              </span>
              <span className="text-[12px] text-[#92929D] font-medium">· {p.pack}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171725] tracking-tight">{p.name}</h1>
            <p className="text-[13px] text-[#696974] mt-1 font-mono">Composition: Active Salt Formulation (100% match)</p>
          </div>

          {/* Price breakdown */}
          <div className="bg-[#FAFBFD] rounded-2xl p-4 border border-[#ECEEF2]">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-[#171725]">{money(p.price)}</span>
              {p.mrp > p.price && (
                <span className="text-sm text-[#92929D] line-through font-medium">MRP {money(p.mrp)}</span>
              )}
              <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                Save {money(p.mrp - p.price)} ({p.discount}%)
              </span>
            </div>
            <p className="text-[11px] text-[#92929D] mt-1">Inclusive of all applicable taxes</p>
          </div>

          {/* Prescription Alert if needed */}
          {p.prescription && (
            <div className="flex items-start gap-3 rounded-2xl bg-[#FFF9EB] border border-[#FEE685] p-3.5 text-[13px] text-[#92400E]">
              <FileText size={18} className="shrink-0 mt-0.5 text-amber-700" />
              <div>
                <p className="font-bold">Prescription Required</p>
                <p className="text-[12px] text-[#B45309] mt-0.5">Please have your prescription handy to complete checkout.</p>
              </div>
            </div>
          )}

          {/* Quantity and Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-[13px] font-bold text-[#171725]">Quantity:</span>
              <QtyControl value={qty} onChange={setQty} />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => {
                  requestAddToCart(p.id, qty);
                }}
                className="btn btn-outline w-full py-3 text-[14px]"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="btn btn-primary w-full py-3 text-[14px]"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* PIN Code Delivery Checker (Davai24 style) */}
          <div className="border-t border-[#F0F2F5] pt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-[#171725] flex items-center gap-1.5">
                <Truck size={16} className="text-[#FF6B5A]" /> Delivery Options
              </span>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit PIN code"
                  value={pinIn}
                  onChange={(e) => {
                    setPinIn(e.target.value.replace(/\D/g, ""));
                    setPinMsg("");
                  }}
                  className="input !pl-9 !py-2 text-[13px]"
                />
              </div>
              <button
                onClick={checkPin}
                className="px-5 py-2 rounded-xl bg-[#F0F2F5] text-[#171725] hover:bg-[#E4E7EC] font-semibold text-[13px] transition-colors"
              >
                Check
              </button>
            </div>
            {pinMsg && (
              <p className="text-[12px] font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg">
                {pinMsg}
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Tabs Section: Composition, Uses, Side Effects */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ECEEF2] shadow-xs">
        <div className="flex border-b border-[#F0F2F5] gap-6 overflow-x-auto scrollbar-none pb-1">
          {tabs.map((t, idx) => (
            <button
              key={t}
              onClick={() => setTab(idx)}
              className={`pb-3 text-[14px] font-bold whitespace-nowrap transition-colors relative ${
                tab === idx ? "text-[#FF6B5A]" : "text-[#696974] hover:text-[#171725]"
              }`}
            >
              {t}
              {tab === idx && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#FF6B5A] rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="pt-6 text-[14px] text-[#44444F] leading-relaxed">
          {tab === 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-[16px] text-[#171725]">Active Salt Composition</h3>
              <p>
                Contains standard active pharmaceutical ingredients identical to branded prescribed formulations. 
                Davai24 partners only with top manufacturers following strict GMP (Good Manufacturing Practice) standards.
              </p>
              <div className="bg-[#FAFBFD] p-4 rounded-xl border border-[#ECEEF2] grid grid-cols-2 gap-4 text-[13px]">
                <div>
                  <span className="text-[#92929D] block">Salt Form</span>
                  <span className="font-bold text-[#171725]">Therapeutic Grade Active Salt</span>
                </div>
                <div>
                  <span className="text-[#92929D] block">Safety Assurance</span>
                  <span className="font-bold text-[#171725]">GMP & FDA Standards</span>
                </div>
              </div>
            </div>
          )}
          {tab === 1 && (
            <div className="space-y-4">
              <h3 className="font-bold text-[16px] text-[#171725]">Uses & Benefits</h3>
              <p>{p.description || "Indicated for therapeutic management as prescribed by your consulting physician."}</p>
              <ul className="list-disc pl-5 space-y-1.5 text-[13px]">
                <li>Manufactured by certified pharmaceutical leaders</li>
                <li>Clinically verified bioequivalence to the prescribed innovator medicine</li>
                <li>Preserves patient safety while reducing chronic healthcare expenses</li>
              </ul>
            </div>
          )}
          {tab === 2 && (
            <div className="space-y-4">
              <h3 className="font-bold text-[16px] text-[#171725]">Dosage & Expert Advice</h3>
              <p>
                Take this medication in the dose and duration as advised by your doctor. Swallow it as a whole with a glass of water. Do not chew, crush or break it.
              </p>
              <p className="text-[12px] text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
                Caution: Always consult your physician or registered medical practitioner before starting or switching any medication.
              </p>
            </div>
          )}
          {tab === 3 && (
            <div className="space-y-3">
              <h3 className="font-bold text-[16px] text-[#171725]">Delivery, Return & Support</h3>
              <p>Standard delivery arrives within 24 to 48 hours for metro regions and 3-4 days for other PIN codes.</p>
              <p>Easy returns accepted within 7 days of delivery for unopened, sealed healthcare products.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
