import {
  IconBrandLinkedin,
  IconChevronLeft,
  IconCircleCheck,
  IconClock,
  IconGlobe,
  IconMail,
  IconMapPin,
  IconSparkles,
} from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SafeEmailLink } from "@/components/SafeEmailLink";
import { getPortfolioData } from "@/lib/portfolio-data";

const _CONTACT_CANONICAL = "https://madhudadi.in/contact/";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: SearchParams;
}): Promise<Metadata> {
  const { pageContent } = await getPortfolioData();
  const params = searchParams ? await searchParams : {};
  const hasSearchParams = Object.keys(params ?? {}).length > 0;

  const siteUrl = `${(process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in").replace(/\/+$/, "")}/`;
  const canonicalPath = pageContent.contact.seo?.canonicalPath || "/contact/";
  const canonicalUrl = `${siteUrl}${canonicalPath.replace(/^\//, "")}`;

  const title =
    pageContent.contact.seo?.title ||
    "Contact Madhu Dadi - Generative AI & Marketing Analytics Engineer";
  const description =
    pageContent.contact.seo?.description ||
    "Work with Madhu Dadi on production AI, RAG, AI agents, marketing analytics, or full-stack AI product development. Response time is usually within 24 hours.";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: hasSearchParams
      ? {
          index: false,
          follow: true,
          googleBot: { index: false, follow: true },
        }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
    },
  };
}

