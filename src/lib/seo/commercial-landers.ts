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
