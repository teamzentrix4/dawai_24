"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { StoreProvider } from "@/lib/store";
import { LocationProvider } from "@/lib/locationContext";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import SubmissionGuard from "@/components/Common/SubmissionGuard";

// These are only needed after a user interaction, so do not include them in
// the JavaScript required for the first page render.
const CartDrawer = dynamic(() => import("@/components/Cart/CartDrawer"), { ssr: false });
const Toasts = dynamic(() => import("@/components/Common/Toasts"), { ssr: false });
const BackToTop = dynamic(() => import("@/components/Common/BackToTop"), { ssr: false });
const LocationModal = dynamic(() => import("@/components/Header/LocationModal"), { ssr: false });

export default function AppChrome({ children, categories = [] }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return children;
  return (
    <LocationProvider>
      <StoreProvider>
        <SubmissionGuard />
        <Header initialCategories={categories} />
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
