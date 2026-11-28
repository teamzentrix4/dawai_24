"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  RotateCcw, 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Phone, 
  Mail, 
  ChevronRight,
  ArrowRight,
  PackageCheck,
  CreditCard
} from "lucide-react";
import Breadcrumbs from "@/components/Common/Breadcrumbs";

const SECTIONS = [
  { id: "overview", num: "A", title: "Policy Overview" },
  { id: "cancellation", num: "B", title: "Order Cancellation Policy" },
  { id: "return-window", num: "C", title: "Return Window & Eligibility" },
  { id: "non-returnable", num: "D", title: "Non-Returnable Products" },
  { id: "how-to-return", num: "E", title: "How to Raise a Return Request" },
  { id: "verification", num: "F", title: "Verification & Pickup Process" },
  { id: "refund-modes", num: "G", title: "Refund Modes & Timelines" },
  { id: "shipping-charges", num: "H", title: "Shipping Charges & Restocking" },
  { id: "support", num: "I", title: "Customer Support & Grievance" },
];

export default function ReturnRefundPolicyPage() {
  const [activeSection, setActiveSection] = useState("overview");

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
          <Breadcrumbs items={[{ label: "Return & Refund Policy" }]} />
        </div>
      </div>

      {/* 2. Top Banner */}
      <div className="bg-white border-b border-[#E9ECEF]">
        <div className="container-x max-w-6xl py-8 sm:py-12">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2E7D32]">
              <RotateCcw size={16} /> Transparent Patient Protection
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#171725] tracking-tight">
              Return, Refund &amp; Cancellation Policy
            </h1>
            <p className="text-xs sm:text-sm text-[#696974] max-w-3xl leading-relaxed">
              At Dawai24, we are committed to ensuring complete satisfaction and patient safety. We provide a transparent 15-day return window on eligible pharmaceutical and healthcare products, paired with swift, automated refund processing.
            </p>
            <p className="text-xs text-[#92929D] font-medium pt-1">
              Last Updated: November 2026 • Platform: Dawai24
            </p>
          </div>
        </div>
      </div>

      {/* 3. Main Content Grid */}
      <div className="container-x max-w-6xl py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
          
          {/* Sticky Sidebar Navigation */}
          <aside className="hidden lg:block sticky top-24 bg-white border border-[#E9ECEF] rounded-2xl p-4 shadow-2xs max-h-[calc(100vh-120px)] overflow-y-auto">
            <p className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#171725] border-b border-[#F0F2F5] mb-2 flex items-center justify-between">
              <span>Policy Guide</span>
              <span className="text-[11px] font-mono text-[#92929D]">{SECTIONS.length} sections</span>
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
                <Clock size={16} className="text-[#2E7D32]" /> 15-Day Return Window
              </p>
              <p className="text-[11px] leading-relaxed">
                Eligible sealed products can be returned within 15 days of doorstep delivery.
              </p>
            </div>
          </aside>

          {/* Policy Text & Details */}
          <main className="bg-white border border-[#E9ECEF] rounded-3xl p-6 sm:p-10 shadow-2xs space-y-10 text-[#334155] leading-relaxed text-sm sm:text-[15px]">
            
            {/* A. Overview */}
            <section id="overview" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                A. Policy Overview
              </h2>
              <p>
                Dawai24 facilitates online dispensing of medicines and healthcare goods through licensed pharmacy premises. Because pharmaceuticals directly impact patient wellness, our cancellation and return procedures balance customer convenience with statutory medicine storage and handling standards.
              </p>
              
              {/* Highlight Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#2E7D32]/20 text-center space-y-1">
                  <p className="text-2xl font-black text-[#2E7D32]">15 Days</p>
                  <p className="text-xs font-bold text-[#171725]">Return Window</p>
                  <p className="text-[11px] text-[#696974]">From delivery date</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-center space-y-1">
                  <p className="text-2xl font-black text-blue-600">3-5 Days</p>
                  <p className="text-xs font-bold text-[#171725]">Refund Credit</p>
                  <p className="text-[11px] text-[#696974]">Back to original mode</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FFF8F7] border border-[#FF6B5A]/20 text-center space-y-1">
                  <p className="text-2xl font-black text-[#FF6B5A]">100%</p>
                  <p className="text-xs font-bold text-[#171725]">Safe Packaging</p>
                  <p className="text-[11px] text-[#696974]">Tamper-evident seals</p>
                </div>
              </div>
            </section>

            {/* B. Cancellation Policy */}
            <section id="cancellation" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                B. Order Cancellation Policy
              </h2>
              <div className="space-y-3">
                <p>
                  <strong>How can I cancel an order on Dawai24?</strong>
                </p>
                <p>
                  An order for medicines or healthcare products can be cancelled directly from the <strong>&apos;My Orders&apos;</strong> screen on the Dawai24 website or by calling our customer care team at <strong>+91 89586 22622</strong> before the order is dispatched from our licensed pharmacy.
                </p>
                <p>
                  If the order has already been handed to the courier partner, you may refuse acceptance upon delivery. Once returned to our pharmacy hub, the refund will be processed automatically.
                </p>
              </div>
            </section>

            {/* C. Return Window */}
            <section id="return-window" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                C. Return Window &amp; Eligibility
              </h2>
              <div className="space-y-3">
                <p>
                  <strong>What is the time period for return of orders?</strong>
                </p>
                <p>
                  Dawai24 provides an easy <strong>15-day return policy</strong>. You may initiate a return request from <strong>0 to 15 days</strong> from the date of physical delivery, provided the products fulfill the return eligibility criteria specified below.
                </p>
                <div className="bg-[#FAFBFD] border border-[#E2E8F0] p-4 rounded-2xl space-y-2">
                  <p className="text-xs sm:text-sm font-bold text-[#171725] flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#2E7D32]" /> Valid Grounds for Return:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-[#475569]">
                    <li>Damaged, leaked, or crushed packaging received at the time of courier handover.</li>
                    <li>Incorrect medicine, salt, or dosage delivered differing from the pharmacist-approved order.</li>
                    <li>Product received with an expiry date within less than 3 months of delivery.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* D. Non-Returnable Products */}
            <section id="non-returnable" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2 flex items-center justify-between">
                <span>D. Non-Returnable Products</span>
                <span className="text-xs font-normal text-[#FF6B5A] bg-[#FFF1EF] px-3 py-1 rounded-full font-bold">Important</span>
              </h2>
              <p>
                Under statutory pharmaceutical guidelines and health safety standards, the following items <strong>are non-returnable</strong>:
              </p>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50/50 border border-red-100">
                  <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <span><strong>Opened or Partially Used Medicines:</strong> If a tablet strip has been cut, opened, or blister-punctured, or syrup/oral suspension seal has been broken.</span>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50/50 border border-red-100">
                  <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <span><strong>Temperature-Sensitive Medications:</strong> Cold chain items such as Insulin, Injections, Vaccines, and specialized serums requiring constant refrigeration (2°C–8°C).</span>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50/50 border border-red-100">
                  <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <span><strong>Hygiene and Personal Care Essentials:</strong> Intimate care, diapers, breast pumps, thermometers, and medical diagnostic strips with opened factory seals.</span>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50/50 border border-red-100">
                  <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <span><strong>Missing Barcodes or Serial Numbers:</strong> Any product lacking the batch number, manufacturing date, or barcode affixed at the time of delivery.</span>
                </div>
              </div>
            </section>

            {/* E. How to Return */}
            <section id="how-to-return" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                E. How to Raise a Return Request
              </h2>
              <div className="space-y-3">
                <p>Raising a return on Dawai24 is simple:</p>
                <ol className="list-decimal pl-6 space-y-2 text-xs sm:text-sm">
                  <li><strong>Through Platform:</strong> Go to <em>Account &gt; Orders</em>, select the specific order, click <em>&quot;Raise Return&quot;</em>, select the item and reason, and upload a clear photo of the outer packaging and batch number.</li>
                  <li><strong>Through Phone Support:</strong> Call our customer care at <strong>+91 89586 22622</strong> (10 AM to 7 PM, Mon–Sat) with your Order ID.</li>
                  <li><strong>Through Email:</strong> Send an email to <strong>care@davai24.in</strong> with photos of the damaged or incorrect item.</li>
                </ol>
              </div>
            </section>

            {/* F. Verification & Pickup */}
            <section id="verification" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                F. Verification &amp; Pickup Process
              </h2>
              <p>
                Once your return request is submitted, our pharmacy team reviews the photos. Upon verification, a reverse pickup is scheduled via our courier partner within <strong>24 to 48 hours</strong>. Please keep the item in its original box with all leaflets intact.
              </p>
            </section>

            {/* G. Refund Modes */}
            <section id="refund-modes" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                G. Refund Modes &amp; Timelines
              </h2>
              <p>
                Once the returned product arrives at our licensed pharmacy hub and passes quality inspection, the refund is initiated immediately:
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border border-[#E2E8F0] rounded-xl overflow-hidden">
                  <thead className="bg-[#FAFBFD] text-[#171725] font-bold border-b border-[#E2E8F0]">
                    <tr>
                      <th className="p-3">Payment Method Used</th>
                      <th className="p-3">Refund Destination</th>
                      <th className="p-3">Estimated Timeline</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    <tr>
                      <td className="p-3 font-medium">UPI / Google Pay / PhonePe</td>
                      <td className="p-3 text-[#696974]">Original Bank Account / VPA</td>
                      <td className="p-3 text-[#2E7D32] font-semibold">24 to 48 Hours</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Credit / Debit Card</td>
                      <td className="p-3 text-[#696974]">Original Card Statement</td>
                      <td className="p-3 text-[#2E7D32] font-semibold">3 to 5 Business Days</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Net Banking</td>
                      <td className="p-3 text-[#696974]">Bank Source Account</td>
                      <td className="p-3 text-[#2E7D32] font-semibold">3 to 5 Business Days</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Cash on Delivery (COD)</td>
                      <td className="p-3 text-[#696974]">NEFT / UPI to customer bank</td>
                      <td className="p-3 text-[#2E7D32] font-semibold">3 to 5 Business Days (after sharing bank details)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* H. Shipping Charges */}
            <section id="shipping-charges" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] border-b border-[#F0F2F5] pb-2">
                H. Shipping Charges &amp; Restocking
              </h2>
              <p>
                If a return is initiated due to transit damage, batch expiry, or an incorrect item sent by our pharmacy, <strong>100% of the product cost and original delivery fees are fully refunded</strong>.
              </p>
            </section>

            {/* I. Support & Grievance */}
            <section id="support" className="space-y-4 scroll-mt-28 bg-[#FAFBFD] p-5 sm:p-6 rounded-2xl border border-[#E2E8F0]">
              <h2 className="text-lg sm:text-xl font-bold text-[#171725] flex items-center gap-2">
                <AlertCircle size={20} className="text-[#2E7D32]" />
                I. Customer Support &amp; Grievance Redressal
              </h2>
              <p className="text-xs sm:text-sm text-[#475569]">
                Need immediate help with a return, damaged parcel, or pending refund on Dawai24? Our team is ready to assist:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm pt-1">
                <div>
                  <p className="font-bold text-[#171725]">Dawai24 Returns Desk:</p>
                  <p className="text-[#696974]">Customer Support Operations</p>
                  <p className="text-[#696974]">Operating Hours: 10:00 AM - 7:00 PM (Mon-Sat)</p>
                </div>
                <div className="space-y-1">
                  <p className="flex items-center gap-1.5 text-[#171725]">
                    <Phone size={14} className="text-[#2E7D32]" />
                    <span className="font-semibold">Phone:</span> +91 89586 22622
                  </p>
                  <p className="flex items-center gap-1.5 text-[#171725]">
                    <Mail size={14} className="text-[#2E7D32]" />
                    <span className="font-semibold">Email:</span> care@davai24.in
                  </p>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}
