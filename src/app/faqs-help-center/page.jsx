"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  HelpCircle, 
  ChevronDown, 
  PhoneCall, 
  Mail, 
  MessageSquare, 
  FileText, 
  Package, 
  CreditCard, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Headphones,
  CheckCircle2
} from "lucide-react";
import Breadcrumbs from "@/components/Common/Breadcrumbs";

const FAQ_CATEGORIES = [
  { id: "all", name: "All FAQs" },
  { id: "general", name: "General & Dawai24" },
  { id: "substitutes", name: "Substitute Medicines" },
  { id: "prescriptions", name: "Prescription Upload" },
  { id: "orders", name: "Orders & Delivery" },
  { id: "payments", name: "Payments & Pricing" },
  { id: "returns", name: "Returns & Refunds" },
];

const FAQ_DATA = [
  // General
  {
    cat: "general",
    q: "What is Dawai24?",
    a: "Dawai24 is an online pharmacy platform dedicated to providing genuine, affordable medicines. As a customer, you enjoy complete price and composition transparency to ensure you get the best value for your essential daily and chronic prescriptions."
  },
  {
    cat: "general",
    q: "Are the medicines sold on Dawai24 genuine and authentic?",
    a: "Yes, 100%. All medicines and healthcare products on Dawai24 are sourced directly from accredited, licensed pharmaceutical distributors and manufacturers. Every product is checked by registered pharmacists for tamper-proof seals and valid expiry dates."
  },
  {
    cat: "general",
    q: "How does Dawai24 help me save money?",
    a: "Pharmaceutical companies spend significantly on branding, promotion, and representative overheads, which inflates consumer MRP. Substitute medicines contain the exact same chemical salt molecule and active strength without marketing overheads, passing direct savings of up to 70% to you."
  },

  // Substitutes
  {
    cat: "substitutes",
    q: "How to order medicine on Dawai24?",
    a: "To order medicine on Dawai24, you can either search for your prescribed medicine or upload your prescription. You can also call or text our care team at +91 89586 22622 for assistance. We will recommend the best verified substitute for you to order. Provide delivery details, upload your prescription, and choose your preferred payment mode."
  },
  {
    cat: "substitutes",
    q: "Is substitute medicine safe to consume?",
    a: "Yes, substitute medicines are safe and as clinically effective as doctor-prescribed brand names. They contain the identical drug salts and are manufactured in accordance with strict GMP standards. Good Manufacturing Practice (GMP) guarantees high quality and efficacy. Dawai24 offers verified substitutes from top brands such as Cipla, Abbott, Sun Pharma, and Dr. Reddy's."
  },
  {
    cat: "substitutes",
    q: "Why is substitute medicine cheaper?",
    a: "Dawai24 eliminates unnecessary middle layers and sources directly from manufacturers and distributors. Furthermore, substitute medicines avoid heavy brand marketing expenses, allowing us to pass the savings straight to patients."
  },
  {
    cat: "substitutes",
    q: "How to choose the right substitute medicine for myself?",
    a: "Finding the right substitute is simple on Dawai24. Our smart platform identifies the exact active salt and dosage strength for your prescribed brand. Additionally, our registered pharmacists examine each uploaded prescription before dispensing to guarantee accurate bioequivalence."
  },

  // Prescriptions
  {
    cat: "prescriptions",
    q: "Do I need a prescription to order medicines on Dawai24?",
    a: "Yes, for any Schedule H, H1, or X medication, a valid doctor's prescription is required by law. Non-prescription wellness products, healthcare devices, and over-the-counter (OTC) essentials do not require a prescription."
  },
  {
    cat: "prescriptions",
    q: "How do I upload my prescription?",
    a: "Click 'Upload Prescription' in the navigation bar or on the checkout page. Simply upload a clear photo (JPEG, PNG) or PDF of your doctor's written prescription. You can also send it to our pharmacists via WhatsApp at +91 89586 22622."
  },
  {
    cat: "prescriptions",
    q: "What makes a prescription valid?",
    a: "A valid prescription must include the doctor's name, medical registration number, clinic or hospital stamp/header, patient's name, date of consultation, and clear dosage instructions."
  },

  // Orders & Delivery
  {
    cat: "orders",
    q: "How long does medicine delivery take?",
    a: "For metro cities, orders are typically delivered within 24 to 48 hours. For tier 2 and tier 3 cities, delivery usually takes 2 to 4 business days. Live tracking alerts are sent via SMS and WhatsApp upon dispatch."
  },
  {
    cat: "orders",
    q: "How are temperature-sensitive medicines like insulin shipped?",
    a: "Insulins and injectables are packed in insulated packaging with reusable cold gel packs, maintaining strict 2°C–8°C storage throughout transit."
  },
  {
    cat: "orders",
    q: "Can I place an order via WhatsApp or phone call?",
    a: "Yes! You can call or text our support team at +91 89586 22622. Share your prescription or required medicine list, and our team will assist you in generating your order."
  },

  // Payments & Pricing
  {
    cat: "payments",
    q: "What payment methods are supported on Dawai24?",
    a: "We accept UPI (Google Pay, PhonePe, Paytm), Credit/Debit cards, Net Banking, and Cash on Delivery (COD) for eligible locations."
  },
  {
    cat: "payments",
    q: "Are the prices inclusive of taxes?",
    a: "Yes, all prices shown on Dawai24 are inclusive of applicable Goods and Services Tax (GST). There are no hidden fees."
  },

  // Returns & Refunds
  {
    cat: "returns",
    q: "What is the return window for medicines?",
    a: "Dawai24 maintains an easy 15-day return policy for eligible products from the date of delivery in case of transit damage, expired batch, or incorrect medicine received."
  },
  {
    cat: "returns",
    q: "Which products are non-returnable?",
    a: "Opened medicine bottles or cut tablet strips, cold-chain items like insulin, and intimate hygiene products cannot be returned due to drug safety and clinical hygiene laws."
  },
  {
    cat: "returns",
    q: "How long does a refund take?",
    a: "Once approved, UPI refunds take 24–48 hours, while card and net banking refunds reflect in your bank account within 3–5 business days."
  }
];

