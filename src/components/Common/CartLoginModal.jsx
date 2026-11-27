"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, ShoppingBag, UserPlus, X } from "lucide-react";
import { useStore } from "@/lib/store";

export default function CartLoginModal() {
  const pathname = usePathname();
  const { authGateOpen, closeAuthGate } = useStore();
  if (!authGateOpen) return null;
  const next = encodeURIComponent(pathname || "/");

  return <div className="fixed inset-0 z-[80] grid place-items-center p-4" role="dialog" aria-modal="true" aria-labelledby="cart-login-title">
    <button className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]" aria-label="Close login prompt" onClick={closeAuthGate} />
    <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
      <div className="bg-gradient-to-br from-[#FFF2EF] to-[#FFF9F7] px-6 pb-5 pt-6 sm:px-8">
        <button onClick={closeAuthGate} className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-white/90 text-slate-500 transition hover:text-slate-900" aria-label="Close"><X size={18} /></button>
        <span className="grid size-12 place-items-center rounded-2xl bg-[#FF6B5A] text-white shadow-lg shadow-[#FF6B5A]/20"><ShoppingBag size={24} /></span>
        <h2 id="cart-login-title" className="mt-4 text-2xl font-black tracking-tight text-[#171725]">Sign in to add items</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Please log in or create an account to add this product to your cart. Your selected item will be added automatically after you continue.</p>
      </div>
      <div className="space-y-3 p-6 sm:p-8">
        <Link href={`/login?next=${next}`} onClick={closeAuthGate} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6B5A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#F05543]"><LogIn size={17} /> Log in</Link>
        <Link href={`/signup?next=${next}`} onClick={closeAuthGate} className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#FFB1A8] bg-white px-5 py-3 text-sm font-bold text-[#E95545] transition hover:bg-[#FFF5F3]"><UserPlus size={17} /> Create account</Link>
        <button onClick={closeAuthGate} className="w-full py-1 text-sm font-semibold text-slate-500 hover:text-slate-800">Continue browsing</button>
      </div>
    </div>
  </div>;
}
