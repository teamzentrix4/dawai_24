"use client";

import { useState } from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Headphones, 
  MessageSquareHeart,
  Sparkles
} from "lucide-react";
import Breadcrumbs from "@/components/Common/Breadcrumbs";
import { useStore } from "@/lib/store";

export default function ContactUsPage() {
  const { toast } = useStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.name.trim()) errs.name = "Please enter your name";
    if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) errs.email = "Please enter a valid email address";
    if (!formData.message.trim()) errs.message = "Please write your query";

    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error("Could not send message. Please try again.");
      setSubmitted(true);
      toast("Thank you! Your message has been sent to the Dawai24 support desk.", "success");
    } catch (err) {
      toast(err.message || "Failed to submit message", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAFBFD] min-h-screen">
      {/* 1. Breadcrumbs */}
      <div className="bg-white border-b border-[#F0F2F5]">
        <div className="container-x max-w-6xl py-3">
          <Breadcrumbs items={[{ label: "Contact Us" }]} />
        </div>
      </div>

      <div className="container-x max-w-5xl py-8 sm:py-12 space-y-10">
        
        {/* 2. Hero Banner */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E9ECEF] shadow-2xs space-y-3 text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2E7D32] bg-[#F0FDF4] border border-[#2E7D32]/20 px-3.5 py-1.5 rounded-full">
            <MessageSquareHeart size={15} /> Customer &amp; Pharmacist Assistance
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#171725] tracking-tight">
            We Deliver Happiness!
          </h1>
          <p className="text-sm sm:text-base text-[#696974] max-w-2xl leading-relaxed">
            Have questions regarding substitute medications, prescription validation, order tracking, or pharmacy licensing? Our registered pharmacists and support team at Dawai24 are always glad to assist you.
          </p>
        </section>

        {/* 3. Main Grid: Left Message Form & Right Contact Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">
          
          {/* Left Column: Form */}
          <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E9ECEF] shadow-2xs space-y-6">
            <div className="border-b border-[#F0F2F5] pb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171725] tracking-tight">
                We are happy to hear from you
              </h2>
              <p className="text-xs sm:text-sm text-[#696974] mt-1">
                Fill out the form below and our care team will reply promptly.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 text-center space-y-4 bg-[#F0FDF4] rounded-2xl border border-[#2E7D32]/20">
                <div className="w-16 h-16 rounded-full bg-[#2E7D32] text-white flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-[#171725]">Message Successfully Received!</h3>
                <p className="text-xs sm:text-sm text-[#475569] max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{formData.name}</strong>. A Dawai24 care representative has received your inquiry and will reach out to you shortly via <strong>{formData.email}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", phone: "", message: "" });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white border border-[#2E7D32]/30 text-[#2E7D32] font-bold text-xs hover:bg-[#F0FDF4] transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#171725] mb-1.5">
                    Your Name <span className="text-[#FF6B5A]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className={`w-full bg-[#FAFBFD] border ${errors.name ? "border-red-400" : "border-[#E2E8F0]"} rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2E7D32] transition-colors`}
                  />
                  {errors.name && <p className="text-[11px] text-red-500 font-medium mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#171725] mb-1.5">
                      Email Address <span className="text-[#FF6B5A]">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className={`w-full bg-[#FAFBFD] border ${errors.email ? "border-red-400" : "border-[#E2E8F0]"} rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2E7D32] transition-colors`}
                    />
                    {errors.email && <p className="text-[11px] text-red-500 font-medium mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#171725] mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className="w-full bg-[#FAFBFD] border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2E7D32] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#171725] mb-1.5">
                    How can we help? <span className="text-[#FF6B5A]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Enter details about your medicine substitute inquiry, order ID, or prescription clarification..."
                    className={`w-full bg-[#FAFBFD] border ${errors.message ? "border-red-400" : "border-[#E2E8F0]"} rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2E7D32] transition-colors`}
                  />
                  {errors.message && <p className="text-[11px] text-red-500 font-medium mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2E7D32] hover:bg-[#256628] disabled:bg-gray-400 text-white font-bold py-3.5 rounded-xl text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                >
                  {loading ? "Sending..." : <><span>Submit</span> <Send size={15} /></>}
                </button>
              </form>
            )}
          </section>

          {/* Right Column: Exact Dawai24 Contact Details Cards */}
          <aside className="space-y-6">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9ECEF] shadow-2xs space-y-6">
              <h2 className="text-lg font-bold text-[#171725] border-b border-[#F0F2F5] pb-3">
                Contact Information
              </h2>

              <div className="space-y-5 text-xs sm:text-sm">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-[#F0FDF4] text-[#2E7D32] flex items-center justify-center shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#696974]">Helpline &amp; Support</p>
                    <a href="tel:+918958622622" className="font-bold text-[#171725] hover:text-[#2E7D32] text-sm sm:text-base transition-colors">
                      +91 89586 22622
                    </a>
                    <p className="text-[11px] text-[#92929D] mt-0.5">Mon–Sat: 10:00 AM – 7:00 PM</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#696974]">Official Email Support</p>
                    <a href="mailto:care@davai24.in" className="font-bold text-[#171725] hover:text-blue-600 text-sm sm:text-base transition-colors">
                      care@davai24.in
                    </a>
                    <p className="text-[11px] text-[#92929D] mt-0.5">support@davai24.in</p>
                  </div>
                </div>

                {/* Office Address */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-[#FFF1EF] text-[#FF6B5A] flex items-center justify-center shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#696974]">Registered Office Address</p>
                    <p className="font-bold text-[#171725] text-xs sm:text-sm leading-snug mt-0.5">
                      A-11, Amity Rd, A Block, C Block, Sector 125, Noida, Uttar Pradesh 201313
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quality & Pharmacist Assurance Card */}
            <div className="bg-[#FAFBFD] rounded-3xl p-6 border border-[#E2E8F0] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#2E7D32]">
                <ShieldCheck size={18} /> Genuine Dispensing Assurance
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">
                All prescription orders on Dawai24 are dispensed from licensed retail and wholesale pharmacies compliant with state drug licensing authorities and handled under registered pharmacist supervision.
              </p>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
}
