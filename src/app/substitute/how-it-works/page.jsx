import Link from "next/link";
import { 
  Search, 
  GitCompare, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  AlertTriangle,
  Stethoscope,
  TrendingDown,
  Building2,
  Percent,
  Clock,
  HelpCircle
} from "lucide-react";
import Breadcrumbs from "@/components/Common/Breadcrumbs";

export const metadata = {
  title: "How Medicine Substitution Works | Dawai24",
  description: "Learn how Dawai24 helps you find bioequivalent, affordable substitute medicines with identical active salts and save up to 60-70% on monthly prescription bills.",
};

export default function HowSubstituteWorksPage() {
  const steps = [
    {
      num: "01",
      title: "Search Your Prescribed Medicine",
      desc: "Enter your prescribed brand name (e.g. Dolo 650, Pan D, Augmentin) in our smart search bar, or simply upload a clear photo of your prescription.",
      icon: Search,
      highlight: "Over 1,00,000+ medicines mapped to exact chemical salts"
    },
    {
      num: "02",
      title: "Discover Verified Alternatives",
      desc: "Our platform instantly analyzes the active pharmaceutical ingredients (APIs), dosage strength, and form to display bioequivalent substitutes.",
      icon: Layers,
      highlight: "Identical active composition & clinical efficacy"
    },
    {
      num: "03",
      title: "Compare Pricing & Manufacturers",
      desc: "Review side-by-side comparisons of MRP, selling prices, manufacturer accreditations (WHO-GMP), and exact savings before choosing.",
      icon: GitCompare,
      highlight: "Save up to 60% directly on consumer medicine bills"
    },
    {
      num: "04",
      title: "Pharmacist Verification & Doorstep Delivery",
      desc: "Every order is reviewed and validated by our registered pharmacists before being safely packed in tamper-proof seals and dispatched to your home.",
      icon: ShieldCheck,
      highlight: "Delivered safely across all serviceable PIN codes in India"
    }
  ];

  const whyChoose = [
    {
      title: "Same Active Salt & Molecule",
      desc: "Substitute medicines contain the exact same chemical salt (active pharmaceutical ingredient) in identical strength as prescribed by your doctor.",
      icon: Sparkles,
      color: "text-[#2E7D32]",
      bg: "bg-emerald-50"
    },
    {
      title: "WHO-GMP Certified Manufacturers",
      desc: "All substitutes listed on Dawai24 are produced by top Indian and global pharmaceutical giants adhering to stringent Good Manufacturing Practices.",
      icon: Building2,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Substantial Monthly Savings",
      desc: "Eliminating heavy promotional marketing, medical representative overheads, and middle layers enables transparent price reductions of up to 60-70%.",
      icon: Percent,
      color: "text-[#FF6B5A]",
      bg: "bg-[#FFF1EF]"
    },
    {
      title: "Registered Pharmacist Supervision",
      desc: "Our clinical pharmacy team checks every uploaded prescription against statutory dosage rules before dispensing any Schedule H medication.",
      icon: Stethoscope,
      color: "text-purple-600",
      bg: "bg-purple-50"
    }
  ];

  return (
    <div className="bg-[#FAFBFD] min-h-screen">
      {/* 1. Breadcrumbs */}
      <div className="bg-white border-b border-[#F0F2F5]">
        <div className="container-x max-w-6xl py-3">
          <Breadcrumbs 
            items={[
              { label: "Substitute", href: "/substitute/how-it-works" }, 
              { label: "How It Works" }
            ]} 
          />
        </div>
      </div>

      <div className="container-x max-w-5xl py-8 sm:py-12 space-y-12 sm:space-y-16">
        
        {/* 2. Hero Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-[#E9ECEF] shadow-2xs space-y-6 text-center sm:text-left">
          <div className="max-w-3xl space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2E7D32] bg-[#F0FDF4] border border-[#2E7D32]/20 px-3.5 py-1.5 rounded-full">
              <Sparkles size={15} /> Transparent Medicine Bioequivalence
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#171725] tracking-tight leading-[1.15]">
              How Medicine Substitution Works
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-[#475569] leading-relaxed">
              Understand how Dawai24 empowers you to find high-quality, bioequivalent alternatives to expensive branded medicines—ensuring the exact same therapeutic outcome at a fraction of the cost.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/medicines"
              className="inline-flex items-center gap-2 rounded-xl bg-[#2E7D32] px-6 py-3.5 text-sm font-bold text-white shadow-xs hover:bg-[#256628] transition-colors"
            >
              Explore Medicines <ArrowRight size={16} />
            </Link>
            <Link
              href="/upload-prescription"
              className="inline-flex items-center gap-2 rounded-xl bg-white border border-[#CBD5E1] px-6 py-3.5 text-sm font-bold text-[#171725] hover:bg-slate-50 transition-colors shadow-3xs"
            >
              Upload Prescription
            </Link>
          </div>
        </section>

        {/* 3. Comparison Banner (Same Medicine Smaller Bill) */}
        <section className="bg-gradient-to-br from-[#F0FDF4] via-white to-[#F8FAFC] rounded-3xl p-6 sm:p-8 border border-[#2E7D32]/20 shadow-2xs">
          <div className="grid md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171725] tracking-tight">
                Same Medicine. Smaller Bill.
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                When a doctor prescribes a medicine, they specify an active salt molecule. Branded pharmaceutical companies market this molecule under proprietary brand names with high markup. A verified substitute contains the identical molecule, active strength, and bioavailability, but without advertising expenses.
              </p>
              <div className="flex items-center gap-4 pt-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#171725]">
                  <CheckCircle2 size={16} className="text-[#2E7D32]" /> Exact Salt Bioequivalence
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#171725]">
                  <CheckCircle2 size={16} className="text-[#2E7D32]" /> GMP-Certified Manufacturing
                </div>
              </div>
            </div>

            <div className="md:col-span-5 flex justify-center">
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-sm max-w-sm w-full space-y-3">
                <div className="flex items-center justify-between border-b border-[#F0F2F5] pb-2 text-xs font-semibold text-[#696974]">
                  <span>Prescription Concept</span>
                  <span>Example Cost</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-semibold text-slate-700">Branded Medicine</span>
                  <span className="font-bold text-slate-900 line-through text-slate-400">₹100</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm p-2 rounded-xl bg-[#F0FDF4] border border-[#2E7D32]/20">
                  <span className="font-bold text-[#2E7D32]">Identical Salt Substitute</span>
                  <span className="font-black text-[#2E7D32] text-base">₹40</span>
                </div>
                <p className="text-[11px] text-[#2E7D32] font-bold text-center">
                  Direct Savings: Up to 60% per strip
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Step-by-Step Substitution Process */}
        <section className="space-y-6">
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#171725] tracking-tight">
              The 4-Step Substitution Journey
            </h2>
            <p className="text-xs sm:text-sm text-[#696974]">
              How our technology helps you transition to affordable substitutes with 100% confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {steps.map((step, idx) => {
              const IconComp = step.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E9ECEF] shadow-2xs space-y-3 relative hover:shadow-md transition-shadow"
                >
                  <span className="text-3xl font-black text-[#E2E8F0] absolute top-5 right-5">
                    {step.num}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-[#F0FDF4] text-[#2E7D32] flex items-center justify-center">
                    <IconComp size={24} />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#171725] pt-1">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    {step.desc}
                  </p>
                  <p className="text-[11px] font-semibold text-[#2E7D32] bg-[#F0FDF4] px-2.5 py-1 rounded-lg w-fit">
                    {step.highlight}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. Why Choose Substitutes Features */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E9ECEF] shadow-2xs space-y-8">
          <div className="space-y-1 border-b border-[#F0F2F5] pb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#171725] tracking-tight">
              Why Choose Verified Substitutes?
            </h2>
            <p className="text-xs sm:text-sm text-[#696974]">
              High quality, clinical safety, and genuine affordability working together.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {whyChoose.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-[#FAFBFD] border border-[#E2E8F0]">
                  <div className={`w-12 h-12 rounded-2xl ${feat.bg} ${feat.color} flex items-center justify-center shrink-0`}>
                    <Icon size={22} />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-[#171725]">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-[#475569] leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. Medical Disclaimer Notice */}
        <section className="bg-[#FFF8F7] border border-[#FF6B5A]/20 rounded-3xl p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#171725]">
            <AlertTriangle size={20} className="text-[#FF6B5A] shrink-0" />
            Important Clinical &amp; Medical Disclaimer
          </div>
          <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
            While generic and substitute medicines contain identical active pharmaceutical ingredients (salts) and matching strengths, patient physiology and treatment plans vary. Dawai24 advises all patients to discuss substitute alternatives with their consulting physician or certified pharmacist. For critical narrow therapeutic index medicines, always adhere strictly to your specialist&apos;s recommendations. Dawai24 dispenses prescription medications only under the clinical supervision of registered pharmacists against a valid prescription.
          </p>
        </section>

        {/* 7. Bottom Prominent CTA */}
        <section className="bg-gradient-to-r from-[#171725] to-[#2D2D3A] rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-md">
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ready to Discover Your Medicine Substitutes?
            </h2>
            <p className="text-xs sm:text-sm text-gray-300">
              Search your current medicine by name, salt, or brand to compare verified alternatives and start saving today.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/medicines"
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
