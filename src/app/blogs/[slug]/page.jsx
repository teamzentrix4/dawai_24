import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  BookOpen, 
  ChevronRight,
  Sparkles,
  BookmarkCheck,
  Building2,
  Stethoscope,
  ListOrdered,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Award,
  TrendingDown,
  Layers,
  Share2,
  FileText,
  BadgeAlert,
  Search,
  ExternalLink
} from "lucide-react";
import BlogShareButtons from "@/components/Blog/BlogShareButtons";
import ArticleStickyNav from "@/components/Blog/ArticleStickyNav";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (!slug) {
    return {
      title: "Blog Article Not Found | Dawai24",
      description: "The requested healthcare article could not be found on Dawai24.",
    };
  }

  try {
    const blog = await db.cmsEntry.findFirst({
      where: {
        type: "BLOG",
        active: true,
        OR: [{ slug: slug }, { id: slug }],
      },
    });

    if (!blog) {
      return {
        title: "Blog Article Not Found | Dawai24",
        description: "The requested healthcare article could not be found on Dawai24.",
      };
    }

    return {
      title: `${blog.title} | Dawai24 Health Blog`,
      description: blog.subtitle || blog.body?.slice(0, 160) || "Read this healthcare article on Dawai24.",
      openGraph: {
        title: `${blog.title} | Dawai24`,
        description: blog.subtitle || blog.body?.slice(0, 160) || "",
        images: blog.imageUrl ? [{ url: blog.imageUrl }] : [],
      },
    };
  } catch (err) {
    return {
      title: "Health Blog | Dawai24",
      description: "Read helpful healthcare guides and wellness articles on Dawai24.",
    };
  }
}

