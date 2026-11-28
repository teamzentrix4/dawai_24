"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Lock, 
  FileText, 
  Eye, 
  Server, 
  UserCheck, 
  AlertCircle, 
  Mail, 
  Phone, 
  ChevronRight,
  Database,
  Key
} from "lucide-react";
import Breadcrumbs from "@/components/Common/Breadcrumbs";

const SECTIONS = [
  { id: "definition", num: "1", title: "Definition of Personal Information" },
  { id: "types-of-data", num: "2", title: "Types of Data Collection" },
  { id: "collection-sources", num: "3", title: "Data Collection Sources" },
  { id: "data-usage", num: "4", title: "Data Usage & Processing Purpose" },
  { id: "data-retention", num: "5", title: "Data Retention & Storage" },
  { id: "disclosure-transfer", num: "6", title: "Disclosure and Transfer of Your Data" },
  { id: "protection-measures", num: "7", title: "Data Protection & Security Measures" },
  { id: "user-rights", num: "8", title: "Your Rights & Access Control" },
  { id: "third-party", num: "9", title: "Third-Party Services & Links" },
  { id: "policy-changes", num: "10", title: "Changes to this Privacy Policy" },
  { id: "consent", num: "11", title: "Consent & Voluntary Disclosure" },
  { id: "minors", num: "12", title: "Protection of Minors" },
  { id: "international-transfer", num: "13", title: "International Data Transfer" },
  { id: "grievance-redressal", num: "14", title: "Grievance Redressal & DPO" },
  { id: "governing-law", num: "15", title: "Governing Law & Jurisdiction" },
  { id: "breach-notification", num: "16", title: "Data Breach Notification" },
  { id: "severability", num: "17", title: "Severability" },
  { id: "contact-info", num: "18", title: "Contact Information" },
];

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("definition");

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
          <Breadcrumbs items={[{ label: "Privacy Policy" }]} />
        </div>
      </div>

      {/* 2. Top Header Banner */}
      <div className="bg-white border-b border-[#E9ECEF]">
        <div className="container-x max-w-6xl py-8 sm:py-12">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2E7D32]">
              <Lock size={16} /> Privacy &amp; Data Security
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#171725] tracking-tight">
              Dawai24 Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-[#696974] max-w-3xl leading-relaxed">
              This Privacy Policy (&quot;Policy&quot;) elucidates the manner in which Dawai24 (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, utilizes, shares, and processes the information provided by you through the Dawai24 Platform and Website while delivering healthcare and pharmacy delivery services in compliance with the Information Technology Act, 2000, and the Digital Personal Data Protection Act, 2023.
            </p>
            <p className="text-xs text-[#92929D] font-medium pt-1">
              Last Updated: November 2026 • Platform: Dawai24
            </p>
          </div>
        </div>
      </div>

      {/* 3. Main Content with Sticky Sidebar */}
      <div className="container-x max-w-6xl py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
          
          {/* Sticky Navigation Sidebar */}
          <aside className="hidden lg:block sticky top-24 bg-white border border-[#E9ECEF] rounded-2xl p-4 shadow-2xs max-h-[calc(100vh-120px)] overflow-y-auto">
            <p className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#171725] border-b border-[#F0F2F5] mb-2 flex items-center justify-between">
              <span>Privacy Sections</span>
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
                <ShieldCheck size={16} className="text-[#2E7D32]" /> 256-Bit SSL Encryption
              </p>
              <p className="text-[11px] leading-relaxed">
                Your medical prescriptions and personal data are encrypted and protected under healthcare confidentiality regulations.
              </p>
            </div>
          </aside>

          {/* Privacy Policy Content */}
          <main className="bg-white border border-[#E9ECEF] rounded-3xl p-6 sm:p-10 shadow-2xs space-y-10 text-[#334155] leading-relaxed text-sm sm:text-[15px]">
            
            {/* 1. Definition */}
            <section id="definition" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                1. Definition of Personal Information
              </h2>
              <p>
                Personal information is any data that can directly or indirectly identify you. This encompasses de-identified data which, when correlated with other available information, enables your identification.
              </p>
              <p>
                <strong>&quot;Sensitive Personal Data or Information&quot; (SPDI)</strong> refers to information relating to passwords, financial details, prescription records, doctor notes, physical health condition data, and diagnostic details provided to or received by Dawai24 for the purpose of validating, dispensing, and fulfilling medicine orders.
              </p>
            </section>

            {/* 2. Types of Data */}
            <section id="types-of-data" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                2. Types of Data Collection
              </h2>
              <p>When you register on Dawai24 or place an order, we may collect:</p>
              <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm">
                <li><strong>Contact information:</strong> Full name, delivery address, pin code, email address, and phone number.</li>
                <li><strong>Prescription details:</strong> Uploaded prescription photos, doctor names, dosage directions, and medical items.</li>
                <li><strong>Transaction history:</strong> Items purchased, invoice receipts, and preferred payment mode references.</li>
                <li><strong>Technical data:</strong> Device type, IP address, and browser data to safeguard account security and prevent fraudulent activities.</li>
              </ul>
            </section>

            {/* 3. Sources */}
            <section id="collection-sources" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                3. Data Collection Sources
              </h2>
              <p>
                We gather information voluntarily provided by you when registering an account, searching for medicines, uploading prescription documents, or communicating with Dawai24 customer support via phone or email.
              </p>
            </section>

            {/* 4. Data Usage */}
            <section id="data-usage" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                4. Data Usage &amp; Processing Purpose
              </h2>
              <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm">
                <li>To enable registered pharmacists to clinically review prescriptions and verify dosage accuracy.</li>
                <li>To dispense accurate medications and authentic bioequivalent substitutes.</li>
                <li>To route orders to trusted courier partners for timely doorstep delivery.</li>
                <li>To provide order tracking, shipment SMS alerts, and delivery confirmations.</li>
                <li>To handle customer inquiries, returns, and billing support.</li>
              </ul>
            </section>

            {/* 5. Data Retention */}
            <section id="data-retention" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                5. Data Retention &amp; Storage
              </h2>
              <p>
                Prescription records and tax invoices are retained for the statutory period required under the Drugs and Cosmetics Act, 1940 and pharmacy licensing rules. Non-essential data is removed when no longer needed.
              </p>
            </section>

            {/* 6. Disclosure & Transfer */}
            <section id="disclosure-transfer" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                6. Disclosure and Transfer of Your Data
              </h2>
              <p>
                <strong>Dawai24 does not sell, lease, or trade your medical or personal information to third-party marketing companies.</strong> Data is shared strictly with essential service providers:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-xs sm:text-sm">
                <li>Registered pharmacists for prescription verification.</li>
                <li>Logistics and courier partners strictly for physical package delivery.</li>
                <li>Payment gateways for secure transaction processing.</li>
                <li>Government or statutory agencies when strictly required by law.</li>
              </ul>
            </section>

            {/* 7. Protection Measures */}
            <section id="protection-measures" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                7. Data Protection &amp; Security Measures
              </h2>
              <p>
                Dawai24 uses industry-standard 256-bit SSL encryption, restricted role-based internal access, and secure hosting environments to ensure your confidential health information remains completely protected.
              </p>
            </section>

            {/* 8. User Rights */}
            <section id="user-rights" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                8. Your Rights &amp; Access Control
              </h2>
              <p>
                You have the right to view, update, or correct your personal profile information, saved addresses, and past order history within your Dawai24 account dashboard.
              </p>
            </section>

            {/* 9. Third-Party Links */}
            <section id="third-party" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                9. Third-Party Services &amp; Links
              </h2>
              <p>
                Dawai24 may contain links to external reference sources or information portals. We are not responsible for the privacy standards of external websites.
              </p>
            </section>

            {/* 10. Policy Changes */}
            <section id="policy-changes" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                10. Changes to this Privacy Policy
              </h2>
              <p>
                We may periodically update this Policy to reflect operational improvements or regulatory updates. Any changes will be posted directly on this page with an updated timestamp.
              </p>
            </section>

            {/* 11. Consent */}
            <section id="consent" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                11. Consent &amp; Voluntary Disclosure
              </h2>
              <p>
                By using Dawai24 and providing prescription images or address details, you consent to the processing of your data strictly for healthcare delivery purposes as described herein.
              </p>
            </section>

            {/* 12. Protection of Minors */}
            <section id="minors" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                12. Protection of Minors
              </h2>
              <p>
                Dawai24 does not intentionally collect information from individuals under 18 years without the supervision and consent of a parent or legal guardian.
              </p>
            </section>

            {/* 13. International Transfer */}
            <section id="international-transfer" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                13. International Data Transfer
              </h2>
              <p>
                All data collected by Dawai24 is stored and processed securely within servers located in India, in adherence with Indian data residency mandates.
              </p>
            </section>

            {/* 14. Grievance Redressal */}
            <section id="grievance-redressal" className="space-y-4 scroll-mt-28 bg-[#FAFBFD] p-5 sm:p-6 rounded-2xl border border-[#E2E8F0]">
              <h2 className="text-lg sm:text-xl font-bold text-[#171725] flex items-center gap-2">
                <AlertCircle size={20} className="text-[#2E7D32]" />
                14. Grievance Redressal &amp; Data Protection Officer
              </h2>
              <p className="text-xs sm:text-sm text-[#475569]">
                For questions or grievances regarding personal information handling at Dawai24:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm pt-1">
                <div>
                  <p className="font-bold text-[#171725]">Data Protection Cell:</p>
                  <p className="text-[#696974]">Dawai24 Compliance Operations</p>
                </div>
                <div className="space-y-1">
                  <p className="flex items-center gap-1.5 text-[#171725]">
                    <Mail size={14} className="text-[#2E7D32]" />
                    <span className="font-semibold">Email:</span> care@davai24.in
                  </p>
                  <p className="flex items-center gap-1.5 text-[#171725]">
                    <Phone size={14} className="text-[#2E7D32]" />
                    <span className="font-semibold">Phone:</span> +91 89586 22622
                  </p>
                </div>
              </div>
            </section>

            {/* 15. Governing Law */}
            <section id="governing-law" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                15. Governing Law and Jurisdiction
              </h2>
              <p>
                This Privacy Policy is governed by the laws of India. Any legal proceedings related to this policy shall be subject to the jurisdiction of competent courts in India.
              </p>
            </section>

            {/* 16. Data Breach */}
            <section id="breach-notification" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                16. Data Breach Notification
              </h2>
              <p>
                In the event of a security incident affecting user information, Dawai24 will take prompt corrective actions and notify affected users in accordance with applicable legal provisions.
              </p>
            </section>

            {/* 17. Severability */}
            <section id="severability" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                17. Severability
              </h2>
              <p>
                If any term of this Privacy Policy is found unenforceable by a court of competent jurisdiction, the remaining terms shall continue in full effect.
              </p>
            </section>

            {/* 18. Contact Info */}
            <section id="contact-info" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                18. Contact Information
              </h2>
              <p>
                For any privacy questions or data requests, please write to us at <strong>care@davai24.in</strong> or visit our <Link href="/contact-us" className="text-[#2E7D32] font-bold hover:underline">Contact Us page</Link>.
              </p>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}
