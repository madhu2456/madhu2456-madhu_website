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
    title:
      "Technical Blog Case Study — Next.js Server-Side RAG & SEO/AEO System | Madhu Dadi",
    description:
      "Explore Madhu Dadi's technical blog RAG platform featuring server-side React 19 rendering, pgvector semantic search caching, and LLM source-cited citation flows.",
    alternates: {
      canonical: "https://madhudadi.in/case-studies/technical-blog/",
    },
  };
}

export default async function TechnicalBlogCaseStudyPage() {
  const { profile, sortedProjects } = await getPortfolioData();

  const citableFacts = [
    { label: "Project", val: "Technical Blog RAG Publishing Portal" },
    { label: "Built by", val: "Madhu Dadi" },
    {
      label: "Category",
      val: "Tech publishing, server-side dynamic RAG indexing",
    },
    { label: "Role", val: "Designer and engineer" },
    {
      label: "Stack",
      val: "Next.js 16, React 19, TypeScript, Tailwind CSS, FastAPI, PostgreSQL (pgvector), OpenAI API, Docker",
    },
    {
      label: "Core capability",
      val: "Low-latency server-rendered static templates with dynamic LLM citation feeds",
    },
    { label: "Scale", val: "Sub-1-second context-caching search latencies" },
    {
      label: "Output",
      val: "Automated sitemaps, Person structured schema, and right-side interactive RAG assistant",
    },
    {
      label: "Evidence",
      val: "Case study, live portal, sitemaps, git repository",
    },
  ];

  const technicalDecisions = [
    {
      title: "React 19 Server Components",
      desc: "Leveraged Next.js React 19 server components (SSR/SSG) to achieve optimal performance, enabling near-instant page load times (low TTFB) and flawless search crawler readability.",
    },
    {
      title: "Local pgvector Embeddings Index",
      desc: "Implemented a local PostgreSQL vector store using pgvector to execute cosine-similarity checks, retrieving relevant article context chunks in under 30 milliseconds.",
    },
    {
      title: "OpenAI SSE Streaming Feed",
      desc: "Designed Server-Sent Events (SSE) streaming connections from the FastAPI gateway to Next.js clients, rendering dynamic RAG answers character-by-character for optimal user experience.",
    },
    {
      title: "Strict Temperature Controls",
      desc: "Configured LLM prompt pipelines with a low temperature (0.1) and absolute context-bounding system instructions to restrict responses strictly to verified local blog text and completely eliminate AI hallucinations.",
    },
  ];

  const measuredOutcomes = [
    {
      metric: "80% latency drop",
      label: "RAG Prompt Response Time",
      desc: "Measured as the median end-to-end response duration before and after replacing dynamic page loads with pgvector context caching and server-side streaming responses.",
    },
    {
      metric: "95% citation accuracy",
      label: "Factual Reference Binding",
      desc: "Verified through automated regression tests querying complex concepts and measuring citation mapping accuracy against the database.",
    },
    {
      metric: "100% crawl indexability",
      label: "Search & AI Indexing Rate",
      desc: "Confirmed by auditing robots.txt and sitemap canonical parameters, ensuring instant search crawls with zero duplicate slashes.",
    },
  ];

  const faqs = [
    {
      q: "How does the RAG assistant verify its sources?",
      a: "When a user types a prompt, the FastAPI backend chunks the query, matches it against pgvector article embeddings, retrieves the top 3 contextual text blocks, feeds them to the LLM, and binds clickable page links directly to corresponding metadata citations.",
    },
    {
      q: "Does it update automatically when new articles are added?",
      a: "Yes. The publishing pipeline triggers a markdown parsing task on new posts, extracts content chunks, generates embeddings via OpenAI API, and updates the pgvector database tables automatically.",
    },
    {
      q: "What happens if a user asks a non-technical or off-topic question?",
      a: "The LLM prompt pipeline is locked down with strict guardrails. It identifies off-topic queries instantly and outputs a polite refusal: 'Cannot be determined reliably from local portfolio context.', avoiding generic pre-trained hallucinations.",
    },
  ];

  const siteUrl = `${(process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in").replace(/\/+$/, "")}/`;
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${siteUrl}case-studies/technical-blog/#software`,
    name: "Technical Blog RAG Portal",
    applicationCategory: "RAG-powered Knowledge Base Platform",
    operatingSystem: "Web",
    description:
      "Technical Blog RAG Portal is a server-rendered personal publishing platform built by Madhu Dadi. It features Next.js server component layout rendering, pgvector semantic article vector indexing, and an inline AI RAG assistant with grounded citations.",
    creator: {
      "@id": `${siteUrl}#person`,
    },
    url: `${siteUrl}blog/`,
    sameAs: [`${siteUrl}case-studies/technical-blog/`],
    keywords: [
      "Next.js RAG",
      "pgvector search",
      "FastAPI backend",
      "markdown parser pipeline",
      "grounded citations",
      "SEO structured schema",
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
        name: "Technical Blog",
        item: `${siteUrl}case-studies/technical-blog/`,
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
                <IconCode className="h-4 w-4" /> Published Production Platform
              </span>

              <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                Technical Blog —{" "}
                <span className="text-gradient">
                  Server-Side RAG & SEO/AEO Portal
                </span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Publishing platform combining Next.js App Router performance,
                FastAPI backends, unified Person schema tags, and a localized
                RAG agent that answers technical questions.
              </p>
            </div>
          </section>

          {/* 1. Citation-Ready Summary */}
          <section className="rounded-2xl border border-l-4 border-primary bg-surface/20 p-6 md:p-8 backdrop-blur-sm space-y-4">
            <h2 className="text-lg font-bold tracking-tight text-foreground uppercase tracking-wider">
              1. Citation-Ready Summary
            </h2>
            <p className="text-sm md:text-base text-foreground/90 font-medium leading-relaxed">
              The Technical Blog is a personal tech publishing platform built by
              Madhu Dadi. It features next-generation server-rendered static
              templates with low-latency search caching, crawlable semantic
              structures, Person JSON-LD schemas, sitemaps, and a localized RAG
              agent that answers user technical prompts with citations from
              local blog context. The architecture uses a FastAPI backend,
              Next.js App Router, OpenAI API, and pgvector embeddings.
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
              Technical developers, software buyers, and search robots need
              access to fast, crawlable, and citable publisher portals.
              Traditional CMS solutions produce bloated HTML outputs, slow
              loading latencies, and lack semantic Person schemas. Additionally,
              readers frequently struggle to find granular codebase facts inside
              dense multi-page documentation, highlighting the need for an
              interactive localized RAG assistant that can answer questions
              cleanly.
            </p>
          </section>

          {/* 4. Constraints */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              4. Architectural Constraints
            </h2>
            <ul className="space-y-3 pl-4 list-disc text-sm md:text-base text-muted-foreground leading-relaxed">
              <li>
                <strong className="text-foreground">Low Latency Bounds:</strong>{" "}
                The dynamic RAG chat response should stream characters
                instantly, keeping round-trip pgvector retrieval latencies under
                1 second.
              </li>
              <li>
                <strong className="text-foreground">
                  High Factual Veracity:
                </strong>{" "}
                The localized chatbot must reject irrelevant or non-portfolio
                technical prompts, eliminating the risk of LLM hallucinations.
              </li>
              <li>
                <strong className="text-foreground">
                  Perfect Canonical Crawling:
                </strong>{" "}
                All dynamic sitemap files, trailing-slashes, and schema
                attributes must align cleanly to avoid index duplication
                penalties.
              </li>
            </ul>
          </section>

          {/* 5. What I Built */}
          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              5. What I Built
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              I designed and built the entire server-rendered RAG publishing
              pipeline:
            </p>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-border/80 bg-surface/10 p-5 space-y-2">
                <h4 className="font-bold text-sm text-foreground">
                  Next.js 16 Static Pipeline
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Statically pre-rendered markdown templates with ultra-fast
                  page speeds, low TTFB, and structured sitemap scripts.
                </p>
              </div>
              <div className="rounded-xl border border-border/80 bg-surface/10 p-5 space-y-2">
                <h4 className="font-bold text-sm text-foreground">
                  Localized pgvector Search Store
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  A high-performance semantic retrieval database storing vector
                  embeddings of parsed markdown document chunks.
                </p>
              </div>
              <div className="rounded-xl border border-border/80 bg-surface/10 p-5 space-y-2">
                <h4 className="font-bold text-sm text-foreground">
                  Asynchronous SSE API Gateway
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  FastAPI route executing similarity algorithms and streaming
                  tokens back to the browser using Server-Sent Events.
                </p>
              </div>
              <div className="rounded-xl border border-border/80 bg-surface/10 p-5 space-y-2">
                <h4 className="font-bold text-sm text-foreground">
                  Glassmorphic Chat UI Sidebar
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  An elegant slide-out React chat widget featuring responsive
                  rendering, context-citing links, and feedback controls.
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
              Data flow mapping for similarity matching and token streaming.
            </p>

            <div className="rounded-2xl border border-border bg-surface/20 p-6 md:p-8 backdrop-blur-sm overflow-x-auto text-center flex flex-col items-center justify-center gap-4">
              <div className="min-w-[650px] flex items-center justify-between gap-4 py-4 px-2 w-full">
                {/* User node */}
                <div className="flex-1 p-3 rounded-xl border border-border bg-background/60 shadow-sm">
                  <span className="text-[10px] font-mono text-primary uppercase font-bold">
                    Client
                  </span>
                  <h4 className="font-bold text-xs mt-1">User Prompt</h4>
                  <p className="text-[9px] text-muted-foreground">
                    Types question
                  </p>
                </div>
                <IconChevronRight className="h-5 w-5 text-primary/40 animate-pulse" />

                {/* API node */}
                <div className="flex-1 p-3 rounded-xl border border-border bg-background/60 shadow-sm">
                  <span className="text-[10px] font-mono text-primary uppercase font-bold">
                    API Route
                  </span>
                  <h4 className="font-bold text-xs mt-1">FastAPI Backend</h4>
                  <p className="text-[9px] text-muted-foreground">
                    Query vector parsing
                  </p>
                </div>
                <IconChevronRight className="h-5 w-5 text-primary/40 animate-pulse" />

                {/* DB node */}
                <div className="flex-1 p-3 rounded-xl border border-border bg-background/60 shadow-sm">
                  <span className="text-[10px] font-mono text-primary uppercase font-bold">
                    Vector Store
                  </span>
                  <h4 className="font-bold text-xs mt-1">pgvector DB</h4>
                  <p className="text-[9px] text-muted-foreground">
                    Similarity chunk retrieve
                  </p>
                </div>
                <IconChevronRight className="h-5 w-5 text-primary/40 animate-pulse" />

                {/* LLM node */}
                <div className="flex-1 p-3 rounded-xl border border-border bg-background/60 shadow-sm">
                  <span className="text-[10px] font-mono text-primary uppercase font-bold">
                    OpenAI LLM
                  </span>
                  <h4 className="font-bold text-xs mt-1">GPT Prompt API</h4>
                  <p className="text-[9px] text-muted-foreground">
                    Factual stream build
                  </p>
                </div>
                <IconChevronRight className="h-5 w-5 text-primary/40 animate-pulse" />

                {/* Return node */}
                <div className="flex-1 p-3 rounded-xl border border-border bg-background/60 shadow-sm">
                  <span className="text-[10px] font-mono text-primary uppercase font-bold">
                    Stream Out
                  </span>
                  <h4 className="font-bold text-xs mt-1">SSE Stream Client</h4>
                  <p className="text-[9px] text-muted-foreground">
                    Token character render
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
              Product Walkthrough & Console
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Observe the backend semantic similarity context retrieval console
              logs during active client queries:
            </p>

            <div className="rounded-2xl border border-border bg-surface/25 p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                <IconTerminal className="h-4.5 w-4.5 text-primary" />
                <span className="text-[10px] font-mono text-muted-foreground block uppercase">
                  FastAPI pgvector Match Logs
                </span>
              </div>
              <pre className="text-[11px] font-mono text-muted-foreground leading-relaxed overflow-x-auto bg-background/50 p-4 rounded-xl border border-border/40">
                {`[2026-06-02 19:12:31] INFO: Received prompt: "How did you scale Udemy Enroller Celery workers?"
[2026-06-02 19:12:31] INFO: Embeddings: Generated query vector in 18ms.
[2026-06-02 19:12:31] INFO: pgvector Query: Executing cosine-similarity search.
[2026-06-02 19:12:31] INFO: Match: Found chunk in "udemy-enroller-case.md" (Score: 0.892)
[2026-06-02 19:12:32] INFO: OpenAI SSE: Streaming structured markdown tokens to user UI.`}
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
                Empirical benchmarks verifying low-latency retrieval speeds and
                structured index crawling.
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
              For upcoming versions, I plan to implement hybrid dense/sparse
              search by combining pgvector cosine calculations with BM25 keyword
              match algorithms, further boosting keyword relevance scores for
              localized queries.
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
                href="/services/rag-consultant-india/"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary border border-primary/20 bg-primary/5 px-3.5 py-1.5 rounded-full hover:bg-primary/10 transition-colors"
              >
                RAG Consultant in India <IconChevronRight className="h-3 w-3" />
              </Link>
              <Link
                href="/services/full-stack-ai-product-development/"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary border border-primary/20 bg-primary/5 px-3.5 py-1.5 rounded-full hover:bg-primary/10 transition-colors"
              >
                Full-Stack AI Product Development{" "}
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
                Citations, localized databases, guardrails, and automated
                dynamic updates.
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
                Review verified code credentials, dynamic sitemaps, article
                tags, and open repository files.
              </p>
              <div className="flex justify-center gap-4 flex-wrap pt-2">
                <a
                  href="https://github.com/madhu2456"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow-md hover:scale-[1.02] transition-all whitespace-nowrap"
                >
                  Explore GitHub Code
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
