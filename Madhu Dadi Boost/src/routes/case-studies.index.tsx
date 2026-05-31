import { createFileRoute, Link } from "@tanstack/react-router";

const SITE_URL = "https://madhudadi.in";

export const caseStudies = [
  {
    slug: "adticks",
    name: "Adticks",
    category: "SaaS / Web App",
    summary:
      "Search intelligence and AI visibility auditing platform. Parallel headless crawls, render-parity diagnostics, and prioritized SEO/AEO/GEO fix queues.",
  },
  {
    slug: "technical-blog",
    name: "Technical Blog",
    category: "Education",
    summary:
      "Learning-focused blog with series-based paths and a production RAG AI Assistant grounded in a localized vector database.",
  },
  {
    slug: "udemy-enroller-fastapi",
    name: "Udemy Enroller using FastAPI",
    category: "Web App",
    summary:
      "FastAPI automation that auto-enrolls users in free Udemy courses via async queues. 20,000+ courses delivered, ~₹10L in estimated savings.",
  },
];

const TITLE = "Case Studies | Madhu Dadi — LLM, RAG & Analytics Engineering";
const DESCRIPTION =
  "Production case studies by Madhu Dadi. LLM apps, RAG pipelines, AI agents, and marketing analytics shipped across SaaS, healthcare, education, and travel-tech.";
const PAGE_URL = `${SITE_URL}/case-studies`;
const OG_IMAGE = `${SITE_URL}/og.jpg`;

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Case studies by Madhu Dadi",
  itemListOrder: "https://schema.org/ItemListOrderAscending",
  numberOfItems: caseStudies.length,
  itemListElement: caseStudies.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `${SITE_URL}/case-studies/${c.slug}`,
    name: c.name,
  })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Work", item: `${SITE_URL}/#projects` },
    { "@type": "ListItem", position: 3, name: "Case Studies", item: PAGE_URL },
  ],
};

const collectionPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: TITLE,
  description: DESCRIPTION,
  url: PAGE_URL,
  isPartOf: { "@type": "WebSite", name: "Madhu Dadi", url: SITE_URL },
  author: { "@type": "Person", name: "Madhu Dadi", url: SITE_URL },
};

export const Route = createFileRoute("/case-studies/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "keywords", content: "Madhu Dadi case studies, LLM case study, RAG case study, AI agents, marketing analytics, FastAPI, Next.js" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: PAGE_URL },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Madhu Dadi" },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:secure_url", content: OG_IMAGE },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Case studies by Madhu Dadi — AI & Analytics Engineer" },
      { property: "og:logo", content: `${SITE_URL}/icon-512.png` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@madhu245" },
      { name: "twitter:creator", content: "@madhu245" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
      { name: "twitter:image:alt", content: "Case studies by Madhu Dadi" },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(collectionPageJsonLd) },
      { type: "application/ld+json", children: JSON.stringify(itemListJsonLd) },
      { type: "application/ld+json", children: JSON.stringify(breadcrumbJsonLd) },
    ],
  }),
  component: CaseStudiesIndex,
});

function CaseStudiesIndex() {
  return (
    <main className="mx-auto w-[min(1200px,92%)] pt-32 pb-24">
      <p className="mb-3 text-xs uppercase tracking-[0.25em] text-primary">Case Studies</p>
      <h1 className="font-display text-4xl md:text-6xl text-gradient">Selected work.</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        A few engagements that show how I approach AI, analytics, and full-stack delivery.
      </p>

      <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {caseStudies.map((c) => (
          <li key={c.slug}>
            <Link
              to="/case-studies/$slug"
              params={{ slug: c.slug }}
              className="block h-full rounded-2xl border border-border bg-surface/60 p-6 transition-colors hover:bg-surface-elevated"
            >
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{c.category}</p>
              <h2 className="mt-2 font-display text-2xl">{c.name}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{c.summary}</p>
              <p className="mt-5 text-sm text-primary">Read case study →</p>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-16">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back home
        </Link>
      </div>
    </main>
  );
}
