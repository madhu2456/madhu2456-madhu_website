/**
 * Pillar: Attribution after cookies (content strategy).
 * TechArticle structure only — no HowTo/FAQPage growth schema.
 */

export const ATTRIBUTION_AFTER_COOKIES_GUIDE = {
  slug: "attribution-after-cookies",
  path: "/guides/attribution-after-cookies/",
  title: "Attribution after cookies: MTA, MMM, and incrementality",
  seoTitle: "Attribution After Cookies: MTA, MMM, Tests | Madhu Dadi",
  seoDescription:
    "Post-cookie attribution: MTA vs MMM, GA4 paths, incrementality tests. Decision tree for mid-market brands. Consultant guide.",
  publishedAt: "2026-07-22",
  updatedAt: "2026-07-22",
  directAnswer:
    "After third-party cookies and ATT, no single attribution model is “correct.” Use first-party paths when identity holds, marketing mix modeling for aggregate budget questions, and incrementality tests when you need causal checks—then document limits so marketing and finance share one story.",
  sections: [
    {
      id: "what-broke",
      h2: "What broke in digital attribution?",
      paragraphs: [
        "Classic multi-touch attribution assumed you could stitch users across sites and apps. Browser restrictions, ad blockers, consent modes, and mobile ATT reduced that stitching. Platform UIs still show confident last-click or “data-driven” numbers that often cannot be reconciled with CRM revenue.",
        "The response is not to abandon measurement. It is to match the tool to the decision: path models for journey diagnosis, MMM for mix, experiments for causal claims.",
      ],
    },
    {
      id: "decision-tree",
      h2: "Decision tree: path models vs MMM vs tests",
      paragraphs: [
        "Start from the question, not from a vendor slide. If identity is weak, do not force a fragile 12-touch path model as the sole source of truth.",
      ],
      table: {
        caption: "Which approach fits the decision?",
        headers: ["Decision", "Prefer", "Why"],
        rows: [
          [
            "Which digital touch helps conversion this week?",
            "GA4 / warehouse path models",
            "Needs session and campaign quality when stitching works",
          ],
          [
            "How to reallocate quarterly media mix?",
            "MMM (+ optional tests)",
            "Aggregate history; offline and brand media included",
          ],
          [
            "Did this Meta/Google campaign cause lift?",
            "Incrementality / geo holdout",
            "Observational paths cannot prove causality alone",
          ],
          [
            "Platform and finance numbers disagree",
            "Audit collection + warehouse truth tables",
            "Fix events and cost joins before modeling credit",
          ],
        ],
      },
    },
    {
      id: "ga4-dda",
      h2: "GA4 data-driven attribution vs warehouse paths",
      paragraphs: [
        "GA4’s data-driven attribution (when eligible) is a property-level model on Google’s graph of conversions. It is useful operationally, but it is not a full custom multi-touch warehouse model with CRM joins, custom windows, and cost tables.",
        "For deeper control, export to BigQuery, standardize channel dimensions, and build path tables on first-party keys. See the GA4 + BigQuery setup guide for export and mart patterns that make path models maintainable.",
      ],
    },
    {
      id: "incrementality",
      h2: "When incrementality tests are worth it",
      paragraphs: [
        "Geo splits, audience holdouts, and platform lift studies answer causal questions paths cannot. They need enough spend and operational ability to withhold treatment. Small budgets may not power a clean test—in that case, improve collection and use conservative rules until scale arrives.",
        "Pre-register metrics (primary conversion, revenue, not five vanity KPIs) and document contamination risks (national brand spillover, overlapping campaigns).",
      ],
    },
    {
      id: "mmm-link",
      h2: "How this connects to marketing mix modeling",
      paragraphs: [
        "MMM answers mix at aggregate level when user paths fail. It complements—not replaces—digital path work. For tool choice and data readiness, see the MMM 2026 guide and the MMM consultant lander.",
      ],
    },
    {
      id: "pitfalls",
      h2: "Common pitfalls",
      bullets: [
        "Trusting last-click in an ad UI as finance truth",
        "Building MTA on broken UTMs and missing purchase events",
        "Declaring a model “causal” without any experiment",
        "No documented delta between GA4 UI, BigQuery, and CRM",
        "No owner when marketing renames campaigns weekly",
      ],
    },
    {
      id: "consulting",
      h2: "How consulting engagements usually run",
      paragraphs: [
        "Select consulting alongside full-time employment: audit claims vs data, fix collection if needed, ship path tables or experiment design, and hand over. Visakhapatnam-based; remote-first. Custom quotes after discovery—no public rate card.",
        "Commercial entry points: attribution modeling consultant, GA4 consultant, and marketing analytics consultant landers.",
      ],
    },
  ],
  relatedLinks: [
    {
      href: "/attribution-modeling-consultant/",
      label: "Attribution modeling consultant",
    },
    {
      href: "/marketing-mix-modeling-consultant/",
      label: "MMM consultant lander",
    },
    {
      href: "/guides/marketing-mix-modeling-2026/",
      label: "Guide: MMM in 2026",
    },
    {
      href: "/guides/ga4-bigquery/",
      label: "Guide: GA4 + BigQuery setup",
    },
    {
      href: "/ga4-consultant/",
      label: "GA4 consultant lander",
    },
    {
      href: "/services/ga4-bigquery-campaign-analytics/",
      label: "GA4 + BigQuery service page",
    },
    { href: "/contact/#intent=ga4-bigquery", label: "Contact / discovery" },
  ],
} as const;
