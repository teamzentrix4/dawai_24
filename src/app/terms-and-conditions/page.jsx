"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Scale, 
  ShieldCheck, 
  FileText, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Mail, 
  Phone, 
  ChevronRight,
  ExternalLink
} from "lucide-react";
import Breadcrumbs from "@/components/Common/Breadcrumbs";

const SECTIONS = [
  { id: "general", num: "1", title: "General" },
  { id: "products-services", num: "2", title: "Products and Services" },
  { id: "platform-usage", num: "3", title: "Platform Usage" },
  { id: "changes-to-terms", num: "4", title: "Changes to Terms" },
  { id: "invitation-to-offer", num: "5", title: "Invitation to Offer for Sale" },
  { id: "transfer-of-property", num: "6", title: "Transfer of Property & Sale Completion" },
  { id: "item-delivery", num: "7", title: "Item Delivery & Shipping" },
  { id: "eligibility", num: "8", title: "Eligibility of Use" },
  { id: "user-account", num: "9", title: "User Account, Password, and Security" },
  { id: "pricing-payment", num: "10", title: "Pricing Information and Payment" },
  { id: "use-of-materials", num: "11", title: "Use of Materials" },
  { id: "intellectual-property", num: "12", title: "Intellectual Property Rights" },
  { id: "return-refund", num: "13", title: "Return, Refund, Cancellation, and Exchange" },
  { id: "disclaimer", num: "14", title: "Disclaimer of Warranties and Liabilities" },
  { id: "indemnification", num: "15", title: "Indemnification and Limitation of Liability" },
  { id: "governing-law", num: "16", title: "Governing Law and Dispute Resolution" },
  { id: "grievance-redressal", num: "17", title: "Report Abuse / Grievance Redressal" },
  { id: "communications", num: "18", title: "Communications & Notifications" },
];

