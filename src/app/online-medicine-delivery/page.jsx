"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Truck, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  PackageCheck, 
  Thermometer, 
  FileCheck2, 
  Search, 
  UploadCloud, 
  CheckCircle2, 
  ArrowRight,
  ChevronDown,
  Building2,
  AlertCircle
} from "lucide-react";
import Breadcrumbs from "@/components/Common/Breadcrumbs";

export default function OnlineMedicineDeliveryPage() {
  const [pincode, setPincode] = useState("");
  const [pinStatus, setPinStatus] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const checkPincode = (e) => {
    e.preventDefault();
    const cleanPin = pincode.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      setPinStatus({
        type: "error",
        msg: "Please enter a valid 6-digit Indian PIN code."
      });
      return;
    }
    setPinStatus({
      type: "success",
      msg: `PIN ${cleanPin} is serviceable for Dawai24 doorstep medicine delivery! Estimated delivery: 2–3 business days.`
    });
  };

  const deliverySteps = [
    {
      step: "01",
      title: "Upload Prescription or Search Medicines",
      desc: "Easily upload a photo of your doctor's prescription or browse our extensive catalog of authentic generic and branded substitute medications on Dawai24.",
      icon: UploadCloud
    },
    {
      step: "02",
      title: "Pharmacist Verification & Clinical Check",
      desc: "Our registered pharmacists carefully review every order, dosage strength, and drug interaction in compliance with the Drugs & Cosmetics Act.",
      icon: FileCheck2
    },
    {
      step: "03",
      title: "Tamper-Proof & Cold-Chain Packing",
      desc: "Medicines are sealed in discreet, opaque tamper-evident packaging. Temperature-sensitive items are packed with specialized cooling gel packs.",
      icon: PackageCheck
    },
    {
      step: "04",
      title: "Doorstep Express Delivery",
      desc: "Dispatched from our licensed pharmacy hub with end-to-end SMS tracking right up to your doorstep across India.",
      icon: Truck
    }
  ];

  const deliveryFaqs = [
    {
      q: "How long does medicine delivery take on Dawai24?",
      a: "For metro cities, orders are typically delivered within 24 to 48 hours. For tier 2 and tier 3 cities, delivery usually takes 2 to 4 business days."
    },
    {
      q: "Do I need a prescription to order medicines on Dawai24?",
      a: "Yes, for Schedule H, H1, and X prescription medications, a valid doctor's prescription is required by law. However, for over-the-counter (OTC) products and wellness supplements, no prescription is needed."
    },
    {
      q: "How are temperature-sensitive medicines like insulin shipped?",
      a: "Insulins, injections, and vaccines are packed inside temperature-controlled insulated boxes with cooling gel packs to ensure strict 2°C–8°C storage throughout transit."
    },
    {
      q: "What are the shipping charges for medicine delivery?",
      a: "Dawai24 offers free delivery on eligible orders above ₹499. For smaller orders, a nominal delivery fee applies at checkout based on location."
    }
  ];

  return (
    <div className="bg-[#FAFBFD] min-h-screen">
      {/* 1. Breadcrumbs */}
      <div className="bg-white border-b border-[#F0F2F5]">
        <div className="container-x max-w-6xl py-3">
          <Breadcrumbs items={[{ label: "Online Medicine Delivery" }]} />
        </div>
      </div>

      <div className="container-x max-w-5xl py-8 sm:py-12 space-y-12 sm:space-y-16">
        
        {/* 2. Hero Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-[#E9ECEF] shadow-2xs space-y-6 text-center sm:text-left">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2E7D32] bg-[#F0FDF4] border border-[#2E7D32]/20 px-3.5 py-1.5 rounded-full">
              <Truck size={15} /> Pan-India Express Logistics
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#171725] tracking-tight">
              Online Medicine Delivery
            </h1>
            <p className="text-base sm:text-lg text-[#2E7D32] font-semibold">
              Safe, authentic, and fast doorstep delivery of chronic medicines and verified substitutes across India with Dawai24.
            </p>
          </div>

          {/* Quick PIN Code Availability Checker */}
          <div className="pt-2">
            <div className="bg-[#FAFBFD] border border-[#E2E8F0] p-4 sm:p-6 rounded-2xl max-w-2xl space-y-3">
              <p className="text-xs sm:text-sm font-bold text-[#171725] flex items-center gap-2">
                <MapPin size={18} className="text-[#FF6B5A]" /> Check Delivery Serviceability in Your Area
              </p>
              <form onSubmit={checkPincode} className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 6-digit delivery PIN code"
                  className="flex-1 bg-white border border-[#CBD5E1] rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-[#2E7D32]"
                />
                <button
                  type="submit"
                  className="bg-[#2E7D32] hover:bg-[#256628] text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors cursor-pointer shrink-0"
                >
                  Check Serviceability
                </button>
              </form>

              {pinStatus && (
                <div className={`p-3 rounded-xl text-xs font-semibold ${
                  pinStatus.type === "success" 
                    ? "bg-[#F0FDF4] text-[#2E7D32] border border-[#2E7D32]/20" 
                    : "bg-red-50 text-red-600 border border-red-200"
                }`}>
                  {pinStatus.msg}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 3. 4-Step How It Works Grid */}
        <section className="space-y-6">
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#171725] tracking-tight">
              How Dawai24 Medicine Delivery Works
            </h2>
            <p className="text-xs sm:text-sm text-[#696974]">
              From doctor prescription validation to safe doorstep dispatch in 4 transparent stages.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {deliverySteps.map((step, idx) => {
              const IconComp = step.icon;
              return (
                <div key={idx} className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E9ECEF] shadow-2xs space-y-3 relative hover:shadow-md transition-shadow">
                  <span className="text-3xl font-black text-[#E2E8F0] absolute top-4 right-4">
                    {step.step}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-[#F0FDF4] text-[#2E7D32] flex items-center justify-center">
                    <IconComp size={24} />
                  </div>
                  <h3 className="text-base font-bold text-[#171725] pt-1">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Packaging & Safety Standards */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E9ECEF] shadow-2xs space-y-6">
          <div className="space-y-1 border-b border-[#F0F2F5] pb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#171725] tracking-tight">
              Safety, Privacy &amp; Quality Assurances
            </h2>
            <p className="text-xs sm:text-sm text-[#696974]">
              Every parcel leaving our licensed pharmacy undergoes 3-tier inspection protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-[#FAFBFD] border border-[#E2E8F0] space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-bold text-[#171725] text-sm sm:text-base">100% Discreet Packaging</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Your medical privacy is strictly protected. All medications are delivered in sealed, plain outer security cartons without medicine names visible externally.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAFBFD] border border-[#E2E8F0] space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#2E7D32] flex items-center justify-center">
                <Thermometer size={20} />
              </div>
              <h3 className="font-bold text-[#171725] text-sm sm:text-base">Cold-Chain Temperature Control</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Insulins and biologic injectables are dispatched with specialized thermal cooling gel packs, maintaining 2°C to 8°C throughout transit.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAFBFD] border border-[#E2E8F0] space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#FFF1EF] text-[#FF6B5A] flex items-center justify-center">
                <Clock size={20} />
              </div>
              <h3 className="font-bold text-[#171725] text-sm sm:text-base">Live SMS &amp; WhatsApp Tracking</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Receive instant tracking alerts from courier pickup to out-for-delivery status, complete with registered delivery partner contacts.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Where We Serve & Fulfillment Network */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E9ECEF] shadow-2xs space-y-6">
          <div className="space-y-2 border-b border-[#F0F2F5] pb-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#171725]">
              <span className="text-base">🇮🇳</span> Licensed Regional Pharmacy Hubs
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#171725] tracking-tight">
              Pan-India Fulfillment Hubs
            </h2>
            <p className="text-xs sm:text-sm text-[#475569]">
              Orders are packaged and dispatched directly from licensed premises under the supervision of registered pharmacists:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAFBFD] border border-[#E2E8F0] space-y-1">
              <p className="font-bold text-[#171725] text-sm">📍 Northern Hub (Delhi NCR)</p>
              <p className="text-xs text-[#696974]">Sector 125, Noida, Uttar Pradesh 201313</p>
              <p className="font-mono text-[11px] text-[#2E7D32]">Licensed Dispensing &amp; Fulfillment</p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAFBFD] border border-[#E2E8F0] space-y-1">
              <p className="font-bold text-[#171725] text-sm">📍 Southern Hub (Bengaluru)</p>
              <p className="text-xs text-[#696974]">Karnataka Fulfillment Network</p>
              <p className="font-mono text-[11px] text-[#2E7D32]">Cold-Chain &amp; Express Dispensing</p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAFBFD] border border-[#E2E8F0] space-y-1">
              <p className="font-bold text-[#171725] text-sm">📍 Western Hub (Mumbai)</p>
              <p className="text-xs text-[#696974]">Maharashtra Logistics Center</p>
              <p className="font-mono text-[11px] text-[#2E7D32]">Licensed Pharmacy Logistics</p>
            </div>
          </div>
        </section>

        {/* 6. Delivery FAQs */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E9ECEF] shadow-2xs space-y-6">
          <div className="space-y-1 border-b border-[#F0F2F5] pb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#171725] tracking-tight">
              Frequently Asked Questions About Delivery
            </h2>
          </div>

          <div className="divide-y divide-[#F0F2F5]">
            {deliveryFaqs.map((faq, index) => (
              <div key={index} className="py-4 first:pt-0 last:pb-0">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between gap-4 text-left font-bold text-sm sm:text-base text-[#171725] hover:text-[#2E7D32] transition-colors py-1 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-[#696974] transition-transform duration-200 ${
                      openFaq === index ? "rotate-180 text-[#2E7D32]" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <p className="mt-3 text-xs sm:text-sm text-[#475569] leading-relaxed bg-[#FAFBFD] p-4 rounded-xl border border-[#F0F2F5]">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 7. Bottom CTA */}
        <section className="bg-gradient-to-r from-[#171725] to-[#2D2D3A] rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-md">
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Order Your Prescribed Medicines Online Today
            </h2>
            <p className="text-xs sm:text-sm text-gray-300">
              Save up to 70% on your monthly prescription bills with guaranteed doorstep delivery from Dawai24.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-[#2E7D32] px-6 py-3 text-sm font-bold text-white shadow-xs hover:bg-[#256628] transition-colors"
            >
              Browse Medicines <ArrowRight size={16} />
            </Link>
            <Link
              href="/upload-prescription"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-6 py-3 text-sm font-bold text-white hover:bg-white/20 transition-colors"
            >
              Upload Prescription
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
