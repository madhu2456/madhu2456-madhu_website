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
    title: "LLM Developer in India — Production GenAI, Not Prompt Demos",
    seoTitle: "LLM Developer & Consultant in India | Madhu Dadi",
    seoDescription:
      "Hire an LLM developer in India for production generative AI: structured outputs, FastAPI/Next.js, evals, and cost controls. Remote-ready production systems.",
    heroEyebrow: "India · Generative AI",
    shortDescription:
      "Production LLM applications for India and remote teams — structured outputs, prompt pipelines, guardrails, and handover — not demo notebooks.",
    directAnswer: [
      "A senior LLM developer is billed high by agencies and takes months to hire full-time. I ship the same class of production systems on retainer or fixed scope—with the eval and monitoring your team inherits.",
      "Every build aims for three things most demos skip: (1) a structured-output contract, (2) an offline eval harness with a golden set, (3) production tracing with cost per request per feature.",
      "Madhu Dadi is based in Visakhapatnam, India, remote-first across India and worldwide. Select consulting alongside full-time employment. Custom quote after discovery—no public rate card.",
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
      "Marketing analytics consultant in India for GA4/BigQuery, attribution, and CLV models. Novartis, redBus, GroupM background. India & remote engagements.",
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
  {
    slug: "ai-consultant-hyderabad",
    baseServiceSlug: "rag-consultant-india",
    title: "AI Consultant in Hyderabad — RAG, Agents, GA4",
    seoTitle: "AI Consultant in Hyderabad | RAG & Analytics | Madhu Dadi",
    seoDescription:
      "AI consultant for Hyderabad teams: production RAG, LLM apps, agents, and GA4 analytics. Visakhapatnam-based, remote-first, on-site kickoffs on request.",
    heroEyebrow: "Hyderabad · AI Consulting",
    shortDescription:
      "Fractional AI and analytics consulting for Hyderabad product and growth teams — production systems, not slide decks. Remote-first delivery with on-site available.",
    directAnswer: [
      "Madhu Dadi is an AI consultant serving Hyderabad teams remote-first from Visakhapatnam, with professional experience in Hyderabad and nationwide delivery.",
      "Engagements focus on production RAG, LLM applications, agent workflows, and measurement stacks (GA4→BigQuery, attribution) with written specs and handover.",
    ],
    whyIndia: [
      "Hyderabad product and GCC teams get India timezone overlap plus async written delivery.",
      "On-site discovery or kickoffs in Hyderabad available when they materially unblock the work.",
      "Same dual full-time + select consulting model: scoped outcomes, no unlimited agency seat.",
    ],
    locationFocus: [
      "Hyderabad (on-site on request)",
      "Visakhapatnam (home base)",
      "Remote India & worldwide",
    ],
    faqs: [
      {
        question: "Do you work with Hyderabad startups and GCCs?",
        answer:
          "Yes. Typical clients are product, data, and growth teams that need production AI or measurement help without a multi-month full-time hire.",
      },
      {
        question: "Can you come on-site in Hyderabad?",
        answer:
          "Yes for discovery workshops and kickoffs when agreed in scope. Day-to-day build and review stay remote-first for documentation quality and speed.",
      },
      {
        question: "How is this different from the Visakhapatnam page?",
        answer:
          "Same person and services. This URL targets Hyderabad city intent; Visakhapatnam is home-base positioning. Both link to the full capability pages.",
      },
      {
        question: "What do you ship for Hyderabad teams?",
        answer:
          "RAG systems, LLM apps, agents with guardrails, and analytics pipelines (GA4/BigQuery, attribution). Pricing is custom after discovery.",
      },
    ],
    contactIntent: "rag",
    timeline: "2–12 weeks depending on scope",
  },
  {
    slug: "ai-consultant-bengaluru",
    baseServiceSlug: "ai-llm-application-development",
    title: "AI Consultant in Bengaluru — Fractional, RAG, Analytics",
    seoTitle: "AI Consultant in Bengaluru | Fractional AI | Madhu Dadi",
    seoDescription:
      "AI consultant for Bengaluru startups and product teams: fractional AI, RAG, agents, and analytics. Remote-first from Visakhapatnam; on-site on request.",
    heroEyebrow: "Bengaluru · AI Consulting",
    shortDescription:
      "Senior AI consulting for Bengaluru product orgs — fractional roadmap, production RAG/LLM builds, and measurement that finance can trust.",
    directAnswer: [
      "Madhu Dadi is a fractional AI consultant available to Bengaluru teams remote-first, with on-site kickoffs when the engagement warrants travel.",
      "Work spans generative AI apps, RAG, agents, and marketing analytics infrastructure for startups and growth-stage companies that need shipping, not demos.",
    ],
    whyIndia: [
      "Bengaluru teams often need senior AI capacity without a 4–6 month full-time hire cycle.",
      "Remote-first delivery with clear review checkpoints fits distributed product orgs.",
      "On-site workshops in Bengaluru available for founder/engineering alignment sessions.",
    ],
    locationFocus: [
      "Bengaluru (on-site on request)",
      "Visakhapatnam (home base)",
      "Remote India & worldwide",
    ],
    faqs: [
      {
        question: "Do you work with Series A/B startups in Bengaluru?",
        answer:
          "Yes. Common pattern is a scoped build or short retainer while the team hires or levels up in-house AI capacity.",
      },
      {
        question: "Fractional or fixed project?",
        answer:
          "Both. Fixed scope for a single production capability; retainer for roadmap, reviews, and multi-workstream support. Dual full-time employment means select consulting only.",
      },
      {
        question: "Can you help hire our first AI engineer?",
        answer:
          "Yes as an optional add-on: JD input, technical screening, and hand-off so the new hire inherits a running system and docs.",
      },
      {
        question: "Is there a local Bengaluru office?",
        answer:
          "No. Home base is Visakhapatnam. Positioning is honest remote-first with on-site available — not a fake local address.",
      },
    ],
    contactIntent: "ai-llm",
    timeline: "2–12 weeks depending on scope",
  },
  {
    slug: "ai-consultant-chennai",
    baseServiceSlug: "rag-consultant-india",
    title: "AI Consultant in Chennai — RAG, LLM Apps, Attribution",
    seoTitle: "AI Consultant in Chennai | RAG & LLM Apps | Madhu Dadi",
    seoDescription:
      "AI consultant for Chennai teams: production RAG, LLM apps, and attribution/analytics. Remote-first India delivery; on-site kickoffs on request.",
    heroEyebrow: "Chennai · AI Consulting",
    shortDescription:
      "Production AI and measurement consulting for Chennai product and marketing teams — RAG, LLM applications, and decision-grade analytics.",
    directAnswer: [
      "Madhu Dadi is an AI consultant serving Chennai teams remote-first from Visakhapatnam, India, with on-site engagement available when agreed.",
      "Primary work: retrieval systems, generative AI applications, and analytics stacks that connect campaign and product data to outcomes.",
    ],
    whyIndia: [
      "Chennai product and enterprise teams get async-first delivery with India business-day overlap.",
      "Written specs, evals, and handover reduce dependency on a single contractor after ship.",
      "On-site discovery in Chennai available for multi-stakeholder kickoffs.",
    ],
    locationFocus: [
      "Chennai (on-site on request)",
      "Visakhapatnam (home base)",
      "Remote India & worldwide",
    ],
    faqs: [
      {
        question: "What AI work do you take in Chennai?",
        answer:
          "Production RAG, LLM apps with structured outputs and evals, agent workflows with guardrails, and measurement (GA4/BigQuery, attribution).",
      },
      {
        question: "Remote or on-site?",
        answer:
          "Default remote-first. On-site workshops or kickoffs in Chennai when they unblock decisions; build continues remote with documented reviews.",
      },
      {
        question: "Do you only serve Tamil Nadu?",
        answer:
          "No. Chennai is a city-intent page. Clients are India-wide and international.",
      },
      {
        question: "How do we start?",
        answer:
          "Send problem, stack, timeline, and outcome via the contact form or book a short intro call. Typical reply within 24 hours.",
      },
    ],
    contactIntent: "rag",
    timeline: "2–12 weeks depending on scope",
  },
  {
    slug: "ai-consultant-mumbai",
    baseServiceSlug: "marketing-analytics-consultant",
    title: "AI Consultant in Mumbai — Fractional AI + MMM",
    seoTitle: "AI Consultant in Mumbai | Fractional AI + MMM | Madhu Dadi",
    seoDescription:
      "AI and analytics consultant for Mumbai brands: fractional AI, RAG, and marketing mix modeling. Remote-first; on-site kickoffs on request.",
    heroEyebrow: "Mumbai · AI + Analytics",
    shortDescription:
      "Fractional AI and marketing measurement for Mumbai growth and product teams — RAG/LLM systems plus MMM and attribution when media spend needs truth.",
    directAnswer: [
      "Madhu Dadi is an AI and marketing analytics consultant available to Mumbai teams remote-first, with on-site kickoffs when the engagement warrants travel.",
      "Engagements combine production generative AI (RAG, agents, LLM apps) with measurement work (GA4/BigQuery, attribution, marketing mix modeling) when both product and media need clarity.",
    ],
    whyIndia: [
      "Mumbai brands and agencies often need engineering-led analytics plus selective AI builds — not separate slideware vendors.",
      "Remote-first with async specs fits multi-stakeholder marketing and product orgs.",
      "On-site sessions in Mumbai available for executive or agency workshops when scoped.",
    ],
    locationFocus: [
      "Mumbai (on-site on request)",
      "Visakhapatnam (home base)",
      "Remote India & worldwide",
    ],
    faqs: [
      {
        question: "Do you work with Mumbai D2C and media teams?",
        answer:
          "Yes. Common needs include measurement cleanup, attribution/MMM design, and AI automations that cut operational cost with evals.",
      },
      {
        question: "AI or analytics — which first?",
        answer:
          "Discovery decides. If tracking is broken, fix measurement before large AI bets. If the use case is clear and data is ready, ship a scoped AI capability first.",
      },
      {
        question: "Is there a Mumbai office?",
        answer:
          "No. Home base is Visakhapatnam. This page is honest city-intent positioning: remote-first with on-site available — not a fake local NAP.",
      },
      {
        question: "What is a typical engagement length?",
        answer:
          "Scoped builds often 4–10 weeks after discovery. Retainers for ongoing fractional AI or measurement refresh are available when fit is clear.",
      },
    ],
    contactIntent: "marketing-analytics",
    timeline: "4–12 weeks depending on scope",
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
