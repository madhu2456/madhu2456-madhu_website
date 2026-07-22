/**
 * Pillar: GA4 + BigQuery setup guide (content strategy 2026-07-22).
 * Portfolio root guide — not a blog post. Visible structure only; no HowTo/FAQPage growth schema.
 */

export const GA4_BIGQUERY_GUIDE = {
  slug: "ga4-bigquery",
  path: "/guides/ga4-bigquery/",
  title: "GA4 + BigQuery: the 2026 setup guide",
  seoTitle: "GA4 + BigQuery Setup Guide (2026) | Madhu Dadi",
  seoDescription:
    "GA4 to BigQuery setup in 2026: export, schema, costs, and campaign tables. Practical guide with consultant notes. India & remote.",
  publishedAt: "2026-07-22",
  updatedAt: "2026-07-22",
  directAnswer:
    "GA4 BigQuery export streams raw, unsampled event rows into Google Cloud so you can join ads cost, CRM, and offline conversions—work the GA4 UI cannot do at scale. In 2026 the hard part is not flipping the export toggle; it is schema design, cost control, and campaign tables your finance team will trust.",
  sections: [
    {
      id: "why-export",
      h2: "Why export GA4 to BigQuery instead of living in the UI?",
      paragraphs: [
        "The GA4 interface is built for exploration, standard reports, and operational checks. It is not built for unrestricted cohort SQL, multi-year unsampled analysis, or joining first-party revenue systems without hitting quotas and sampling edges.",
        "BigQuery gives you event-level tables (typically events_*), session and user keys Google derives, and the ability to build curated marts for campaigns, funnels, and attribution. That is why “GA4 BigQuery consultant” work is really measurement engineering—not dashboard decoration.",
      ],
    },
    {
      id: "when-you-need-it",
      h2: "When do you actually need GA4 → BigQuery?",
      paragraphs: [
        "You probably need the export when at least one of these is true: (1) paid media is material and platform numbers disagree with CRM or finance; (2) you need custom multi-touch or path models; (3) product and growth share one customer timeline; (4) you are preparing inputs for MMM or incrementality tests.",
        "You may not need it yet if traffic is tiny, decisions are purely last-click in one ad platform, and nobody will query a warehouse. In that case, fix GA4 collection first and revisit export when the questions outgrow the UI.",
      ],
    },
    {
      id: "setup-steps",
      h2: "Setup checklist (2026)",
      paragraphs: [
        "The following is an implementation checklist, not a substitute for Google’s current product docs—UI labels move. Always confirm against Google Analytics Help and Cloud documentation for your property type.",
      ],
      steps: [
        {
          title: "Confirm property and billing readiness",
          body: "Use a GA4 property you control. Link a Google Cloud project with BigQuery API enabled and billing set (export itself is free at the GA4 toggle; storage and queries are not). Decide region for data residency (important for India and EU stakeholders).",
        },
        {
          title: "Enable BigQuery linking and export frequency",
          body: "In GA4 Admin → Product links → BigQuery links, create the link, choose the dataset, and pick daily and/or streaming export. Streaming helps near-real-time ops; daily is enough for many campaign models. Document which you enabled and why.",
        },
        {
          title: "Validate event quality before you model",
          body: "Garbage in, expensive garbage out. Fix critical events (purchase, generate_lead, key funnels), currency, item arrays, and consent-affected fields first. sGTM is optional—add it when client-side loss or ad match rates justify the ops cost.",
        },
        {
          title: "Design curated tables (do not dashboard off raw export)",
          body: "Raw events_* tables are wide and nested. Build incremental transforms: flatten key params, standardize channel grouping, join ad cost, and materialize campaign_day or session marts. Partition by date and cluster by common filters to control scan cost.",
        },
        {
          title: "Connect BI to marts, not raw",
          body: "Point Looker Studio (or your BI tool) at curated views. Raw export dashboards are slow, expensive, and fragile when schemas evolve.",
        },
        {
          title: "QA and ownership",
          body: "Define expected deltas between UI and warehouse, set freshness checks, and assign who owns broken events. Without ownership, export becomes an expensive archive nobody trusts.",
        },
      ],
    },
    {
      id: "ui-vs-bq",
      h2: "GA4 UI vs BigQuery — what each is for",
      paragraphs: [
        "Use both. The UI is for product managers and marketers who need quick answers. BigQuery is for analysts and engineers who need joins, history, and custom logic.",
      ],
      table: {
        caption: "Practical split of responsibilities",
        headers: ["Need", "Prefer GA4 UI", "Prefer BigQuery"],
        rows: [
          ["Quick traffic / conversion check", "Yes", "Overkill"],
          ["Unsampled long-range analysis", "Limited", "Yes"],
          ["Join CRM / subscriptions / ads cost", "Hard", "Yes"],
          ["Custom multi-touch paths", "Limited", "Yes"],
          ["Ops monitoring of a single property", "Yes", "Possible with marts"],
          ["MMM / experiment input tables", "Rarely enough", "Yes"],
        ],
      },
    },
    {
      id: "cost",
      h2: "What does GA4 BigQuery cost in practice?",
      paragraphs: [
        "There is no single public price that fits every site. Costs split into (a) BigQuery storage for exported tables, (b) query bytes scanned by transforms and dashboards, and (c) optional streaming/insert patterns. Google’s pricing changes; treat the table below as order-of-magnitude planning, not a quote.",
        "The lever you control most is query design: partition pruning, avoiding SELECT *, pre-aggregating for Looker, and not rebuilding full history every hour.",
      ],
      table: {
        caption: "Planning ranges (illustrative — verify with Cloud billing)",
        headers: [
          "Situation",
          "What usually dominates cost",
          "Consultant focus",
        ],
        rows: [
          [
            "Low traffic, few analysts",
            "Storage is small; casual UI-like queries still cheap",
            "Clean events first; simple daily mart",
          ],
          [
            "Mid traffic, marketing dashboards",
            "Repeated full scans from BI tools",
            "Curated marts + scheduled views",
          ],
          [
            "High traffic / ecommerce",
            "Wide nested rows + frequent rebuilds",
            "Incremental models, clustering, cost alerts",
          ],
        ],
      },
    },
    {
      id: "schema",
      h2: "Schema and modeling patterns that age well",
      paragraphs: [
        "Keep a registry of event names and parameters your team is allowed to emit. Map business entities (order_id, lead_id, subscription_id) into stable event params. Prefer server-side or first-party collection for money events when client-side loss is visible in the audit.",
        "For campaigns, standardize UTM and Google Click ID handling early. Attribution models built on messy channel dimensions fail regardless of SQL skill. See also the attribution and MMM landers when budget questions outgrow digital path tables.",
      ],
    },
    {
      id: "pitfalls",
      h2: "Common pitfalls",
      bullets: [
        "Enabling export before fixing broken purchase or lead events",
        "Building Looker dashboards directly on events_* with SELECT *",
        "Ignoring timezone and currency consistency across ads and GA4",
        "Expecting UI and BigQuery totals to match to the cent without a documented reconciliation",
        "No owner for schema changes when marketing ships new funnels weekly",
      ],
    },
    {
      id: "how-i-help",
      h2: "How consulting fits (dual full-time + select work)",
      paragraphs: [
        "I take scoped GA4 + BigQuery engagements alongside full-time employment: audit, fix plan, implementation notes, and warehouse marts your team can run. Based in Visakhapatnam, India; remote-first delivery.",
        "If you need an exact-match commercial page, start with the GA4 consultant or Google Analytics consultant landers; for full service depth use the GA4 + BigQuery campaign analytics service page.",
      ],
    },
  ],
  relatedLinks: [
    {
      href: "/services/ga4-bigquery-campaign-analytics/",
      label: "GA4 + BigQuery campaign analytics service",
    },
    { href: "/ga4-consultant/", label: "GA4 consultant lander" },
    {
      href: "/google-analytics-consultant/",
      label: "Google Analytics consultant lander",
    },
    {
      href: "/attribution-modeling-consultant/",
      label: "Attribution modeling consultant",
    },
    {
      href: "/marketing-mix-modeling-consultant/",
      label: "Marketing mix modeling consultant",
    },
    { href: "/case-studies/adticks/", label: "Adticks case study" },
  ],
} as const;
