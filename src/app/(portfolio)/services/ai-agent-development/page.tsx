import {
  IconAlertCircle,
  IconArrowRight,
  IconBrain,
  IconCheck,
  IconChevronRight,
  IconCpu,
  IconHelp,
  IconSettings,
  IconSquareCheck,
  IconTerminal,
  IconUsers,
} from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getPortfolioData } from "@/lib/portfolio-data";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = `${(process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in").replace(/\/+$/, "")}/`;
  const canonicalUrl = `${siteUrl}services/ai-agent-development/`;

  return {
    title: "AI Agent Engineer for Tool-Using LLM Workflows | Madhu Dadi",
    description:
      "Hire Madhu Dadi to build production AI agents with tool integrations, workflow controls, loop prevention, FastAPI backends, and Next.js interfaces.",
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function AiAgentDevelopmentPage() {
  const { profile, sortedProjects } = await getPortfolioData();

  // Prefilled contact URL configuration
  const prefillSubject = "AI Agent Development Inquiry";
  const prefillMessage = `Hi Madhu,\n\nI read your AI Agent Development service page and would love to schedule a discovery call.\n\nProject Scope:\n- Intended Agent Tasks:\n- Required Tools/APIs:\n- Estimated Run Scopes:\n\nLooking forward to speaking with you!`;
  const contactUrl = `/contact/?subject=${encodeURIComponent(prefillSubject)}&message=${encodeURIComponent(prefillMessage)}`;

  // Agent capabilities checklist
  const agentCapabilities = [
    "Goal Decomposition & Planning",
    "JSON Schema Function Calling",
    "API Integrations & Webhooks",
    "Sandboxed Code Execution",
    "LangGraph State Management",
    "Infinite Loop Protections",
    "Structured Parser Guardrails",
    "Graceful Failure Fallbacks",
    "Human Approval Gates",
    "Token Cost & Run Telemetry",
    "Execution Audit Logs",
    "Server-Side GA4/BigQuery Hooks",
  ];

  const sections = [
    {
      id: "definition",
      title: "1. What I Mean by AI Agents",
      icon: <IconBrain className="h-5 w-5 text-primary" />,
      desc: "Unlike standard static chatbots that operate on rigid if-else branches, AI agents are software entities designed with autonomous reasoning loops. They analyze a high-level goal, decompose it into sequential sub-tasks, select appropriate external tools, validate their own outputs, and self-correct when errors arise.",
    },
    {
      id: "comparison",
      title: "2. Chatbot vs. Autonomous Agent",
      icon: <IconCpu className="h-5 w-5 text-primary" />,
      desc: "Chatbots excel at answering questions from static knowledge bases. Agents, however, actively execute workflows. They read emails, query corporate SQL databases, compute metrics, call third-party APIs, write files, and handle asynchronous tasks over long durations, acting as autonomous team members.",
    },
    {
      id: "tooluse",
      title: "3. Tool-Use & API Architecture",
      icon: <IconTerminal className="h-5 w-5 text-primary" />,
      desc: "Agents require highly robust, structured integrations. I define explicit JSON schemas and Pydantic validation boundaries for every function the agent can invoke. This guarantees the LLM passes the exact correct parameters, preventing invalid API calls and system crashes.",
    },
    {
      id: "guardrails",
      title: "4. Guardrails & Failure Handling",
      icon: <IconAlertCircle className="h-5 w-5 text-destructive" />,
      desc: "The biggest bottleneck with agents is unpredictable behavior. I implement strict execution boundaries: maximum step depth limits to prevent infinite loops, structured output parsing guardrails (like instructor or guardrails-ai) to fix malformed JSON, and clean fallback behaviors when APIs time out.",
    },
    {
      id: "audit",
      title: "5. Logging & Audit Trails",
      icon: <IconTerminal className="h-5 w-5 text-primary" />,
      desc: "Production agents require complete traceability. Every task decomposition, prompt version, tool input/output, and LLM raw response is logged. This enables you to inspect the exact execution trace, prompt versions, tool calls, inputs, outputs, and decision path of the agent, trace execution timelines, and audit run history on admin dashboards.",
    },
    {
      id: "hitl",
      title: "6. Human-in-the-Loop Workflows",
      icon: <IconUsers className="h-5 w-5 text-primary" />,
      desc: "Certain tasks—like processing refunds, deleting database rows, or sending outbound client emails—require manual review. I build deterministic state machines using LangGraph that pause agent execution, notify administrators, and await explicit approval before resuming the workflow.",
    },
    {
      id: "analytics",
      title: "7. Analytics & Success Measurement",
      icon: <IconSettings className="h-5 w-5 text-primary" />,
      desc: "We track the downstream commercial performance of your agents. Telemetry tags measure total tokens consumed, average execution costs, task completion success rates, and user satisfaction ratings, routing metrics directly into GA4 and BigQuery.",
    },
  ];

  const faqs = [
    {
      q: "How do you prevent agents from getting stuck in infinite loops?",
      a: "I enforce strict execution boundaries: (1) setting hard maximum step limits (e.g., max 15 steps per task run), (2) implementing semantic loop detection checks that analyze duplicate tool inputs, and (3) coding graceful fallbacks that hand tasks off to humans.",
    },
    {
      q: "What frameworks do you build agents with?",
      a: "I build primary state-machine agents using LangGraph for deterministic state control, task planners, and multi-agent coordination. I also utilize CrewAI or lightweight custom execution loops depending on the scope.",
    },
    {
      q: "Do you include human approval gates?",
      a: "Yes. I construct custom LangGraph state machines that automatically pause the execution thread when high-impact tools are triggered (e.g., executing a purchase or emailing a client). The agent saves its state and resumes only after receiving a secure HTTP approval signal.",
    },
    {
      q: "Can you connect agent telemetry to marketing and product analytics?",
      a: "Yes. Every tool call, task completion rate, token footprint, and user feedback is instrumented using downstream hooks, sending structured telemetry directly into GA4 and BigQuery to analyze return on investment.",
    },
  ];

  const siteUrl = `${(process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in").replace(/\/+$/, "")}/`;
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl}services/ai-agent-development/#service`,
    name: "AI Agent Development",
    serviceType: "AI agent development",
    description:
      "Autonomous AI agents using tools, following workflow graph rules, integrating observability, loop control, and human approval loops.",
    provider: {
      "@id": `${siteUrl}#person`,
    },
    areaServed: ["India", "Worldwide", "Remote"],
    url: `${siteUrl}services/ai-agent-development/`,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "AI Agent engineering services",
      itemListElement: [
        {
          "@type": "Offer",
          name: "Tool-use frameworks",
          description:
            "Custom function calling integrations utilizing LangGraph and state machines.",
        },
        {
          "@type": "Offer",
          name: "Human-in-the-loop gates",
          description:
            "Deterministic pause-and-resume workflows for human approval on high-impact tasks.",
        },
        {
          "@type": "Offer",
          name: "Error correction & loop guards",
          description:
            "Infinite loop detection and runtime fallback protections.",
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
        name: "AI Agent Development",
        item: `${siteUrl}services/ai-agent-development/`,
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
                <IconCpu className="h-4 w-4" /> Autonomous Operations
              </span>

              <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                AI Agent Engineer for{" "}
                <span className="text-gradient">Tool-Using LLM Workflows</span>
              </h1>

              {/* Above-the-fold opening copy */}
              <div className="border-l-4 border-primary pl-5 py-2">
                <p className="text-base md:text-lg text-foreground/90 font-medium leading-relaxed">
                  I build AI agents that can use tools, call APIs, retrieve
                  knowledge, follow business rules, and complete defined
                  workflows without becoming unreliable demo software. My focus
                  is on guardrails, evals, observability, fallback behavior, and
                  measurable outcomes.
                </p>
              </div>
            </div>
          </section>

          {/* Agent Capabilities Checklist */}
          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
              <IconSquareCheck className="h-5.5 w-5.5 text-primary" /> Core
              Agent Capabilities Checklist
            </h2>
            <div className="rounded-2xl border border-border bg-surface/10 p-6 md:p-8">
              <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {agentCapabilities.map((item) => (
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

          {/* Core Agent Sections */}
          <section className="space-y-8">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Agentic Engineering Architecture
              </h2>
              <p className="text-sm text-muted-foreground">
                How we construct robust, predictable multi-agent systems
                designed for production reliability.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {sections.map((sect) => (
                <article
                  key={sect.id}
                  className="rounded-2xl border border-border bg-surface/20 p-6 space-y-4 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                      {sect.icon}
                    </div>
                    <h3 className="font-bold text-sm md:text-base text-foreground">
                      {sect.title}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {sect.desc}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* Proof / Verified Case Studies */}
          <section className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Agent & Workflow Project Proof
              </h2>
              <p className="text-sm text-muted-foreground">
                Explore real, verified case studies where I designed and shipped
                advanced automation workflows and indexing engines.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Udemy Enroller */}
              <article className="group rounded-2xl border border-border bg-surface/20 p-6 space-y-4 hover:-translate-y-1 transition-all duration-300">
                <span className="text-[10px] font-mono tracking-widest text-primary uppercase block">
                  FastAPI Automation Workflow
                </span>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  Browser Task Automation System
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Built a private FastAPI automation project exploring async
                  task queues, Playwright workflow orchestration, bounded worker
                  concurrency, secure session-state handling, and telemetry
                  logging.
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
                Let&apos;s build your autonomous agent
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Whether you need multi-agent planning state-machines, automated
                data ingestion flows, or human-in-the-loop approval systems, I
                design and ship production agents that execute reliably.
              </p>
              <div className="pt-4 flex flex-col items-center gap-4">
                <Link
                  href={contactUrl}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                >
                  Schedule agent discovery call
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
