import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { 
  ShieldCheck, 
  ChevronRight,
  BookOpen,
  ArrowLeft,
  AlertTriangle,
  BadgeAlert
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
        title: "Understanding the Perception of Generic Medicine Online Quality | Dawai24",
        description: "Learn about the efficacy, safety, and regulatory standards of buying generic medicines online in India.",
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
  } catch {
    return {
      title: "Health Blog | Dawai24",
      description: "Read helpful healthcare guides and wellness articles on Dawai24.",
    };
  }
}

function formatDate(date) {
  if (!date) return "September 10, 2026";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return "September 10, 2026";
  }
}

function formatShortDate(date) {
  if (!date) return "10-Sept-2026";
  try {
    const d = new Date(date);
    const day = d.getDate();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return "10-Sept-2026";
  }
}

function parseSections(body) {
  if (!body) return [];
  const lines = body.split("\n");
  const sections = [];
  let currentHeader = null;
  let currentContent = [];

  for (const line of lines) {
    const trimmed = line.trim();
    const isHeading = 
      trimmed.startsWith("## ") || 
      trimmed.startsWith("# ") ||
      (trimmed.length > 5 && trimmed.length < 80 && (trimmed.endsWith(":") || trimmed.endsWith("?")));

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

    relatedBlogs = await db.cmsEntry.findMany({
      where: {
        type: "BLOG",
        active: true,
        ...(blog ? { id: { not: blog.id } } : {}),
      },
      take: 4,
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Error fetching blog details:", error);
  }

  // Fallback content matching the reference topic if database row is missing or empty
  if (!blog) {
    blog = {
      id: "ref-default",
      title: "Understanding the Perception of Generic Medicine Online Quality",
      subtitle: "Buying medicines online in the digital era has transformed how health care is accessed. With just a click of a button, patients can now access various drugs, including generic ones, correctly at their doorsteps.",
      body: `Buying medicines online in the digital era has transformed how health care is accessed. With just a click of a button, patients can now access various drugs, including generic ones, correctly at their doorsteps. As much as purchasing generic medicine online is convenient, many individuals still doubt the grade and trustworthiness of these medicines.

This blog will dismantle some standard perceptions about the quality of generic medicines bought online and explain what you should know when you purchase such medicines.

## A generic medicine — is it effective?
Generic drugs contain active ingredients, dosage and strength similar to branded versions. They have the same potency as branded medicines but are more reasonable.

For instance, your doctor prescribes a branded painkiller. The generic will provide the same pain relief and will not cost that much. The medicines appear when the patent of a branded version expires so that manufacturers and dealers may also produce and sell them.

## Generic Medicine Online? Reliable much?
Purchasing generic medicine online is a very convenient alternative, which is why it has become prevalent.

Here’s why:
- Cost Savings: Generic medicines cost less than branded drugs, and online drugstores often present extra discounts, cashback, or subscription bargains.
- Accessibility: Online platforms permit access to a wide range of medicines, even to people living far from cities or in less developed countries.
- Convenience: You can save yourself the trouble of going from one physical pharmacy to another by ordering your medication from the comfort of your home.
- Transparency: Online platforms allow you to compare prices, read their reviews, and check product details before purchasing.

## Perception of Effectiveness and Quality: Familiar Concerns
Despite these benefits, many patients still doubt buying generic medicines online due to their quality.

Let’s try to dispel some of these concerns:

1. Are Online Generic Medications Equally as Powerful as the Branded Ones?
Yes, generic medicines sold online are as effective as their branded counterparts. Regulatory authorities like the FDA and CDSCO ensure that generic medicines meet strict safety, efficacy, and quality standards. The active ingredient of the generic medicine contains the same element as its brand-name counterpart and thus offers precisely the same therapeutic benefit.

2. Can One Trust Online Pharmacies?
There is a massive variance between online pharmacy sites; a few are legitimate, with high-quality control standards, while others might be unverified platforms selling counterfeit or sub-standard medicines.

3. Are Generic Medicines Safe?
Generic medicines undergo rigorous testing and adhere to similar regulatory requirements as branded drugs. However, unless medicine is bought from a licensed provider, it may result in safety issues.

## Ensuring Quality While Buying Generic Medicines Online
Set your mind at ease regarding these issues and make certain you get excellent generic medicines by following these steps:
- Choose Reputable Online Pharmacies: Use reputed platforms like Dawai24. These are known to source their products from certified manufacturers and maintain stringent quality standards.
- Check the regulatory approvals: Look for approval from health authorities, such as CDSCO in India or the FDA of other countries, regarding the medicine being used.
- Customer Reviews: Customer reviews are insights into the platform’s reliability, product quality, and delivery efficiency.
- Check Packaging and Expiry Dates: Upon delivery, check for evidence of tampering. Ensure that the medicine has an explicit, valid expiry date.
- Consult Your Doctor or Pharmacist: If you are unsure about changing to a generic drug, consult your healthcare provider.

## Benefits of Buying Generic Medication Online
Buying generic medicine online saves money and improves access to essential healthcare. Here’s how:
- Affordability: Generic medicines are significantly cheaper than branded drugs, making them accessible to a larger population.
- Ease of Access: Online platforms stock various medicines, ensuring availability even for less common treatments.
- Time-Saving: Skip the lines and deliver your prescriptions to your doorstep, often with expedited shipping options.
- Transparent Pricing: Online pharmacies facilitate price comparisons with other brands for the best economic deal.

## Breaking the Stigma of Generic Medicines Online
Most people believe in the inferior quality of generic medicines over branded drugs because of incorrect information.

As a fact:
Generic medicines are just as effective and undergo the same rigorous testing. Generic medicines are produced using the same active ingredients and under strict quality standards. The lower price of generic medicines is not due to a compromise in quality but to reduced marketing and R&D expenses.

## Conclusion: Empowering Choices for Healthcare
Buying generic medicine online opens an entirely new world of affordability, accessibility, and convenience. Quality is a concern but can be minimized by using reputable platforms and taking safety precautions.

By understanding facts and handling common misconceptions, one can confidently make informed choices regarding their health. Welcome the convenience an online pharmacy provides, ensuring affordable healthcare without compromising quality.`,
      imageUrl: "/img/why-substitute-hero.png",
      createdAt: new Date("2026-09-10T09:19:01.187Z"),
      updatedAt: new Date("2026-09-10T09:19:01.187Z")
    };
  }

  const sections = parseSections(blog.body);

  return (
    <div className="min-h-screen bg-white text-[#171725] font-sans antialiased">
      
      {/* 1. Breadcrumbs Strip (Clean, border-bottom, identical to PlatinumRx) */}
      <div data-slot="blog-breadcrumbs" className="border-b border-[#F0F2F5] bg-[#FAFBFD]/60">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-2.5">
          <nav aria-label="breadcrumb" data-slot="breadcrumb" className="flex items-center min-w-0">
            <ol data-slot="breadcrumb-list" className="flex items-center gap-1.5 text-xs text-[#8E8E93] min-w-0 flex-nowrap truncate">
              <li data-slot="breadcrumb-item" className="inline-flex items-center gap-1 shrink-0">
                <Link data-slot="breadcrumb-link" href="/" className="hover:text-[#FF6B5A] transition-colors">
                  Home
                </Link>
              </li>
              <li data-slot="breadcrumb-separator" role="presentation" aria-hidden="true" className="shrink-0 text-[#C7C7CC]">
                <ChevronRight size={13} />
              </li>
              <li data-slot="breadcrumb-item" className="inline-flex items-center gap-1 shrink-0">
                <Link data-slot="breadcrumb-link" href="/blogs" className="hover:text-[#FF6B5A] transition-colors">
                  Blogs
                </Link>
              </li>
              <li data-slot="breadcrumb-separator" role="presentation" aria-hidden="true" className="shrink-0 text-[#C7C7CC]">
                <ChevronRight size={13} />
              </li>
              <li data-slot="breadcrumb-item" className="min-w-0 truncate font-normal text-[#171725]">
                <span data-slot="breadcrumb-page" className="truncate block">
                  {blog.title}
                </span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* 2. Main Article Page (Exact PlatinumRx layout: max-w-[1240px], 793px main column, 384px sidebar) */}
      <div data-testid="article-page" className="max-w-[1240px] mx-auto px-4 sm:px-6 pb-16">
        <div className="flex flex-col gap-6 pt-4 md:flex-row md:gap-10 md:pt-6">
          
          {/* Left / Main Column: Max width 793px like PlatinumRx */}
          <div className="min-w-0 flex-1 md:max-w-[793px]">
            <header data-testid="article-hero" className="flex flex-col gap-3 md:gap-5">
              <div className="flex flex-col gap-2">
                
                {/* Title */}
                <h1 
                  data-testid="article-hero-title" 
                  className="text-[22px] sm:text-[28px] md:text-[32px] font-bold text-[#171725] leading-[1.3] tracking-tight"
                >
                  {blog.title}
                </h1>

                {/* Subtitle if available */}
                {blog.subtitle && (
                  <p className="text-xs sm:text-sm text-[#696974] leading-relaxed">
                    {blog.subtitle}
                  </p>
                )}

                {/* Meta Row: Last Updated + Share Icons */}
                <div className="flex items-center justify-between gap-3 pt-1 border-b border-[#F0F2F5] pb-3">
                  <p data-testid="article-hero-updated-at" className="text-xs text-[#92929D]">
                    Last Updated:&nbsp;
                    <span className="text-[#171725] font-medium">
                      {formatDate(blog.updatedAt || blog.createdAt)}
                    </span>
                  </p>

                  <div data-testid="article-hero-share" className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-[#696974]">Share</span>
                    <BlogShareButtons title={blog.title} />
                  </div>
                </div>
              </div>

              {/* Cover Image Desktop (h-[380px] to [400px] rounded-2xl object-cover) */}
              {blog.imageUrl && (
                <div 
                  data-testid="article-hero-cover" 
                  className="relative hidden h-[380px] md:h-[400px] overflow-hidden rounded-2xl md:block bg-slate-50 border border-[#E9ECEF]"
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
              <div className="relative h-[220px] w-full overflow-hidden rounded-xl md:hidden my-3 bg-slate-50 border border-[#E9ECEF]">
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="size-full object-cover"
                />
              </div>
            )}

            {/* Mobile Only: Written by & Reviewed by Card */}
            <div 
              data-testid="article-professionals-mobile" 
              className="border border-[#E9ECEF] bg-white rounded-xl flex flex-col gap-3 px-4 py-3.5 md:hidden my-4 shadow-2xs"
            >
              <div className="flex flex-col gap-2.5">
                <div data-testid="article-professionals-pharmacist" className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-[#FFF1EF] text-[#FF6B5A] flex items-center justify-center shrink-0 font-bold text-xs border border-[#FF6B5A]/20">
                    <BookOpen size={16} />
                  </div>
                  <div className="text-xs flex min-w-0 flex-col gap-0.5 leading-4 italic">
                    <p className="text-[#92929D] not-italic">Written by:</p>
                    <span className="text-[#171725] font-semibold not-italic">Susmita Maity, B pharmacy</span>
                  </div>
                </div>

                <div className="h-px w-full bg-[#F0F2F5]" />

                <div data-testid="article-professionals-doctor" className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-[#EBF7EE] text-[#16A34A] flex items-center justify-center shrink-0 font-bold text-xs border border-[#16A34A]/20">
                    <ShieldCheck size={16} />
                  </div>
                  <div className="text-xs flex min-w-0 flex-col gap-0.5 leading-4 italic">
                    <p className="text-[#92929D] not-italic">Reviewed by:</p>
                    <span className="text-[#171725] font-semibold not-italic">Dr. Devika Rani, MBBS</span>
                  </div>
                </div>
              </div>

              <div className="h-px w-full bg-[#F0F2F5]" />

              <p data-testid="article-professionals-published-at" className="text-[11px] text-[#92929D] italic">
                Published date: <span className="text-[#171725] font-medium not-italic">{formatShortDate(blog.createdAt)}</span>
              </p>
            </div>

            {/* Article Body Container */}
            <div id="article-body" className="mt-4 flex flex-col gap-4 md:mt-6 md:gap-6">
              
              {/* Sticky Horizontal Section Navigation Bar (like PlatinumRx) */}
              {sections.length > 0 && (
                <ArticleStickyNav sections={sections} />
              )}

              {/* Formatted Article Content */}
              <div className="flex flex-col gap-8 text-[14px] sm:text-[15px] leading-relaxed text-[#475569]">
                {sections.length > 0 ? (
                  sections.map((sec, idx) => (
                    <section 
                      key={idx} 
                      id={sec.id} 
                      data-slot="section-anchor" 
                      data-testid={`article-section-${sec.id}`}
                      className="scroll-mt-32"
                    >
                      <h2 className="text-[18px] sm:text-[22px] font-bold text-[#171725] pb-2 border-b border-[#F0F2F5]">
                        {sec.title}
                      </h2>
                      <div className="mt-3 flex flex-col gap-3.5 leading-relaxed text-[#475569]">
                        {sec.content.split("\n\n").map((p, pIdx) => {
                          const pTrim = p.trim();
                          if (pTrim.startsWith("-") || pTrim.startsWith("•")) {
                            const listItems = pTrim.split("\n").filter(Boolean);
                            return (
                              <ul key={pIdx} className="my-2 list-disc pl-5 space-y-1.5 text-[#475569]">
                                {listItems.map((li, liIdx) => (
                                  <li key={liIdx}>{li.replace(/^[-•]\s*/, "")}</li>
                                ))}
                              </ul>
                            );
                          }
                          return (
                            <p key={pIdx} className="whitespace-pre-line">
                              {pTrim}
                            </p>
                          );
                        })}
                      </div>
                    </section>
                  ))
                ) : (
                  (blog.body || "").split("\n\n").map((p, idx) => (
                    <p key={idx} className="whitespace-pre-line">{p}</p>
                  ))
                )}
              </div>

              {/* Safe & Authentic Guarantee Card */}
              <div className="my-6 rounded-2xl bg-gradient-to-r from-[#FFF1EF] to-[#FFF8F6] p-5 sm:p-7 border border-[#FF6B5A]/20 shadow-xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF6B5A]">
                      Dawai24 Quality Commitment
                    </span>
                    <h3 className="font-bold text-[#171725] text-base sm:text-lg">
                      Same Salt. Same Potency. Smaller Bill.
                    </h3>
                    <p className="text-xs sm:text-sm text-[#696974] leading-relaxed max-w-lg">
                      Substitute medicines share identical active pharmaceutical ingredients, strict safety standards, and bioequivalence with expensive branded medicines.
                    </p>
                  </div>
                  <Link
                    href="/medicines"
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-[#FF6B5A] px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#e05646] shadow-xs transition-colors cursor-pointer"
                  >
                    <span>Search Substitute Medicines</span>
                  </Link>
                </div>
              </div>

              {/* Medical Disclaimer */}
              <div className="rounded-xl border border-[#E9ECEF] bg-[#FAFBFD] p-4 text-xs text-[#92929D]">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle size={16} className="text-[#FF6B5A] shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong className="text-[#171725]">Medical Disclaimer:</strong> This article is published for educational and general information purposes only. It is not intended to substitute professional medical advice, clinical diagnosis, or physician consultation. Always consult your doctor or registered healthcare provider before modifying any medication regimen.
                  </p>
                </div>
              </div>

              {/* Bottom Back to blogs link */}
              <div className="pt-4 flex items-center justify-between border-t border-[#F0F2F5]">
                <Link
                  href="/blogs"
                  className="inline-flex items-center gap-2 rounded-full border border-[#E9ECEF] bg-white px-5 py-2 text-xs font-semibold text-[#171725] hover:border-[#FF6B5A] hover:text-[#FF6B5A] transition-colors shadow-2xs"
                >
                  <ArrowLeft size={14} />
                  <span>Back to All Blogs</span>
                </Link>
              </div>

            </div>
          </div>

          {/* Right Sidebar: 384px exact width like PlatinumRx sticky top-32 */}
          <aside className="hidden w-[384px] shrink-0 md:block">
            <div className="sticky top-28 space-y-4">
              
              {/* 1. Professionals (Written by & Reviewed by) */}
              <div 
                data-testid="article-professionals" 
                className="border border-[#E9ECEF] bg-white rounded-xl flex flex-col gap-2.5 px-4 py-3.5 shadow-2xs"
              >
                <div className="flex flex-col gap-2.5">
                  <div data-testid="article-professionals-pharmacist" className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-[#FFF1EF] text-[#FF6B5A] flex items-center justify-center shrink-0 font-bold text-xs border border-[#FF6B5A]/20">
                      <BookOpen size={15} />
                    </div>
                    <div className="text-xs flex min-w-0 flex-col gap-0.5 leading-4 italic">
                      <p className="text-[#92929D] not-italic">Written by:</p>
                      <span className="text-[#171725] font-semibold underline underline-offset-2 not-italic">
                        Susmita Maity, B pharmacy
                      </span>
                    </div>
                  </div>

                  <div className="h-px w-full bg-[#F0F2F5]" />

                  <div data-testid="article-professionals-doctor" className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-[#EBF7EE] text-[#16A34A] flex items-center justify-center shrink-0 font-bold text-xs border border-[#16A34A]/20">
                      <ShieldCheck size={15} />
                    </div>
                    <div className="text-xs flex min-w-0 flex-col gap-0.5 leading-4 italic">
                      <p className="text-[#92929D] not-italic">Reviewed by:</p>
                      <span className="text-[#171725] font-semibold underline underline-offset-2 not-italic">
                        Dr. Devika Rani, MBBS
                      </span>
                    </div>
                  </div>
                </div>

                <div className="h-px w-full bg-[#F0F2F5]" />

                <p data-testid="article-professionals-published-at" className="text-[11px] text-[#92929D] italic">
                  Published date: <span className="text-[#171725] font-medium not-italic">{formatShortDate(blog.createdAt)}</span>
                </p>
              </div>

              {/* 2. Editorial Policy & Report Error Box */}
              <div className="flex w-full flex-col gap-2.5 rounded-xl border border-[#E9ECEF] bg-white p-4 shadow-2xs">
                <div data-slot="editorial-policy" className="flex w-full items-center gap-3">
                  <div className="size-8 rounded-lg bg-[#EBF7EE] text-[#16A34A] flex items-center justify-center shrink-0">
                    <ShieldCheck size={17} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#171725]">Authentic &amp; Trustworthy Information</div>
                    <div className="text-xs text-[#FF6B5A] font-medium hover:underline">
                      <Link href="/about-us">Read our Editorial Policy</Link>
                    </div>
                  </div>
                </div>

                <div className="h-px w-full bg-[#F0F2F5]" />

                <div data-slot="report-an-error" className="flex w-full items-center gap-3">
                  <div className="size-8 rounded-lg bg-[#FAFBFD] text-[#92929D] flex items-center justify-center shrink-0 border border-[#E9ECEF]">
                    <BadgeAlert size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[#171725]">Having issues with content?</div>
                    <Link href="/contact-us" className="text-xs text-[#FF6B5A] font-semibold hover:underline">
                      Report Error or Suggest Update
                    </Link>
                  </div>
                </div>
              </div>

              {/* 3. Dawai24 Preferred Source Banner */}
              <div
                data-slot="preferred-source-google"
                className="bg-white flex items-center gap-4 rounded-xl border border-[#E9ECEF] px-4 py-3.5 shadow-2xs"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 48 48"
                  fill="none"
                  className="shrink-0"
                >
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <p className="text-xs font-bold text-[#171725] leading-snug">
                  Add <span className="text-[#FF6B5A]">Dawai24</span> as a preferred healthcare source on Google
                </p>
              </div>

              {/* 4. Recent Articles Sidebar (if any) */}
              {relatedBlogs.length > 0 && (
                <div className="rounded-xl border border-[#E9ECEF] bg-white p-4 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F0F2F5]">
                    <h3 className="font-bold text-[#171725] text-xs">Recent Health Articles</h3>
                    <Link href="/blogs" className="text-[11px] font-semibold text-[#FF6B5A] hover:underline">
                      View all
                    </Link>
                  </div>

                  <div className="divide-y divide-[#F0F2F5]">
                    {relatedBlogs.map((rel) => (
                      <Link
                        key={rel.id}
                        href={`/blogs/${rel.slug || rel.id}`}
                        className="group flex items-start gap-3 py-2.5 first:pt-1 last:pb-0"
                      >
                        {rel.imageUrl ? (
                          <div className="size-12 rounded-lg overflow-hidden shrink-0 bg-slate-50 border border-[#E9ECEF]">
                            <img
                              src={rel.imageUrl}
                              alt={rel.title}
                              className="size-full object-cover group-hover:scale-105 transition duration-300"
                            />
                          </div>
                        ) : (
                          <div className="size-12 rounded-lg bg-[#FFF1EF] text-[#FF6B5A] flex items-center justify-center shrink-0 font-bold text-xs">
                            <BookOpen size={16} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-[#92929D]">{formatShortDate(rel.createdAt)}</p>
                          <h4 className="text-xs font-semibold text-[#171725] line-clamp-2 group-hover:text-[#FF6B5A] transition-colors leading-snug">
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
      </div>
    </div>
  );
}
