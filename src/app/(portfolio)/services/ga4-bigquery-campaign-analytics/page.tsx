import {
  IconAlertCircle,
  IconArrowRight,
  IconCheck,
  IconChevronRight,
  IconHelp,
  IconSettings,
  IconSquareCheck,
} from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getPortfolioData } from "@/lib/portfolio-data";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = `${(process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in").replace(/\/+$/, "")}/`;
  const canonicalUrl = `${siteUrl}services/ga4-bigquery-campaign-analytics/`;

  return {
    title:
      "GA4 & BigQuery Analytics Consultant for Campaign Measurement | Madhu Dadi",
    description:
      "Hire Madhu Dadi for GA4 setups, BigQuery warehousing, server-side Google Tag Manager (sGTM), campaign attribution, and marketing data dashboards.",
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function Ga4BigQueryCampaignAnalyticsPage() {
  const { profile, sortedProjects } = await getPortfolioData();

  // Prefilled contact URL configuration
  const contactUrl = "/contact/#intent=ga4-bigquery";

  const whoThisIsFor = [
    "Marketing teams looking for a single source of truth for media spend and conversions",
    "Growth engineering teams needing server-side tracking setups (sGTM)",
    "Data leaders aiming to feed raw GA4 event streams into BigQuery",
    "E-commerce brands seeking accurate checkout and purchase attribution",
    "Agencies running search and social ad campaigns needing precise conversion API signals",
    "B2B enterprises tracking lead gen channels and lifecycle progression",
  ];

  const problemsSolved = [
    "Mismatched and bloated ad platform reporting numbers",
    "Missing checkout funnel events and incorrect revenue values in GA4",
    "Incomplete measurement caused by browser privacy controls, consent constraints, and client-side blocking",
    "Slow and inefficient BI dashboards reading from raw unoptimized tables",
    "Lack of user lifecycle tracking across domain transitions",
    "Broken lead forms or conversion signals that fail silently without alerting",
  ];

  const whatIBuild = [
    {
      title: "Server-Side GTM Setup (sGTM)",
      desc: "Implement server-side containers on Google Cloud Platform, routing consented first-party measurement streams through controlled server endpoints to improve data quality, privacy controls, and measurement resilience.",
    },
    {
      title: "GA4 Schema Calibration",
      desc: "Define custom event schemas, item arrays, and user properties to map complete customer journeys with exact telemetry specifications.",
    },
    {
      title: "Google Cloud BigQuery Warehouses",
      desc: "Connect native GA4 export integrations, build SQL schemas, partition tables, and construct optimized views to reduce query costs.",
    },
    {
      title: "Attribution Transformation Models",
      desc: "Create custom multi-touch attribution tables in SQL, combining UTM parameters and user IDs to understand true conversion drivers.",
    },
    {
      title: "Google Ads & Meta Conversion APIs (CAPI)",
      desc: "Configure server-side conversion API signals (Meta CAPI, Google Enhanced Conversions) to feed ad platforms high-match-rate signals.",
    },
    {
      title: "Automated Data QA & Alerting",
      desc: "Deploy validation scripts to verify tracking logs daily, sending automated alerts to Slack or Email when anomalous drops occur.",
    },
  ];

  const proofBlocks = [
    {
      company: "redBus",
      role: "Campaign Analytics Lead",
      desc: "Designed scale-focused campaign tracking databases. Connected dynamic UTM arrays and transactional identifiers, enabling the marketing department to optimize acquisition budgets across channels, lower average CAC, and monitor customer retention.",
    },
    {
      company: "GroupM",
      role: "Ads Data Hub Engineering",
      desc: "Constructed secure marketing SQL workflows in Ads Data Hub. Built attribution data views, extracting campaign attribution variables safely to resolve platform overlap issues while complying with GDPR and CCPA boundaries.",
    },
    {
      company: "Novartis",
      role: "Data Warehouse Integration",
      desc: "Normalized patient program schemas, loading data pipelines into secure reporting tables. Enabled analytical modeling workflows for operations leads while maintaining strict regulatory compliance frameworks.",
    },
    {
      company: "Absolinsoft",
      role: "Web Attribution & Tagging",
      desc: "Built custom tag templates and data-layer configurations for conversion monitoring. Configured custom analytics frameworks to trace conversion outcomes from paid search channels.",
    },
  ];

  const faqs = [
    {
      q: "Why do I need a server-side tracking (sGTM) setup?",
      a: "Client-side tracking is increasingly blocked by browsers, ad blockers, and network controls. Server-side tracking (sGTM) moves the tag execution process to your server, allowing you to route clean first-party data streams to GA4 and ad platforms. This improves data accuracy, page load speeds, and security.",
    },
    {
      q: "How does the GA4 export to BigQuery help with marketing?",
      a: "The standard GA4 UI limits your ability to query raw data, perform user-level cohort analysis, or run custom attribution. By exporting to BigQuery, you gain access to raw event logs. This allows you to combine GA4 data with CRM databases, build custom models in SQL, and design dashboards in Looker Studio that don't hit GA4 API quota limits.",
    },
    {
      q: "Do you configure Conversion APIs for Meta, Google, and TikTok?",
      a: "Yes. I set up server-side conversion signals (such as Meta Conversions API and Google Enhanced Conversions) via sGTM. I map user identifiers (hashed email, phone) to maximize match rates, leading to more accurate attribution and lower cost-per-acquisition (CPA).",
    },
    {
      q: "Can you help optimize our Google Cloud BigQuery query costs?",
      a: "Yes. Raw GA4 exports can quickly become expensive to query if tables are not partitioned and clustered correctly. I optimize schemas, build incremental transformation tables, and design views that limit scanned bytes, significantly reducing monthly GCP analytics costs.",
    },
  ];

  const siteUrl = `${(process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in").replace(/\/+$/, "")}/`;
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl}services/ga4-bigquery-campaign-analytics/#service`,
    name: "GA4 & BigQuery Analytics Consultant for Campaign Measurement",
    serviceType: "GA4, BigQuery & Campaign Measurement Analytics",
    description:
      "Server-side tracking (sGTM), custom GA4 schemas, BigQuery data modeling, conversion APIs, and marketing dashboards that connect campaigns to outcomes.",
    provider: {
      "@id": `${siteUrl}#person`,
    },
    areaServed: ["India", "Worldwide", "Remote"],
    url: `${siteUrl}services/ga4-bigquery-campaign-analytics/`,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "GA4 & BigQuery Analytics Services",
      itemListElement: [
        {
          "@type": "Offer",
          name: "Server-side GTM setup & Conversions API",
          description:
            "Deploying sGTM containers, routing consented first-party measurement streams through controlled server endpoints to improve data quality and privacy controls.",
        },
        {
          "@type": "Offer",
          name: "BigQuery warehouse & SQL transformation modeling",
          description:
            "Setting up raw GA4 integrations, designing partition schemes, and constructing cost-efficient reporting tables.",
        },
        {
          "@type": "Offer",
          name: "Marketing & Attribution dashboards",
          description:
            "Building Looker Studio/Power BI dashboards linking CAC, media spend, and transactional performance.",
        },
      ],
    },
  };

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
        name: "Services",
        item: `${siteUrl}services/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "GA4 & BigQuery Analytics Consultant for Campaign Measurement",
        item: `${siteUrl}services/ga4-bigquery-campaign-analytics/`,
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: safe — server-controlled JSON-LD only
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: safe — server-controlled JSON-LD only
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Header profile={profile} />

      <main id="main-content" className="flex-1 px-6 py-28 bg-background/50">
        <div className="container mx-auto max-w-4xl space-y-16">
          {/* Back Navigation */}
          <div>
            <Link
              href="/services/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors group"
            >
              <span className="inline-block transform group-hover:-translate-x-1 transition-transform">
                ←
              </span>
              Back to Services
            </Link>
          </div>

          {/* Hero Segment */}
          <section className="relative rounded-3xl border border-border/80 bg-surface/30 p-8 md:p-12 backdrop-blur-md overflow-hidden">
            <div className="absolute top-0 right-0 h-72 w-72 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <IconSettings className="h-6 w-6" />
                </div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 tracking-wide uppercase">
                  Advanced Telemetry
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent leading-tight animate-fade-in">
                GA4 & BigQuery Analytics Consultant for Campaign Measurement
              </h1>
              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed font-medium">
                I help marketing, growth, and product teams build analytics
                systems they can trust. End-to-end server-side tracking (sGTM),
                custom GA4 schemas, BigQuery data modeling, and attribution
                dashboards that connect media spend directly to transactional
                outcomes.
              </p>
              <div className="pt-2">
                <Link
                  href={contactUrl}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                >
                  Book tracking consultation
                  <IconArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>

          {/* Core Objectives Block */}
          <section className="grid gap-8 md:grid-cols-2">
            {/* Column 1: Who this is for */}
            <div className="rounded-2xl border border-border bg-surface/20 p-6 md:p-8 space-y-6">
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <IconCheck className="h-5 w-5 text-primary" /> Who This Is For
              </h2>
              <ul className="space-y-4">
                {whoThisIsFor.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Problems Solved */}
            <div className="rounded-2xl border border-border bg-surface/20 p-6 md:p-8 space-y-6">
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <IconAlertCircle className="h-5 w-5 text-primary" /> Problems I
                Solve
              </h2>
              <ul className="space-y-4">
                {problemsSolved.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-destructive shrink-0 mt-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Service Capabilities Grid */}
          <section className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Service Capabilities & Deliverables
              </h2>
              <p className="text-sm md:text-base text-muted-foreground">
                Structured components of the analytics setup, tailored to your
                exact marketing and engineering infrastructure.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {whatIBuild.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border bg-surface/25 p-6 hover:bg-surface/40 hover:border-primary/20 transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <h3 className="font-bold text-base text-foreground leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                      <IconSquareCheck className="h-4 w-4" /> Production Ready
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Professional Context / Proof Timeline */}
          <section className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Proven Analytics Experience
              </h2>
              <p className="text-sm md:text-base text-muted-foreground">
                Hands-on analytics integration and campaign attribution
                engineering for high-growth platforms.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {proofBlocks.map((item) => (
                <div
                  key={item.company}
                  className="rounded-2xl border border-border bg-surface/15 p-6 md:p-8 hover:border-primary/20 transition-all space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-foreground">
                        {item.company}
                      </h3>
                      <p className="text-xs font-semibold text-primary tracking-wide uppercase">
                        {item.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Primary Tech Stack */}
          <section className="rounded-2xl border border-border bg-surface/20 p-6 md:p-8 space-y-6">
            <h3 className="font-bold text-sm tracking-widest text-muted-foreground uppercase text-center md:text-left">
              Measurement Technologies Supported
            </h3>
            <div className="flex flex-wrap gap-2.5 justify-center md:justify-start">
              {[
                "GA4",
                "BigQuery",
                "sGTM",
                "SQL",
                "Python",
                "Google Tag Manager",
                "Looker Studio",
                "GCP",
                "dbt",
                "Postgres",
              ].map((tech) => (
                <span
                  key={tech}
                  className="rounded-xl border border-border bg-background/50 px-3.5 py-2 text-xs font-mono text-foreground font-semibold"
                >
                  {tech}{" "}
                </span>
              ))}
            </div>
          </section>

          {/* FAQ Segment */}
          <section className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
                <IconHelp className="h-6 w-6 text-primary" /> Service FAQs
              </h2>
              <p className="text-sm text-muted-foreground">
                Common questions about GA4 schemas, BigQuery configurations, and
                campaign analytics project engagements.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-2xl border border-border bg-surface/10 overflow-hidden [&_summary::-webkit-details-marker]:hidden transition-all duration-300 hover:bg-surface/25"
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer select-none">
                    <span className="font-bold text-sm md:text-base text-foreground/90 pr-4">
                      {faq.q}
                    </span>
                    <span className="text-primary shrink-0 transition-transform duration-300 group-open:rotate-90">
                      <IconChevronRight className="h-5 w-5" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 pt-0 border-t border-border/20 mt-2">
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed pt-4">
                      {faq.a}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Footer Call to Action Banner */}
          <section className="relative rounded-3xl border border-border/80 bg-surface/20 p-8 md:p-12 overflow-hidden text-center max-w-4xl mx-auto">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 bg-primary/5 rounded-full blur-[100px] -z-10" />
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Let&apos;s map your customer lifecycle
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Send a summary of your tracking needs, current stack, and
                problems. I will respond with a structured initial proposal
                within 24 hours.
              </p>
              <div className="pt-4 flex flex-col items-center gap-4">
                <Link
                  href={contactUrl}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:scale-[1.02] hover:shadow-glow transition-all"
                >
                  Book campaign analytics consultation
                  <IconArrowRight className="h-4 w-4" />
                </Link>
                <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground mt-2">
                  <Link
                    href="/profile/"
                    className="hover:text-primary transition-colors"
                  >
                    About Madhu Dadi (Profile)
                  </Link>
                  <span className="text-muted-foreground/30 select-none">
                    |
                  </span>
                  <Link
                    href="/credentials/"
                    className="hover:text-primary transition-colors"
                  >
                    Verified Credentials & Proof
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer profile={profile} projects={sortedProjects} />
    </div>
  );
}