export default function FaqsHelpCenterPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openIndex, setOpenIndex] = useState(null);

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCat = activeCategory === "all" || item.cat === activeCategory;
      const matchesSearch = 
        item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.a.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [searchTerm, activeCategory]);

  return (
    <div className="bg-[#FAFBFD] min-h-screen">
      {/* 1. Breadcrumbs */}
      <div className="bg-white border-b border-[#F0F2F5]">
        <div className="container-x max-w-6xl py-3">
          <Breadcrumbs items={[{ label: "FAQs & Help Center" }]} />
        </div>
      </div>

      <div className="container-x max-w-5xl py-8 sm:py-12 space-y-10 sm:space-y-12">
        
        {/* 2. Hero Search Banner */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-[#E9ECEF] shadow-2xs space-y-6 text-center">
          <div className="space-y-2 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2E7D32] bg-[#F0FDF4] border border-[#2E7D32]/20 px-3.5 py-1.5 rounded-full">
              <HelpCircle size={15} /> Help &amp; Support Knowledge Base
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#171725] tracking-tight">
              How Can We Help You?
            </h1>
            <p className="text-sm sm:text-base text-[#696974]">
              Find answers regarding substitute medicines, prescription verification, order tracking, and refunds on Dawai24.
            </p>
          </div>

          {/* Search Box */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#92929D]" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by topic, e.g. 'substitute', 'prescription', 'delivery'..."
              className="w-full bg-[#FAFBFD] border border-[#CBD5E1] rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:border-[#2E7D32] shadow-3xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#696974] hover:text-[#171725]"
              >
                Clear
              </button>
            )}
          </div>
        </section>

        {/* 3. Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {FAQ_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setOpenIndex(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-[#2E7D32] text-white shadow-2xs"
                  : "bg-white border border-[#E2E8F0] text-[#475569] hover:bg-gray-50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* 4. FAQs Accordion List */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E9ECEF] shadow-2xs space-y-6">
          <div className="border-b border-[#F0F2F5] pb-4 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-[#171725] tracking-tight">
              Frequently Asked Questions
            </h2>
            <span className="text-xs font-semibold text-[#696974] bg-[#F8FAFC] px-3 py-1 rounded-full border border-[#E2E8F0]">
              Showing {filteredFaqs.length} results
            </span>
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <HelpCircle size={40} className="mx-auto text-gray-300" />
              <p className="font-bold text-base text-[#171725]">No matching questions found</p>
              <p className="text-xs sm:text-sm text-[#696974]">
                Try adjusting your search terms or contact our pharmacy support team directly.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#F0F2F5]">
              {filteredFaqs.map((faq, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 text-left font-bold text-sm sm:text-base text-[#171725] hover:text-[#2E7D32] transition-colors py-1 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={20}
                      className={`shrink-0 text-[#696974] transition-transform duration-200 ${
                        openIndex === idx ? "rotate-180 text-[#2E7D32]" : ""
                      }`}
                    />
                  </button>
                  {openIndex === idx && (
                    <div className="mt-3 text-xs sm:text-sm text-[#475569] leading-relaxed bg-[#FAFBFD] p-4 sm:p-5 rounded-2xl border border-[#F0F2F5]">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 5. Contact & Support Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9ECEF] shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F0FDF4] text-[#2E7D32] flex items-center justify-center">
              <PhoneCall size={24} />
            </div>
            <h3 className="text-lg font-bold text-[#171725]">Talk to a Pharmacist</h3>
            <p className="text-xs sm:text-sm text-[#696974] leading-relaxed">
              Have clinical queries about your medicine salts, dosage, or interactions? Speak directly with our registered pharmacist.
            </p>
            <div className="pt-2">
              <a
                href="tel:+918958622622"
                className="inline-flex items-center gap-2 font-bold text-sm text-[#2E7D32] hover:underline"
              >
                +91 89586 22622 <ArrowRight size={14} />
              </a>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9ECEF] shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Mail size={24} />
            </div>
            <h3 className="text-lg font-bold text-[#171725]">Email Support Desk</h3>
            <p className="text-xs sm:text-sm text-[#696974] leading-relaxed">
              For order status inquiries, bulk orders, or feedback, email our helpdesk. Typical response time is under 2 hours.
            </p>
            <div className="pt-2">
              <a
                href="mailto:care@davai24.in"
                className="inline-flex items-center gap-2 font-bold text-sm text-blue-600 hover:underline"
              >
                care@davai24.in <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
