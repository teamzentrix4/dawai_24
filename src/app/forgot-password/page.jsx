"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, KeyRound, LoaderCircle, Send } from "lucide-react";
import AuthShell from "@/components/Forms/AuthShell";

export default function ForgotPassword() {
  const [details, setDetails] = useState({ login: "", message: "" });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    const login = details.login.trim();
    if (!login) return setError("Enter the email address or mobile number registered with your account.");
    setError(""); setSending(true);
    try {
      const isEmail = /^\S+@\S+\.\S+$/.test(login);
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "Password reset request", email: isEmail ? login : "care@dawai24.in", phone: isEmail ? "" : login.replace(/\D/g, "").slice(-10), message: `Password reset request for: ${login}. ${details.message.trim() || "Please help me reset my password."}` }) });
      if (!response.ok) throw new Error("We could not submit your reset request. Please try again.");
      setSent(true);
    } catch (requestError) { setError(requestError.message); } finally { setSending(false); }
  };

  return <AuthShell title="Reset your password" subtitle="Send a secure password-reset request to the Dawai24 support team.">
    {sent ? <div className="space-y-5 text-center"><span className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 size={30} /></span><div><h2 className="text-lg font-extrabold">Request received</h2><p className="mt-2 text-sm leading-6 text-slate-600">Our support team will verify your account details and contact you to complete the password reset.</p></div><Link href="/login" className="btn btn-primary w-full">Back to login</Link></div> : <form onSubmit={submit} className="space-y-4" noValidate><div className="rounded-xl bg-[#FFF8F6] p-3 text-xs leading-5 text-slate-600"><KeyRound size={15} className="mr-1 inline text-[#FF6B5A]"/> For your security, a password is reset only after the registered account details are verified.</div><label className="block text-[12px] font-bold text-[#171725]">Registered email or mobile number<input value={details.login} onChange={(event) => setDetails((current) => ({ ...current, login: event.target.value }))} className="input mt-1" placeholder="name@example.com or 10-digit mobile" autoComplete="username" /></label><label className="block text-[12px] font-bold text-[#171725]">Message <span className="font-normal text-slate-400">(optional)</span><textarea value={details.message} onChange={(event) => setDetails((current) => ({ ...current, message: event.target.value }))} className="input mt-1 min-h-22 resize-y" placeholder="Add any detail that can help us verify your account." /></label>{error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">{error}</p>}<button type="submit" disabled={sending} className="btn btn-primary w-full py-3 disabled:cursor-wait disabled:opacity-70">{sending ? <><LoaderCircle size={17} className="animate-spin"/>Sending request...</> : <><Send size={17}/>Send reset request</>}</button><Link href="/login" className="block text-center text-sm font-semibold text-[#FF6B5A] hover:underline">Back to login</Link></form>}
  </AuthShell>;
}
