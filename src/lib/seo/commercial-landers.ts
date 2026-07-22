/**
 * Commercial keyword landers at site root (content strategy 2026-07-22).
 * Exact-match commercial intent pages that deep-link to full /services/* capability pages.
 * Visible FAQs only — no FAQPage growth schema (owner policy).
 */

export type CommercialLanderFaq = {
  question: string;
  answer: string;
};

export type CommercialLander = {
  /** URL path segment at root, e.g. ga4-consultant → /ga4-consultant/ */
  slug: string;
  baseServiceSlug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  heroEyebrow: string;
  shortDescription: string;
  directAnswer: string[];
  /** Differentiator / value bullets (not necessarily geo) */
  valueProps: string[];
  focusTags: string[];
  faqs: CommercialLanderFaq[];
  contactIntent: string;
  timeline?: string;
  /** Optional related case-study slug */
  proofProjectSlug?: string;
};

export const COMMERCIAL_LANDERS: CommercialLander[] = [
  {
    slug: "ga4-consultant",
    baseServiceSlug: "ga4-bigquery-campaign-analytics",
    title: "GA4 Consultant for SaaS & D2C Teams",
    seoTitle: "GA4 Consultant — Audit, Migration & BigQuery | Madhu Dadi",
    seoDescription:
      "GA4 consultant for migration, event audits, sGTM, and BigQuery export. Independent, India & remote. Scoped quotes after discovery.",
    heroEyebrow: "GA4 · Measurement · Consulting",
    shortDescription:
      "Hire a hands-on GA4 consultant for migration, event tracking fixes, server-side tagging, and pipelines that match finance—not vanity UI reports.",
    directAnswer: [
      "A GA4 consultant is a specialist who designs, audits, and implements Google Analytics 4 measurement so events, conversions, and exports are accurate enough for growth and finance decisions.",
      "I work select consulting alongside full-time employment: discovery, a written fix plan, then scoped implementation (GA4 schemas, sGTM when needed, BigQuery export). Based in Visakhapatnam, India; remote-first worldwide.",
    ],
    valueProps: [
      "Tracking audits that prioritize broken revenue and lead events first",
      "UA→GA4 migration patterns that reconstruct reports in BigQuery when the UI falls short",
      "sGTM and first-party collection only when the audit shows a measurable accuracy win",
      "Handover docs your marketing and data teams can own after ship",
    ],
    focusTags: [
      "GA4 audit",
      "GA4 migration",
      "sGTM",
      "BigQuery export",
      "India & remote",
    ],
    faqs: [
      {
        question: "What does a GA4 consultant actually do?",
        answer:
          "Audit current tracking, define event and conversion schemas, implement or fix GA4/GTM (and sGTM when needed), and optionally pipe data to BigQuery for unsampled analysis. Deliverables are documented so your team can operate without a permanent agency seat.",
      },
      {
        question: "How much does a GA4 consultant cost in 2026?",
        answer:
          "There is no public rate card. After a free discovery call I quote a scoped engagement (audit-only vs implement) based on property complexity, consent constraints, and whether BigQuery or ad CAPIs are in scope.",
      },
      {
        question: "GA4 vs Universal Analytics: what breaks in migration?",
        answer:
          "Session and goal models change, custom dimensions map differently, and many UA reports have no 1:1 GA4 twin. We rebuild critical views from events—often in BigQuery—rather than forcing old UA logic into the GA4 UI.",
      },
      {
        question: "How long does a GA4 + BigQuery setup take?",
        answer:
          "Typical scoped builds land in 3–6 weeks after discovery, depending on property count, consent mode, and warehouse access. Audit-only work can be shorter.",
      },
      {
        question: "Do I need a GA4 consultant if I use GTM?",
        answer:
          "GTM is the implementation surface; GA4 still needs a coherent event model, conversion definitions, and QA. Many teams have GTM but still ship broken funnels or unusable BigQuery exports—that is the gap this engagement fills.",
      },
    ],
    contactIntent: "ga4-bigquery",
    timeline: "3–6 weeks (scoped)",
    proofProjectSlug: "adticks",
  },
  {
    slug: "google-analytics-consultant",
    baseServiceSlug: "ga4-bigquery-campaign-analytics",
    title: "Independent Google Analytics Consultant",
    seoTitle: "Google Analytics Consultant — GA4 & BigQuery | Madhu Dadi",
    seoDescription:
      "Independent Google Analytics consultant: GA4 audits, GTM/sGTM, BigQuery pipelines, and dashboards finance trusts. India & remote.",
    heroEyebrow: "Google Analytics · GA4 · GTM",
    shortDescription:
      "Independent Google Analytics consulting for teams that need GA4, GTM, and BigQuery done correctly—without an agency black box.",
    directAnswer: [
      "A Google Analytics consultant helps you design and fix measurement so GA4 (and related GTM/BigQuery pieces) report trustworthy traffic, conversions, and revenue for decisions—not only marketing vanity metrics.",
      "I am an independent engineer-consultant: Novartis, redBus, and GroupM (WPP) background. Select consulting engagements only, dual full-time + consulting boundaries respected. Visakhapatnam-based, remote-first.",
    ],
    valueProps: [
      "Independent specialist—not a multi-layered agency account team",
      "GA4 + GTM + BigQuery treated as one stack, not three disconnected vendors",
      "Works with your existing marketing and engineering owners",
      "Written specs, QA checklists, and ownership transfer",
    ],
    focusTags: ["Google Analytics", "GA4", "GTM", "BigQuery", "Looker Studio"],
    faqs: [
      {
        question:
          "How is a Google Analytics consultant different from an agency?",
        answer:
          "You work directly with the implementer. Scope is written, technical, and bounded. Agencies often optimize for retainers and multi-channel packages; this path is for teams that need measurement engineering and clear handover.",
      },
      {
        question:
          "What deliverables should I expect from a GA consulting engagement?",
        answer:
          "Typically: audit findings, event/conversion registry, GTM/GA4 implementation notes, optional sGTM and BigQuery models, and a dashboard layer on curated tables. Exact pack depends on discovery.",
      },
      {
        question: "Can you fix a broken GA4 setup without starting over?",
        answer:
          "Often yes. Many properties need schema cleanup, conversion redefinition, and export redesign rather than a greenfield property. We only recommend a full reset when the event model is unrecoverable.",
      },
      {
        question: "How do you price Google Analytics consulting?",
        answer:
          "Custom scoped quotes after free discovery—no public price list. Audit-only, implement, or warehouse-depth options depending on goals and access.",
      },
      {
        question: "Do you work with existing marketing and dev teams?",
        answer:
          "Yes. The default model is embed with your stack owners: marketing defines outcomes, engineering owns deploy paths, and I deliver measurement design and implementation notes both can run with.",
      },
    ],
    contactIntent: "ga4-bigquery",
    timeline: "3–6 weeks (scoped)",
    proofProjectSlug: "adticks",
  },
  {
    slug: "marketing-analytics-consultant",
    baseServiceSlug: "marketing-analytics-consultant",
    title: "Marketing Analytics Consultant",
    seoTitle: "Marketing Analytics Consultant — Attribution | Madhu Dadi",
    seoDescription:
      "Marketing analytics consultant for attribution, CLV, GA4/BigQuery, and decision dashboards. Independent; India & remote.",
    heroEyebrow: "Marketing Analytics · Attribution · BI",
    shortDescription:
      "Fractional-style marketing analytics consulting: attribution, CLV, GA4/BigQuery pipelines, and decision systems growth and finance can both trust.",
    directAnswer: [
      "A marketing analytics consultant designs measurement and decision systems—attribution, pipelines, and dashboards—so campaign and product data answer revenue questions instead of producing conflicting platform reports.",
      "I offer select consulting alongside full-time work: discovery, scoped builds, and handover. Experience across healthcare, travel-tech, and media (Novartis, redBus, GroupM). Visakhapatnam base; remote-first delivery.",
    ],
    valueProps: [
      "Multi-touch attribution and channel path models on warehouse data",
      "CLV and lifecycle views when CRM access allows",
      "GA4/BigQuery and ad-cost joins for media truth tables",
      "Decision frameworks stakeholders can run after the engagement",
    ],
    focusTags: [
      "Attribution",
      "CLV",
      "GA4/BigQuery",
      "Media mix inputs",
      "India & remote",
    ],
    faqs: [
      {
        question:
          "What does a marketing analytics consultant actually deliver?",
        answer:
          "A written measurement plan, implemented pipelines or models (as scoped), and decision dashboards or tables your team can operate. Not a permanent outsourced analyst seat unless you explicitly want advisory retainers after ship.",
      },
      {
        question: "How much do marketing analytics consultants charge in 2026?",
        answer:
          "Quotes are custom after discovery—no public rate card. Cost depends on data access, number of channels, and whether work is audit, model build, or warehouse + dashboard delivery.",
      },
      {
        question:
          "When should a startup hire a marketing analytics consultant?",
        answer:
          "When paid acquisition is material and platform reports disagree with revenue, or when you need attribution/CLV design before hiring a full analytics team. Early teams with tiny spend may only need a short audit.",
      },
      {
        question: "In-house analyst vs consultant: what should I pick?",
        answer:
          "Hire in-house for ongoing reporting ownership. Use a consultant to design the system, fix broken measurement, or stand up the first warehouse models—then hand over. Many teams do both over time.",
      },
      {
        question: "How do you handle attribution after iOS and cookie loss?",
        answer:
          "Prefer first-party collection, server-side where justified, warehouse-level path models, and incrementality tests for big bets—not a single last-click number in an ad UI.",
      },
    ],
    contactIntent: "marketing-analytics",
    timeline: "4–8 weeks (scoped)",
  },
  {
    slug: "marketing-mix-modeling-consultant",
    baseServiceSlug: "marketing-analytics-consultant",
    title: "Marketing Mix Modeling (MMM) Consultant",
    seoTitle: "Marketing Mix Modeling Consultant (MMM) | Madhu Dadi",
    seoDescription:
      "MMM consultant for D2C and SaaS: measure paid media without cookies. Bayesian MMM, Robyn/Meridian options, warehouse-ready inputs.",
    heroEyebrow: "MMM · Media mix · Incrementality",
    shortDescription:
      "Marketing mix modeling consulting for brands that need paid-media impact without third-party cookies—honest data requirements, scoped implementation, clear handover.",
    directAnswer: [
      "A marketing mix modeling consultant helps you estimate how media and other drivers affect outcomes (revenue, leads) using aggregated historical data—useful when cookie-level multi-touch attribution is incomplete after iOS and third-party cookie loss.",
      "I scope MMM as select consulting: assess data readiness, choose an approach (custom Bayesian, open-source Robyn-style, or vendor tools like Meridian when appropriate), and leave models and docs your team can re-run. Visakhapatnam-based; remote-first; dual full-time + consulting boundaries apply.",
    ],
    valueProps: [
      "Data-readiness audit before promising a full MMM (many teams need cost and outcome history cleaned first)",
      "MMM vs multi-touch attribution framed as complements, not a single silver bullet",
      "Warehouse-friendly inputs (often BigQuery) so models retrain without a black box",
      "Honest about sample size: thin spend history may mean start with incrementality tests or simpler mix views",
    ],
    focusTags: [
      "Marketing mix modeling",
      "MMM",
      "Robyn / Meridian options",
      "Incrementality",
      "India & remote",
    ],
    faqs: [
      {
        question: "What is marketing mix modeling in 2026?",
        answer:
          "MMM uses historical aggregated media, price, promo, and control variables to estimate contribution and response curves. In 2026 it is often paired with experiments because cookie-based user paths are weaker—not a replacement for clean first-party collection.",
      },
      {
        question: "MMM vs multi-touch attribution — which do I need?",
        answer:
          "MTA (or path models) explains user journeys when identity is reliable. MMM explains channel contribution at aggregate level when cookies and user stitching fail. Many mid-market brands need both: warehouse paths for digital detail, MMM for mix and budget questions.",
      },
      {
        question: "How much data does MMM actually require?",
        answer:
          "Typically months of consistent weekly or daily spend and outcome series across major channels. Exact thresholds depend on volatility and channel count. If history is thin, we may recommend fixing measurement and running geo or holdout tests before a heavy MMM.",
      },
      {
        question: "How much does an MMM engagement cost?",
        answer:
          "Custom quote after discovery—no public rate card. Cost depends on data prep, number of channels, and whether the deliverable is a one-time model, a retrainable pipeline, or advisory only.",
      },
      {
        question: "Robyn vs Meridian vs a custom Bayesian MMM?",
        answer:
          "Choice depends on data shape, team skills, and whether you need open-source control vs managed tooling. Discovery picks the lightest stack that answers the decision—not the trendiest logo.",
      },
    ],
    contactIntent: "marketing-analytics",
    timeline: "6–12 weeks (data-ready scoped MMM)",
  },
  {
    slug: "attribution-modeling-consultant",
    baseServiceSlug: "ga4-bigquery-campaign-analytics",
    title: "Attribution Modeling Consultant",
    seoTitle: "Attribution Modeling Consultant — Post-Cookie | Madhu Dadi",
    seoDescription:
      "Attribution consultant for post-cookie stacks: GA4 paths, incrementality, MMM overlays. Independent; India & remote.",
    heroEyebrow: "Attribution · GA4 · Incrementality",
    shortDescription:
      "Independent attribution consulting after cookies and iOS: GA4 path models, warehouse multi-touch tables, and when to add MMM or experiments—not a single last-click number.",
    directAnswer: [
      "An attribution modeling consultant designs how you assign credit for conversions across channels when user identity is incomplete—using first-party paths in GA4/BigQuery, rules or data-driven models where they hold, and incrementality or MMM where cookies fail.",
      "I scope select consulting alongside full-time work: audit current claims, fix collection where needed, then ship path tables or experiment design your team can run. Visakhapatnam-based; remote-first.",
    ],
    valueProps: [
      "Post-cookie framing: first-party collection before fancy multi-touch math",
      "GA4 + BigQuery path models when identity is good enough; honest limits when it is not",
      "Clear MTA vs MMM vs geo/holdout tests—so budget questions get the right tool",
      "Works with media, analytics, and engineering owners; written handover",
    ],
    focusTags: [
      "Multi-touch attribution",
      "GA4 paths",
      "Incrementality",
      "MTA vs MMM",
      "India & remote",
    ],
    faqs: [
      {
        question: "What is the best attribution model in 2026?",
        answer:
          "There is no universal best. Last-click is simple but biased. Data-driven or position-based path models help when identity is reliable. For budget mix under cookie loss, pair digital paths with MMM or incrementality tests. Discovery picks the lightest model that answers your decision.",
      },
      {
        question: "How does GA4 data-driven attribution actually work?",
        answer:
          "GA4’s data-driven model uses conversion paths in Google’s property when volume and eligibility thresholds are met. It is not a full warehouse MTA. For custom windows, CRM joins, or cost data, we usually rebuild paths in BigQuery on top of clean events.",
      },
      {
        question: "MTA vs MMM — which one for a mid-market brand?",
        answer:
          "Use path/MTA-style models for digital journey diagnosis when stitching works. Use MMM for aggregate media mix and offline-heavy brands. Many teams need both: paths for ops, MMM or tests for board-level mix. See also the MMM consultant lander for mix-focused work.",
      },
      {
        question: "How do I run incrementality tests on Meta and Google?",
        answer:
          "Typical patterns are geo splits, audience holdouts, or platform lift studies with pre-registered metrics and enough power. I help design the test and measurement, not run black-box media buying. Fit depends on spend level and operational ability to hold out traffic.",
      },
      {
        question: "What does an attribution engagement look like end-to-end?",
        answer:
          "Discovery and audit → identity and event readiness → path or rule model in the warehouse (or GA4 config fixes) → optional experiment design → docs and dashboard views. Timeline depends on data quality; often a few weeks after access is granted.",
      },
    ],
    contactIntent: "ga4-bigquery",
    timeline: "3–8 weeks (scoped)",
    proofProjectSlug: "adticks",
  },
  {
    slug: "fractional-ai-consultant",
    baseServiceSlug: "ai-llm-application-development",
    title: "Fractional AI Consultant on Retainer",
    seoTitle: "Fractional AI Consultant — Strategy, RAG, Ops | Madhu Dadi",
    seoDescription:
      "Hire a fractional AI consultant: roadmap, RAG, evals, LLM ops on retainer. Dual full-time+consult; India & remote.",
    heroEyebrow: "Fractional AI · Retainer · RAG / LLM",
    shortDescription:
      "Senior AI consulting on a monthly retainer: roadmap, RAG design, evals, and LLM ops—without a full-time hire. Scoped hours, written deliverables, clear boundaries.",
    directAnswer: [
      "A fractional AI consultant is a senior practitioner who joins your product or data leadership on a part-time retainer to set AI direction, design RAG/LLM systems, run evals, and unblock shipping—without replacing an in-house engineering team.",
      "I offer select retainers and scoped projects alongside full-time employment. Expect written roadmaps, architecture notes, and review cadence—not unlimited “fractional CTO” bandwidth. Visakhapatnam-based; remote-first.",
    ],
    valueProps: [
      "Roadmap and build-vs-buy decisions grounded in production constraints",
      "RAG, structured outputs, evals, and logging patterns your team can own",
      "Vendor and model selection without locking you into a single agency stack",
      "Hours and outcomes agreed up front; dual-role availability is explicit",
    ],
    focusTags: [
      "Fractional AI",
      "Retainer",
      "RAG / LLM ops",
      "Evals",
      "India & remote",
    ],
    faqs: [
      {
        question: "What is a fractional AI consultant?",
        answer:
          "A part-time senior AI specialist embedded with your team for strategy and hands-on design/implementation guidance. Different from a full-time hire (no employment benefits stack) and from a large agency (you work with one engineer-consultant, not account layers).",
      },
      {
        question: "Fractional AI consultant vs agency vs full-time hire?",
        answer:
          "Hire full-time when AI is a permanent core competency and you need daily ownership. Use an agency for large multi-role packages. Use fractional consulting when you need senior judgment and shipping patterns a few days per week or month, with a clear end state or ongoing advisory cap.",
      },
      {
        question: "How many hours a month is a typical retainer?",
        answer:
          "Varies by scope—often a fixed block after discovery (for example design reviews + architecture + async support). Exact hours are written into the engagement; this is not an open-ended “call anytime” CTO seat.",
      },
      {
        question: "What are common 90-day fractional AI outcomes?",
        answer:
          "Examples: prioritized AI roadmap, a production-shaped RAG or LLM vertical slice with evals, logging baseline, and a handover plan for your engineers. Outcomes are scoped in discovery—not generic transformation decks.",
      },
      {
        question: "How do you measure ROI on a fractional AI engagement?",
        answer:
          "Pick 1–2 decision metrics up front (time-to-first-safe-deploy, support deflection, latency/cost targets, or a revenue experiment). We review those at checkpoints rather than vanity demo metrics.",
      },
    ],
    contactIntent: "ai-llm",
    timeline: "Retainer or 4–12 week scoped build",
    proofProjectSlug: "technical-blog",
  },
  {
    slug: "ai-consultant-for-startups",
    baseServiceSlug: "ai-llm-application-development",
    title: "Fractional AI Consultant for Startups",
    seoTitle: "AI Consultant for Startups — RAG & Shipping | Madhu Dadi",
    seoDescription:
      "Fractional AI consultant for seed to Series B: roadmap, RAG, LLM integration, evals—without a full-time hire. India & remote.",
    heroEyebrow: "Startups · Fractional AI · Ship",
    shortDescription:
      "AI consulting for seed to Series B teams that need a roadmap and a shippable RAG/LLM slice—without hiring a full-time AI lead yet.",
    directAnswer: [
      "An AI consultant for startups helps early product teams choose what to build, design RAG or LLM integrations, and ship a thin production slice with evals—so founders do not burn a full-time senior hire on the first experiment.",
      "I take select consulting work alongside full-time employment: discovery, a written pilot plan, then scoped build or fractional advisory. Visakhapatnam-based; remote-first for US, EU, and India teams.",
    ],
    valueProps: [
      "Pilot scope that fits runway: one vertical slice, clear kill criteria",
      "RAG vs fine-tune vs rules—picked for data and latency, not hype",
      "Evals and logging so “demo works” becomes “ops can run it”",
      "Path to hand off to your first AI/full-stack engineer",
    ],
    focusTags: [
      "Startups",
      "Seed–Series B",
      "RAG / LLM",
      "Pilot → production",
      "India & remote",
    ],
    faqs: [
      {
        question:
          "What does a fractional AI consultant actually do for startups?",
        answer:
          "Prioritize use cases, design the architecture, help implement a first safe deploy (often RAG or structured LLM workflows), and leave docs/evals your team can extend. Not a replacement for product/engineering ownership.",
      },
      {
        question: "How much does a startup AI consultant cost per month?",
        answer:
          "Custom quote after discovery—no public rate card. Options include short pilots or a capped monthly advisory block. Cost tracks scope and access, not a generic package.",
      },
      {
        question:
          "When should a startup hire an AI consultant vs an AI engineer?",
        answer:
          "Hire an engineer when AI is a standing product surface needing daily ownership. Use a consultant to set the first architecture, ship a pilot, and de-risk the hire—or to unblock a specific integration while your team stays generalist.",
      },
      {
        question:
          "What can a fractional AI consultant realistically ship in 90 days?",
        answer:
          "Examples: prioritized roadmap, production-shaped RAG or agent vertical slice with basic evals, and a handover plan. Multi-product “AI transformation” in 90 days is not a credible default.",
      },
      {
        question: "How do you scope an AI pilot that will not stall?",
        answer:
          "One user job, one data source set, success metrics, and a time box. We write kill criteria before build. If data or access is missing, discovery stops at a readiness report instead of an endless prototype.",
      },
    ],
    contactIntent: "ai-llm",
    timeline: "4–12 week pilot or capped monthly advisory",
    proofProjectSlug: "technical-blog",
  },
];

export function getCommercialLander(
  slug: string,
): CommercialLander | undefined {
  return COMMERCIAL_LANDERS.find((l) => l.slug === slug);
}

export function requireCommercialLander(slug: string): CommercialLander {
  const lander = getCommercialLander(slug);
  if (!lander) {
    throw new Error(`Missing commercial lander definition: ${slug}`);
  }
  return lander;
}
