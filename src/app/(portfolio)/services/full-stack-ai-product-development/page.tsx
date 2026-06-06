import {
  IconArrowRight,
  IconAward,
  IconCheck,
  IconChevronRight,
  IconCode,
  IconCpu,
  IconDatabase,
  IconHelp,
  IconLayout,
  IconNetwork,
  IconRocket,
  IconShieldLock,
} from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getPortfolioData } from "@/lib/portfolio-data";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = `${(process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in").replace(/\/+$/, "")}/`;
  const canonicalUrl = `${siteUrl}services/full-stack-ai-product-development/`;

  return {
    title: "Full Stack AI Engineer for FastAPI, Next.js & GenAI Products",
    description:
      "Full-stack AI product development by Madhu Dadi. I build FastAPI backends, Next.js interfaces, Postgres schemas, Celery tasks, and analytics instrumentation.",
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function FullStackAIProductPage() {
  const { profile, sortedProjects } = await getPortfolioData();

  // Prefilled contact URL configuration
  const contactUrl = "/contact/#intent=full-stack-ai";

  // Target query tags for SEO/AEO context

  const whatIBuild = [
    {
      title: "SaaS MVPs",
      desc: "Fast, end-to-end software products built to scale, featuring complete auth, databases, Stripe payments, and admin controls.",
    },
    {
      title: "AI-Powered Analytics Portals",
      desc: "Analytics dashboards that parse dense telemetry schemas and present metrics with clear, interactive controls.",
    },
    {
      title: "Agentic Chat Interfaces",
      desc: "Source-cited chatbot frontends that showcase prompt chains, retrieve context dynamically, and stream markdown responses.",
    },
    {
      title: "Internal Productivity Tools",
      desc: "Internal workflow tools for approved data operations, browser-based QA, structured imports, admin automation, and operational reporting.",
    },
    {
      title: "API-First Services",
      desc: "High-throughput API endpoints designed in Python/FastAPI with Pydantic validations and detailed OpenAPI docs.",
    },
    {
      title: "Vector Retrieval Architectures",
      desc: "Embeddings generation, hybrid neural search configurations, and context-aware RAG pipelines mapped directly to databases.",
    },
  ];

  const backendStack = [
    { name: "FastAPI", role: "High-performance Python microservices gateway" },
    {
      name: "Pydantic",
      role: "Strict data serialization and schema validations",
    },
    {
      name: "SQLAlchemy",
      role: "Secure, optimized programmatic database mappings",
    },
    {
      name: "Alembic",
      role: "Safe, version-controlled database schema migrations",
    },
    {
      name: "Celery",
      role: "Distributed asynchronous tasks and worker queues",
    },
    {
      name: "Redis",
      role: "Ultra-fast session storage, in-memory cache, and message broker",
    },
  ];

  const frontendStack = [
    {
      name: "Next.js",
      role: "React framework with robust App Router static generation",
    },
    {
      name: "TypeScript",
      role: "Strict compile-time types for secure application scaling",
    },
    {
      name: "React 19",
      role: "Modern server/client components and asynchronous actions",
    },
    {
      name: "Tailwind CSS",
      role: "Elegant design styling with harmonious OKLch variables",
    },
    { name: "motion/react", role: "Fluid, high-performance micro-animations" },
    {
      name: "Tabler Icons",
      role: "Consistent, visually polished vector icons",
    },
  ];

  const caseStudies = [
    {
      title: "Adticks SEO Audit Engine",
      url: "/case-studies/adticks/",
      desc: "Built a complex SEO & AEO audit platform featuring Celery task queues processing hundreds of concurrent crawls, Python crawl workers generating structured audit signals, and an interactive Next.js dashboard presenting data analytics.",
      tech: ["FastAPI", "Next.js", "Celery", "Redis", "Postgres"],
    },
    {
      title: "Udemy Enroller",
      descriptor: "FastAPI Browser-Workflow Automation",
      url: "/case-studies/udemy-enroller-fastapi/",
      desc: "Designed a private FastAPI and Playwright workflow-orchestration system with bounded worker concurrency, secure session-state handling, background queues, and telemetry logging.",
      tech: ["FastAPI", "Python", "Docker", "Background Tasks"],
    },
    {
      title: "redBus Campaign Attribution",
      url: "/case-studies/",
      desc: "Engineered high-scale transactional CAC databases and multi-touch marketing attribution. Connected web click events directly to transactional databases, allowing growth leaders to allocate million-dollar budgets accurately.",
      tech: ["Data Warehousing", "Attribution Modeling", "SQL", "BigQuery"],
    },
    {
      title: "Absolinsoft Web Pipelines",
      url: "/case-studies/",
      desc: "Managed end-to-end tracking tags, schema instrumentation, and conversion rate optimizations (CRO). Linked search traffic analytics directly to downstream database leads, optimizing acquisition funnels.",
      tech: ["GTM", "Web Telemetry", "SEO Analytics", "CRO"],
    },
  ];

  const faqs = [
    {
      q: "Do you design the product layout and interfaces?",
      a: "Yes. I construct clear, responsive, production-ready, highly interactive web interfaces using Tailwind CSS and motion animations. I focus on curated harmonious color palettes, modern typography, sleek dark modes, and fully responsive layouts that function on all desktop and mobile devices.",
    },
    {
      q: "Can you integrate with existing databases?",
      a: "Yes. I write clean SQLAlchemy database models, design optimized relational database schemas (normalized or data warehouses), and write safe versioned migrations using Alembic to ensure zero data loss during deployment.",
    },
    {
      q: "What vector databases do you support for AI applications?",
      a: "I work with PGVector (to keep your tech stack simplified directly inside your Postgres cluster), Qdrant, Pinecone, or Chroma, depending on your retrieval speeds, scalability needs, and hybrid dense/sparse search requirements.",
    },
    {
      q: "How do you handle user authentication and security?",
      a: "I implement production-ready OAuth2 flows, stateful or stateless JSON Web Tokens (JWT), secure HttpOnly cookies, password hashing via bcrypt or argon2, and strict Cross-Origin Resource Sharing (CORS) configurations to block vulnerabilities.",
    },
    {
      q: "Do you handle server deployment and DevOps?",
      a: "Yes. I deliver fully containerized codebases using Docker and Docker Compose, supported by automated GitHub Actions CI/CD pipelines that deploy cleanly to your virtual servers (VPS) or cloud infrastructure with zero downtime.",
    },
  ];

  const siteUrl = `${(process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in").replace(/\/+$/, "")}/`;
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl}services/full-stack-ai-product-development/#service`,
    name: "Full-Stack AI Product Development",
    serviceType: "Full-stack AI product development",
    description:
      "Madhu Dadi builds full-stack AI products with FastAPI, Next.js, TypeScript, Postgres, Redis, Celery, analytics, SEO, performance, and production deployment practices.",
    provider: {
      "@id": `${siteUrl}#person`,
    },
    areaServed: ["India", "Worldwide", "Remote"],
    url: `${siteUrl}services/full-stack-ai-product-development/`,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Full-Stack AI Product Development services",
      itemListElement: [
        {
          "@type": "Offer",
          name: "SaaS MVP engineering",
          description:
            "Full-stack software products with auth, payments, database schemas, and admin panels.",
        },
        {
          "@type": "Offer",
          name: "Database & task queue architectures",
          description:
            "SQLAlchemy models, Alembic migrations, Celery worker nodes, and Redis message brokers.",
        },
        {
          "@type": "Offer",
          name: "Analytics and SEO instrumentation",
          description:
            "Schema markup, server-rendered layouts, crawlable structures, and GA4 telemetry.",
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
        name: "Full-Stack AI Product Development",
        item: `${siteUrl}services/full-stack-ai-product-development/`,
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
        <div className="container mx-auto max-w-5xl space-y-16">
          {/* Back Button */}
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
                <IconCode className="h-4 w-4" /> Full-Stack Engineering
              </span>

              <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                Full Stack AI Engineer for{" "}
                <span className="text-gradient">
                  FastAPI, Next.js & GenAI Products
                </span>
              </h1>

              {/* Above-the-fold answer */}
              <div className="border-l-4 border-primary pl-5 py-2">
                <p className="text-base md:text-lg text-foreground/90 font-medium leading-relaxed">
                  I build full-stack AI products from architecture to
                  deployment: FastAPI backends, Next.js interfaces, Postgres
                  schemas, async queues, authentication, analytics, SEO,
                  observability, and CI/CD.
                </p>
              </div>

              {/* Target Queries copy block (AEO/GEO optimization) */}
              <p className="text-sm text-muted-foreground leading-relaxed pt-4">
                This service is relevant for teams searching for a full-stack AI
                engineer, FastAPI developer, Next.js AI product engineer,
                Postgres database architect, SaaS MVP engineer, or Python
                backend developer.
              </p>
            </div>
          </section>

          {/* What I Build Grid */}
          <section className="space-y-8">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                What I Build
              </h2>
              <p className="text-sm text-muted-foreground">
                High-quality, modular software products engineered for
                performance, usability, accessibility, and clean search engine
                crawlability.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {whatIBuild.map((item) => (
                <div
                  key={item.title}
                  className="group relative rounded-xl border border-border/80 bg-surface/10 p-6 shadow-sm transition-all duration-300 hover:border-primary/45 hover:bg-surface-elevated/20"
                >
                  <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Example Architecture Visualizer */}
          <section className="space-y-8">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
                <IconNetwork className="h-6 w-6 text-primary animate-pulse" />{" "}
                Example Architecture Blueprint
              </h2>
              <p className="text-sm text-muted-foreground">
                Production-grade, asynchronous infrastructure model designed to
                ensure ultra-low user interface latencies during long-running AI
                completions.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface/20 p-6 md:p-10 backdrop-blur-sm overflow-x-auto">
              <div className="min-w-[650px] flex items-center justify-between gap-4 py-4 px-2">
                {/* Client Box */}
                <div className="flex-1 flex flex-col items-center p-4 rounded-xl border border-border bg-background/60 shadow-sm text-center">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                    User Agent
                  </span>
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
                    <IconLayout className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-xs">Interactive Web UI</h4>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Chrome, Safari, Mobile
                  </p>
                </div>

                <div className="flex shrink-0 items-center justify-center text-muted-foreground text-xs font-mono">
                  <IconChevronRight className="h-5 w-5 text-primary/40 animate-pulse" />
                </div>

                {/* API Gateway Gateway */}
                <div className="flex-1 flex flex-col items-center p-4 rounded-xl border border-border bg-background/60 shadow-sm text-center relative">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                    API Backend
                  </span>
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
                    <IconCode className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-xs">FastAPI Gateway</h4>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    REST APIs, JWT Auth
                  </p>
                </div>

                <div className="flex shrink-0 items-center justify-center text-muted-foreground text-xs font-mono">
                  <IconChevronRight className="h-5 w-5 text-primary/40 animate-pulse" />
                </div>

                {/* Task Queue Queue */}
                <div className="flex-1 flex flex-col items-center p-4 rounded-xl border border-border bg-background/60 shadow-sm text-center">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                    Broker & Queue
                  </span>
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
                    <IconCpu className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-xs">Redis & Celery</h4>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Task queues, Worker pool
                  </p>
                </div>

                <div className="flex shrink-0 items-center justify-center text-muted-foreground text-xs font-mono">
                  <IconChevronRight className="h-5 w-5 text-primary/40 animate-pulse" />
                </div>

                {/* Database Database */}
                <div className="flex-1 flex flex-col items-center p-4 rounded-xl border border-border bg-background/60 shadow-sm text-center">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                    Storage Layer
                  </span>
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
                    <IconDatabase className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-xs">Postgres DB</h4>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    pgvector, Relational Schema
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Backend Stack vs. Frontend Stack side-by-side */}
          <section className="grid gap-8 md:grid-cols-2">
            {/* Backend stack */}
            <article className="rounded-2xl border border-border bg-surface/20 p-6 md:p-8 backdrop-blur-sm space-y-6">
              <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
                <IconDatabase className="h-5 w-5 text-primary" /> Backend Stack
                Core
              </h3>
              <div className="space-y-4">
                {backendStack.map((tech) => (
                  <div
                    key={tech.name}
                    className="flex items-start gap-3 p-3 rounded-xl border border-border/40 bg-background/40"
                  >
                    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                      <IconCheck className="h-3 w-3" />
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">
                        {tech.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {tech.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            {/* Frontend stack */}
            <article className="rounded-2xl border border-border bg-surface/20 p-6 md:p-8 backdrop-blur-sm space-y-6">
              <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
                <IconLayout className="h-5 w-5 text-primary" /> Frontend Stack
                Core
              </h3>
              <div className="space-y-4">
                {frontendStack.map((tech) => (
                  <div
                    key={tech.name}
                    className="flex items-start gap-3 p-3 rounded-xl border border-border/40 bg-background/40"
                  >
                    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                      <IconCheck className="h-3 w-3" />
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">
                        {tech.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {tech.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          {/* Analytics, SEO and Deployment splits */}
          <section className="grid gap-8 md:grid-cols-2">
            {/* Analytics and SEO */}
            <div className="rounded-2xl border border-border bg-surface/20 p-6 md:p-8 backdrop-blur-sm space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-24 w-24 bg-primary/5 rounded-full blur-2xl -z-10" />
              <div className="flex items-center gap-3">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
                  <IconRocket className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-lg text-foreground">
                  Analytics & SEO Instrumentation
                </h3>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                I build applications with clean metadata, semantic HTML,
                sitemaps, schema.org JSON-LD, crawlable links, and server-side
                analytics so they are easier for search engines and answer
                engines to understand, index, and cite.
              </p>
            </div>

            {/* Deployment and Monitoring */}
            <div className="rounded-2xl border border-border bg-surface/20 p-6 md:p-8 backdrop-blur-sm space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-24 w-24 bg-primary/5 rounded-full blur-2xl -z-10" />
              <div className="flex items-center gap-3">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
                  <IconShieldLock className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-lg text-foreground">
                  Deployment & Observability
                </h3>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                I secure production codebases using Docker containers and Docker
                Compose. I construct reliable GitHub Actions CI/CD pipelines
                that trigger safe automated code verification tests and push
                updates with zero downtime. I instrument structured logging
                patterns, error notifications, and server-side metrics to trace
                bugs instantly.
              </p>
            </div>
          </section>

          {/* Verifiable Case Studies Proof */}
          <section className="space-y-8">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Verifiable Case Studies & Proof
              </h2>
              <p className="text-sm text-muted-foreground">
                Explore real, completed full-stack software products,
                attribution pipelines, and automated tools.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {caseStudies.map((study) => (
                <article
                  key={study.title}
                  className="rounded-2xl border border-border bg-surface/25 p-6 space-y-4 flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 h-24 w-24 bg-primary/5 rounded-full blur-2xl -z-10" />

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <IconAward className="h-4.5 w-4.5" />
                      </div>
                      <div className="flex flex-col">
                        {study.descriptor && (
                          <span className="text-[10px] font-mono tracking-widest text-primary uppercase block mb-1">
                            {study.descriptor}
                          </span>
                        )}
                        <h3 className="font-bold text-base text-foreground">
                          {study.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {study.desc}
                    </p>
                  </div>

                  <div className="space-y-4 pt-2 border-t border-border/50">
                    <div className="flex flex-wrap gap-1.5">
                      {study.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-border bg-background/50 px-2.5 py-0.5 text-[10px] font-mono text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div>
                      <Link
                        href={study.url}
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-hover group/link transition-colors"
                      >
                        View case details
                        <IconChevronRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Accordion FAQs */}
          <section className="space-y-8 max-w-3xl mx-auto">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
                <IconHelp className="h-6 w-6 text-primary" /> Frequently Asked
                Questions
              </h2>
              <p className="text-sm text-muted-foreground">
                Clear answers regarding design systems, backend schemas, RAG
                integrations, security, and deployment.
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

          {/* Dynamic prefecthed contact CTA Banner */}
          <section className="relative rounded-3xl border border-primary/20 bg-surface/20 p-8 md:p-12 overflow-hidden text-center max-w-3xl mx-auto">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 bg-primary/5 rounded-full blur-[100px] -z-10" />

            <div className="max-w-xl mx-auto space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Let&apos;s build your full-stack AI product
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed animate-pulse">
                From database normalizations and FastAPI backend gateways to
                modern Next.js interactive UI panels and secure Docker
                deployments. Let&apos;s schedule a technical discovery call.
              </p>
              <div className="pt-4 flex flex-col items-center gap-4">
                <Link
                  href={contactUrl}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                >
                  Book a technical discovery call
                  <IconArrowRight className="h-4.5 w-4.5" />
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
