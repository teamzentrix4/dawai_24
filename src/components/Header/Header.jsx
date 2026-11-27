"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ChevronDown, 
  Menu, 
  X, 
  Navigation,
  Wallet,
  ShoppingCart,
  LayoutDashboard,
  LogOut
} from "lucide-react";
import Logo from "@/components/Common/Logo";
import { useStore } from "@/lib/store";

const SearchBox = dynamic(() => import("@/components/Search/SearchBox"), { ssr: false });
const PinModal = dynamic(() => import("./PinModal"), { ssr: false });

export default function Header({ initialCategories = [] }) {
  const router = useRouter();
  const { count, pin, user, openDrawer, logout } = useStore();
  const [pinOpen, setPinOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpandedTab, setMobileExpandedTab] = useState(null);
  const [dynamicCategories, setDynamicCategories] = useState(initialCategories);
  const [auth, setAuth] = useState({ admin: null, customer: null, loaded: false });
  const timeoutRef = useRef(null);

  // Close dropdown when scrolling
  useEffect(() => {
    // The layout supplies this data on first render. Only fall back to the API
    // if the cached server data was unavailable.
    if (!initialCategories.length) {
      fetch("/api/catalog/categories", { cache: "force-cache" }).then((r) => r.json()).then(setDynamicCategories).catch(() => setDynamicCategories([]));
    }
    const handleScroll = () => {
      setActiveDropdown(null);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [initialCategories.length]);
  useEffect(() => { fetch("/api/auth/session").then(r=>r.json()).then(data=>setAuth({...data,loaded:true})).catch(()=>setAuth({admin:null,customer:null,loaded:true})); }, []);
  const signOut = async (type) => { await fetch("/api/auth/logout", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({type}) }); if(type==="customer") logout(); setAuth((x)=>({...x,[type]:null})); router.refresh(); };
  const navEntries = dynamicCategories.map((category) => [category.name, { slug: category.slug, items: category.subcategories || [] }]);

  const handleMouseEnter = (key) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(key);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 120);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.06)] border-b border-[#F0F2F5]">
        {/* Top Navbar Bar */}
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 h-[68px] flex items-center justify-between gap-4">
          
          {/* Left section: Hamburger (Mobile) + Logo + Delivering to */}
          <div className="flex items-center gap-3 md:gap-5 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-1.5 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>

            {/* Logo */}
            <Logo width={36} height={36} />

            {/* Vertical Divider */}
            <div className="hidden sm:block h-7 w-[1px] bg-[#E2E4E8]" />

            {/* Delivering to Selector */}
            <button
              onClick={() => setPinOpen(true)}
              className="flex items-center gap-2 text-left py-1 px-1.5 sm:px-2 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer"
              title="Change Delivery Location"
            >
              <Navigation 
                size={18} 
                className="text-[#171725] shrink-0 -rotate-45 stroke-[2.2]" 
              />
              <div className="flex flex-col leading-tight">
                <span className="text-[12px] font-bold text-[#171725] tracking-tight">
                  Delivering to
                </span>
                <div className="flex items-center gap-1 text-[11px] text-[#696974] font-medium">
                  <span className="truncate max-w-[130px] sm:max-w-[180px]">
                    {pin ? `Bengaluru, ${pin}` : "Bengaluru, 560102"}
                  </span>
                  <ChevronDown size={13} className="text-[#696974] group-hover:translate-y-0.5 transition-transform" />
                </div>
              </div>
            </button>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right section: Wallet, Cart, Login */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Wallet / Offers Icon */}
            <button
              onClick={() => {
                if (!user) router.push("/login");
                else router.push("/account");
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#171725] hover:bg-gray-100 hover:text-black transition-colors"
              aria-label="Wallet & Offers"
              title="Wallet & Offers"
            >
              <Wallet size={20} strokeWidth={1.8} />
            </button>

            {/* Cart Icon with badge */}
            <button
              onClick={openDrawer}
              className="relative w-10 h-10 rounded-full flex items-center justify-center text-[#171725] hover:bg-gray-100 hover:text-black transition-colors"
              aria-label="Shopping Cart"
              title="Cart"
            >
              <ShoppingCart size={20} strokeWidth={1.8} />
              {count > 0 && (
                <span className="absolute top-1 right-1 bg-[#FF6B5A] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm animate-pulse">
                  {count}
                </span>
              )}
            </button>

            {/* Vertical separator */}
            <div className="hidden sm:block h-6 w-[1px] bg-[#E2E4E8] mx-0.5" />

            {/* Auth actions */}
            {auth.admin ? (
              <div className="flex items-center gap-1.5">
                <Link href="/admin" className="inline-flex items-center gap-1.5 rounded-full bg-[#F3EAFA] px-4 py-2 text-[13px] font-bold text-[#7B2CBF]"><LayoutDashboard size={15}/>Dashboard</Link>
                <button onClick={() => signOut("admin")} className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-semibold text-[#696974] hover:bg-gray-100"><LogOut size={15}/>Logout</button>
              </div>
            ) : auth.customer || user ? (
              <div className="flex items-center gap-1">
                <Link href="/account" className="px-3 py-2 text-sm font-semibold text-[#171725] hover:bg-gray-100 rounded-full transition-colors">{(auth.customer?.name || user?.name)?.split(" ")[0] || "Account"}</Link>
                <button onClick={() => signOut("customer")} title="Logout" className="grid size-9 place-items-center rounded-full text-[#696974] hover:bg-gray-100"><LogOut size={16}/></button>
              </div>
            ) : auth.loaded ? (
              <Link
                href="/login"
                className="px-5 py-2 text-[14px] font-semibold text-[#FF6B5A] bg-[#FFF1EF] hover:bg-[#FFE5E1] active:bg-[#FFD8D3] rounded-full transition-colors tracking-wide"
              >
                Login
              </Link>
            ) : <div className="h-10 w-20 animate-pulse rounded-full bg-slate-100"/>}
          </div>
        </div>

        {/* Mobile Search Bar row */}
        <div className="md:hidden px-4 pb-3">
          <SearchBox />
        </div>

        {/* Navigation Tabs Bar with Dropdowns (Desktop) */}
        <nav 
          className="hidden md:block border-t border-[#F0F2F5] bg-white relative" 
          aria-label="Category Navigation"
        >
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
            <ul className="flex items-center justify-between text-[13px] lg:text-[14px] font-semibold text-[#171725] py-0">
              {navEntries.map(([tabTitle, data]) => {
                const isOpen = activeDropdown === tabTitle;
                return (
                  <li
                    key={tabTitle}
                    className="relative group py-2.5"
                    onMouseEnter={() => handleMouseEnter(tabTitle)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                        isOpen 
                          ? "bg-[#F7F8F9] text-[#FF6B5A]" 
                          : "text-[#171725] hover:text-[#FF6B5A] hover:bg-[#F9FAFB]"
                      }`}
                      aria-expanded={isOpen}
                    >
                      <span>{tabTitle}</span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-[#FF6B5A]" : "text-[#92929D] group-hover:text-[#FF6B5A]"
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {isOpen && (
                      <div 
                        className="absolute left-0 top-[100%] pt-1 z-50 animate-in fade-in zoom-in-95 duration-150"
                        onMouseEnter={() => handleMouseEnter(tabTitle)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="w-64 bg-white rounded-xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.15)] border border-[#EBEBEF] py-2 overflow-hidden ring-1 ring-black/5">
                          <ul className="flex flex-col divide-y divide-[#F6F6F9]">
                            {data.items.map((item) => {
                              // Direct route for subcategories: /category/{catSlug}/{item.slug}
                              const href = `/category/${data.slug}/${item.slug}`;
                              return (
                                <li key={item.name}>
                                  <Link
                                    href={href}
                                    onClick={() => setActiveDropdown(null)}
                                    className="block px-4 py-2.5 text-[13px] text-[#44444F] font-medium hover:text-[#FF6B5A] hover:bg-[#FFF8F7] transition-colors"
                                  >
                                    {item.name}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>


                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <aside className="absolute left-0 top-0 h-full w-[85%] max-w-[320px] bg-white shadow-2xl flex flex-col overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#F0F2F5]">
              <Logo width={32} height={32} />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Location selector in drawer */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setPinOpen(true);
              }}
              className="flex items-center gap-3 px-4 py-3 bg-[#F9FAFB] border-b border-[#F0F2F5] text-left"
            >
              <Navigation size={18} className="text-[#171725] -rotate-45" />
              <div>
                <p className="text-[11px] font-bold text-[#171725]">Delivering to</p>
                <p className="text-[12px] text-[#696974]">{pin ? `Bengaluru, ${pin}` : "Bengaluru, 560102"}</p>
              </div>
            </button>

            {/* Category tabs accordion */}
            <div className="flex-1 py-2">
              <p className="px-4 py-2 text-[11px] font-bold text-[#92929D] uppercase tracking-wider">
                Categories & Resources
              </p>
              {navEntries.map(([tabTitle, data]) => {
                const isExpanded = mobileExpandedTab === tabTitle;
                return (
                  <div key={tabTitle} className="border-b border-[#F5F5F7]">
                    <button
                      onClick={() => setMobileExpandedTab(isExpanded ? null : tabTitle)}
                      className="w-full flex items-center justify-between px-4 py-3 text-[14px] font-semibold text-[#171725] hover:bg-gray-50"
                    >
                      <span>{tabTitle}</span>
                      <ChevronDown
                        size={16}
                        className={`text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="bg-[#FAFBFD] px-4 py-1 pb-3 space-y-1">
                        {data.items.map((item) => {
                          const href = `/category/${data.slug}/${item.slug}`;
                          return (
                            <Link
                              key={item.name}
                              href={href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block py-1.5 text-[13px] text-[#44444F] hover:text-[#FF6B5A]"
                            >
                              {item.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-[#F0F2F5] space-y-2">
              {auth.admin ? <><Link href="/admin" onClick={()=>setMobileMenuOpen(false)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7B2CBF] py-2.5 text-[14px] font-semibold text-white"><LayoutDashboard size={16}/>Admin Dashboard</Link><button onClick={()=>{setMobileMenuOpen(false);signOut("admin")}} className="flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-[14px] font-semibold"><LogOut size={16}/>Logout</button></> : auth.customer || user ? <><Link href="/account" onClick={()=>setMobileMenuOpen(false)} className="block w-full rounded-xl bg-[#171725] py-2.5 text-center text-[14px] font-semibold text-white">My Account</Link><button onClick={()=>{setMobileMenuOpen(false);signOut("customer")}} className="flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-[14px] font-semibold"><LogOut size={16}/>Logout</button></> : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-2.5 text-center text-[14px] font-semibold text-[#FF6B5A] bg-[#FFF1EF] hover:bg-[#FFE5E1] rounded-xl"
                >
                  Login / Sign Up
                </Link>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Pin Modal */}
      {pinOpen && <PinModal onClose={() => setPinOpen(false)} />}
    </>
  );
}
