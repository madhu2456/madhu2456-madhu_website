import { ArrowRight, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getPortfolioData } from "@/lib/portfolio-data";

const DEFAULT_SITE_URL = "https://madhudadi.in";
const CASE_STUDIES_DESCRIPTION =
  "Selected case studies by Madhu Dadi across AI visibility, RAG-powered learning, automation, marketing analytics, and full-stack engineering.";

const getSiteUrl = () => {
  const url = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(
    /\/+$/,
    "",
  );
  return `${url}/`;
};

export const metadata: Metadata = {
  title: "Case Studies | Madhu Dadi",
  description: CASE_STUDIES_DESCRIPTION,
  alternates: {
    canonical: "/case-studies/",
  },
  openGraph: {
    title: "Case Studies | Madhu Dadi",
    description: CASE_STUDIES_DESCRIPTION,
    url: "/case-studies/",
    type: "website",
    images: [
      {
        url: `${getSiteUrl()}opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Madhu Dadi case studies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Case Studies | Madhu Dadi",
    description: CASE_STUDIES_DESCRIPTION,
    images: [`${getSiteUrl()}opengraph-image`],
    creator: "@madhu245",
    site: "@madhu245",
  },
};

export default async function CaseStudiesPage() {
  const { sortedProjects } = await getPortfolioData();
  const siteUrl = getSiteUrl();
  const collectionUrl = `${siteUrl}case-studies/`;
  const itemListElement = sortedProjects.map((project, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: project.title,
    url: `${collectionUrl}${project.slug}/`,
  }));

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${collectionUrl}#collection`,
    url: collectionUrl,
    name: "Case studies by Madhu Dadi",
    description: CASE_STUDIES_DESCRIPTION,
    inLanguage: "en-US",
    isPartOf: { "@id": `${siteUrl}#website` },
    mainEntity: {
      "@type": "ItemList",
      "@id": `${collectionUrl}#items`,
      numberOfItems: itemListElement.length,
      itemListElement,
    },
  };

  return (
    <main className="mx-auto w-[min(1200px,92%)] pt-32 pb-24">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: server-side JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <Link
        href="/"
        className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        Home
      </Link>

      <header className="mt-8 max-w-3xl">
        <p className="text-xs tracking-[0.25em] text-primary uppercase">
          Selected work
        </p>
        <h1 className="mt-3 font-display text-5xl text-gradient md:text-7xl">
          Selected work.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          Case studies across AI visibility, RAG learning systems, async
          automation, and the full-stack engineering that keeps them useful
          after launch.
        </p>
      </header>

      <section className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedProjects.map((project) => {
          const stack = project.technologies?.map((tech) => tech.name) ?? [];

          return (
            <article
              key={project.slug}
              className="group flex flex-col rounded-2xl border border-border bg-surface/60 p-6 transition-all hover:-translate-y-1 hover:border-primary/40"
            >
              {project.category ? (
                <p className="text-xs tracking-widest text-primary uppercase">
                  {project.category}
                </p>
              ) : null}
              <h2 className="mt-3 font-display text-2xl leading-tight">
                {project.title}
              </h2>
              {project.tagline ? (
                <p className="mt-2 text-sm font-medium text-foreground/80">
                  {project.tagline}
                </p>
              ) : null}
              {project.impactSummary ? (
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {project.impactSummary}
                </p>
              ) : null}
              <div className="mt-5 flex flex-wrap gap-1.5">
                {stack.slice(0, 6).map((tech) => (
                  <span
                    key={`${project.slug}-${tech}`}
                    className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                <Link
                  href={`/case-studies/${project.slug}/`}
                  className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
                >
                  Read case study <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    Live <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : null}
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