export default async function ContactPage() {
  const { profile, sortedProjects, sortedNavigationItems, pageContent } =
    await getPortfolioData();

  const siteUrl = `${(process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in").replace(/\/+$/, "")}/`;
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Contact",
        item: `${siteUrl}contact/`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is your typical turnaround time?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            pageContent.contact.responseTimeText ||
            "I usually reply within 24 hours.",
        },
      },
      {
        "@type": "Question",
        name: "Are you open to remote work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, I am remote-first and available worldwide. Relocation is also possible for the right full-time role.",
        },
      },
      {
        "@type": "Question",
        name: "What projects are the best fit?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "I specialize in LLM/RAG applications, AI agents, FastAPI/Next.js product builds, and marketing analytics pipelines.",
        },
      },
      {
        "@type": "Question",
        name: "Do you take on freelance or contract work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, I am available for freelance consulting, contract roles, and full-time opportunities depending on the scope.",
        },
      },
    ],
  };

  const bestFitAreas = pageContent.contact.bestFitAreas || [
    "LLM/RAG applications",
    "AI agents and workflow automation",
    "FastAPI/Next.js product builds",
    "GA4, BigQuery, campaign analytics, dashboards",
    "AI visibility and SEO/AEO/GEO systems",
  ];

  const linkedinUrl =
    profile.socialLinks.linkedin ||
    "https://www.linkedin.com/in/madhu-dadi-54684531";

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: safe - server-controlled JSON-LD only
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbSchema, faqSchema]),
        }}
      />
      <Header profile={profile} navigationItems={sortedNavigationItems} />

      <main id="main-content" className="flex-1 px-6 py-28 bg-background/50">
        <div className="container mx-auto max-w-4xl space-y-12">
          {/* Back Button */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <IconChevronLeft className="h-4 w-4" /> Back to Home
            </Link>
          </div>

          <div className="grid gap-10 lg:grid-cols-2">
            {/* Left Column: Context, Best Fit, and Direct Details */}
            <div className="space-y-8">
              {/* Intro Section */}
              <section className="space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                  <IconSparkles className="h-3.5 w-3.5 animate-pulse" />{" "}
                  {pageContent.contact.eyebrow || "Collaboration"}
                </span>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                  {pageContent.contact.heroTitle || "Contact Me"}
                </h1>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {pageContent.contact.heroSubtitle ||
                    "Work with me on production AI, RAG, AI agents, marketing analytics, or full-stack AI product development."}
                </p>
              </section>

              {/* Best Fit Focus Areas */}
              <section className="space-y-4">
                <h2 className="text-lg font-bold tracking-tight border-b border-border/80 pb-2">
                  Best fit projects:
                </h2>
                <ul className="space-y-3">
                  {bestFitAreas.map((area) => (
                    <li key={area} className="flex gap-2.5 items-start">
                      <IconCircleCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/90">{area}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Consulting Process */}
              <section className="space-y-4">
                <h2 className="text-lg font-bold tracking-tight border-b border-border/80 pb-2">
                  My Consulting Process
                </h2>
                <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    Every engagement starts with a comprehensive discovery
                    phase. I prioritize understanding your underlying business
                    objectives, technical constraints, and data architecture
                    before proposing any solutions. This ensures that the AI
                    products and marketing pipelines we build together are
                    perfectly aligned with your strategic goals and deliver
                    measurable ROI from day one.
                  </p>
                  <p>
                    Whether you need a robust Retrieval-Augmented Generation
                    (RAG) system, custom AI agents, or high-performance FastAPI
                    backends, I follow a transparent, milestone-driven approach.
                    You will have full visibility into the development
                    lifecycle, from initial architectural design and rapid
                    prototyping to production deployment, performance tuning,
                    and ongoing maintenance.
                  </p>
                  <p>
                    For marketing and analytics clients, my focus is on creating
                    single-source-of-truth measurement systems using Google
                    Analytics 4 (GA4) and Google BigQuery. I specialize in
                    resolving data fragmentation, building reliable server-side
                    tracking pipelines, and designing actionable dashboards that
                    empower your marketing teams to make confident, data-driven
                    decisions at scale.
                  </p>
                </div>
              </section>

              {/* Frequently Asked Questions */}
              <section className="space-y-4">
                <h2 className="text-lg font-bold tracking-tight border-b border-border/80 pb-2">
                  Frequently Asked Questions
                </h2>
                <dl className="space-y-4 text-sm">
                  {faqSchema.mainEntity.map((faq, index) => {
                    const icons = [
                      IconClock,
                      IconGlobe,
                      IconSparkles,
                      IconCircleCheck,
                    ];
                    const Icon = icons[index % icons.length];
                    return (
                      <div
                        key={faq.name}
                        className="p-4 rounded-xl border border-border/50 bg-surface/10 space-y-2"
                      >
                        <dt className="font-semibold text-foreground flex items-center gap-2">
                          <Icon className="h-4.5 w-4.5 text-primary" />{" "}
                          {faq.name}
                        </dt>
                        <dd className="text-muted-foreground leading-relaxed pl-[26px]">
                          {faq.acceptedAnswer.text}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </section>

              {/* Direct Info */}
              <section className="space-y-4">
                <h2 className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
                  Direct Contact & Portals
                </h2>
                <ul className="space-y-3.5 text-sm">
                  <li className="flex items-center gap-3 p-4 rounded-xl border border-border/60 bg-surface/20">
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary border border-primary/10 shrink-0">
                      <IconMail className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block uppercase font-mono">
                        Email Address
                      </span>
                      <SafeEmailLink
                        email={profile.email}
                        className="font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        {profile.email}
                      </SafeEmailLink>
                    </div>
                  </li>
                  <li className="flex items-center gap-3 p-4 rounded-xl border border-border/60 bg-surface/20">
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary border border-primary/10 shrink-0">
                      <IconBrandLinkedin className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block uppercase font-mono">
                        LinkedIn Profile
                      </span>
                      <a
                        href={linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        linkedin.com/in/madhu-dadi
                      </a>
                    </div>
                  </li>

                  <li className="flex items-center gap-3 p-4 rounded-xl border border-border/60 bg-surface/20">
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary border border-primary/10 shrink-0">
                      <IconMapPin className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block uppercase font-mono">
                        Location
                      </span>
                      <span className="font-semibold text-foreground">
                        {profile.location}
                      </span>
                    </div>
                  </li>
                </ul>
              </section>
            </div>

            {/* Right Column: Contact Form Component */}
            <div className="space-y-4 lg:pt-14">
              <div className="rounded-2xl border border-border bg-surface/10 p-6 md:p-8 space-y-6 backdrop-blur-sm">
                <div className="space-y-2">
                  <h2 className="text-xl font-bold tracking-tight">
                    Send a Message
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Submit your requirements below to instantly start our review
                    pipeline.
                  </p>
                </div>
                <Suspense
                  fallback={
                    <div className="flex flex-col items-center justify-center h-80 rounded-xl border border-border bg-surface/30 p-6 text-center space-y-4 animate-pulse">
                      <div className="h-8 w-8 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                        Contact form loading. You can also email me directly at{" "}
                        <SafeEmailLink
                          email={profile.email}
                          className="text-primary hover:underline transition-colors font-medium break-all"
                        >
                          {profile.email}
                        </SafeEmailLink>
                        .
                      </p>
                    </div>
                  }
                >
                  <ContactForm />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer
        profile={profile}
        navigationItems={sortedNavigationItems}
        projects={sortedProjects}
      />
    </div>
  );
}
