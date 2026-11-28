import Link from "next/link";
import { db } from "@/lib/db";
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  HeartHandshake, 
  ChevronRight,
  Search,
  CheckCircle2,
  Stethoscope,
  TrendingDown
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Health & Medicine Information You Can Trust | Dawai24 Blogs",
  description: "Find trusted health articles on medicines, substitute generics, symptoms, and everyday healthcare curated to help you make informed decisions.",
  openGraph: {
    title: "Health & Medicine Information You Can Trust | Dawai24",
    description: "Explore verified healthcare articles, generic medicine guides, and wellness advice.",
  },
};

function estimateReadTime(text) {
  if (!text) return "3 min read";
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} min read`;
}

function formatDate(date) {
  if (!date) return "Recent";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return "Recent";
  }
}

export default async function BlogsPage() {
  let blogs = [];
  try {
    blogs = await db.cmsEntry.findMany({
      where: {
        type: "BLOG",
        active: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    blogs = [];
  }

  const featuredBlog = blogs.length > 0 ? blogs[0] : null;
  const compactBlogs = blogs.length > 1 ? blogs.slice(1, 5) : [];
  const gridBlogs = blogs.length > 5 ? blogs.slice(5) : (blogs.length > 1 ? blogs.slice(1) : []);

  // Standard health categories inspired by PlatinumRx
  const categories = [
    { title: "Generic Medicines", count: "12+ Reads", color: "from-blue-500/10 to-indigo-500/10", border: "border-blue-200" },
    { title: "Chronic & Heart Care", count: "8+ Reads", color: "from-rose-500/10 to-pink-500/10", border: "border-rose-200" },
    { title: "Diabetes Wellness", count: "10+ Reads", color: "from-amber-500/10 to-orange-500/10", border: "border-amber-200" },
    { title: "Daily Health & Nutrition", count: "15+ Reads", color: "from-emerald-500/10 to-teal-500/10", border: "border-emerald-200" },
  ];

  return (
    <div data-testid="blog-list-page" className="min-h-screen bg-[#FDFDFD] text-[#1E293B] font-sans antialiased pb-16">
      
      {/* 1. Breadcrumbs Strip */}
      <div className="border-b border-[#F1F5F9] bg-white">
        <div className="container-x py-3">
          <nav className="flex items-center gap-1.5 text-xs font-medium text-[#64748B]">
            <Link href="/" className="hover:text-[#FF6B5A] transition-colors">
              Home
            </Link>
            <ChevronRight size={13} className="text-[#94A3B8]" />
            <span className="text-[#0F172A] font-semibold">Blogs</span>
          </nav>
        </div>
      </div>

      {/* 2. Hero Section (Clean Warm PlatinumRx Style) */}
      <section 
        data-testid="blog-list-hero" 
        className="bg-[linear-gradient(110.69deg,#FFF4F2_0.47%,#F8FAFC_79.23%,#F1F5F9_104.61%)] border-b border-[#F1F5F9]"
      >
        <div className="container-x flex flex-col items-center gap-4 py-12 text-center md:gap-6 md:py-18">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1 text-xs font-bold text-[#FF6B5A] border border-[#FF6B5A]/20 shadow-2xs">
            <Sparkles size={14} /> Dawai24 Healthcare Knowledge Hub
          </span>
          <h1 
            data-testid="blog-list-hero-title" 
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] max-w-4xl tracking-tight leading-tight"
          >
            Health &amp; Medicine Information <span className="text-[#FF6B5A] block sm:inline">You Can Trust</span>
          </h1>
          <p className="text-sm sm:text-base text-[#64748B] max-w-2xl leading-relaxed">
            Find medically-verified articles on generic substitutes, medicine usages, preventive wellness, and everyday healthcare — written to help you make informed decisions.
          </p>
        </div>
      </section>

      {/* 3. Main Blogs Area */}
      <main className="container-x py-10 sm:py-12 space-y-12">
        {blogs.length === 0 ? (
          /* Empty State */
          <div className="mx-auto max-w-lg rounded-2xl border border-[#E2E8F0] bg-white p-10 text-center shadow-xs">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#FFF1EF] text-[#FF6B5A]">
              <BookOpen size={28} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#0F172A]">No Articles Found</h3>
            <p className="mt-2 text-xs sm:text-sm text-[#64748B]">
              We are preparing medical articles for you. Browse our medicines or check back soon.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/medicines" className="btn btn-primary text-xs sm:text-sm">
                Browse Medicines
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Top Section: Latest Health Articles (Featured Large + Compact 4 List) */}
            <section className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
                Latest Health Articles
              </h2>

              <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
                {/* Left: Featured Large Card */}
                {featuredBlog && (
                  <div data-testid="blog-list-featured" className="min-w-0 md:flex-1 w-full">
                    <Link 
                      href={`/blogs/${featuredBlog.slug || featuredBlog.id}`}
                      className="group flex w-full flex-col gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all duration-300"
                    >
                      <div className="relative h-[220px] sm:h-[280px] md:h-[340px] w-full overflow-hidden rounded-xl bg-slate-100">
                        {featuredBlog.imageUrl ? (
                          <img
                            src={featuredBlog.imageUrl}
                            alt={featuredBlog.title}
                            className="size-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="size-full flex items-center justify-center bg-[#FFF1EF] text-[#FF6B5A]">
                            <BookOpen size={48} className="opacity-40" />
                          </div>
                        )}
                        <span className="absolute top-3 left-3 rounded-full bg-[#0F172A]/85 backdrop-blur-sm px-3 py-1 text-[11px] font-bold text-white uppercase tracking-wider">
                          Featured
                        </span>
                      </div>

                      <div className="flex flex-col items-start gap-1.5 pt-1">
                        <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                          <span>{formatDate(featuredBlog.createdAt)}</span>
                          <span>•</span>
                          <span>{estimateReadTime(featuredBlog.body)}</span>
                        </div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#0F172A] group-hover:text-[#FF6B5A] transition-colors leading-snug">
                          {featuredBlog.title}
                        </h3>
                        {featuredBlog.subtitle && (
                          <p className="text-xs sm:text-sm text-[#64748B] line-clamp-2 leading-relaxed">
                            {featuredBlog.subtitle}
                          </p>
                        )}
                        <span className="mt-2 text-xs sm:text-sm font-bold text-[#FF6B5A] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          <span>Read full article</span>
                          <ArrowRight size={14} />
                        </span>
                      </div>
                    </Link>
                  </div>
                )}

                {/* Right: Compact Articles List (Like PlatinumRx right side) */}
                {compactBlogs.length > 0 && (
                  <div data-testid="blog-list-compact" className="flex min-w-0 flex-col gap-3.5 md:flex-1 w-full">
                    {compactBlogs.map((b) => (
                      <Link
                        key={b.id}
                        href={`/blogs/${b.slug || b.id}`}
                        className="group flex w-full items-center gap-4 rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs hover:shadow-sm hover:border-[#CBD5E1] transition-all"
                      >
                        <div className="relative h-[84px] w-[110px] sm:h-[96px] sm:w-[130px] shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          {b.imageUrl ? (
                            <img
                              src={b.imageUrl}
                              alt={b.title}
                              className="size-full object-cover group-hover:scale-105 transition duration-300"
                            />
                          ) : (
                            <div className="size-full flex items-center justify-center bg-[#FFF1EF] text-[#FF6B5A]">
                              <BookOpen size={24} className="opacity-40" />
                            </div>
                          )}
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
                          <p className="text-[11px] text-[#94A3B8]">
                            {formatDate(b.createdAt)}
                          </p>
                          <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] line-clamp-2 group-hover:text-[#FF6B5A] transition-colors leading-snug">
                            {b.title}
                          </h4>
                          <span className="mt-1 text-xs font-semibold text-[#FF6B5A] inline-flex items-center gap-0.5">
                            <span>Read article</span>
                            <ChevronRight size={12} />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Mid Section: Category Highlights */}
            <section className="space-y-5 pt-4">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
                Explore by Topics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((cat, idx) => (
                  <div 
                    key={idx}
                    className={`rounded-2xl border ${cat.border} bg-gradient-to-br ${cat.color} p-4 sm:p-5 flex flex-col justify-between hover:shadow-xs transition`}
                  >
                    <div>
                      <h4 className="font-bold text-[#0F172A] text-sm sm:text-base">{cat.title}</h4>
                      <p className="text-xs text-[#64748B] mt-0.5">{cat.count}</p>
                    </div>
                    <span className="mt-4 text-xs font-bold text-[#FF6B5A] inline-flex items-center gap-1">
                      Browse reads <ChevronRight size={12} />
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Bottom Section: Most Read Articles Grid (4 cols like PlatinumRx) */}
            {gridBlogs.length > 0 && (
              <section className="space-y-6 pt-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
                    Most Read Articles
                  </h2>
                  <span className="text-xs text-[#64748B]">
                    {gridBlogs.length} articles
                  </span>
                </div>

                <div data-testid="blog-list-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {gridBlogs.map((b) => (
                    <Link
                      key={b.id}
                      href={`/blogs/${b.slug || b.id}`}
                      className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-2xs hover:shadow-md hover:border-[#CBD5E1] transition-all"
                    >
                      <div className="relative aspect-400/260 w-full overflow-hidden bg-slate-100">
                        {b.imageUrl ? (
                          <img
                            src={b.imageUrl}
                            alt={b.title}
                            className="size-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        ) : (
                          <div className="size-full flex items-center justify-center bg-[#FFF1EF] text-[#FF6B5A]">
                            <BookOpen size={28} className="opacity-40" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col gap-2 p-4">
                        <div className="flex flex-col gap-1">
                          <p className="text-[11px] text-[#94A3B8]">
                            Updated {formatDate(b.updatedAt || b.createdAt)}
                          </p>
                          <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] line-clamp-2 group-hover:text-[#FF6B5A] transition-colors leading-snug">
                            {b.title}
                          </h4>
                        </div>
                        <span className="mt-auto pt-2 text-xs font-bold text-[#FF6B5A] inline-flex items-center gap-1">
                          <span>Read more</span>
                          <ChevronRight size={12} />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Smart Savings / Substitute Medicine Banner on Blogs Home */}
            <div className="rounded-2xl bg-gradient-to-r from-[#172A45] via-[#233A5E] to-[#1B2D4A] text-white p-6 sm:p-10 shadow-lg">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFC9C2]">
                    <TrendingDown size={16} className="text-[#FF6B5A]" /> Medicine Price Transparency
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
                    Never Overpay for Prescriptions Again
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    Substitute medicines share identical active pharmaceutical ingredients, strict safety standards, and bioequivalence with expensive branded medicines. Search your salt on Dawai24 to save up to 70%.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/medicines"
                    className="inline-flex items-center gap-2 rounded-full bg-[#FF6B5A] px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-[#F05543] shadow-md transition-colors"
                  >
                    <span>Search Substitute Medicines</span>
                    <ArrowRight size={15} />
                  </Link>
                  <Link
                    href="/upload-prescription"
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-white/20 transition-colors"
                  >
                    Upload Prescription
                  </Link>
                </div>
              </div>
            </div>

            {/* Medical Expert Panel Box */}
            <section className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F1F5F9]">
                <div>
                  <h3 className="text-lg font-bold text-[#0F172A]">Our Clinical Review Standards</h3>
                  <p className="text-xs text-[#64748B]">All Dawai24 articles are verified for medical veracity and clinical safety.</p>
                </div>
                <div className="flex items-center gap-2 text-[#16A34A] text-xs font-semibold">
                  <ShieldCheck size={18} />
                  <span>WHO-GMP & CDSCO Guidelines Compliant</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <div className="size-10 rounded-xl bg-[#FFF1EF] text-[#FF6B5A] flex items-center justify-center shrink-0">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0F172A]">Strict Salt Matching</h4>
                    <p className="text-xs text-[#64748B] mt-1 leading-relaxed">Exact therapeutic equivalence and active ingredient checks.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="size-10 rounded-xl bg-[#EBF7EE] text-[#16A34A] flex items-center justify-center shrink-0">
                    <Stethoscope size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0F172A]">Clinical Pharmacist Review</h4>
                    <p className="text-xs text-[#64748B] mt-1 leading-relaxed">Cross-referenced against verified pharmacological journals.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="size-10 rounded-xl bg-[#EFF6FF] text-[#3B82F6] flex items-center justify-center shrink-0">
                    <HeartHandshake size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0F172A]">Patient-Centric Clarity</h4>
                    <p className="text-xs text-[#64748B] mt-1 leading-relaxed">Clear dosage, side-effects, precautions, and savings guidance.</p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

    </div>
  );
}
