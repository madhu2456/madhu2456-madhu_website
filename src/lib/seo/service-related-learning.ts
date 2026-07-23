/** Related learning / proof links per service (blog + guides + case studies). */
export type RelatedLearningLink = {
  href: string;
  label: string;
  kind: "blog" | "guide" | "case-study" | "tool";
};

const BLOG = "https://madhudadi.in/blog";

export const SERVICE_RELATED_LEARNING: Record<string, RelatedLearningLink[]> = {
  "rag-consultant-india": [
    {
      href: "/guides/rag-vs-fine-tuning-2026/",
      label: "Guide: RAG vs fine-tuning in 2026",
      kind: "guide",
    },
    {
      href: "/guides/ai-search-optimization-2026/",
      label: "Guide: AI search optimization (AEO/GEO)",
      kind: "guide",
    },
    {
      href: "/case-studies/technical-blog/",
      label: "Case study: production RAG on this technical blog",
      kind: "case-study",
    },
  ],
  "ai-llm-application-development": [
    {
      href: "/guides/rag-vs-fine-tuning-2026/",
      label: "Guide: RAG vs fine-tuning decision framework",
      kind: "guide",
    },
    {
      href: "/guides/fractional-ai-playbook/",
      label: "Guide: fractional AI pricing & 90-day playbook",
      kind: "guide",
    },
    {
      href: "/case-studies/technical-blog/",
      label: "Case study: LLM app + blog stack",
      kind: "case-study",
    },
  ],
  "ai-agent-development": [
    {
      href: "/case-studies/udemy-enroller-fastapi/",
      label: "Case study: async orchestration & agent-style workflows",
      kind: "case-study",
    },
    {
      href: "/guides/fractional-ai-playbook/",
      label: "Guide: fractional AI shipping playbook",
      kind: "guide",
    },
    {
      href: `${BLOG}/ask`,
      label: "Production AI assistant on the blog",
      kind: "tool",
    },
  ],
  "marketing-analytics-consultant": [
    {
      href: "/guides/marketing-mix-modeling-2026/",
      label: "Guide: MMM in 2026 (Robyn vs Meridian vs custom)",
      kind: "guide",
    },
    {
      href: "/guides/attribution-after-cookies/",
      label: "Guide: attribution after cookies",
      kind: "guide",
    },
    {
      href: "/case-studies/adticks/",
      label: "Case study: Adticks AI visibility & measurement",
      kind: "case-study",
    },
  ],
  "ga4-bigquery-campaign-analytics": [
    {
      href: "/guides/ga4-bigquery/",
      label: "Guide: GA4 + BigQuery setup (2026)",
      kind: "guide",
    },
    {
      href: "/guides/consent-mode-v2-india/",
      label: "Guide: Consent Mode v2 for India",
      kind: "guide",
    },
    {
      href: "/case-studies/adticks/",
      label: "Case study: crawl/audit measurement systems",
      kind: "case-study",
    },
  ],
  "full-stack-ai-product-development": [
    {
      href: "/case-studies/technical-blog/",
      label: "Case study: full-stack Next.js + FastAPI product",
      kind: "case-study",
    },
    {
      href: "/case-studies/adticks/",
      label: "Case study: Adticks full-stack platform",
      kind: "case-study",
    },
    {
      href: `${BLOG}/posts/fastapi-vs-django-vs-flask-which-to-choose`,
      label: "FastAPI vs Django vs Flask",
      kind: "blog",
    },
  ],
};

const FALLBACK_LINKS: RelatedLearningLink[] = [
  { href: `${BLOG}/`, label: "Technical blog", kind: "blog" },
  {
    href: "/guides/ga4-bigquery/",
    label: "Guide: GA4 + BigQuery setup",
    kind: "guide",
  },
  {
    href: "/case-studies/",
    label: "All case studies",
    kind: "case-study",
  },
];

export function getRelatedLearning(
  slug: string,
  max = 3,
): RelatedLearningLink[] {
  const links = SERVICE_RELATED_LEARNING[slug] ?? FALLBACK_LINKS;
  return links.slice(0, max);
}

export function relatedLearningKindLabel(
  kind: RelatedLearningLink["kind"],
): string {
  switch (kind) {
    case "blog":
      return "Blog";
    case "guide":
      return "Guide";
    case "tool":
      return "Live tool";
    default:
      return "Case study";
  }
}
