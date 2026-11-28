"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, Heart, LogOut, MapPin, Menu, Package, Settings, ShoppingBag, UserRound, Wallet, X } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { useLocation } from "@/lib/locationContext";

const navigation = [
  ["Account", "Add & edit your details", "/account", UserRound],
  ["My Orders", "Check your order details", "/orders", Package],
  ["Wishlist", "Your saved medicines", "/wishlist", Heart],
  ["My Addresses", "Add & edit your address", "/account/addresses", MapPin],
  ["Wallet", "Cashback, coins, and refunds", "/account/wallet", Wallet],
];

export default function CustomerShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, ready, logout } = useStore();
  const { location, openLocationModal } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const name = user?.name || "Dawai24 User";
  const initials = name.split(" ").filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "U";
  const locationText = location?.area ? `${location.area}, ${location.pincode || location.city}` : `${location?.city || "Bengaluru"}, ${location?.pincode || "560102"}`;

  const signOut = async () => {
    await fetch("/api/auth/logout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "customer" }) });
    logout(); router.replace("/"); router.refresh();
  };

  const menu = <aside className="flex h-full w-full flex-col rounded-[26px] border border-slate-100 bg-white p-4 shadow-[0_14px_32px_-25px_rgba(15,23,42,.28)] sm:p-5">
    <div className="flex items-center gap-4 border-b border-slate-100 px-1 pb-5"><span className="grid size-13 place-items-center rounded-full bg-[#FFF0ED] text-xl font-black text-[#FF6B5A]">{initials}</span><div className="min-w-0"><h1 className="truncate text-xl font-black text-[#171725]">Hello, {name}</h1><p className="mt-1 text-xs text-slate-500">{user?.phone || "Your Dawai24 account"}</p></div></div>
    <nav className="mt-2 flex-1">{navigation.map(([label, description, href, Icon]) => { const active = href === "/account" ? pathname === "/account" : pathname === href; return <Link key={label} href={href} onClick={() => setMobileOpen(false)} className={`group flex items-center gap-3 border-b border-dashed border-slate-200 px-3 py-4 transition ${active ? "border-l-2 border-l-[#FF6B5A] bg-[#FFF1EF]" : "hover:bg-slate-50"}`}><Icon size={21} className={active ? "text-[#FF6B5A]" : "text-slate-700"}/><span className="min-w-0 flex-1"><b className="block text-sm text-[#171725]">{label}</b><small className="mt-0.5 block truncate text-xs text-slate-500">{description}</small></span><ChevronRight size={18} className={active ? "text-[#FF6B5A]" : "text-slate-400"}/></Link>; })}</nav>
    <button onClick={signOut} className="mt-4 border-t border-slate-200 px-2 pt-5 text-left text-sm font-semibold text-[#FF6B5A] hover:text-[#E95545]">Logout</button>
  </aside>;

  if (!ready) return <div className="grid min-h-screen place-items-center bg-[#F6F7FB] text-sm font-semibold text-slate-500">Loading your account...</div>;
  return <div className="min-h-screen bg-[#F6F7FB] text-[#171725]">
    <header className="sticky top-0 z-40 border-y border-slate-200 bg-white"><div className="mx-auto flex h-[82px] max-w-[1440px] items-center gap-4 px-5 sm:px-8"><Link href="/" className="flex items-center gap-2 border-r border-slate-200 pr-5"><span className="grid size-9 place-items-center rounded-xl bg-[#FF6B5A] font-black text-white">D</span><b className="text-xl">Dawai<span className="text-[#FF6B5A]">24</span></b></Link><button onClick={openLocationModal} className="hidden items-center gap-2 text-left sm:flex"><MapPin size={19} className="text-[#FF6B5A]"/><span><small className="block text-[10px] font-bold uppercase tracking-[.1em] text-slate-400">Delivering to</small><b className="block text-xs">{locationText}</b></span></button><span className="ml-auto hidden text-sm font-bold text-slate-700 sm:inline">{name}</span><Link href="/" className="grid size-10 place-items-center rounded-full border border-slate-200 text-slate-700 hover:text-[#FF6B5A]" aria-label="Cart"><ShoppingBag size={19}/></Link><button onClick={() => setMobileOpen(true)} className="grid size-10 place-items-center rounded-xl border border-slate-200 lg:hidden"><Menu size={20}/></button></div></header>
    {mobileOpen && <div className="fixed inset-0 z-50 lg:hidden"><button className="absolute inset-0 bg-slate-950/35" onClick={() => setMobileOpen(false)} aria-label="Close menu"/><div className="absolute inset-y-0 left-0 w-[min(90%,370px)] p-4"><button onClick={() => setMobileOpen(false)} className="absolute right-7 top-7 z-10"><X size={20}/></button>{menu}</div></div>}
    <div className="mx-auto grid max-w-[1440px] gap-6 px-4 py-7 sm:px-8 lg:grid-cols-[385px_minmax(0,1fr)] lg:py-10"><div className="hidden lg:block">{menu}</div><main className="min-w-0 rounded-[26px] border border-slate-100 bg-white p-5 shadow-[0_14px_32px_-25px_rgba(15,23,42,.28)] sm:p-7 lg:p-9">{children}</main></div>
  </div>;
}
