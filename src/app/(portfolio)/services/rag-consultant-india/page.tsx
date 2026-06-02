import {
  IconAlertCircle,
  IconAlertTriangle,
  IconArrowRight,
  IconCheck,
  IconChevronRight,
  IconDatabase,
  IconHelp,
  IconSettings,
  IconSquareCheck,
  IconTerminal,
  IconTools,
} from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getPortfolioData } from "@/lib/portfolio-data";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = `${(process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in").replace(/\/+$/, "")}/`;
  const canonicalUrl = `${siteUrl}services/rag-consultant-india/`;

  return {
    title: "RAG Consultant in India — Source-Cited AI Assistants | Madhu Dadi",
    description:
      "Madhu Dadi builds RAG systems and source-cited AI assistants using FastAPI, Next.js, vector databases, evals, logs, and analytics instrumentation for production teams.",
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function RagConsultantIndiaPage() {
  const { profile, sortedProjects } = await getPortfolioData();

  // Prefilled contact URL configuration
  const prefillSubject = "RAG Consulting Inquiry";
  const prefillMessage = `Hi Madhu,\n\nI read your RAG Consultant page and would love to discuss a custom RAG/semantic search implementation.\n\nProject Scope:\n- Types of Documents:\n- Volume of Data:\n- Expected Target Latency:\n\nLet's connect!`;
  const contactUrl = `/contact/?subject=${encodeURIComponent(prefillSubject)}&message=${encodeURIComponent(prefillMessage)}`;

  // RAG Checklist Items (16 Items requested in the checklist specification)
  const ragChecklist = [
    "Document Ingestion Pipelines",
    "Smart Chunking Strategy",
    "Metadata Enrichment Strategy",
    "Embedding Model Selection",
    "Vector Database Schema Design",
    "Hybrid Dense/Sparse Search",
    "Cross-Encoder Reranking",
    "Grounding Context Prompts",
    " Verifiable Source Citations",
    "Graceful Refusal Behavior",
    "Continuous Evaluation Datasets",
    "p95 Latency Tracking",
    "Downstream Cost Tracking",
    "User Thumbs Up/Down Feedback",
    "Admin Review & Logs Tools",
    "Observability & Active Alerting",
  ];

  const goodRagNeeds = [
    {
      title: "Context-Aware Chunking",
      desc: "Document splits based on semantic sections (headers, tables, paragraphs) rather than rigid character counts.",
    },
    {
      title: "Hybrid Dense/Sparse Search",
      desc: "Combining neural semantic search (vector) with exact keyword matching (BM25) to cover synonyms and serial numbers.",
    },
    {
      title: "Cross-Encoder Reranking",
      desc: "Using lightweight reranker models (like Cohere or BGE) to ensure the absolute most relevant chunks are fed into the context window.",
    },
    {
      title: "Citation Telemetry",
      desc: "Tracing every generated claim to its source chunk index, allowing users to verify facts in one click.",
    },
  ];

  const commonFailureModes = [
    {
      title: "Lost in the Middle",
      desc: "LLMs ignore critical facts hidden in the middle of extremely large context windows, causing wrong answers.",
    },
    {
      title: "Source Hallucination",
      desc: "Making up source citations or linking to completely unrelated document chunks when retrieval fails.",
    },
    {
      title: "Data Leakage",
      desc: "Exposing private or sensitive files across organization roles due to a lack of strict metadata tenant filters.",
    },
    {
      title: "Silent Retrieval Failure",
      desc: "Generating highly confident answers based on completely outdated or empty retrieved contexts.",
    },
  ];

  const implementationProcess = [
    {
      step: "01",
      title: "Telemetry & Schema Design",
      desc: "Audit your data schemas, design ingestion ETL pipelines, and model metadata filtering policies.",
    },
    {
      step: "02",
      title: "Vector Store Tuning",
      desc: "Select the optimal embedding model, setup vector index settings (Pinecone, Qdrant, pgvector), and tune hybrid search weights.",
    },
    {
      step: "03",
      title: "Reranker & Prompt Assembly",
      desc: "Integrate multi-stage reranking pipelines, enforce rigid system prompts, and build robust refusal and citation templates.",
    },
    {
      step: "04",
      title: "Evals & Analytics Handoff",
      desc: "Set up evaluation datasets (RAGAS framework), instrument downstream GA4/BigQuery telemetry, and deploy admin review tools.",
    },
  ];

  const archOptions = [
    {
      name: "Lightweight SQL RAG",
      stack: "Postgres (pgvector) + FastAPI",
      suitability:
        "SaaS products with highly transactional data, strict role policies, and lower volumes (<50k pages).",
    },
    {
      name: "Dedicated Vector Store RAG",
      stack: "Pinecone / Qdrant + FastAPI + Celery",
      suitability:
        "High-volume, sub-second search applications needing advanced metadata isolation and scaling.",
    },
    {
      name: "Hybrid Neural RAG",
      stack: "BM25 + Vector + Cohere Rerank",
      suitability:
        "Enterprise search portals requiring high lexical precision (IDs, skus) and semantic depth.",
    },
  ];

  const faqs = [
    {
      q: "How do you guarantee that a RAG assistant will not hallucinate?",
      a: "No LLM is 100% immune, but we minimize hallucination to near-zero by: (1) enforcing strict prompt boundaries that forbid answering without context, (2) using citation parser schemas, and (3) adding evaluation guardrails.",
    },
    {
      q: "Can you implement RAG on private local data?",
      a: "Yes. I build secure vector stores utilizing strict metadata tenant filtering or private VPC deployments to ensure user permissions are respected and private files are never leaked.",
    },
    {
      q: "What embedding models and vector databases do you recommend?",
      a: "I recommend Cohere or OpenAI text-embeddings-3-large for general use, and Pinecone or Qdrant for dedicated vector indexing. If your stack is Postgres, pgvector is an exceptionally clean, low-overhead starting point.",
    },
    {
      q: "How do you trace costs and latencies?",
      a: "We integrate downstream observability layers (such as LangSmith or custom logging) to trace exact prompt/completion tokens, model latencies, and routing flows, giving you full visibility into run costs.",
    },
  ];

  const siteUrl = `${(process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in").replace(/\/+$/, "")}/`;
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl}services/rag-consultant-india/#service`,
    name: "RAG System Development & Consulting",
    serviceType: "RAG system consulting and development",
    description:
      "Retrieval-augmented generation systems and source-cited AI assistants featuring hybrid search, rerankers, evals, and observability.",
    provider: {
      "@id": `${siteUrl}#person`,
    },
    areaServed: ["India", "Worldwide", "Remote"],
    url: `${siteUrl}services/rag-consultant-india/`,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "RAG engineering services",
      itemListElement: [
        {
          "@type": "Offer",
          name: "Vector database integration",
          description:
            "Integration of pgvector, Pinecone, or Qdrant for semantic query matching.",
        },
        {
          "@type": "Offer",
          name: "Document ingestion pipelines",
          description:
            "Chunking, metadata enrichment, and vector embedding pipelines.",
        },
        {
          "@type": "Offer",
          name: "Source attribution & citation UI",
          description:
            "Observability and user interfaces showing precise source document citations.",
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
        name: "RAG Consultant in India",
        item: `${siteUrl}services/rag-consultant-india/`,
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
                <IconDatabase className="h-4 w-4" /> Enterprise Semantic Search
              </span>

              <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                RAG Consultant <span className="text-gradient">in India</span>
              </h1>

              {/* Above-the-fold opening copy */}
              <div className="border-l-4 border-primary pl-5 py-2">
                <p className="text-base md:text-lg text-foreground/90 font-medium leading-relaxed">
                  I design and build retrieval-augmented generation systems that
                  answer from your documents, content, databases, or knowledge
                  base with source citations, retrieval controls, evals, logs,
                  and production-ready APIs.
                </p>
              </div>
            </div>
          </section>

          {/* Scannable RAG Checklist */}
          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
              <IconSquareCheck className="h-5.5 w-5.5 text-primary" />{" "}
              Production RAG Requirements Checklist
            </h2>
            <div className="rounded-2xl border border-border bg-surface/10 p-6 md:p-8">
              <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {ragChecklist.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 items-center text-xs font-medium text-foreground/95"
                  >
                    <IconCheck className="h-4 w-4 text-primary shrink-0 font-bold" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* What Good RAG Needs vs Common Failure Modes */}
          <section className="grid gap-8 md:grid-cols-2">
            {/* What RAG Needs */}
            <article className="rounded-2xl border border-border bg-surface/20 p-6 md:p-8 space-y-6">
              <h2 className="text-lg md:text-xl font-bold tracking-tight flex items-center gap-2">
                <IconCheck className="h-5 w-5 text-primary" /> What a Good RAG
                System Needs
              </h2>
              <div className="space-y-4">
                {goodRagNeeds.map((item) => (
                  <div key={item.title} className="space-y-1">
                    <h3 className="text-sm font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            {/* Failure Modes */}
            <article className="rounded-2xl border border-border bg-surface/20 p-6 md:p-8 space-y-6">
              <h2 className="text-lg md:text-xl font-bold tracking-tight flex items-center gap-2">
                <IconAlertTriangle className="h-5 w-5 text-destructive" />{" "}
                Common RAG Failure Modes
              </h2>
              <div className="space-y-4">
                {commonFailureModes.map((item) => (
                  <div key={item.title} className="space-y-1">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-destructive" />{" "}
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          </section>

          {/* RAG Process Timeline */}
          <section className="space-y-8">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-center">
              My RAG Implementation Process
            </h2>
            <div className="grid gap-6 md:grid-cols-4">
              {implementationProcess.map((item) => (
                <div
                  key={item.step}
                  className="relative rounded-xl border border-border bg-surface/10 p-5 space-y-3"
                >
                  <span className="text-3xl font-mono font-bold text-primary/30 block">
                    {item.step}
                  </span>
                  <h3 className="font-bold text-sm text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Architecture Options Compare Cards */}
          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
              <IconTools className="h-5.5 w-5.5 text-primary" /> RAG System
              Architecture Options
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {archOptions.map((opt) => (
                <div
                  key={opt.name}
                  className="rounded-xl border border-border bg-surface/15 p-6 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <h3 className="font-bold text-base text-foreground">
                      {opt.name}
                    </h3>
                    <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-mono bg-primary/10 text-primary border border-primary/20">
                      {opt.stack}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {opt.suitability}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Evals, Hallucination, Citations, & Telemetry Splits */}
          <section className="grid gap-8 md:grid-cols-3">
            {/* Evals and Hallucination Controls */}
            <article className="rounded-2xl border border-border bg-surface/20 p-6 space-y-4">
              <h2 className="text-base font-bold tracking-tight flex items-center gap-2">
                <IconAlertCircle className="h-4.5 w-4.5 text-primary" /> 1.
                Evaluation & Hallucination
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We establish strict test suites using frameworks like RAGAS to
                score faithfulness, answer relevance, and context recall,
                checking prompts against versioned retrieval indexes before
                shipping.
              </p>
            </article>

            {/* Citation and source display design */}
            <article className="rounded-2xl border border-border bg-surface/20 p-6 space-y-4">
              <h2 className="text-base font-bold tracking-tight flex items-center gap-2">
                <IconTerminal className="h-4.5 w-4.5 text-primary" /> 2.
                Citation & Source Display
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Citations are designed at the ingestion level. We inject chunk
                metadata filters that return precise page numbers, section
                headers, and click-through link tags in streaming markdown
                formats.
              </p>
            </article>

            {/* Analytics and feedback loops */}
            <article className="rounded-2xl border border-border bg-surface/20 p-6 space-y-4">
              <h2 className="text-base font-bold tracking-tight flex items-center gap-2">
                <IconSettings className="h-4.5 w-4.5 text-primary" /> 3.
                Analytics & Feedback
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Every prompt, retrieval duration, embedding token cost, and
                thumbs-up/down click is cleanly instrumented and routed into
                BigQuery to constantly refine retrieval weights and chunk
                strategies.
              </p>
            </article>
          </section>

          {/* Proof / Verified Case Studies */}
          <section className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Grounded RAG Project Proof
              </h2>
              <p className="text-sm text-muted-foreground">
                Explore real, verified case studies where I designed and shipped
                advanced semantic search pipelines.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Technical Blog */}
              <article className="group rounded-2xl border border-border bg-surface/20 p-6 space-y-4 hover:-translate-y-1 transition-all duration-300">
                <span className="text-[10px] font-mono tracking-widest text-primary uppercase block">
                  Retrieval-Augmented Generation
                </span>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  Technical Blog RAG Assistant
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Designed a precise, high-accuracy Q&A search system backed by
                  vector search pipelines, custom semantic chunking schemas, and
                  multi-stage prompt validation rigs.
                </p>
                <div className="pt-2">
                  <Link
                    href="/case-studies/technical-blog/"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover group/link transition-colors"
                  >
                    View RAG study
                    <IconChevronRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
                  </Link>
                </div>
              </article>

              {/* Adticks */}
              <article className="group rounded-2xl border border-border bg-surface/20 p-6 space-y-4 hover:-translate-y-1 transition-all duration-300">
                <span className="text-[10px] font-mono tracking-widest text-primary uppercase block">
                  AI Marketing Audit Platform
                </span>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  Adticks
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Engineered custom parallel indexing models and multi-stage NLP
                  analysis layers capable of running automated SEO/AEO/GEO
                  diagnostic audits across 10,000+ pages simultaneously.
                </p>
                <div className="pt-2">
                  <Link
                    href="/case-studies/adticks/"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover group/link transition-colors"
                  >
                    View Adticks study
                    <IconChevronRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
                  </Link>
                </div>
              </article>

              {/* Udemy Enroller */}
              <article className="group rounded-2xl border border-border bg-surface/20 p-6 space-y-4 hover:-translate-y-1 transition-all duration-300">
                <span className="text-[10px] font-mono tracking-widest text-primary uppercase block">
                  FastAPI Automation Workflow
                </span>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  Udemy Enroller
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Built a high-throughput, async automated course-enrollment
                  scheduling pipeline using Python, FastAPI, and Postgres,
                  serving over 20,000 automated enrollments cleanly.
                </p>
                <div className="pt-2">
                  <Link
                    href="/case-studies/udemy-enroller-fastapi/"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover group/link transition-colors"
                  >
                    View automation study
                    <IconChevronRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
                  </Link>
                </div>
              </article>
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
                Clear answers about development processes, model capabilities,
                and implementation scope.
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
                Let&apos;s build a high-precision RAG system
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Schedule a technical discovery call to review your current
                document formats, discuss chunking and vector storage designs,
                and outline your evaluation goals.
              </p>
              <div className="pt-4">
                <Link
                  href={contactUrl}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                >
                  Schedule RAG discovery call
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
