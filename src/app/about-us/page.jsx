"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Users, 
  Percent, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  ChevronDown, 
  ArrowRight,
  Sparkles,
  HelpCircle,
  FileCheck2,
  Clock,
  Layers,
  HeartHandshake
} from "lucide-react";
import Breadcrumbs from "@/components/Common/Breadcrumbs";

export default function AboutUsPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "How to order medicine on Dawai24?",
      a: "To order medicine on Dawai24, you can either search for the prescribed medicine or upload your prescription. You can also contact our support helpline at +91 89586 22622 for assistance. We recommend verified, identical-salt substitutes for you to order. Enter the patient's details and shipping address, upload a valid prescription, and choose a suitable payment method."
    },
    {
      q: "Is substitute medicine safe to consume?",
      a: "Yes, substitute medicines are safe and clinically as effective as prescribed brand-name medicines. They contain the identical drug salts and active ingredients, manufactured to the same regulatory standards in GMP-certified facilities. Good Manufacturing Practice (GMP) ensures high-quality production standards. At Dawai24, we offer only verified substitutes from reputed pharmaceutical manufacturers such as Cipla, Abbott, Sun Pharma, Dr. Reddy's, and Torrent."
    },
    {
      q: "Why is substitute medicine cheaper?",
      a: "Dawai24 cuts out excessive distribution layers and sources directly from authorized manufacturers and distributors. Moreover, branded pharmaceutical companies spend heavily on marketing, promotion, and representative channels, which increases the consumer MRP. Substitute medicines offer the exact same therapeutic formulation without marketing markups, delivering up to 60-70% savings directly to you."
    },
    {
      q: "How to choose the right substitute medicine for myself?",
      a: "Finding the right substitute from thousands of medicines can feel complicated. Our platform maps each branded medicine to its exact active salt composition and strength. Furthermore, our registered pharmacists verify every uploaded prescription before dispensing to guarantee accurate bioequivalence and patient safety."
    }
  ];

  return (
    <div className="bg-[#FAFBFD] min-h-screen">
      {/* 1. Breadcrumbs navigation */}
      <div className="bg-white border-b border-[#F0F2F5]">
        <div className="container-x max-w-6xl py-3">
          <Breadcrumbs items={[{ label: "About Us" }]} />
        </div>
      </div>

      <div className="container-x max-w-5xl py-8 sm:py-12 space-y-12 sm:space-y-16">
        
        {/* 2. Hero Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-[#E9ECEF] shadow-2xs space-y-6 text-center sm:text-left">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#171725] tracking-tight">
              Welcome To Dawai24
            </h1>
            <p className="text-base sm:text-lg md:text-xl font-medium text-[#2E7D32]">
              Your Trusted Online Medicine Delivery Partner — quick, safe, and convenient access to your medicines, right at your doorstep.
            </p>
          </div>

          {/* 3 Metric Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="flex items-center gap-4 bg-[#F8FAFC] rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] shadow-3xs">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Users size={24} />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-[#171725]">10L+</p>
                <p className="text-xs sm:text-sm font-semibold text-[#696974]">Patients &amp; Customers Served</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-[#F8FAFC] rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] shadow-3xs">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#2E7D32] flex items-center justify-center shrink-0">
                <Percent size={24} />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-[#2E7D32]">Up to 70%</p>
                <p className="text-xs sm:text-sm font-semibold text-[#696974]">Medicine Cost Savings</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-[#F8FAFC] rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] shadow-3xs">
              <div className="w-12 h-12 rounded-xl bg-[#FFF1EF] text-[#FF6B5A] flex items-center justify-center shrink-0">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-[#FF6B5A]">Pan-India</p>
                <p className="text-xs sm:text-sm font-semibold text-[#696974]">Express Delivery Reach</p>
              </div>
            </div>
          </div>

          {/* Narrative Paragraph */}
          <div className="pt-2 text-sm sm:text-base text-[#475569] leading-relaxed space-y-3">
            <p>
              Dawai24 was founded with a clear mission: ensuring that high monthly prescription costs never prevent patients and families from adhering to essential medical therapies. In a fast-moving world, visiting multiple offline pharmacies in search of prescribed medicines or affordable alternatives shouldn&apos;t be an ordeal.
            </p>
            <p>
              That is why Dawai24 provides a reliable, transparent online medicine discovery and delivery platform. Through Dawai24, you can order authentic medications and bioequivalent substitutes directly to your home, ensuring your family stays healthy without financial strain.
            </p>
          </div>
        </section>

        {/* 3. Leadership & Operations Team */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E9ECEF] shadow-2xs space-y-6">
          <div className="border-b border-[#F0F2F5] pb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#171725] tracking-tight">
              Meet the Team: The People Behind Dawai24
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-[#FAFBFD] border border-[#E2E8F0]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] text-white flex items-center justify-center font-black text-xl shadow-xs">
                D24
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#171725]">Dawai24 Founding Team</h3>
                <p className="text-xs sm:text-sm text-[#2E7D32] font-semibold">Leadership, Supply Chain &amp; Tech</p>
                <p className="text-xs text-[#696974] mt-0.5">Healthcare innovators dedicated to price transparency</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 rounded-2xl bg-[#FAFBFD] border border-[#E2E8F0]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF6B5A] to-[#E53935] text-white flex items-center justify-center font-black text-xl shadow-xs">
                Rx
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#171725]">Clinical Pharmacy Board</h3>
                <p className="text-xs sm:text-sm text-[#FF6B5A] font-semibold">Prescription Validation</p>
                <p className="text-xs text-[#696974] mt-0.5">Registered Pharmacists &amp; Quality Control Specialists</p>
              </div>
            </div>
          </div>

          <p className="text-sm sm:text-base text-[#475569] leading-relaxed pt-2">
            The team behind Dawai24 brings deep experience across pharmaceutical distribution, technology, and patient care. We believe modern software and organized logistics can democratize access to medicines by making prices clear, alternatives understandable, and delivery dependable for every pin code across India.
          </p>
        </section>

        {/* 4. Our Vision Section */}
        <section className="bg-gradient-to-br from-[#F0FDF4] via-white to-[#F8FAFC] rounded-3xl p-6 sm:p-10 border border-[#2E7D32]/20 shadow-2xs space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2E7D32]">
            <Sparkles size={16} /> Our Core Vision
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#171725] tracking-tight">
            Our Vision
          </h2>
          <div className="space-y-3 text-sm sm:text-base text-[#475569] leading-relaxed">
            <p>
              Dawai24 was established with a singular objective: <strong>to make healthcare and chronic medications genuinely affordable for every Indian family</strong>. We strive to simplify medicine purchasing by helping people discover high-quality medicines and authentic substitute options with identical efficacy.
            </p>
            <p>
              This is especially crucial for individuals and senior citizens managing long-term conditions (including diabetes, cardiovascular health, hypertension, and thyroid care) who require ongoing monthly prescriptions. From comparing salts and reviewing doctor prescriptions to dispatching sealed parcels to doorsteps, Dawai24 makes the entire journey effortless.
            </p>
            <p>
              As we scale our operations, our goal is to serve millions more households across urban and rural India, making dependable healthcare accessible at reasonable costs.
            </p>
          </div>
        </section>

        {/* 5. Why Choose Dawai24 for Medicine Home Delivery */}
        <section className="space-y-6">
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#171725] tracking-tight">
              Why Choose Dawai24 for Medicine Home Delivery?
            </h2>
            <p className="text-sm sm:text-base text-[#696974]">
              Transforming how Indian households procure their essential monthly healthcare needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E9ECEF] shadow-2xs hover:shadow-md transition-shadow space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Truck size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#171725]">
                Convenience at Your Fingertips
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Say goodbye to store-hopping and pharmacy queues. Easily upload your prescription or search your medicine name to order from the comfort of your home.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E9ECEF] shadow-2xs hover:shadow-md transition-shadow space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#2E7D32] flex items-center justify-center">
                <Layers size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#171725]">
                Transparent Medicine Buying Experience
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Transparency is our core standard. We provide complete salt composition details, manufacturer credentials, and direct price comparisons so you can make confident choices.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E9ECEF] shadow-2xs hover:shadow-md transition-shadow space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF1EF] text-[#FF6B5A] flex items-center justify-center">
                <Percent size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#171725]">
                Dismantling the Medicine Markup Burden
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                By sourcing directly from certified pharmaceutical distributors and eliminating intermediary promotional markups, we pass maximum savings directly to you.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E9ECEF] shadow-2xs hover:shadow-md transition-shadow space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Clock size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#171725]">
                Dedicated Customer &amp; Pharmacist Support
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Our support team and registered pharmacists are available daily from 10:00 AM to 7:00 PM via phone (+91 89586 22622) and email to address inquiries and ensure smooth fulfillment.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Where We Serve & Compliance Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E9ECEF] shadow-2xs space-y-8">
          <div className="space-y-2 border-b border-[#F0F2F5] pb-5">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#171725]">
              <span className="text-lg">🇮🇳</span> Pan-India Distribution &amp; Licensing Compliance
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#171725] tracking-tight">
              Where We Serve
            </h2>
            <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
              Dawai24 operates in compliance with pharmaceutical dispensing standards, fulfilling and shipping medicine orders across India through trusted logistics partners.
            </p>
          </div>

          {/* Operating Hubs & Pharmacy Partners */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-[#171725] flex items-center gap-2">
              <MapPin size={20} className="text-[#FF6B5A]" /> Distribution &amp; Registered Pharmacy Hubs
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAFBFD] border border-[#E2E8F0] space-y-1.5">
                <p className="font-bold text-[#171725] text-sm sm:text-base">📍 Northern Hub (Delhi NCR)</p>
                <p className="text-xs text-[#696974]">Sector 125, Noida, Uttar Pradesh 201313</p>
                <div className="pt-2 text-[11px] font-mono text-[#475569] bg-white p-2 rounded-lg border border-[#E2E8F0]">
                  Licensed Dispensing &amp; Fulfillment
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAFBFD] border border-[#E2E8F0] space-y-1.5">
                <p className="font-bold text-[#171725] text-sm sm:text-base">📍 Southern Hub (Bengaluru)</p>
                <p className="text-xs text-[#696974]">Karnataka Fulfillment Network</p>
                <div className="pt-2 text-[11px] font-mono text-[#475569] bg-white p-2 rounded-lg border border-[#E2E8F0]">
                  Licensed Dispensing &amp; Cold-Chain
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAFBFD] border border-[#E2E8F0] space-y-1.5">
                <p className="font-bold text-[#171725] text-sm sm:text-base">📍 Western Hub (Mumbai)</p>
                <p className="text-xs text-[#696974]">Maharashtra Logistics Center</p>
                <div className="pt-2 text-[11px] font-mono text-[#475569] bg-white p-2 rounded-lg border border-[#E2E8F0]">
                  Licensed Dispensing &amp; Logistics
                </div>
              </div>
            </div>
          </div>

          {/* States & Coverage */}
          <div className="grid sm:grid-cols-2 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-[#F0FDF4] border border-[#2E7D32]/20 space-y-2">
              <h4 className="font-bold text-sm sm:text-base text-[#171725] flex items-center gap-2">
                <CheckCircle2 size={18} className="text-[#2E7D32]" /> States and Union Territories We Serve
              </h4>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                Dawai24 delivers to customers across all <strong>28 States and 8 Union Territories of India</strong> through express courier partners.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFF8F7] border border-[#FF6B5A]/20 space-y-2">
              <h4 className="font-bold text-sm sm:text-base text-[#171725] flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#FF6B5A]" /> Delivery Boundaries &amp; PIN Verification
              </h4>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                At present, Dawai24 serves only delivery destinations within the territory of India. Customers can enter their 6-digit PIN code at checkout to confirm exact delivery turnaround times.
              </p>
            </div>
          </div>

          {/* Regulatory Basis */}
          <div className="rounded-2xl bg-[#FAFBFD] border border-[#E2E8F0] p-5 sm:p-6 space-y-2">
            <div className="flex items-center gap-2 text-[#171725] font-bold text-sm sm:text-base">
              <FileCheck2 size={20} className="text-[#2E7D32]" />
              Regulatory Basis for Operations
            </div>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              Dawai24 operates strictly in accordance with the <strong>Drugs and Cosmetics Act, 1940</strong>, and the <strong>Drugs and Cosmetics Rules, 1945</strong>. Pharmaceutical sales are completed through licensed pharmacy premises and dispatched to customers in sealed packaging. All prescription drug dispensing is conducted under the direct supervision of qualified, registered pharmacists against valid medical prescriptions.
            </p>
          </div>
        </section>

        {/* 7. Frequently Asked Questions */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E9ECEF] shadow-2xs space-y-6">
          <div className="space-y-1 border-b border-[#F0F2F5] pb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#171725] tracking-tight">
              Frequently asked questions
            </h2>
            <p className="text-xs sm:text-sm text-[#696974]">
              Common queries about ordering substitute medicines on Dawai24.
            </p>
          </div>

          <div className="divide-y divide-[#F0F2F5]">
            {faqs.map((faq, index) => (
              <div key={index} className="py-4 first:pt-0 last:pb-0">
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
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

          <div className="pt-2 text-center">
            <Link 
              href="/faqs-help-center" 
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#2E7D32] hover:underline"
            >
              View More FAQs <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* 8. Bottom CTA Banner */}
        <section className="bg-gradient-to-r from-[#171725] to-[#2D2D3A] rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-md">
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ready to Save Up to 70% on Your Medicines?
            </h2>
            <p className="text-xs sm:text-sm text-gray-300">
              Upload your doctor&apos;s prescription or search for your regular medicines to view authentic substitutes instantly.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-[#2E7D32] px-6 py-3 text-sm font-bold text-white shadow-xs hover:bg-[#256628] transition-colors"
            >
              Search Medicines <ArrowRight size={16} />
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
