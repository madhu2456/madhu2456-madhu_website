import { createFileRoute, Link, notFound } from "@tanstack/react-router";

const SITE_URL = "https://madhudadi.in";

type CaseStudy = {
  slug: string;
  name: string;
  category: string;
  client: string;
  role: string;
  period: string;
  summary: string;
  problem: string;
  approach: string[];
  outcomes: string[];
  stack: string[];
  links?: { label: string; href: string }[];
};

const studies: Record<string, CaseStudy> = {
  adticks: {
    slug: "adticks",
    name: "Adticks",
    category: "SaaS / Web App",
    client: "Adticks",
    role: "Founder & Full-stack / AI Engineer",
    period: "2024 to Present",
    summary:
      "Search intelligence and AI visibility auditing platform, parallel headless crawls, render-parity diagnostics, and prioritized SEO/AEO/GEO fix queues.",
    problem:
      "As search shifts from ten blue links to AI Overviews and answer engines (ChatGPT, Claude, Gemini, Perplexity), brands struggle to measure and maintain visibility across LLM systems. Standard crawlers don't diagnose accessibility issues specific to generative crawlers (GPTBot, ClaudeBot, PerplexityBot), and client-side JS rendering hides critical semantic content, entity relationships, and schema.org markup from LLM crawlers, leading to omission from AI citations.",
    approach: [
      "Designed Adticks as a unified inside-out site auditing engine.",
      "Runs parallel headless crawls with Playwright to identify render-parity gaps between raw server HTML and fully client-rendered DOM.",
      "Audits robots.txt, sitemaps, structured data schemas, and llms.txt configurations.",
      "FastAPI + Celery backend schedules deep crawls, parses with selectolax, runs 18 parallel audit analyzers.",
      "Outputs severity-prioritized fix queues tailored for SEO, AEO, and GEO.",
    ],
    outcomes: [
      "Scales to parallel headless rendering across 10,000+ pages per audit.",
      "Detects JS render-parity bottlenecks that hide text, pricing, and schema from bots, driving indexing and AI Overview citation lift.",
      "Reduces technical audit cycle time by ~85% with automated diagnostics.",
    ],
    stack: ["Next.js", "React", "Tailwind CSS", "FastAPI", "PostgreSQL", "Redis", "Celery", "Playwright"],
    links: [
      { label: "Visit Adticks", href: "https://adticks.com/" },
      { label: "Audit App", href: "https://app.adticks.com/" },
    ],
  },
  "technical-blog": {
    slug: "technical-blog",
    name: "Technical Blog",
    category: "Education",
    client: "madhudadi.in/blog",
    role: "Designer & Engineer",
    period: "2024 to Present",
    summary:
      "Learning-focused technical blog with series-based learning paths and a production-grade RAG AI Assistant grounded in a localized vector database.",
    problem:
      "Software developers, AI engineers, and data analysts face fragmented, surface-level learning resources. Most guides cover hello-world LLM concepts but skip the edge cases, structural design decisions, and real-world deployment challenges of pipelines like RAG. Static docs lack interactive search, forcing engineers to dig through forums and repos for verified patterns.",
    approach: [
      "Built series-based learning paths that teach technical concepts progressively.",
      "Integrated a custom production-grade AI Assistant powered by a localized RAG pipeline.",
      "Next.js for server-rendered page speed; Tailwind CSS for the visual system.",
      "Secure FastAPI backend with custom execution runtime test runners.",
    ],
    outcomes: [
      "Ranks organically on high-intent AI and engineering topics.",
      "RAG assistant returns grounded answers with citations in real time, ~80% lower user search latency.",
      "Automated CI and post-deploy cache warming keep TTFB low for bots and humans.",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "FastAPI", "RAG", "Vector DB"],
    links: [
      { label: "Visit Blog", href: "https://madhudadi.in/blog" },
      { label: "AI Assistant", href: "https://madhudadi.in/blog/ask" },
    ],
  },
  "udemy-enroller-fastapi": {
    slug: "udemy-enroller-fastapi",
    name: "Udemy Enroller using FastAPI",
    category: "Web App",
    client: "Open source / community",
    role: "Designer & Engineer",
    period: "2023 to Present",
    summary:
      "FastAPI automation that scrapes coupon sites, validates Udemy course links, and auto-enrolls users via async queues, eliminating ~100% of manual effort.",
    problem:
      "Finding free or discounted Udemy courses is repetitive and time-sensitive. Users had to monitor multiple coupon sites, copy links, and enroll before short validity windows expired, losing opportunities to timezone gaps and manual toil. The system needed a robust, high-availability architecture to handle async queues and rate-limiting gracefully.",
    approach: [
      "FastAPI service for the core API layer with session-based Udemy authentication.",
      "Celery + Redis for async task processing and concurrent enrollments.",
      "Scraping and validation pipeline that authenticates, verifies coupons, and enrolls users without manual input.",
      "Comprehensive logging and monitoring to track success rates and handle CAPTCHAs / IP blocks.",
    ],
    outcomes: [
      "Reduced manual enrollment effort by ~90%, users enroll in multiple courses in seconds.",
      "Delivered 20,000+ free courses in 6 months; estimated savings ₹10,00,000+.",
      "Scales to hundreds of concurrent coupon requests while respecting platform rate limits.",
    ],
    stack: ["Python", "FastAPI", "REST API Design", "GitHub Actions", "Google Analytics"],
    links: [
      { label: "Live demo", href: "https://udemyenroller.madhudadi.in/" },
      { label: "Source code", href: "https://github.com/madhu2456/udemy_enroller_fastapi" },
    ],
  },
};

