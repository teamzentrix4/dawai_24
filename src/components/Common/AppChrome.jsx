"use client";

import { usePathname } from "next/navigation";
import { StoreProvider } from "@/lib/store";
import { LocationProvider } from "@/lib/locationContext";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import CartDrawer from "@/components/Cart/CartDrawer";
import Toasts from "@/components/Common/Toasts";
import BackToTop from "@/components/Common/BackToTop";
import LocationModal from "@/components/Header/LocationModal";

export default function AppChrome({ children }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return children;
  return (
    <LocationProvider>
      <StoreProvider>
        <Header />
        <main className="min-h-[60vh]">{children}</main>
        <Footer />
        <CartDrawer />
        <Toasts />
        <BackToTop />
        <LocationModal />
      </StoreProvider>
    </LocationProvider>
  );
}
