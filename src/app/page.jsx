import HomeHero from "@/components/Home/HomeHero";
import HomeQuickActions from "@/components/Home/HomeQuickActions";
import HomeBannerCarousel from "@/components/Home/HomeBannerCarousel";
import HomeWhySubstitute from "@/components/Home/HomeWhySubstitute";
import HomeShopByCategory from "@/components/Home/HomeShopByCategory";
import HomeAdvantage from "@/components/Home/HomeAdvantage";
import HomeTestimonials from "@/components/Home/HomeTestimonials";
import HomeNews from "@/components/Home/HomeNews";
import HomeKnowMore from "@/components/Home/HomeKnowMore";
import { db } from "@/lib/db";
import { publicCategoryFilter } from "@/lib/productWizard";

export const metadata = {
  title: "Buy Generic Medicines Online & Save Up to 60% on PlatinumRx",
  description: "PlatinumRx is India's trusted online pharmacy for branded substitute medicines. Save up to 60% on chronic prescription drugs with identical salt compositions.",
};

export const dynamic = "force-dynamic";
export default async function HomePage() {
  const [categories, banners, cms] = await Promise.all([
    db.category.findMany({ where: publicCategoryFilter, include: { subcategories: { where: publicCategoryFilter, orderBy: { sortOrder: "asc" } } }, orderBy: { sortOrder: "asc" } }),
    db.banner.findMany({ where: { active: true, placement: "HOME_PROMO" }, orderBy: { sortOrder: "asc" } }),
    db.cmsEntry.findMany({ where: { active: true, type: { in: ["HOME_HERO","QUICK_ACTION","WHY_FEATURE","ADVANTAGE","TESTIMONIAL","NEWS","KNOW_MORE","FAQ"] } }, orderBy: { sortOrder: "asc" } }),
  ]);
  const content = (type) => cms.filter((x) => x.type === type);
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Hero Section (Blue gradient banner with Doctor Approved pills + Search + Ambassador image) */}
      <HomeHero content={content("HOME_HERO")[0]} />

      {/* 2. Quick Action Cards (Add Prescription Upload + WhatsApp Order) */}
      <HomeQuickActions actions={content("QUICK_ACTION")} />

      {/* 3. Promotional Carousel Banners */}
      <HomeBannerCarousel slides={banners} />

      {/* 4. Why Choose Substitute (Perception card + Same Composition + Certified Mfg + 60% Savings) */}
      <HomeWhySubstitute features={content("WHY_FEATURE")} />

      {/* 5. Shop by Category (Interactive tabs + subcategories grid) */}
      <HomeShopByCategory categories={categories} />

      {/* 6. The PlatinumRx Advantage (100% Genuine, FDA & GMP Approved, GMP Certified) */}
      <HomeAdvantage advantages={content("ADVANTAGE")} />

      {/* 7. Trusted by 10L+ Customers (Customer reviews slider) */}
      <HomeTestimonials reviews={content("TESTIMONIAL")} />

      {/* 8. We Are In The News (Interactive coverage + press logos) */}
      <HomeNews articles={content("NEWS")} />

      {/* 9. Know More About PlatinumRx (SEO description + FAQs) */}
      <HomeKnowMore sections={content("KNOW_MORE")} faqs={content("FAQ")} />
    </div>
  );
}
