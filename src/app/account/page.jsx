"use client";

import { useEffect, useState } from "react";
import { LoaderCircle, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export default function Account() {
  const router = useRouter();
  const { user, ready, login, toast } = useStore();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (ready && !user) router.replace("/login?next=/account"); }, [ready, user, router]);
  useEffect(() => { if (user) setForm({ name: user.name || "", email: user.email || "", phone: user.phone || "" }); }, [user]);
  if (!ready || !user) return null;

  const save = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (form.name.trim().length < 2) nextErrors.name = "Enter your full name";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = "Enter a valid email address";
    setErrors(nextErrors); if (Object.keys(nextErrors).length) return;
    setSaving(true);
    try { const response = await fetch("/api/auth/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name, email: form.email }) }); const data = await response.json(); if (!response.ok) return toast(data.error || "Profile could not be updated", "error"); login(data); toast("Your details were saved", "success"); } finally { setSaving(false); }
  };
  const change = (key, value) => { setForm((current) => ({ ...current, [key]: value })); setErrors((current) => ({ ...current, [key]: "" })); };

  return <section className="max-w-[760px]">
    <div className="mb-8"><p className="text-xs font-bold uppercase tracking-[.15em] text-[#FF6B5A]">Account details</p><h2 className="mt-2 text-3xl font-black tracking-tight">Fill Details</h2><p className="mt-2 text-sm text-slate-500">Keep your profile details current for deliveries and orders.</p></div>
    <form onSubmit={save} noValidate className="space-y-5">
      <Field label="Name" error={errors.name}><input value={form.name} onChange={(event) => change("name", event.target.value)} className={`input h-12 ${errors.name ? "error" : ""}`} placeholder="Your full name" /></Field>
      <Field label="Email ID" error={errors.email}><input type="email" value={form.email} onChange={(event) => change("email", event.target.value)} className={`input h-12 ${errors.email ? "error" : ""}`} placeholder="name@example.com" /></Field>
      <Field label="Primary mobile number"><input disabled value={`+91 ${form.phone}`} className="input h-12 cursor-not-allowed bg-slate-50 text-slate-500" /><span className="mt-1.5 flex items-center gap-1 text-xs font-medium text-emerald-700"><ShieldCheck size={14}/> Verified mobile number</span></Field>
      <div className="pt-2"><button type="submit" disabled={saving} className="btn btn-primary rounded-lg px-6 py-3 disabled:cursor-wait disabled:opacity-70">{saving ? <><LoaderCircle size={16} className="animate-spin"/>Saving details...</> : "Save Details"}</button></div>
    </form>
  </section>;
}

function Field({ label, error, children }) { return <label className="block text-sm font-bold text-[#171725]"><span className="mb-2 block">{label}</span>{children}{error && <p className="field-error">{error}</p>}</label>; }