function estimateReadTime(text) {
  if (!text) return "4 min read";
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} min read`;
}

function formatDate(date) {
  if (!date) return "Recent";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return "Recent";
  }
}

function formatShortDate(date) {
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

// Helper to extract sections from body for table of contents
function parseSections(body) {
  if (!body) return [];
  const lines = body.split("\n");
  const sections = [];
  let currentHeader = null;
  let currentContent = [];

  for (const line of lines) {
    const trimmed = line.trim();
    const isHeading = 
      trimmed.startsWith("#") || 
      trimmed.startsWith("##") || 
      (trimmed.length > 5 && trimmed.length < 80 && (trimmed.endsWith(":") || trimmed.endsWith("?") || /^\d+\.\s+[A-Z]/.test(trimmed)));

    if (isHeading) {
      if (currentHeader) {
        sections.push({
          title: currentHeader,
          id: currentHeader.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
          content: currentContent.join("\n").trim(),
        });
        currentContent = [];
      }
      currentHeader = trimmed.replace(/^#+\s*/, "");
    } else {
      currentContent.push(line);
    }
  }

  if (currentHeader) {
    sections.push({
      title: currentHeader,
      id: currentHeader.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      content: currentContent.join("\n").trim(),
    });
  }

  return sections;
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  if (!slug) notFound();

  let blog = null;
  let relatedBlogs = [];

  try {
    blog = await db.cmsEntry.findFirst({
      where: {
        type: "BLOG",
        active: true,
        OR: [{ slug: slug }, { id: slug }],
      },
    });

    if (!blog) {
      notFound();
    }

    relatedBlogs = await db.cmsEntry.findMany({
      where: {
        type: "BLOG",
        active: true,
        id: { not: blog.id },
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Error fetching blog details:", error);
    notFound();
  }

  const sections = parseSections(blog.body);
  const paragraphs = (blog.body || "").split("\n\n").filter(Boolean);

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1E293B] font-sans antialiased">
      {/* 1. Breadcrumbs Strip (Clean & Exact like PlatinumRx) */}
      <div className="border-b border-[#F1F5F9] bg-white">
        <div className="container-x py-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-medium text-[#64748B]">
            <Link href="/" className="hover:text-[#FF6B5A] transition-colors">
              Home
            </Link>
            <ChevronRight size={13} className="text-[#94A3B8]" />
            <Link href="/blogs" className="hover:text-[#FF6B5A] transition-colors">
              Blogs
            </Link>
            <ChevronRight size={13} className="text-[#94A3B8]" />
            <span className="text-[#0F172A] font-medium truncate max-w-[240px] sm:max-w-md">
              {blog.title}
            </span>
          </nav>
        </div>
      </div>

      {/* 2. Main Article Content Container */}
      <main className="container-x py-6 md:py-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10 items-start">
          
          {/* Main Column (max-w-[793px] like PlatinumRx) */}
          <div className="min-w-0 flex-1 lg:max-w-[800px] w-full">
            
            {/* ARTICLE HERO HEADER */}
            <header data-testid="article-hero" className="flex flex-col gap-4 md:gap-5 pb-5">
              <div className="flex flex-col gap-2.5">
                {/* Title */}
                <h1 
                  data-testid="article-hero-title" 
                  className="text-2xl sm:text-3xl md:text-[34px] font-extrabold text-[#0F172A] leading-[1.25] tracking-tight"
                >
                  {blog.title}
                </h1>

                {/* Subtitle if available */}
                {blog.subtitle && (
                  <p className="text-sm sm:text-base text-[#475569] font-normal leading-relaxed">
                    {blog.subtitle}
                  </p>
                )}

                {/* Meta row: Last Updated & Share Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <p data-testid="article-hero-updated-at" className="text-xs text-[#64748B]">
                      Last Updated:&nbsp;
                      <span className="font-semibold text-[#0F172A]">
                        {formatDate(blog.updatedAt || blog.createdAt)}
                      </span>
                    </p>
                    <span className="text-[#CBD5E1]">•</span>
                    <span className="text-xs text-[#64748B] flex items-center gap-1">
                      <Clock size={12} className="text-[#94A3B8]" />
                      {estimateReadTime(blog.body)}
                    </span>
                  </div>

                  <div data-testid="article-hero-share" className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#64748B]">Share:</span>
                    <BlogShareButtons title={blog.title} />
                  </div>
                </div>
              </div>

              {/* Cover Image Desktop (h-[400px] rounded-2xl object-cover) */}
              {blog.imageUrl && (
                <div 
                  data-testid="article-hero-cover" 
                  className="relative hidden h-[380px] md:h-[420px] w-full overflow-hidden rounded-2xl md:block bg-slate-100 border border-[#E2E8F0]"
                >
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="size-full object-cover"
                  />
                </div>
              )}
            </header>

            {/* Mobile Cover Image */}
            {blog.imageUrl && (
              <div className="relative h-[220px] w-full overflow-hidden rounded-xl md:hidden mb-4 bg-slate-100 border border-[#E2E8F0]">
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="size-full object-cover"
                />
              </div>
            )}

            {/* ARTICLE SECTION NAVIGATION (Sticky Horizontal Pill Bar) */}
            {sections.length > 0 && (
              <ArticleStickyNav sections={sections} />
            )}

            {/* MOBILE ONLY: Professional Box */}
            <div data-testid="article-professionals-mobile" className="md:hidden my-4 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs space-y-3">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-[#FFF1EF] text-[#FF6B5A] flex items-center justify-center shrink-0 font-bold text-xs border border-[#FF6B5A]/20">
                    <UserCheck size={18} />
                  </div>
                  <div className="text-xs italic leading-tight">
                    <p className="text-[#94A3B8] text-[11px] uppercase tracking-wide font-medium not-italic">Written by:</p>
                    <span className="font-semibold text-[#0F172A] not-italic">Dawai24 Healthcare Team</span>
                    <p className="text-[11px] text-[#64748B] not-italic">Clinical Research & Content</p>
                  </div>
                </div>

                <div className="h-px w-full bg-[#F1F5F9]" />

                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-[#EBF7EE] text-[#16A34A] flex items-center justify-center shrink-0 font-bold text-xs border border-[#16A34A]/20">
                    <Stethoscope size={18} />
                  </div>
                  <div className="text-xs italic leading-tight">
                    <p className="text-[#94A3B8] text-[11px] uppercase tracking-wide font-medium not-italic">Reviewed by:</p>
                    <span className="font-semibold text-[#0F172A] not-italic">Dr. Dawai24 Medical Board</span>
                    <p className="text-[11px] text-[#16A34A] font-medium not-italic">Verified for Medical Accuracy</p>
                  </div>
                </div>
              </div>
              <div className="h-px w-full bg-[#F1F5F9]" />
              <p className="text-[11px] text-[#64748B] italic">
                Published date: <span className="font-medium text-[#0F172A] not-italic">{formatShortDate(blog.createdAt)}</span>
              </p>
            </div>

            {/* ARTICLE BODY & SECTIONS */}
            <div id="article-body" data-testid="article-body" className="mt-4 flex flex-col gap-6 md:gap-8">
              {sections.length > 0 ? (
                <div className="flex flex-col gap-8">
                  {sections.map((sec, idx) => (
                    <section 
                      key={idx} 
                      id={sec.id} 
                      data-slot="section-anchor" 
                      data-testid={`article-section-${sec.id}`}
                      className="scroll-mt-28"
                    >
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#0F172A] pb-2 border-b border-[#F1F5F9] flex items-center gap-2">
                        {sec.title}
                      </h2>
                      <div className="mt-3 flex flex-col gap-3 text-sm sm:text-base leading-relaxed text-[#334155]">
                        {sec.content.split("\n\n").map((p, pIdx) => {
                          const pTrim = p.trim();
                          if (pTrim.startsWith("-") || pTrim.startsWith("•")) {
                            const listItems = pTrim.split("\n").filter(Boolean);
                            return (
                              <ul key={pIdx} className="my-2 list-disc pl-5 space-y-1.5 text-[#334155]">
                                {listItems.map((li, liIdx) => (
                                  <li key={liIdx}>{li.replace(/^[-•]\s*/, "")}</li>
                                ))}
                              </ul>
                            );
                          }
                          return (
                            <p key={pIdx} className="whitespace-pre-line text-[#334155]">
                              {pTrim}
                            </p>
                          );
                        })}
                      </div>
                    </section>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4 text-sm sm:text-base leading-relaxed text-[#334155]">
                  {paragraphs.map((p, idx) => (
                    <p key={idx} className="whitespace-pre-line">{p}</p>
                  ))}
                </div>
              )}

              {/* SAVINGS & GENERIC MEDICINE HIGHLIGHT BANNER */}
              <div className="my-4 rounded-2xl bg-gradient-to-r from-[#FFF1EF] via-[#FFEAE6] to-[#FFF5F4] p-5 sm:p-7 border border-[#FF6B5A]/20 shadow-xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-xl">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF6B5A]">
                      <Sparkles size={14} /> Dawai24 Smart Savings
                    </span>
                    <h3 className="font-extrabold text-[#0F172A] text-base sm:text-lg">
                      Save Up to 70% on Substitute Generic Medicines
                    </h3>
                    <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                      Substitute medicines carry identical active salts, therapeutic potency, and safety standard at a fraction of brand-name costs.
                    </p>
                  </div>
                  <Link
                    href="/medicines"
                    className="shrink-0 inline-flex items-center gap-2 rounded-full bg-[#FF6B5A] px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#F05543] shadow-xs transition-colors"
                  >
                    <span>Search Medicines</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* MEDICAL DISCLAIMER */}
              <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-xs text-[#64748B]">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle size={17} className="text-[#FF6B5A] shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong className="text-[#0F172A]">Medical Disclaimer:</strong> This article is published for educational and general information purposes only. It is not designed to substitute clinical diagnosis, prescription, or physician consultation. Consult your doctor or certified pharmacist before modifying any medication regimen.
                  </p>
                </div>
              </div>

              {/* Back Link */}
              <div className="pt-4 flex items-center justify-between border-t border-[#F1F5F9]">
                <Link
                  href="/blogs"
                  className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-5 py-2 text-xs sm:text-sm font-semibold text-[#0F172A] hover:border-[#FF6B5A] hover:text-[#FF6B5A] transition-colors shadow-2xs"
                >
                  <ArrowLeft size={15} />
                  <span>Back to All Blogs</span>
                </Link>
              </div>
            </div>

          </div>

          {/* Right Sidebar (w-[384px] like PlatinumRx sticky top-28) */}
          <aside className="hidden w-[360px] lg:w-[384px] shrink-0 md:block">
            <div className="sticky top-28 space-y-4">
              
              {/* 1. Professionals (Author + Doctor Box) */}
              <div 
                data-testid="article-professionals" 
                className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs space-y-3"
              >
                <div className="flex flex-col gap-3">
                  {/* Pharmacist / Writer */}
                  <div data-testid="article-professionals-pharmacist" className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-[#FFF1EF] text-[#FF6B5A] flex items-center justify-center shrink-0 font-bold text-xs border border-[#FF6B5A]/20">
                      <UserCheck size={18} />
                    </div>
                    <div className="text-xs leading-tight">
                      <p className="text-[#94A3B8] text-[11px] uppercase tracking-wide font-medium">Written by:</p>
                      <h4 className="font-bold text-[#0F172A]">Dawai24 Healthcare Team</h4>
                      <p className="text-[11px] text-[#64748B]">Pharmaceutical Research & Insights</p>
                    </div>
                  </div>

                  <div className="h-px w-full bg-[#F1F5F9]" />

                  {/* Doctor Reviewer */}
                  <div data-testid="article-professionals-doctor" className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-[#EBF7EE] text-[#16A34A] flex items-center justify-center shrink-0 font-bold text-xs border border-[#16A34A]/20">
                      <Stethoscope size={18} />
                    </div>
                    <div className="text-xs leading-tight">
                      <p className="text-[#94A3B8] text-[11px] uppercase tracking-wide font-medium">Reviewed by:</p>
                      <h4 className="font-bold text-[#0F172A]">Dr. Dawai24 Medical Board</h4>
                      <p className="text-[11px] text-[#16A34A] font-medium">Verified for Clinical Safety</p>
                    </div>
                  </div>
                </div>

                <div className="h-px w-full bg-[#F1F5F9]" />

                <p data-testid="article-professionals-published-at" className="text-[11px] text-[#64748B] italic">
                  Published date: <span className="font-semibold text-[#0F172A] not-italic">{formatShortDate(blog.createdAt)}</span>
                </p>
              </div>

              {/* 2. Editorial Policy & Report Error Box */}
              <div className="flex w-full flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs">
                <div data-slot="editorial-policy" className="flex w-full items-center gap-3">
                  <div className="size-8 rounded-lg bg-[#EBF7EE] text-[#16A34A] flex items-center justify-center shrink-0">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0F172A]">Authentic & Trustworthy Information</div>
                    <div className="text-xs text-[#FF6B5A] font-medium hover:underline">
                      <Link href="/about">Read our Editorial Policy</Link>
                    </div>
                  </div>
                </div>

                <div className="h-px w-full bg-[#F1F5F9]" />

                <div data-slot="report-an-error" className="flex w-full items-center gap-3">
                  <div className="size-8 rounded-lg bg-[#F8FAFC] text-[#64748B] flex items-center justify-center shrink-0 border border-[#E2E8F0]">
                    <BadgeAlert size={17} />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[#0F172A]">Having issues with content?</div>
                    <Link href="/contact" className="text-xs text-[#FF6B5A] font-semibold hover:underline">
                      Report Error or Suggest Update
                    </Link>
                  </div>
                </div>
              </div>

              {/* 3. Dawai24 Order & Search Widget */}
              <div className="rounded-xl border border-[#E2E8F0] bg-gradient-to-br from-[#172A45] to-[#233A5E] text-white p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2.5">
                  <Building2 size={20} className="text-[#FF6B5A]" />
                  <h3 className="font-bold text-sm">Need Safe Generic Medicines?</h3>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Compare brand names and certified substitute medicines with identical salts on Dawai24.
                </p>
                <div className="pt-1 flex flex-col gap-2">
                  <Link
                    href="/medicines"
                    className="w-full text-center rounded-lg bg-[#FF6B5A] py-2 text-xs font-bold text-white hover:bg-[#F05543] transition-colors"
                  >
                    Compare Medicines & Save
                  </Link>
                  <Link
                    href="/upload-prescription"
                    className="w-full text-center rounded-lg bg-white/10 border border-white/20 py-2 text-xs font-bold text-white hover:bg-white/20 transition-colors"
                  >
                    Upload Prescription
                  </Link>
                </div>
              </div>

              {/* 4. Related Blogs List */}
              {relatedBlogs.length > 0 && (
                <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                    <h3 className="font-bold text-[#0F172A] text-sm">Recent Articles</h3>
                    <Link href="/blogs" className="text-xs font-semibold text-[#FF6B5A] hover:underline">
                      View all
                    </Link>
                  </div>

                  <div className="divide-y divide-[#F1F5F9]">
                    {relatedBlogs.map((rel) => (
                      <Link
                        key={rel.id}
                        href={`/blogs/${rel.slug || rel.id}`}
                        className="group flex items-start gap-3 py-2.5 first:pt-1 last:pb-0"
                      >
                        {rel.imageUrl ? (
                          <div className="size-14 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-[#E2E8F0]">
                            <img
                              src={rel.imageUrl}
                              alt={rel.title}
                              className="size-full object-cover group-hover:scale-105 transition duration-300"
                            />
                          </div>
                        ) : (
                          <div className="size-14 rounded-lg bg-[#FFF1EF] text-[#FF6B5A] flex items-center justify-center shrink-0 font-bold text-xs">
                            <BookOpen size={18} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] text-[#94A3B8]">{formatShortDate(rel.createdAt)}</p>
                          <h4 className="text-xs font-semibold text-[#0F172A] line-clamp-2 group-hover:text-[#FF6B5A] transition-colors">
                            {rel.title}
                          </h4>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}
