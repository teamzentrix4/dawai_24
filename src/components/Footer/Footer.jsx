import Link from "next/link";
import Logo from "@/components/Common/Logo";
import { ShieldCheck, Truck, Headphones, RotateCcw } from "lucide-react";

export const footerSections = [
  {
    title: "Know Us",
    links: [
      { name: "About Us", url: "/about-us" },
      { name: "Terms & Conditions", url: "/terms-and-conditions" },
      { name: "Privacy Policy", url: "/privacy-policy" },
      { name: "Return & Refund Policy", url: "/return-refund-policy" },
      { name: "Online Medicine Delivery", url: "/online-medicine-delivery" },
      { name: "Contact Us", url: "/contact-us" },
      { name: "FAQs & Help Center", url: "/faqs-help-center" },
    ],
  },
  {
    title: "Health Resources",
    links: [
      { name: "All Medicines", url: "/medicines" },
      { name: "All Health Products", url: "/medicines" },
      { name: "All Brands", url: "/brands" },
      { name: "Health Conditions", url: "/health-conditions" },
      { name: "All Salts & Ingredients", url: "/medicines" },
      { name: "Health Articles & FAQs", url: "/faqs" },
    ],
  },
  {
    title: "Top Health Categories",
    links: [
      { name: "Personal Care", url: "/category/personal-care" },
      { name: "Sexual Wellness", url: "/category/personal-care?sub=sexual-wellness" },
      { name: "Vitamins & Supplements", url: "/category/vitamins-and-supplements" },
      { name: "Skin Care", url: "/category/personal-care?sub=skin-care" },
      { name: "Pain Relief", url: "/category/health-conditions?sub=pain-relief" },
      { name: "Eye Care", url: "/category/health-conditions?sub=eye-care" },
      { name: "Protein Supplements", url: "/category/vitamins-and-supplements?sub=protein-supplements" },
    ],
  },
  {
    title: "Top Chronic Care",
    links: [
      { name: "Diabetes And Heart Care", url: "/category/diabetes-and-heart-care" },
      { name: "Healthcare Devices", url: "/category/healthcare-devices" },
      { name: "Kidney Care", url: "/category/health-conditions?sub=kidney-care" },
      { name: "Bone And Joint", url: "/category/personal-care?sub=bone-and-joint" },
      { name: "Digestive Care", url: "/category/health-conditions?sub=digestive-care" },
      { name: "Respiratory Care", url: "/category/health-conditions?sub=respiratory-care" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#EAECEF] mt-20 text-[#171725]">
      {/* Trust Highlights Strip */}
      <div className="border-b border-[#F0F2F5] bg-[#FAFBFD] py-8">
        <div className="container-x grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF1EF] text-[#FF6B5A] flex items-center justify-center shrink-0">
              <ShieldCheck size={24} strokeWidth={2.2} />
            </div>
            <div>
              <h4 className="font-bold text-[14px] text-[#171725]">100% Genuine Medicines</h4>
              <p className="text-[12px] text-[#696974] mt-0.5">Sourced directly from verified top manufacturers</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF1EF] text-[#FF6B5A] flex items-center justify-center shrink-0">
              <Truck size={24} strokeWidth={2.2} />
            </div>
            <div>
              <h4 className="font-bold text-[14px] text-[#171725]">Safe & Fast Delivery</h4>
              <p className="text-[12px] text-[#696974] mt-0.5">Reliable doorstep delivery across all PIN codes</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF1EF] text-[#FF6B5A] flex items-center justify-center shrink-0">
              <RotateCcw size={24} strokeWidth={2.2} />
            </div>
            <div>
              <h4 className="font-bold text-[14px] text-[#171725]">Easy Returns</h4>
              <p className="text-[12px] text-[#696974] mt-0.5">Hassle-free return & replacement policy</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF1EF] text-[#FF6B5A] flex items-center justify-center shrink-0">
              <Headphones size={24} strokeWidth={2.2} />
            </div>
            <div>
              <h4 className="font-bold text-[14px] text-[#171725]">24/7 Support</h4>
              <p className="text-[12px] text-[#696974] mt-0.5">Dedicated pharmacist & support helpline</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container-x py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">

          {/* Company Bio */}
          <div className="lg:col-span-2 space-y-4 pr-0 lg:pr-6">
            <Logo width={42} height={42} />
            {/* <p className="text-[13px] text-[#696974] leading-relaxed">
              Davai24 is India&apos;s leading platform for affordable, quality-assured substitute & branded medicines. 
              We help families save up to 70% on monthly prescription bills with 100% same salt composition.
            </p> */}
            <div className="pt-2 text-[12px] text-[#92929D] space-y-1">
              <p><strong className="text-[#171725]">Address:</strong>A-11, Amity Rd, A Block, C Block, Sector 125, Noida, Uttar Pradesh 201313</p>
              <p><strong className="text-[#171725]">Support:</strong>8958622622</p>
            </div>
          </div>

          {/* Dynamic Link Groups */}
          {footerSections.map((sec) => (
            <div key={sec.title} className="space-y-3">
              <h3 className="font-bold text-[14px] text-[#171725] tracking-tight">{sec.title}</h3>
              <ul className="space-y-2 text-[13px]">
                {sec.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.url}
                      className="text-[#696974] hover:text-[#FF6B5A] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Legal & Copyright */}
      <div className="border-t border-[#F0F2F5] bg-[#F8F9FA] py-5">
        <div className="container-x flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#92929D]">
          <p>© {new Date().getFullYear()} Dawai24. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/policies/privacy-policy" className="hover:text-[#171725]">Privacy</Link>
            <Link href="/policies/terms-and-conditions" className="hover:text-[#171725]">Terms</Link>
            <Link href="/help" className="hover:text-[#171725]">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
