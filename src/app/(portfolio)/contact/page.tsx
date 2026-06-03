import {
  IconBrandLinkedin,
  IconCalendar,
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
import { getPortfolioData } from "@/lib/portfolio-data";

const CONTACT_CANONICAL = "https://madhudadi.in/contact/";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: SearchParams;
}): Promise<Metadata> {
  const params = searchParams ? await searchParams : {};

  const hasSearchParams = Object.keys(params ?? {}).length > 0;

  return {
    title: "Contact Madhu Dadi — Generative AI & Marketing Analytics Engineer",
    description:
      "Work with Madhu Dadi on production AI, RAG, AI agents, marketing analytics, or full-stack AI product development. Response time is usually within 24 hours.",
    alternates: {
      canonical: CONTACT_CANONICAL,
    },
    robots: hasSearchParams
      ? {
          index: false,
          follow: true,
          googleBot: {
            index: false,
            follow: true,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
          },
        },
    openGraph: {
      title:
        "Contact Madhu Dadi — Generative AI & Marketing Analytics Engineer",
      description:
        "Work with Madhu Dadi on production AI, RAG, AI agents, marketing analytics, or full-stack AI product development. Response time is usually within 24 hours.",
      url: CONTACT_CANONICAL,
      type: "website",
    },
  };
}

export default async function ContactPage() {
  const { profile, sortedProjects } = await getPortfolioData();

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

  const bestFitAreas = [
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
        // biome-ignore lint/security/noDangerouslySetInnerHtml: safe — server-controlled JSON-LD only
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Header profile={profile} />

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
                  Collaboration
                </span>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                  Contact Madhu Dadi —{" "}
                  <span className="text-gradient">
                    Generative AI & Marketing Analytics Engineer
                  </span>
                </h1>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Work with me on production AI, RAG, AI agents, marketing
                  analytics, or full-stack AI product development.
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

              {/* Engagement Status & Details */}
              <section className="space-y-4">
                <h2 className="text-lg font-bold tracking-tight border-b border-border/80 pb-2">
                  Availability & Engagement
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 text-xs">
                  <div className="p-4 rounded-xl border border-border/50 bg-surface/10 space-y-1">
                    <span className="text-muted-foreground block font-medium">
                      Availability
                    </span>
                    <span className="font-semibold text-foreground flex items-center gap-1">
                      <IconGlobe className="h-4 w-4 text-primary" />{" "}
                      Remote-first, available worldwide
                    </span>
                  </div>
                  <div className="p-4 rounded-xl border border-border/50 bg-surface/10 space-y-1">
                    <span className="text-muted-foreground block font-medium">
                      Response Time
                    </span>
                    <span className="font-semibold text-foreground flex items-center gap-1">
                      <IconClock className="h-4 w-4 text-primary" /> I usually
                      reply within 24 hours
                    </span>
                  </div>
                </div>
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
                      <a
                        href={`mailto:${profile.email}`}
                        className="font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        {profile.email}
                      </a>
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
                      <IconCalendar className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block uppercase font-mono">
                        Booking / Scheduling
                      </span>
                      <a
                        href={`mailto:${profile.email}?subject=Booking%20Inquiry`}
                        className="font-semibold text-primary hover:underline transition-all"
                      >
                        Request scheduling link
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
                        <a
                          href={`mailto:${profile.email}`}
                          className="text-primary hover:underline transition-colors font-medium break-all"
                        >
                          {profile.email}
                        </a>
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

      <Footer profile={profile} projects={sortedProjects} />
    </div>
  );
}
