import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPortfolioData } from "@/lib/portfolio-data";

type CaseStudy = {
  title?: string | null;
  slug?: string | null;
  tagline?: string | null;
  category?: string | null;
  impactSummary?: string | null;
  liveUrl?: string | null;
  githubUrl?: string | null;
  featured?: boolean | null;
  coverImage?: {
    asset?: string | null;
  } | null;
  technologies?: Array<{ name?: string | null } | null> | null;
};

const DEFAULT_SITE_URL = "https://madhudadi.in";
const CASE_STUDIES_DESCRIPTION =
  "Detailed case studies of AI, analytics, and full-stack projects delivered by Madhu Dadi.";

const getSiteUrl = () =>
  (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Case Studies",
  description: CASE_STUDIES_DESCRIPTION,
  alternates: {
    canonical: "/case-studies",
  },
  openGraph: {
    title: "Case Studies | Madhu Dadi",
    description: CASE_STUDIES_DESCRIPTION,
    url: "/case-studies",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
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
    images: [{ url: "/opengraph-image", alt: "Madhu Dadi case studies" }],
  },
};

export default async function CaseStudiesPage() {
  const { sortedProjects } = await getPortfolioData();
  const caseStudies = sortedProjects.map((project) => ({
    ...project,
    coverImage: project.coverImage ? { asset: project.coverImage } : null,
  })) as CaseStudy[];
  const siteUrl = getSiteUrl();
  const collectionUrl = `${siteUrl}/case-studies`;
  const itemListElement = caseStudies
    .map((project, index) => {
      const slug = project.slug?.trim();
      const title = project.title?.trim();
      if (!slug || !title) return null;

      return {
        "@type": "ListItem",
        position: index + 1,
        name: title,
        url: `${collectionUrl}/${slug}`,
      };
    })
    .filter(
      (
        item,
      ): item is {
        "@type": "ListItem";
        position: number;
        name: string;
        url: string;
      } => Boolean(item),
    );

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${collectionUrl}#collection`,
    url: collectionUrl,
    name: "Case Studies",
    description: CASE_STUDIES_DESCRIPTION,
    inLanguage: "en-US",
    isPartOf: { "@id": `${siteUrl}/#website` },
    mainEntity: {
      "@type": "ItemList",
      "@id": `${collectionUrl}#items`,
      numberOfItems: itemListElement.length,
      itemListElement,
    },
  };

  return (
    <main className="min-h-screen py-20 px-6 bg-muted/10">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: server-side JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <div className="container mx-auto max-w-6xl space-y-12">
        <header className="text-center space-y-4">
          <nav className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">Case studies</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold">Case Studies</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Selected project breakdowns with implementation details, technology
            decisions, and measurable outcomes.
          </p>
          <div className="flex items-center justify-center pt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-border/70 bg-background px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Back to home
            </Link>
          </div>
        </header>

        {caseStudies.length === 0 ? (
          <section className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
            Case studies will appear here after projects are published.
          </section>
        ) : (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {caseStudies.map((project) => {
              const slug = project.slug?.trim();
              const title = project.title?.trim() || "Untitled Project";
              const summary =
                project.impactSummary?.trim() ||
                project.tagline?.trim() ||
                "Problem-to-impact walkthrough, architecture notes, and delivery evidence.";

              return (
                <article
                  key={slug || title}
                  className="rounded-xl border bg-card overflow-hidden flex flex-col"
                >
                  {project.coverImage?.asset ? (
                    <div className="relative aspect-video bg-muted">
                      <Image
                        src={project.coverImage.asset}
                        alt={`${title} preview`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                  ) : null}

                  <div className="p-6 space-y-4 flex-1 flex flex-col">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {project.featured ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-primary/15 text-primary">
                            Featured
                          </span>
                        ) : null}
                        {project.category ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                            {project.category}
                          </span>
                        ) : null}
                      </div>
                      <h2 className="text-2xl font-semibold">{title}</h2>
                      <p className="text-sm text-muted-foreground">{summary}</p>
                    </div>

                    {project.technologies && project.technologies.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {project.technologies
                          .map((tech) => tech?.name?.trim())
                          .filter((tech): tech is string => Boolean(tech))
                          .slice(0, 6)
                          .map((tech) => (
                            <span
                              key={`${title}-${tech}`}
                              className="px-2 py-1 text-xs rounded-md bg-primary/10 text-primary"
                            >
                              {tech}
                            </span>
                          ))}
                      </div>
                    ) : null}

                    <div className="pt-2 mt-auto flex flex-wrap gap-3">
                      {slug ? (
                        <Link
                          href={`/case-studies/${slug}`}
                          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm"
                        >
                          Read case study
                        </Link>
                      ) : null}
                      {project.liveUrl ? (
                        <Link
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-lg border hover:bg-accent transition-colors text-sm"
                        >
                          Live demo
                        </Link>
                      ) : null}
                      {project.githubUrl ? (
                        <Link
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-lg border hover:bg-accent transition-colors text-sm"
                        >
                          Source code
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
