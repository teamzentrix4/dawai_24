"use client";

import { useState } from "react";
import { ChevronDown, CircleHelp, ShieldCheck, Sparkles } from "lucide-react";

export default function HomeKnowMore({ sections = [], faqs = [] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  if (!sections.length && !faqs.length) return null;

  return <section data-slot="know-more" className="border-t border-slate-100 bg-[#F7F9FC] py-12 md:py-20">
    <div className="container-x">
      <div className="overflow-hidden rounded-3xl border border-[#E5EAF1] bg-white shadow-[0_18px_50px_-34px_rgba(15,23,42,0.32)]">
        <div className="border-b border-[#E9EEF4] bg-gradient-to-r from-[#FFF7F5] via-white to-[#F4F9FF] px-5 py-7 sm:px-8 md:px-10 md:py-9">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3.5"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#FF6B5A] text-white shadow-[0_8px_18px_-8px_rgba(255,107,90,0.7)]"><Sparkles size={21} /></span><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#FF6B5A]">Dawai24 guide</p><h2 className="mt-1 text-2xl font-black tracking-tight text-[#171725] md:text-[30px]">Know more about Dawai24</h2><p className="mt-1 text-sm text-slate-500">Everything you need to know before placing an order.</p></div></div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"><ShieldCheck size={15} /> Trusted healthcare support</span>
          </div>
        </div>
        <button onClick={() => setMobileOpen((value) => !value)} className="flex w-full items-center justify-between border-b border-slate-100 px-5 py-4 text-left text-sm font-bold text-[#171725] md:hidden" aria-expanded={mobileOpen}>Read information and FAQs <ChevronDown size={18} className={`transition-transform ${mobileOpen ? "rotate-180" : ""}`} /></button>
        <div className={`${mobileOpen ? "block" : "hidden"} md:block`}>
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-4 p-5 sm:p-8 md:p-10">
              {sections.map((section, index) => <article key={section.id} className="rounded-2xl border border-slate-100 bg-[#FBFCFE] p-4 sm:p-5"><div className="flex gap-3"><span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-[#FFF0ED] text-xs font-black text-[#FF6B5A]">0{index + 1}</span><div><h3 className="text-[15px] font-extrabold leading-6 text-[#171725] sm:text-base">{section.title}</h3><p className="mt-1.5 whitespace-pre-line text-[13px] leading-6 text-slate-600 sm:text-sm">{section.body}</p></div></div></article>)}
            </div>
            {faqs.length > 0 && <aside className="border-t border-[#E9EEF4] bg-[#F8FBFF] p-5 sm:p-8 lg:border-l lg:border-t-0 md:p-10"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#EAF4FF] text-[#2389DF]"><CircleHelp size={21} /></span><div><p className="text-xs font-bold uppercase tracking-[0.13em] text-[#2389DF]">Need help?</p><h3 className="mt-0.5 text-lg font-extrabold text-[#171725]">Frequently asked questions</h3></div></div><div className="mt-6 space-y-3">{faqs.map((faq, index) => { const isOpen = openFaq === index; return <div key={faq.id} className={`overflow-hidden rounded-xl border transition-colors ${isOpen ? "border-[#FFB4AB] bg-white shadow-sm" : "border-[#DCE6F0] bg-white"}`}><button onClick={() => setOpenFaq(isOpen ? null : index)} className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left text-sm font-bold text-[#171725]" aria-expanded={isOpen}><span>{faq.title}</span><ChevronDown size={18} className={`shrink-0 text-[#FF6B5A] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} /></button>{isOpen && <div className="border-t border-[#F1F3F6] px-4 pb-4 pt-3 text-[13px] leading-6 text-slate-600">{faq.body}</div>}</div>; })}</div></aside>}
          </div>
        </div>
      </div>
    </div>
  </section>;
}