export const Route = createFileRoute("/case-studies/$slug")({
  loader: ({ params }): CaseStudy => {
    const study = studies[params.slug];
    if (!study) throw notFound();
    return study;
  },

  head: ({ params, loaderData }) => {
    const title = loaderData
      ? `${loaderData.name} Case Study | ${loaderData.category} · Madhu Dadi`
      : "Case Study · Madhu Dadi, AI & Analytics Engineer";
    const description = loaderData?.summary ?? "Case study by Madhu Dadi, AI & Analytics Engineer.";
    const url = `${SITE_URL}/case-studies/${params.slug}`;
    const ogImage = `${SITE_URL}/og.jpg`;
    const keywords = loaderData ? loaderData.stack.join(", ") : undefined;

    const articleJsonLd = loaderData && {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: loaderData.name,
      description: loaderData.summary,
      about: loaderData.category,
      keywords,
      image: ogImage,
      datePublished: "2024-01-01",
      dateModified: new Date().toISOString().slice(0, 10),
      author: { "@type": "Person", name: "Madhu Dadi", url: SITE_URL },
      publisher: {
        "@type": "Person",
        name: "Madhu Dadi",
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png` },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      url,
    };

    const breadcrumbJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Work", item: `${SITE_URL}/#projects` },
        { "@type": "ListItem", position: 3, name: "Case Studies", item: `${SITE_URL}/case-studies` },
        ...(loaderData
          ? [{ "@type": "ListItem", position: 4, name: loaderData.name, item: url }]
          : []),
      ],
    };

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "author", content: "Madhu Dadi" },
        ...(keywords ? [{ name: "keywords", content: keywords }] : []),
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { property: "og:site_name", content: "Madhu Dadi" },
        { property: "og:image", content: ogImage },
        { property: "og:image:secure_url", content: ogImage },
        { property: "og:image:type", content: "image/jpeg" },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:image:alt", content: loaderData ? `${loaderData.name} case study by Madhu Dadi` : "Case study by Madhu Dadi" },
        { property: "og:logo", content: `${SITE_URL}/icon-512.png` },
        { property: "article:author", content: "Madhu Dadi" },
        { property: "article:section", content: loaderData?.category ?? "Case Study" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@madhu245" },
        { name: "twitter:creator", content: "@madhu245" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: ogImage },
        { name: "twitter:image:alt", content: loaderData ? `${loaderData.name} case study by Madhu Dadi` : "Case study by Madhu Dadi" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        ...(articleJsonLd ? [{ type: "application/ld+json", children: JSON.stringify(articleJsonLd) }] : []),
        { type: "application/ld+json", children: JSON.stringify(breadcrumbJsonLd) },
      ],
    };
  },
  component: CaseStudyPage,
  notFoundComponent: CaseStudyNotFound,
});

function CaseStudyPage() {
  const study = Route.useLoaderData() as CaseStudy;

  return (
    <main className="mx-auto w-[min(900px,92%)] pt-32 pb-24">
      <Link to="/case-studies" className="text-sm text-muted-foreground hover:text-foreground">
        ← All case studies
      </Link>

      <p className="mt-8 text-xs uppercase tracking-[0.25em] text-primary">{study.category}</p>
      <h1 className="mt-3 font-display text-4xl md:text-6xl text-gradient">{study.name}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{study.summary}</p>

      <dl className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-border bg-surface/40 p-6 text-sm md:grid-cols-3">
        <div>
          <dt className="text-xs uppercase tracking-widest text-muted-foreground">Client</dt>
          <dd className="mt-1">{study.client}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-widest text-muted-foreground">Role</dt>
          <dd className="mt-1">{study.role}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-widest text-muted-foreground">Period</dt>
          <dd className="mt-1">{study.period}</dd>
        </div>
      </dl>

      <section className="mt-12">
        <h2 className="font-display text-2xl">Problem</h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">{study.problem}</p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl">Approach</h2>
        <ul className="mt-3 space-y-2">
          {study.approach.map((a) => (
            <li key={a} className="flex gap-3 rounded-xl border border-border bg-surface/40 px-4 py-3 text-sm">
              <span className="text-primary">◆</span>
              <span>{a}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl">Outcomes</h2>
        <ul className="mt-3 space-y-2">
          {study.outcomes.map((o) => (
            <li key={o} className="flex gap-3 rounded-xl border border-border bg-surface/40 px-4 py-3 text-sm">
              <span className="text-primary">✓</span>
              <span>{o}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl">Stack</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {study.stack.map((s) => (
            <li key={s} className="rounded-full border border-border bg-surface/60 px-3 py-1 text-xs">
              {s}
            </li>
          ))}
        </ul>
      </section>

      {study.links && study.links.length > 0 && (
        <section className="mt-12 flex flex-wrap gap-3">
          {study.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
            >
              {l.label} ↗
            </a>
          ))}
        </section>
      )}
    </main>
  );
}

function CaseStudyNotFound() {
  return (
    <main className="mx-auto w-[min(700px,92%)] pt-40 pb-24 text-center">
      <h1 className="font-display text-4xl">Case study not found</h1>
      <p className="mt-3 text-muted-foreground">That case study doesn't exist (yet).</p>
      <Link
        to="/case-studies"
        className="mt-8 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground"
      >
        See all case studies
      </Link>
    </main>
  );
}