export default function TermsAndConditionsPage() {
  const [activeSection, setActiveSection] = useState("general");

  const scrollTo = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="bg-[#FAFBFD] min-h-screen">
      {/* 1. Breadcrumbs */}
      <div className="bg-white border-b border-[#F0F2F5]">
        <div className="container-x max-w-6xl py-3">
          <Breadcrumbs items={[{ label: "Terms & Conditions" }]} />
        </div>
      </div>

      {/* 2. Top Header Banner */}
      <div className="bg-white border-b border-[#E9ECEF]">
        <div className="container-x max-w-6xl py-8 sm:py-12">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2E7D32]">
              <Scale size={16} /> Legal &amp; Regulatory Documentation
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#171725] tracking-tight">
              Terms and Conditions
            </h1>
            <p className="text-xs sm:text-sm text-[#696974] max-w-3xl leading-relaxed">
              This document (&quot;Terms&quot;) is an electronic record in accordance with the Information Technology Act, 2000, and its applicable rules and amendments. It adheres to the regulations for electronic records as outlined in various statutes. This electronic record is generated through a computer system and does not necessitate physical or digital signatures.
            </p>
            <p className="text-xs text-[#92929D] font-medium pt-1">
              Last Updated: November 2026 • Platform: Dawai24
            </p>
          </div>
        </div>
      </div>

      {/* 3. Main Body with Sticky Sidebar */}
      <div className="container-x max-w-6xl py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
          
          {/* Sticky Sidebar */}
          <aside className="hidden lg:block sticky top-24 bg-white border border-[#E9ECEF] rounded-2xl p-4 shadow-2xs max-h-[calc(100vh-120px)] overflow-y-auto">
            <p className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#171725] border-b border-[#F0F2F5] mb-2 flex items-center justify-between">
              <span>Sections</span>
              <span className="text-[11px] font-mono text-[#92929D]">{SECTIONS.length} items</span>
            </p>
            <nav className="space-y-1">
              {SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollTo(sec.id)}
                  type="button"
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                    activeSection === sec.id
                      ? "bg-[#F0FDF4] text-[#2E7D32] border border-[#2E7D32]/20 font-bold"
                      : "text-[#696974] hover:bg-[#FAFBFD] hover:text-[#171725]"
                  }`}
                >
                  <span className="truncate">{sec.num}. {sec.title}</span>
                  {activeSection === sec.id && <ChevronRight size={14} className="shrink-0 text-[#2E7D32]" />}
                </button>
              ))}
            </nav>

            <div className="mt-6 pt-4 border-t border-[#F0F2F5] p-3 rounded-xl bg-[#FAFBFD] space-y-2 text-xs text-[#696974]">
              <p className="font-bold text-[#171725] flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-[#2E7D32]" /> Pharmacy Compliance
              </p>
              <p className="text-[11px] leading-relaxed">
                Operated in accordance with the Drugs and Cosmetics Act, 1940 and Pharmacy Practice Regulations.
              </p>
            </div>
          </aside>

          {/* Legal Content */}
          <main className="bg-white border border-[#E9ECEF] rounded-3xl p-6 sm:p-10 shadow-2xs space-y-10 text-[#334155] leading-relaxed text-sm sm:text-[15px]">
            
            {/* 1. GENERAL */}
            <section id="general" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                1. GENERAL
              </h2>
              <div className="space-y-3">
                <p>
                  <strong>1.1. Platform:</strong> &quot;Platform&quot; shall mean the website accessible at <strong>www.davai24.in</strong>, associated web pages, and mobile interfaces, operated and maintained by <strong>Dawai24</strong> (&quot;Company&quot;, &quot;We&quot;, &quot;Us&quot;, or &quot;Our&quot;).
                </p>
                <p>
                  <strong>1.2. User Definition:</strong> In these Terms, &quot;You&quot;, &quot;Your&quot;, or &quot;User&quot; refers to any individual accessing, browsing, registering on, or utilizing the services of Dawai24.
                </p>
                <p>
                  <strong>1.3. Acceptance of Terms:</strong> By using Dawai24, you confirm that you have read, understood, and agreed to be legally bound by these Terms, our Privacy Policy, and all operational policies displayed on the Platform.
                </p>
              </div>
            </section>

            {/* 2. PRODUCTS AND SERVICES */}
            <section id="products-services" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                2. PRODUCTS AND SERVICES
              </h2>
              <div className="space-y-3">
                <p>
                  <strong>2.1. Nature of Services:</strong> Dawai24 is an online pharmacy platform and healthcare discovery service facilitating the ordering, pharmacist verification, and doorstep delivery of prescription pharmaceuticals, over-the-counter (OTC) healthcare items, and bioequivalent substitute medications across India.
                </p>
                <p>
                  <strong>2.2. Generic &amp; Substitute Medicines:</strong> We showcase bioequivalent alternatives that have identical active pharmaceutical ingredients (APIs), strength, and therapeutic properties as prescribed brand-name drugs. All substitute medicines available on Dawai24 are sourced strictly from accredited, GMP-compliant Indian pharmaceutical manufacturers (e.g., Cipla, Abbott, Sun Pharma, Dr. Reddy&apos;s, Torrent).
                </p>
                <p>
                  <strong>2.3. No Doctor-Patient Relationship:</strong> The information provided on Dawai24 (including medicine salt breakdowns, pricing charts, and healthcare articles) is for educational purposes only. It is not a substitute for clinical diagnosis or prescription by a registered medical practitioner.
                </p>
              </div>
            </section>

            {/* 3. PLATFORM USAGE */}
            <section id="platform-usage" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                3. PLATFORM USAGE
              </h2>
              <div className="space-y-3">
                <p>
                  <strong>3.1. Lawful Use:</strong> You agree to use Dawai24 solely for lawful personal healthcare procurement. You agree not to upload altered, forged, or unauthorized prescriptions, or engage in deceptive transactions.
                </p>
                <p>
                  <strong>3.2. Prohibited Conduct:</strong> Users must not scrape, crawl, reverse engineer, or extract price or inventory data from Dawai24 using automated tools or scripts without prior written permission.
                </p>
              </div>
            </section>

            {/* 4. CHANGES TO TERMS */}
            <section id="changes-to-terms" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                4. CHANGES TO TERMS
              </h2>
              <p>
                Dawai24 reserves the right to modify these Terms at any time. Changes become effective upon posting on the Platform. Continued use of the Platform after such updates constitutes your acceptance of the revised terms.
              </p>
            </section>

            {/* 5. INVITATION TO OFFER FOR SALE */}
            <section id="invitation-to-offer" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                5. INVITATION TO OFFER FOR SALE
              </h2>
              <div className="space-y-3">
                <p>
                  <strong>5.1. Product Listings:</strong> The display of medicines and health products on Dawai24 constitutes an invitation to offer and not a binding offer to sell.
                </p>
                <p>
                  <strong>5.2. Acceptance of Orders:</strong> An order placed on Dawai24 is accepted only after our registered pharmacist has reviewed and validated the doctor&apos;s prescription (for Schedule H and H1 medications) and confirmed inventory availability at our licensed dispensing pharmacy.
                </p>
              </div>
            </section>

            {/* 6. TRANSFER OF PROPERTY */}
            <section id="transfer-of-property" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                6. TRANSFER OF PROPERTY &amp; SALE COMPLETION
              </h2>
              <p>
                All pharmaceutical sales are completed at our licensed pharmacy premises in compliance with the Drugs and Cosmetics Act, 1940. Risk of loss and title for items pass to the customer upon handover to our authorized delivery partners.
              </p>
            </section>

            {/* 7. ITEM DELIVERY & SHIPPING */}
            <section id="item-delivery" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                7. ITEM DELIVERY &amp; SHIPPING
              </h2>
              <p>
                Dawai24 delivers to serviceable pin codes across India through established courier partners. All medications are packaged in discreet, sealed, tamper-evident outer containers to preserve patient privacy and safeguard quality.
              </p>
            </section>

            {/* 8. ELIGIBILITY OF USE */}
            <section id="eligibility" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                8. ELIGIBILITY OF USE
              </h2>
              <p>
                Use of Dawai24 is available only to individuals legally competent to contract under the Indian Contract Act, 1872. Minors under 18 years of age may procure medicines only through their parent or legal guardian.
              </p>
            </section>

            {/* 9. USER ACCOUNT & SECURITY */}
            <section id="user-account" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                9. USER ACCOUNT, PASSWORD, AND SECURITY
              </h2>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials, login OTPs, and personal records. You agree to notify Dawai24 promptly of any unauthorized access to your account.
              </p>
            </section>

            {/* 10. PRICING AND PAYMENT */}
            <section id="pricing-payment" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                10. PRICING INFORMATION AND PAYMENT
              </h2>
              <p>
                All prices on Dawai24 are quoted in Indian National Rupees (INR) and are inclusive of applicable GST. We accept UPI, Debit/Credit Cards, Net Banking, and Cash on Delivery (where applicable).
              </p>
            </section>

            {/* 11. USE OF MATERIALS */}
            <section id="use-of-materials" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                11. USE OF MATERIALS
              </h2>
              <p>
                All content on Dawai24, including product descriptions, page layouts, designs, illustrations, and code, is protected by intellectual property laws. Unauthorized reproduction or commercial distribution without written consent is prohibited.
              </p>
            </section>

            {/* 12. INTELLECTUAL PROPERTY */}
            <section id="intellectual-property" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                12. INTELLECTUAL PROPERTY RIGHTS
              </h2>
              <p>
                &quot;Dawai24&quot; and related platform logos are trademarks of the Company. Third-party brand names, salt molecules, and manufacturer trademarks are used strictly for reference, composition identification, and comparative awareness.
              </p>
            </section>

            {/* 13. RETURN AND REFUND SUMMARY */}
            <section id="return-refund" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                13. RETURN, REFUND, CANCELLATION, AND EXCHANGE
              </h2>
              <p>
                Dawai24 maintains an easy 15-day return window on eligible sealed products. Please review our comprehensive <Link href="/return-refund-policy" className="text-[#2E7D32] font-bold hover:underline">Return &amp; Refund Policy</Link> for detailed eligibility criteria and timelines.
              </p>
            </section>

            {/* 14. DISCLAIMER OF WARRANTIES */}
            <section id="disclaimer" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                14. DISCLAIMER OF WARRANTIES AND LIABILITIES
              </h2>
              <p>
                The Platform is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. Dawai24 disclaims all warranties, express or implied. In cases of unintended pricing or technical listing inaccuracies, Dawai24 reserves the right to cancel the order and provide a full refund.
              </p>
            </section>

            {/* 15. INDEMNIFICATION */}
            <section id="indemnification" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                15. INDEMNIFICATION AND LIMITATION OF LIABILITY
              </h2>
              <p>
                You agree to indemnify and hold harmless Dawai24, its officers, pharmacists, and partners against any claims, losses, or damages resulting from breach of these Terms or provision of fraudulent prescription data.
              </p>
            </section>

            {/* 16. GOVERNING LAW */}
            <section id="governing-law" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                16. GOVERNING LAW AND DISPUTE RESOLUTION
              </h2>
              <p>
                These Terms are governed by the laws of India. Any legal disputes arising out of the use of Dawai24 shall be subject to the exclusive jurisdiction of the competent courts of India.
              </p>
            </section>

            {/* 17. GRIEVANCE REDRESSAL */}
            <section id="grievance-redressal" className="space-y-4 scroll-mt-28 bg-[#FAFBFD] p-5 sm:p-6 rounded-2xl border border-[#E2E8F0]">
              <h2 className="text-lg sm:text-xl font-bold text-[#171725] flex items-center gap-2">
                <AlertCircle size={20} className="text-[#2E7D32]" />
                17. REPORT ABUSE / GRIEVANCE REDRESSAL
              </h2>
              <p className="text-xs sm:text-sm text-[#475569]">
                In accordance with the Information Technology Act, 2000 and consumer protection guidelines, our Grievance Redressal details are:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm pt-1">
                <div>
                  <p className="font-bold text-[#171725]">Grievance Officer:</p>
                  <p className="text-[#696974]">Customer Grievance &amp; Redressal Cell</p>
                  <p className="text-[#696974]">Dawai24 Healthcare Operations</p>
                </div>
                <div className="space-y-1">
                  <p className="flex items-center gap-1.5 text-[#171725]">
                    <Mail size={14} className="text-[#2E7D32]" />
                    <span className="font-semibold">Email:</span> care@davai24.in
                  </p>
                  <p className="flex items-center gap-1.5 text-[#171725]">
                    <Phone size={14} className="text-[#2E7D32]" />
                    <span className="font-semibold">Support:</span> +91 89586 22622
                  </p>
                </div>
              </div>
            </section>

            {/* 18. COMMUNICATIONS */}
            <section id="communications" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                18. COMMUNICATIONS &amp; NOTIFICATIONS
              </h2>
              <p>
                By using Dawai24, you consent to receive electronic communications from us regarding your order confirmations, prescription review updates, and dispatch notifications via SMS, WhatsApp, or email.
              </p>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}
