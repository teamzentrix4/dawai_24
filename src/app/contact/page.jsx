"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, MessageSquare, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";
import Breadcrumbs from "@/components/Common/Breadcrumbs";
import { useStore } from "@/lib/store";

export default function Contact() {
  const { toast } = useStore();
  const [f, setF] = useState({ name: "", email: "", phone: "", message: "" });
  const [err, setErr] = useState({});
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const v = {};
    if (f.name.trim().length < 2) v.name = "Enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) v.email = "Enter a valid email address";
    if (f.message.trim().length < 8) v.message = "Please write a brief description of your inquiry";
    setErr(v);
    if (Object.keys(v).length) return;
    try{const response=await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(f)});if(!response.ok)throw new Error("Message could not be submitted");setSent(true);toast("Thank you! Your message has been received.","success");}catch(error){toast(error.message,"error")}
  };

  return (
    <>
      <Breadcrumbs items={[{ label: "Contact Us" }]} />
      <div className="container-x max-w-4xl pb-16 space-y-8">
        
        <div>
          <h1 className="text-3xl font-black text-[#171725] tracking-tight">Contact Us</h1>
          <p className="text-[14px] text-[#696974] mt-1">
            Have questions about substitute medicines, order delivery, or prescriptions? We&apos;re here to help.
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_360px] gap-8 items-start">
          
          {/* Contact Form Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ECEEF2] shadow-xs">
            {sent ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-extrabold text-xl text-[#171725]">Message Received</h3>
                <p className="text-[14px] text-[#696974] max-w-sm mx-auto">
                  Thank you, <b>{f.name}</b>. A member of our support team will get in touch with you at <b>{f.email}</b>.
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setF({ name: "", email: "", phone: "", message: "" });
                  }}
                  className="btn btn-outline text-[13px] mt-2"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="cn" className="text-[12px] font-bold text-[#171725] block mb-1">
                    Your Full Name
                  </label>
                  <input
                    id="cn"
                    className={`input ${err.name ? "error" : ""}`}
                    placeholder="e.g. Vikram Malhotra"
                    value={f.name}
                    onChange={(e) => setF({ ...f, name: e.target.value })}
                  />
                  {err.name && <p className="field-error">{err.name}</p>}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ce" className="text-[12px] font-bold text-[#171725] block mb-1">
                      Email Address
                    </label>
                    <input
                      id="ce"
                      type="email"
                      className={`input ${err.email ? "error" : ""}`}
                      placeholder="vikram@example.com"
                      value={f.email}
                      onChange={(e) => setF({ ...f, email: e.target.value })}
                    />
                    {err.email && <p className="field-error">{err.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="cp" className="text-[12px] font-bold text-[#171725] block mb-1">
                      Mobile Number (Optional)
                    </label>
                    <input
                      id="cp"
                      className="input"
                      placeholder="10-digit mobile"
                      value={f.phone}
                      onChange={(e) => setF({ ...f, phone: e.target.value.replace(/\D/g, "") })}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="cm" className="text-[12px] font-bold text-[#171725] block mb-1">
                    How can we help?
                  </label>
                  <textarea
                    id="cm"
                    rows={4}
                    className={`input ${err.message ? "error" : ""}`}
                    placeholder="Ask about active salts, order tracking, prescription verification..."
                    value={f.message}
                    onChange={(e) => setF({ ...f, message: e.target.value })}
                  />
                  {err.message && <p className="field-error">{err.message}</p>}
                </div>

                <button type="submit" className="btn btn-primary w-full py-3 text-[14px] font-bold tracking-wide">
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>

          {/* Contact Details Card */}
          <aside className="space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-[#ECEEF2] shadow-xs space-y-5 text-[13px]">
              <h2 className="font-extrabold text-[15px] text-[#171725] border-b border-[#F0F2F5] pb-2.5">
                Davai24 Headquarters
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#FFF1EF] text-[#FF6B5A] flex items-center justify-center shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-[#171725]">Registered Office</p>
                    <p className="text-[#696974] mt-0.5 leading-snug">
                      A-11, Amity Rd, A Block, C Block, Sector 125, Noida, Uttar Pradesh 201313
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-[#171725]">Customer Support Helpline</p>
                    <p className="text-[#696974] mt-0.5">+91 96069 73757</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-[#171725]">Email Inquiries</p>
                    <p className="text-[#696974] mt-0.5">care@davai24.in</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-[#171725]">Working Hours</p>
                    <p className="text-[#696974] mt-0.5">Monday to Sunday: 8:00 AM – 10:00 PM IST</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#FAFBFD] rounded-3xl p-5 border border-[#ECEEF2] text-[12px] text-[#696974] flex items-center gap-3">
              <ShieldCheck size={20} className="text-emerald-600 shrink-0" />
              <span>All medical and substitute medicine queries are answered under pharmacist guidance.</span>
            </div>
          </aside>

        </div>
      </div>
    </>
  );
}
