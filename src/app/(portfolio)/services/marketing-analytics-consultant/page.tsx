import {
  IconAlertCircle,
  IconArrowRight,
  IconAward,
  IconChartBar,
  IconCheck,
  IconChevronRight,
  IconHelp,
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
  const canonicalUrl = `${siteUrl}services/marketing-analytics-consultant/`;

  return {
    title:
      "Marketing Analytics Consultant — GA4, BigQuery, Campaign Analytics | Madhu Dadi",
    description:
      "Hire Madhu Dadi for marketing analytics, GA4, BigQuery, campaign measurement, attribution, dashboards, experimentation analysis, and decision intelligence workflows.",
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function MarketingAnalyticsConsultantPage() {
  const { profile, sortedProjects } = await getPortfolioData();

  // Prefilled contact URL configuration
  const prefillSubject = "Marketing Analytics Inquiry";
  const prefillMessage = `Hi Madhu,\n\nI read your Marketing Analytics Consultant page and would love to discuss a custom measurement or dashboard project.\n\nProject Scope:\n- Primary Telemetry Needs (GA4, sGTM, etc.):\n- Current Data Stack (BigQuery, SQL, etc.):\n- Key Business Outcomes to Track:\n\nLet's connect!`;
  const contactUrl = `/contact/?subject=${encodeURIComponent(prefillSubject)}&message=${encodeURIComponent(prefillMessage)}`;

  // Target query tag collection
  const targetQueries = [
    "marketing analytics consultant",
    "GA4 consultant India",
    "campaign analytics consultant",
    "attribution consultant",
    "BigQuery analytics consultant",
    "decision intelligence consultant",
    "marketing dashboard consultant",
  ];

  const whoThisIsFor = [
    "Marketing teams mapping complex customer journeys",
    "Growth teams needing multi-touch attribution models",
    "Product teams measuring active engagement funnels",
    "Founders designing structured marketing analytics frameworks",
    "Agencies running high-stakes paid acquisition workflows",
    "B2B SaaS teams connecting web trials to downstream MRR",
  ];

  const problemsSolved = [
    "GA4 data is unreliable or missing critical event logs",
    "Campaign reports do not match actual business bottom lines",
    "Analytics dashboards are designed poorly and ignored",
    "Multi-touch attribution is unclear and overrepresented",
    "A/B experiments are read optimistically without statistical rigor",
    "Stakeholders and executives do not trust telemetry numbers",
  ];

  const whatIBuild = [
    {
      title: "GA4 Measurement Plans",
      desc: "Custom custom event schemas, user properties tracking, and server-side tag container configurations.",
    },
    {
      title: "Campaign Performance Dashboards",
      desc: "Interactive dashboards consolidating media spend, impressions, CTRs, and downstream CAC.",
    },
    {
      title: "BigQuery Ingestion Layers",
      desc: "Robust ETL pipelines extracting raw GA4 datasets, normalizing columns, and prepping tables for BI.",
    },
    {
      title: "Executive dashboards",
      desc: "Polished, high-level business intelligence layers mapping telemetry straight to revenue.",
    },
    {
      title: "Attribution Frameworks",
      desc: "Custom multi-touch or marketing mix models designed to trace actual campaign channels.",
    },
    {
      title: "A/B Testing Analysis",
      desc: "Statistical experimentation engines calculating confidence intervals, p-values, and conversion lift.",
    },
    {
      title: "CLM Reporting Layers",
      desc: "End-to-end Customer Lifecycle Management structures mapping cohort retention and churn rates.",
    },
    {
      title: "Frictionless Funnel Analytics",
      desc: "Comprehensive drop-off mapping across onboarding flows, product trials, and payment processes.",
    },
    {
      title: "Marketing Data QA Protocols",
      desc: "Automated regression checks to instantly flag data discrepancy, missing tracking tags, or broken forms.",
    },
  ];

  const proofBlocks = [
    {
      company: "redBus",
      role: "Campaign Analytics Lead",
      desc: "Developed comprehensive campaign measurement and multi-touch attribution models. Successfully linked multi-million dollar campaign telemetry directly to client transactions, allowing growth leaders to optimize channel allocation, reduce customer acquisition cost (CAC), and boost lifetime retention rates.",
    },
    {
      company: "GroupM",
      role: "Ads Data Hub Engineering",
      desc: "Designed secure Google Ads Data Hub (ADH) SQL querying models to process massive cross-channel campaign datasets. Enabled privacy-safe attribution modeling complying with strict GDPR/CCPA criteria while unlocking clear conversion lift data.",
    },
    {
      company: "Novartis",
      role: "Patient-Support Analytics",
      desc: "Engineered scalable data warehouse reporting structures and interactive support-program dashboards. Normalization of patient telemetry schemas enabled healthcare program managers to track support-workflow efficiency and patient retention trends with absolute data trust.",
    },
    {
      company: "Absolinsoft",
      role: "SEO, SEM & Web Analytics",
      desc: "Owned full-stack conversion rate optimization (CRO) and tracking instrumentation. Architected end-to-end Google Tag Manager, custom schema telemetry, and SEO analytics pipelines that connected organic discovery metrics directly to sales conversions.",
    },
  ];

  const faqs = [
    {
      q: "Can Madhu Dadi audit our GA4 and BigQuery setup?",
      a: "Yes. I run diagnostic analytics audits to resolve typical tracking flaws: duplicate transactions, unlinked cross-domain properties, incorrect referral exclusions, missing custom definitions, and misconfigured conversion events. I also build clean SQL pipelines inside BigQuery.",
    },
    {
      q: "Can Madhu Dadi build custom attribution models?",
      a: "Yes. I design custom attribution models (First-touch, Last-touch, Position-based, or Data-driven W-shaped setups) in SQL and Python to bypass standard self-attributing network biases and connect spend to business results.",
    },
    {
      q: "Can Madhu Dadi build analytics dashboards?",
      a: "Yes. I construct beautiful, high-performance dashboards using Looker Studio or Power BI. I focus on clean information hierarchy so growth teams can extract actionable decisions inside 5 seconds.",
    },
    {
      q: "Can Madhu Dadi connect product analytics to AI features?",
      a: "Yes. This is my core differentiator. I bridge the gap by instrumenting tracking plans that feed real user feedback (like thumbs up/down, prompt success metrics, and RAG latencies) back into server-side GA4 events and BigQuery.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header profile={profile} />

      <main id="main-content" className="flex-1 px-6 py-28 bg-background/50">
        <div className="container mx-auto max-w-5xl space-y-16">
          {/* Back Navigation */}
          <div>
            <Link
              href="/services/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              <IconChevronRight className="h-4 w-4 rotate-180" /> Back to
              Services
            </Link>
          </div>

          {/* Hero Section */}
          <section className="relative rounded-3xl border border-border bg-surface/30 p-8 md:p-12 shadow-card backdrop-blur-md overflow-hidden">
            <div className="absolute top-0 right-0 h-56 w-56 bg-primary/5 rounded-full blur-3xl -z-10" />

            <div className="space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                <IconChartBar className="h-4 w-4" /> Data Science & Decision
                Support
              </span>

              <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                Marketing Analytics{" "}
                <span className="text-gradient">Consultant</span>
              </h1>

              {/* Above-the-fold direct answer */}
              <div className="border-l-4 border-primary pl-5 py-2">
                <p className="text-base md:text-lg text-foreground/90 font-medium leading-relaxed">
                  Madhu Dadi helps teams build marketing analytics systems they
                  can trust, including GA4, BigQuery reporting, campaign
                  analytics, attribution analysis, dashboards, experimentation
                  reads, and decision-intelligence workflows.
                </p>
              </div>

              {/* Target Queries SEO tags */}
              <div className="space-y-2 pt-4">
                <span className="text-[10px] font-mono tracking-widest text-muted-foreground block uppercase">
                  Service Capabilities Covered
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {targetQueries.map((query) => (
                    <span
                      key={query}
                      className="rounded-full border border-border bg-background/50 px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                    >
                      {query}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Who This Is For vs Problems I Solve */}
          <section className="grid gap-8 md:grid-cols-2">
            {/* Who this is for */}
            <article className="rounded-2xl border border-border bg-surface/20 p-6 md:p-8 backdrop-blur-sm space-y-6">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
                <IconSquareCheck className="h-5 w-5 text-primary" /> Who This Is
                For
              </h2>
              <ul className="space-y-4">
                {whoThisIsFor.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                      <IconCheck className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-sm md:text-base text-muted-foreground">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </article>

            {/* Problems I solve */}
            <article className="rounded-2xl border border-border bg-surface/20 p-6 md:p-8 backdrop-blur-sm space-y-6">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
                <IconAlertCircle className="h-5 w-5 text-destructive" />{" "}
                Problems I Solve
              </h2>
              <ul className="space-y-4">
                {problemsSolved.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive mt-0.5">
                      <span className="text-[10px] font-bold">!</span>
                    </span>
                    <span className="text-sm md:text-base text-muted-foreground">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          </section>

          {/* What I Build Grid */}
          <section className="space-y-8">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Analytics Core Deliverables
              </h2>
              <p className="text-sm text-muted-foreground">
                Bespoke dashboards, tracking plans, and warehouse data
                structures to establish complete data trust.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {whatIBuild.map((item) => (
                <div
                  key={item.title}
                  className="group relative rounded-xl border border-border/80 bg-surface/10 p-6 shadow-sm transition-all duration-300 hover:border-primary/40 hover:bg-surface-elevated/20"
                >
                  <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Deep Proof Blocks Section */}
          <section className="space-y-8">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Verifiable Professional Proof
              </h2>
              <p className="text-sm text-muted-foreground">
                Deep proof of my marketing measurement and data analytics
                implementations across blue-chip companies, travel-tech, and
                agencies.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {proofBlocks.map((block) => (
                <article
                  key={block.company}
                  className="rounded-2xl border border-border bg-surface/20 p-6 md:p-8 space-y-4 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 h-24 w-24 bg-primary/5 rounded-full blur-2xl -z-10" />
                  <div className="flex items-center gap-3">
                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                      <IconAward className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-foreground">
                        {block.company}
                      </h3>
                      <span className="text-[10px] font-mono text-muted-foreground block uppercase">
                        {block.role}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    {block.desc}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* Bespoke Accordion FAQs */}
          <section className="space-y-8 max-w-3xl mx-auto">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
                <IconHelp className="h-6 w-6 text-primary" /> Frequently Asked
                Questions
              </h2>
              <p className="text-sm text-muted-foreground">
                Clear answers about audits, dashboard designs, attribution
                modeling, and AI integrations.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-xl border border-border bg-surface/20 p-5 [&_summary::-webkit-details-marker]:hidden transition-all duration-300"
                >
                  <summary className="flex items-center justify-between font-semibold text-sm md:text-base text-foreground cursor-pointer focus:outline-none select-none">
                    <span>{faq.q}</span>
                    <span className="text-muted-foreground transition-transform duration-300 group-open:rotate-180">
                      <IconChevronRight className="h-4.5 w-4.5 rotate-90" />
                    </span>
                  </summary>
                  <div className="mt-3 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Interactive Conversion Call To Action */}
          <section className="relative rounded-3xl border border-primary/20 bg-surface/20 p-8 md:p-12 overflow-hidden text-center max-w-3xl mx-auto">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 bg-primary/5 rounded-full blur-[100px] -z-10" />

            <div className="max-w-xl mx-auto space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Let&apos;s build an analytics framework you trust
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Connect your campaign spends directly to actual client
                transactions and business outcomes. Schedule a technical audit
                or dashboard planning discovery session.
              </p>
              <div className="pt-4">
                <Link
                  href={contactUrl}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                >
                  Book a technical discovery call
                  <IconArrowRight className="h-4.5 w-4.5" />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer profile={profile} projects={sortedProjects} />
    </div>
  );
}
