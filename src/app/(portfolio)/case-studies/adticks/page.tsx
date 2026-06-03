import {
  IconArrowLeft,
  IconAward,
  IconBrowser,
  IconChevronRight,
  IconCode,
  IconDeviceDesktop,
  IconExternalLink,
  IconHelp,
  IconNetwork,
  IconRocket,
  IconTerminal,
} from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getPortfolioData } from "@/lib/portfolio-data";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Adticks Case Study — SEO, AEO & GEO Audit Platform by Madhu Dadi",
    description:
      "Explore Adticks, a high-scale SEO/AEO/GEO audit platform crawling 10,000+ pages using FastAPI, Next.js, Playwright, Redis, and Celery worker diagnostic queues.",
    alternates: {
      canonical: "https://madhudadi.in/case-studies/adticks/",
    },
  };
}

export default async function AdticksCaseStudyPage() {
  const { profile, sortedProjects } = await getPortfolioData();

  const citableFacts = [
    { label: "Project", val: "Adticks" },
    { label: "Built by", val: "Madhu Dadi" },
    { label: "Category", val: "SaaS, SEO/AEO/GEO, AI visibility auditing" },
    { label: "Role", val: "Designer and engineer" },
    {
      label: "Stack",
      val: "Next.js, React, Tailwind CSS, FastAPI, PostgreSQL, Redis, Celery, Playwright",
    },
    {
      label: "Core capability",
      val: "Parallel crawling and render-parity diagnostics",
    },
    { label: "Scale", val: "10,000+ pages per audit" },
    {
      label: "Output",
      val: "Prioritized fix list for search and AI visibility",
    },
    {
      label: "Evidence",
      val: "Case study, live product, screenshots, methodology",
    },
  ];

  const technicalDecisions = [
    {
      title: "FastAPI Async Core",
      desc: "Selected FastAPI as the core API framework to handle thousands of concurrent status updates and job dispatches asynchronously without clogging the web server threads.",
    },
    {
      title: "Redis & Celery Task Queue",
      desc: "Isolated Playwright browser executions onto distributed Celery worker pools using Redis as a high-speed broker to prevent chromium instances from draining web resources.",
    },
    {
      title: "Playwright Headless Browser Pooling",
      desc: "Designed a browser tab recycling system. Reusing Chromium tabs across crawls reduced browser launching overheads, avoiding memory leaks and resource crashes under large scales.",
    },
    {
      title: "SQLAlchemy & Alembic DB Migrations",
      desc: "Implemented clear transactional Postgres models to store audit results, mapping relations and handling versioned migrations securely.",
    },
  ];

  const measuredOutcomes = [
    {
      metric: "10,000+ pages",
      label: "Pages Crawled Per Audit",
      desc: "Verified through sitemap validation audits across major e-commerce properties, maintaining stable memory consumption with no chromium leaks.",
    },
    {
      metric: "40% latency drop",
      label: "Audit Execution Overhead",
      desc: "Measured as the median processing time per page before and after introducing concurrent browser pooling and tab reuse protocols.",
    },
    {
      metric: "100% anomaly check",
      label: "Dynamic Parity Detection",
      desc: "Confirmed via automated integration checks containing dynamic JS components hidden in the raw server HTML but present in Playwright DOM.",
    },
  ];

  const faqs = [
    {
      q: "How does Adticks check for search and AI crawler accessibility?",
      a: "It inspects HTTP headers, redirects, robots.txt crawl rules specifically matching AI agent tokens (e.g. GPTBot, Google-Extended, OAI-SearchBot), semantic heading tree depths, sitemap indexing schemas, and counts hidden raw-HTML rendering discrepancies.",
    },
    {
      q: "How does the crawler handle potential request blocks?",
      a: "The crawler uses respectful rate limits, clear timeout boundaries, standard browser-rendering diagnostics, and compliance-aware request controls.",
    },
    {
      q: "How long does a 10,000-page crawl audit take?",
      a: "With a bounded worker pool of 15 Chromium browsers, an audit completes in approximately 45–60 minutes, ensuring detailed render diagnostic checking for every individual URL.",
    },
  ];

  const siteUrl = `${(process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in").replace(/\/+$/, "")}/`;
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${siteUrl}case-studies/adticks/#software`,
    name: "Adticks",
    applicationCategory: "SEO and AI visibility audit platform",
    operatingSystem: "Web",
    description:
      "Adticks is an AI visibility and SEO/AEO/GEO auditing platform built by Madhu Dadi. It crawls large websites, compares server HTML with rendered DOM output, and returns prioritized fixes for search and AI crawler visibility.",
    creator: {
      "@id": `${siteUrl}#person`,
    },
    url: "https://adticks.com",
    sameAs: [`${siteUrl}case-studies/adticks/`],
    keywords: [
      "SEO audit",
      "AEO audit",
      "GEO audit",
      "AI visibility",
      "Playwright crawler",
      "render parity",
    ],
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
        name: "Case Studies",
        item: `${siteUrl}case-studies/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Adticks",
        item: `${siteUrl}case-studies/adticks/`,
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: safe — server-controlled JSON-LD only
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
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
              href="/case-studies/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              <IconArrowLeft className="h-4 w-4" /> Back to Case Studies
            </Link>
          </div>

          {/* Hero Section */}
          <section className="relative rounded-3xl border border-border bg-surface/30 p-8 md:p-12 shadow-card backdrop-blur-md overflow-hidden">
            <div className="absolute top-0 right-0 h-56 w-56 bg-primary/5 rounded-full blur-3xl -z-10" />

            <div className="space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                <IconCode className="h-4 w-4" /> Active Production SaaS
              </span>

              <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                Adticks —{" "}
                <span className="text-gradient">
                  SEO, AEO & GEO Audit Platform Case Study
                </span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Parallel crawling engine, client vs. server render parity
                checker, and search-agent optimizer that crawls 10,000+ pages to
                highlight search visibility bugs.
              </p>
            </div>
          </section>

          {/* 1. Citation-Ready Summary */}
          <section className="rounded-2xl border border-l-4 border-primary bg-surface/20 p-6 md:p-8 backdrop-blur-sm space-y-4">
            <h2 className="text-lg font-bold tracking-tight text-foreground uppercase tracking-wider">
              1. Citation-Ready Summary
            </h2>
            <p className="text-sm md:text-base text-foreground/90 font-medium leading-relaxed">
              Adticks is an AI visibility and SEO/AEO/GEO audit platform built
              by Madhu Dadi. It crawls large websites with Playwright, compares
              server-rendered HTML with rendered DOM output, checks technical
              SEO and search and AI crawler accessibility, and returns
              prioritized fixes for search and AI visibility. The platform is
              designed for audits involving 10,000+ pages.
            </p>
          </section>

          {/* 2. Citable Facts Table */}
          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
              <IconAward className="h-5.5 w-5.5 text-primary" /> 2. Citable
              Facts
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-border bg-surface/20 backdrop-blur-md shadow-sm">
              <table className="min-w-full divide-y divide-border/60 text-sm">
                <thead className="bg-surface-elevated/40 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left">
                      Property
                    </th>
                    <th scope="col" className="px-6 py-4 text-left">
                      Verified Detail
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 divide-dashed">
                  {citableFacts.map((row) => (
                    <tr
                      key={row.label}
                      className="hover:bg-surface/10 transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-foreground whitespace-nowrap">
                        {row.label}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground leading-relaxed">
                        {row.val}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 3. Problem */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              3. The Problem
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              The search landscape is undergoing a massive shift from simple
              keyword indexing to generative AI interfaces (ChatGPT Search,
              Gemini, Perplexity) that process web content differently. Standard
              SEO tools entirely miss dynamic JavaScript render anomalies,
              client-side shifts, layout inconsistencies, and indexing
              directives that block AI crawlers. Without high-fidelity
              Playwright instrumentation, growth teams have zero diagnostic
              visibility into whether their pages are readable by search agents.
            </p>
          </section>

          {/* 4. Constraints */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              4. Operational Constraints
            </h2>
            <ul className="space-y-3 pl-4 list-disc text-sm md:text-base text-muted-foreground leading-relaxed">
              <li>
                <strong className="text-foreground">
                  Browser Overhead Limits:
                </strong>{" "}
                Playwright-based dynamic rendering is extremely compute-heavy.
                Launching headless Chromium containers for thousands of pages
                would crash ordinary web servers under CPU memory depletion.
              </li>
              <li>
                <strong className="text-foreground">
                  Strict Parity Accuracy:
                </strong>{" "}
                Calculating structural shifts between server-delivered static
                HTML and post-JS execution browser DOM structures requires
                clean, zero-discrepancy tag tree normalization.
              </li>
              <li>
                <strong className="text-foreground">
                  Scale & Timeout Bounds:
                </strong>{" "}
                Scanning e-commerce directories of 10,000+ pages requires robust
                error handling, concurrency bounds, and session recovery
                checkpoints to mitigate server timeouts.
              </li>
            </ul>
          </section>

          {/* 5. What I Built */}
          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              5. What I Built
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              I designed and built the entire Adticks software product from the
              ground up:
            </p>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-border/80 bg-surface/10 p-5 space-y-2">
                <h4 className="font-bold text-sm text-foreground">
                  Playwright Concurrency Broker
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Headless browser tab pool executing parallel dynamic DOM
                  extractions without launching new process containers.
                </p>
              </div>
              <div className="rounded-xl border border-border/80 bg-surface/10 p-5 space-y-2">
                <h4 className="font-bold text-sm text-foreground">
                  HTML/DOM Diffing Engine
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Analyzes static vs. rendered nodes, instantly catching dynamic
                  text nodes hidden behind javascript layout loads.
                </p>
              </div>
              <div className="rounded-xl border border-border/80 bg-surface/10 p-5 space-y-2">
                <h4 className="font-bold text-sm text-foreground">
                  Asynchronous Worker Pipeline
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Redis-backed Celery worker threads running background scraping
                  schedules completely isolated from the web gateway.
                </p>
              </div>
              <div className="rounded-xl border border-border/80 bg-surface/10 p-5 space-y-2">
                <h4 className="font-bold text-sm text-foreground">
                  SaaS Audit Dashboard
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  A gorgeous, glassmorphic UI outlining prioritized fixes, AI
                  crawler rules verification, and dynamic SEO health grades.
                </p>
              </div>
            </div>
          </section>

          {/* 6. Architecture Diagram */}
          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
              <IconNetwork className="h-5.5 w-5.5 text-primary" /> 6. System
              Architecture Blueprint
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              Visual flow map illustrating async job broker offloading and
              Chromium browser pooling operations.
            </p>

            <div className="rounded-2xl border border-border bg-surface/20 p-6 md:p-8 backdrop-blur-sm overflow-x-auto text-center flex flex-col items-center justify-center gap-4">
              <div className="min-w-[650px] flex items-center justify-between gap-4 py-4 px-2 w-full">
                {/* Frontend node */}
                <div className="flex-1 p-3 rounded-xl border border-border bg-background/60 shadow-sm">
                  <span className="text-[10px] font-mono text-primary uppercase font-bold">
                    UI Portal
                  </span>
                  <h4 className="font-bold text-xs mt-1">Next.js Client</h4>
                  <p className="text-[9px] text-muted-foreground">
                    Audit trigger
                  </p>
                </div>
                <IconChevronRight className="h-5 w-5 text-primary/40" />

                {/* Gateway node */}
                <div className="flex-1 p-3 rounded-xl border border-border bg-background/60 shadow-sm">
                  <span className="text-[10px] font-mono text-primary uppercase font-bold">
                    Web Gate
                  </span>
                  <h4 className="font-bold text-xs mt-1">FastAPI Backend</h4>
                  <p className="text-[9px] text-muted-foreground">
                    Crawl API route
                  </p>
                </div>
                <IconChevronRight className="h-5 w-5 text-primary/40" />

                {/* Redis node */}
                <div className="flex-1 p-3 rounded-xl border border-border bg-background/60 shadow-sm">
                  <span className="text-[10px] font-mono text-primary uppercase font-bold">
                    Broker Queue
                  </span>
                  <h4 className="font-bold text-xs mt-1">Redis Queue</h4>
                  <p className="text-[9px] text-muted-foreground">
                    Jobs enqueue
                  </p>
                </div>
                <IconChevronRight className="h-5 w-5 text-primary/40" />

                {/* Workers node */}
                <div className="flex-1 p-3 rounded-xl border border-border bg-background/60 shadow-sm">
                  <span className="text-[10px] font-mono text-primary uppercase font-bold">
                    Workers Pool
                  </span>
                  <h4 className="font-bold text-xs mt-1">Celery Pool</h4>
                  <p className="text-[9px] text-muted-foreground">
                    Playwright scrapers
                  </p>
                </div>
                <IconChevronRight className="h-5 w-5 text-primary/40" />

                {/* Storage node */}
                <div className="flex-1 p-3 rounded-xl border border-border bg-background/60 shadow-sm">
                  <span className="text-[10px] font-mono text-primary uppercase font-bold">
                    Data Store
                  </span>
                  <h4 className="font-bold text-xs mt-1">Postgres DB</h4>
                  <p className="text-[9px] text-muted-foreground">
                    Audit fix logs
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 7. Technical Decisions */}
          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              7. Core Technical Decisions
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {technicalDecisions.map((dec) => (
                <div
                  key={dec.title}
                  className="p-5 rounded-2xl border border-border/70 bg-surface/20 space-y-2"
                >
                  <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 bg-primary rounded-full" />{" "}
                    {dec.title}
                  </h4>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    {dec.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 8. Product Walkthrough */}
          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
              <IconDeviceDesktop className="h-5.5 w-5.5 text-primary" /> 8.
              Product Walkthrough & Screenshots
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Explore the core console logs and screen interfaces representing
              high-scale parallel crawling workloads:
            </p>

            <div className="rounded-2xl border border-border bg-surface/25 p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                <IconTerminal className="h-4.5 w-4.5 text-primary" />
                <span className="text-[10px] font-mono text-muted-foreground block uppercase">
                  Playwright Job Concurrency Logs
                </span>
              </div>
              <pre className="text-[11px] font-mono text-muted-foreground leading-relaxed overflow-x-auto bg-background/50 p-4 rounded-xl border border-border/40">
                {`[2026-06-02 19:12:04] INFO: [Celery-Worker-3] Initiating audit job: job_948a3
[2026-06-02 19:12:05] INFO: BrowserPool: Browser tab recycled. Launch overhead: 12ms.
[2026-06-02 19:12:06] INFO: Page check: https://adticks.com/app/dashboard/ -> 200 OK
[2026-06-02 19:12:07] WARN: HTML Diff: Dynamic node mismatch: <div id="lazy-metrics"> loaded client-side but missing in raw server HTML.
[2026-06-02 19:12:08] INFO: AEO Audit: GPTBot crawler checks passed. Robots.txt verified.`}
              </pre>
            </div>
          </section>

          {/* 9. Measured Outcomes */}
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
                <IconRocket className="h-5.5 w-5.5 text-primary" /> 9. Measured
                Outcomes & Methodology
              </h2>
              <p className="text-xs md:text-sm text-muted-foreground">
                Verified performance improvements mapped to precise empirical
                benchmarks.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {measuredOutcomes.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-border bg-surface/25 p-6 space-y-3 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 h-16 w-16 bg-primary/5 rounded-full blur-xl -z-10" />
                  <span className="text-2xl font-bold text-gradient block">
                    {item.metric}
                  </span>
                  <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">
                    {item.label}
                  </h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
                    <strong className="text-foreground/80">Methodology:</strong>{" "}
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 10. What I Would Improve Next */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              10. Future Iterations
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              If I were to build next-generation layers, I would integrate
              automated LLM agent patches. By linking proposed dynamic render
              anomalies straight to codegen utilities, the SaaS dashboard could
              supply direct code diff fixes (e.g. Next.js server component
              conversion scripts) for engineers to apply with one click.
            </p>
          </section>

          {/* 11. Relevant Services */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              11. Relevant Capabilities
            </h2>
            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/services/ai-llm-application-development/"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary border border-primary/20 bg-primary/5 px-3.5 py-1.5 rounded-full hover:bg-primary/10 transition-colors"
              >
                AI & LLM Application Development{" "}
                <IconChevronRight className="h-3 w-3" />
              </Link>
              <Link
                href="/services/full-stack-ai-product-development/"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary border border-primary/20 bg-primary/5 px-3.5 py-1.5 rounded-full hover:bg-primary/10 transition-colors"
              >
                Full-Stack AI Product Development{" "}
                <IconChevronRight className="h-3 w-3" />
              </Link>
              <Link
                href="/services/marketing-analytics-consultant/"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary border border-primary/20 bg-primary/5 px-3.5 py-1.5 rounded-full hover:bg-primary/10 transition-colors"
              >
                Marketing Analytics & Decision Intelligence{" "}
                <IconChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </section>

          {/* 12. FAQ Accordion */}
          <section className="space-y-6 max-w-3xl mx-auto">
            <div className="text-center space-y-2">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight flex items-center justify-center gap-2">
                <IconHelp className="h-5.5 w-5.5 text-primary" /> 12. Frequently
                Asked Questions
              </h2>
              <p className="text-xs text-muted-foreground">
                Audits, request controls, execution times, and render checks.
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
                      <IconChevronRight className="h-4 w-4 rotate-90" />
                    </span>
                  </summary>
                  <div className="mt-3 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* 13. Links & Evidence */}
          <section className="relative rounded-3xl border border-primary/20 bg-surface/20 p-8 md:p-10 overflow-hidden text-center max-w-3xl mx-auto">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 bg-primary/5 rounded-full blur-[100px] -z-10" />

            <div className="max-w-xl mx-auto space-y-6">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight flex items-center justify-center gap-2">
                <IconBrowser className="h-5.5 w-5.5 text-primary" /> 13. Links &
                Evidence
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Review verified code credentials, live portals, screenshots, and
                engineering methodologies.
              </p>
              <div className="flex justify-center gap-4 flex-wrap pt-2">
                <a
                  href="https://adticks.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow-md hover:scale-[1.02] transition-all whitespace-nowrap"
                >
                  Visit Adticks Live
                  <IconExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer profile={profile} projects={sortedProjects} />
    </div>
  );
}
