/**
 * India-intent service landers (Semrush plan Phase 5).
 * These are real, unique pages — not soft-duplicate doorways of the base services.
 * Each lander has India-specific copy, FAQs, and location framing; it links to the
 * full capability page for deliverables/stack depth.
 */

export type IndiaServiceFaq = {
  question: string;
  answer: string;
};

export type IndiaServiceAlias = {
  /** URL slug under /services/ */
  slug: string;
  /** Base service slug for stack/features deep-link */
  baseServiceSlug: string;
  /** Visible H1 */
  title: string;
  seoTitle: string;
  seoDescription: string;
  heroEyebrow: string;
  shortDescription: string;
  /** TL;DR / direct-answer paragraphs for AEO */
  directAnswer: string[];
  /** India / city positioning bullets */
  whyIndia: string[];
  locationFocus: string[];
  faqs: IndiaServiceFaq[];
  /** Contact form intent hash */
  contactIntent: string;
  timeline?: string;
};

export const INDIA_SERVICE_ALIASES: IndiaServiceAlias[] = [
  {
    slug: "llm-developer-india",
    baseServiceSlug: "ai-llm-application-development",
    title: "LLM Developer & Consultant in India",
    seoTitle: "LLM Developer & Consultant in India | Madhu Dadi",
    seoDescription:
      "Hire an LLM developer in India for production generative AI: structured outputs, FastAPI/Next.js, evals. Remote-ready.",
    heroEyebrow: "India · Generative AI",
    shortDescription:
      "Production LLM applications for India and remote teams — structured outputs, prompt pipelines, guardrails, and handover — not demo notebooks.",
    directAnswer: [
      "Madhu Dadi is an LLM developer and consultant based in Visakhapatnam, India, available remote-first across India and worldwide.",
      "Engagements cover generative AI apps, chat/copilot surfaces, structured outputs (Pydantic/JSON Schema), evals, logging, and deployment notes with explicit latency and cost trade-offs.",
    ],
    whyIndia: [
      "India timezone overlap with US/EU morning and APAC business hours for async-first delivery.",
      "Production experience across Novartis, redBus, and GroupM (WPP) — not only freelance demos.",
      "Clear written specs, telemetry, and handover so in-house teams can own the system after ship.",
    ],
    locationFocus: [
      "Visakhapatnam (home base)",
      "Hyderabad (professional experience)",
      "Remote India & worldwide",
    ],
    faqs: [
      {
        question:
          "Can I hire an LLM developer in India for a US or EU product?",
        answer:
          "Yes. Default delivery is remote-first with written specs, review checkpoints, and overlap windows that work for US East/West and European mornings. On-site kickoffs in India cities are available when the engagement warrants it.",
      },
      {
        question:
          "What is different about this India lander vs the full LLM service page?",
        answer:
          "This page answers India-intent queries (timezone, location, hire-from-India). The full capability page covers architecture, stack, and deliverables in depth. Both share the same engineer and process.",
      },
      {
        question: "What is a typical timeline for an LLM MVP from India?",
        answer:
          "Scoped MVPs with evals and deployment notes often land in 2–6 weeks after discovery. Larger multi-surface products take longer once scope and risk are agreed.",
      },
      {
        question: "Do you work with Indian startups and enterprises?",
        answer:
          "Yes — product teams in India and global teams with India engineering centers. Pricing and process are custom to scope; contact for fit, constraints, and next step.",
      },
    ],
    contactIntent: "ai-llm",
    timeline: "2–6 weeks (scoped MVP)",
  },
  {
    slug: "marketing-analytics-consultant-india",
    baseServiceSlug: "marketing-analytics-consultant",
    title: "Marketing Analytics Consultant in India",
    seoTitle: "Marketing Analytics Consultant in India | Madhu Dadi",
    seoDescription:
      "Marketing analytics consultant in India for GA4/BigQuery, attribution, and CLV. Novartis, redBus, GroupM background.",
    heroEyebrow: "India · Marketing Analytics",
    shortDescription:
      "Attribution, CLV, and marketing decision systems for India and remote teams — pipelines leaders can trust, not vanity dashboards.",
    directAnswer: [
      "Madhu Dadi is a marketing analytics consultant based in Visakhapatnam, India, with 9+ years across healthcare, travel-tech, and media/advertising.",
      "Typical work includes multi-touch attribution, CLV models, GA4/BigQuery warehouses, and decision frameworks that connect campaign telemetry to revenue questions.",
    ],
    whyIndia: [
      "Experience in Indian and global media/measurement stacks (GroupM/WPP, redBus scale, Novartis analytics).",
      "Comfortable with INR- and USD-scoped projects, agency and in-house stakeholder models.",
      "Engineering-led analytics: dbt, SQL, Python, BigQuery — not slide-only consulting.",
    ],
    locationFocus: [
      "Visakhapatnam (home base)",
      "Hyderabad & remote India",
      "Global remote stakeholders",
    ],
    faqs: [
      {
        question: "Do you help Indian brands fix GA4 and BigQuery measurement?",
        answer:
          "Yes. Common work includes event schema cleanup, server-side tracking patterns, BigQuery export modeling, and reports that match finance-grade outcomes rather than only media-platform metrics.",
      },
      {
        question: "Is this the same as the marketing analytics service page?",
        answer:
          "Same practice, India-qualified positioning. Use this URL for hire-in-India intent; the full service page has feature and deliverable depth. Cross-link both in navigation and content.",
      },
      {
        question: "Can you work with agencies and performance teams in India?",
        answer:
          "Yes — agencies, growth teams, and product analytics orgs. Engagements start with a problem statement, data access constraints, and success metrics — not a generic dashboard package.",
      },
      {
        question: "What tools do you typically use?",
        answer:
          "SQL, Python, BigQuery, dbt, Pandas, GA4/GTM, and custom pipelines. Stack is chosen against your warehouse and privacy constraints.",
      },
    ],
    contactIntent: "marketing-analytics",
    timeline: "4–8 weeks",
  },
  {
    slug: "ai-consultant-visakhapatnam",
    baseServiceSlug: "rag-consultant-india",
    title: "AI Consultant in Visakhapatnam",
    seoTitle: "AI Consultant in Visakhapatnam | Madhu Dadi",
    seoDescription:
      "AI consultant in Visakhapatnam for RAG, LLM apps, agents, and analytics. Local home base with Hyderabad experience and remote-first India delivery.",
    heroEyebrow: "Visakhapatnam · AI Consulting",
    shortDescription:
      "Hire an AI engineer based in Visakhapatnam for production RAG, LLM applications, agents, and marketing analytics — local presence, remote-ready delivery.",
    directAnswer: [
      "Madhu Dadi is an AI consultant based in Visakhapatnam, Andhra Pradesh, with professional experience including Hyderabad and remote delivery nationwide and worldwide.",
      "Primary commercial focus: production RAG systems, generative AI apps, AI agents with guardrails, and analytics infrastructure that connects engineering to business outcomes.",
    ],
    whyIndia: [
      "Home base in Visakhapatnam — suitable for teams that want an India-based engineer with production habits, not slideware.",
      "Hybrid discovery and kickoffs possible in Visakhapatnam/Hyderabad when the engagement warrants travel.",
      "Default mode is remote-first with async written specs and clear review checkpoints.",
    ],
    locationFocus: [
      "Visakhapatnam (home base)",
      "Hyderabad (professional experience)",
      "Remote India & worldwide",
    ],
    faqs: [
      {
        question: "Are you available for on-site work in Visakhapatnam?",
        answer:
          "Yes for discovery workshops and kickoffs when it materially helps the engagement. Day-to-day build and review are remote-first for efficiency and documentation quality.",
      },
      {
        question: "How does this relate to the AI consultant in India hub?",
        answer:
          "This page targets Visakhapatnam city intent. The broader /ai-consultant-india/ hub covers multi-city and remote India positioning. Both describe the same person and services.",
      },
      {
        question: "What AI services do you offer from Visakhapatnam?",
        answer:
          "RAG consulting, LLM application development, AI agent systems, marketing analytics, GA4/BigQuery pipelines, and full-stack AI product delivery (FastAPI/Next.js).",
      },
      {
        question: "Do you only serve clients in Andhra Pradesh?",
        answer:
          "No. Visakhapatnam is home base. Clients are India-wide and international; delivery is remote-first unless on-site is agreed.",
      },
    ],
    contactIntent: "rag",
    timeline: "2–12 weeks depending on scope",
  },
];

export function getIndiaServiceAlias(
  slug: string,
): IndiaServiceAlias | undefined {
  return INDIA_SERVICE_ALIASES.find((alias) => alias.slug === slug);
}

export function requireIndiaServiceAlias(slug: string): IndiaServiceAlias {
  const alias = getIndiaServiceAlias(slug);
  if (!alias) {
    throw new Error(`Missing India service alias definition: ${slug}`);
  }
  return alias;
}

export function isIndiaServiceAliasSlug(slug: string): boolean {
  return INDIA_SERVICE_ALIASES.some((alias) => alias.slug === slug);
}
