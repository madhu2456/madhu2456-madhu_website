/** Related learning / proof links per service (blog topical authority). */
export type RelatedLearningLink = {
  href: string;
  label: string;
  kind: "blog" | "case-study" | "tool";
};

const BLOG = "https://madhudadi.in/blog";

export const SERVICE_RELATED_LEARNING: Record<string, RelatedLearningLink[]> = {
  "rag-consultant-india": [
    {
      href: `${BLOG}/posts/rag-vs-fine-tuning-which-llm-approach`,
      label: "RAG vs fine-tuning: which approach to use",
      kind: "blog",
    },
    {
      href: `${BLOG}/ask`,
      label: "Try the production Ask RAG assistant",
      kind: "tool",
    },
    {
      href: "/case-studies/technical-blog/",
      label: "Case study: production RAG on this technical blog",
      kind: "case-study",
    },
  ],
  "ai-llm-application-development": [
    {
      href: `${BLOG}/posts/rag-vs-fine-tuning-which-llm-approach`,
      label: "RAG vs fine-tuning comparison",
      kind: "blog",
    },
    {
      href: `${BLOG}/posts/fastapi-vs-django-vs-flask-which-to-choose`,
      label: "FastAPI vs Django vs Flask",
      kind: "blog",
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
      href: `${BLOG}/ask`,
      label: "Production AI assistant on the blog",
      kind: "tool",
    },
  ],
  "marketing-analytics-consultant": [
    {
      href: "/case-studies/adticks/",
      label: "Case study: Adticks AI visibility & measurement",
      kind: "case-study",
    },
    {
      href: `${BLOG}/`,
      label: "Technical blog: analytics & product engineering",
      kind: "blog",
    },
  ],
  "ga4-bigquery-campaign-analytics": [
    {
      href: "/case-studies/adticks/",
      label: "Case study: crawl/audit measurement systems",
      kind: "case-study",
    },
    {
      href: `${BLOG}/`,
      label: "Blog: data & analytics writing",
      kind: "blog",
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

export function getRelatedLearning(slug: string): RelatedLearningLink[] {
  return (
    SERVICE_RELATED_LEARNING[slug] ?? [
      { href: `${BLOG}/`, label: "Technical blog", kind: "blog" as const },
      {
        href: "/case-studies/",
        label: "All case studies",
        kind: "case-study" as const,
      },
    ]
  );
}
