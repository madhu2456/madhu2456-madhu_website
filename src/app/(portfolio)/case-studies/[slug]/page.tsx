import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { defineQuery } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import { client } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/live";

type Citation = {
  label?: string | null;
  url?: string | null;
};

type ImpactMetric = {
  label?: string | null;
  value?: string | null;
};

type CaseStudy = {
  title?: string | null;
  slug?: { current?: string | null } | null;
  tagline?: string | null;
  category?: string | null;
  liveUrl?: string | null;
  githubUrl?: string | null;
  featured?: boolean | null;
  problemStatement?: string | null;
  solutionApproach?: string | null;
  impactSummary?: string | null;
  impactMetrics?: ImpactMetric[] | null;
  citations?: Citation[] | null;
  coverImage?: {
    asset?: Parameters<typeof urlFor>[0] | null;
    lqip?: string | null;
    alt?: string | null;
  } | null;
  technologies?: Array<{ name?: string | null; category?: string | null } | null> | null;
  _updatedAt?: string | null;
};

const CASE_STUDY_QUERY = defineQuery(`*[_type == "project" && slug.current == $slug][0]{
  title,
  slug,
  tagline,
  category,
  liveUrl,
  githubUrl,
  featured,
  problemStatement,
  solutionApproach,
  impactSummary,
  impactMetrics[]{
    label,
    value
  },
  citations[]{
    label,
    url
  },
  "coverImage": {
    "asset": coverImage.asset->,
    "lqip": coverImage.asset->metadata.lqip,
    "alt": coverImage.alt
  },
  technologies[]->{name, category},
  _updatedAt
}`);

const CASE_STUDY_META_QUERY = defineQuery(`*[_type == "project" && slug.current == $slug][0]{
  title,
  tagline,
  impactSummary,
  "coverImage": coverImage.asset->
}`);

const CASE_STUDY_SLUGS_QUERY = defineQuery(
  `*[_type == "project" && defined(slug.current)]{ "slug": slug.current }`,
);

const DEFAULT_SITE_URL = "https://madhudadi.in";

const getSiteUrl = () =>
  (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, "");

const toDescription = (...values: Array<string | null | undefined>) => {
  const merged = values
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value))
    .join(" ");

  if (!merged) {
    return "Case study detailing implementation approach, stack, and measurable delivery outcomes.";
  }

  if (merged.length <= 155) {
    return merged;
  }

  const boundary = merged.lastIndexOf(" ", 155);
  const safeBoundary = boundary > 0 ? boundary : 155;
  return `${merged.slice(0, safeBoundary).trim().replace(/[,\s;:!?-]+$/, "")}.`;
};

const makeEvidenceLinks = (project: CaseStudy, siteUrl: string) => {
  const slug = project.slug?.current?.trim();
  const links: Array<{ label: string; url: string }> = [];

  if (slug) {
    links.push({
      label: "Case study",
      url: `${siteUrl}/case-studies/${slug}`,
    });
  }

  if (project.liveUrl) {
    links.push({ label: "Live demo", url: project.liveUrl });
  }
  if (project.githubUrl) {
    links.push({ label: "Source code", url: project.githubUrl });
  }

  for (const citation of project.citations ?? []) {
    if (!citation?.url) continue;
    links.push({
      label: citation.label?.trim() || "Evidence",
      url: citation.url,
    });
  }

  return Array.from(new Map(links.map((link) => [link.url, link])).values());
};

export async function generateStaticParams() {
  const slugs = await client.fetch<Array<{ slug?: string | null }>>(
    CASE_STUDY_SLUGS_QUERY,
  );

  return (slugs ?? [])
    .map((item) => item.slug?.trim())
    .filter((value): value is string => Boolean(value))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await sanityFetch({
    query: CASE_STUDY_META_QUERY,
    params: { slug },
    stega: false,
  });

  if (!data?.title) {
    return {
      title: "Case Study Not Found",
      alternates: {
        canonical: `/case-studies/${slug}`,
      },
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const siteUrl = getSiteUrl();
  const title = `${data.title} | Case Study`;
  const description = toDescription(data.impactSummary, data.tagline);
  const imageUrl = data.coverImage
    ? urlFor(data.coverImage).width(1200).height(630).url()
    : `${siteUrl}/opengraph-image`;

  return {
    title,
    description,
    alternates: {
      canonical: `/case-studies/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/case-studies/${slug}`,
      type: "article",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: data.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: imageUrl, alt: data.title }],
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data } = await sanityFetch({
    query: CASE_STUDY_QUERY,
    params: { slug },
    stega: false,
  });

  const project = (data ?? null) as CaseStudy | null;

  if (!project?.title) {
    notFound();
  }

  const siteUrl = getSiteUrl();
  const title = project.title.trim();
  const evidenceLinks = makeEvidenceLinks(project, siteUrl);
  const caseStudyUrl = `${siteUrl}/case-studies/${slug}`;
  const description = toDescription(project.impactSummary, project.tagline);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${caseStudyUrl}#case-study`,
    headline: title,
    description,
    dateModified: project._updatedAt ?? new Date().toISOString(),
    url: caseStudyUrl,
    author: {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Madhu Dadi",
      url: siteUrl,
    },
    isPartOf: {
      "@type": "CollectionPage",
      "@id": `${siteUrl}/case-studies`,
    },
    citation: evidenceLinks.map((link) => link.url),
  };

  return (
    <main className="min-h-screen py-16 px-6 bg-muted/10">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: server-side JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="container mx-auto max-w-4xl space-y-8 md:space-y-10">
        <header className="rounded-2xl border bg-background p-6 md:p-8 space-y-6 shadow-sm">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/case-studies"
              className="hover:text-foreground transition-colors"
            >
              Case studies
            </Link>
            <span>/</span>
            <span className="text-foreground">{title}</span>
          </nav>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-border/70 bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Back to home
            </Link>
            <Link
              href="/case-studies"
              className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              All case studies
            </Link>
          </div>
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
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">{title}</h1>
          {project.tagline ? (
            <p className="text-lg text-muted-foreground max-w-3xl">{project.tagline}</p>
          ) : null}
        </header>

        {project.coverImage?.asset ? (
          <div className="relative aspect-video rounded-xl overflow-hidden border bg-muted">
            <Image
              src={urlFor(project.coverImage.asset).width(1280).height(720).url()}
              alt={project.coverImage.alt?.trim() || `${title} preview`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
              placeholder={project.coverImage.lqip ? "blur" : "empty"}
              blurDataURL={project.coverImage.lqip ?? undefined}
            />
          </div>
        ) : null}

        <section className="rounded-2xl border bg-background p-4 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {project.liveUrl ? (
              <Link
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Live demo
              </Link>
            ) : null}
            {project.githubUrl ? (
              <Link
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
              >
                Source code
              </Link>
            ) : null}
            <Link
              href="#evidence"
              className="inline-flex items-center justify-center rounded-xl border px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
            >
              Evidence links
            </Link>
          </div>
        </section>

        <article className="space-y-6">
          <section className="rounded-2xl border bg-background p-6 md:p-7 space-y-3 shadow-sm">
            <h2 className="text-2xl font-semibold">Problem</h2>
            <p className="text-muted-foreground leading-relaxed">
              {project.problemStatement?.trim() ||
                "The project addressed a real-world workflow bottleneck and focused on improving decision speed, reliability, and usability."}
            </p>
          </section>

          <section className="rounded-2xl border bg-background p-6 md:p-7 space-y-3 shadow-sm">
            <h2 className="text-2xl font-semibold">Solution</h2>
            <p className="text-muted-foreground leading-relaxed">
              {project.solutionApproach?.trim() ||
                "The solution combined scalable API design, automation-first workflows, and production-oriented frontend delivery to reduce manual effort and improve outcomes."}
            </p>
          </section>

          <section className="rounded-2xl border bg-background p-6 md:p-7 space-y-3 shadow-sm">
            <h2 className="text-2xl font-semibold">Impact</h2>
            <p className="text-muted-foreground leading-relaxed">
              {project.impactSummary?.trim() ||
                "The implementation improved operational efficiency and made decision support more repeatable through measurable, maintainable workflows."}
            </p>

            {project.impactMetrics && project.impactMetrics.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {project.impactMetrics.map((metric) => {
                  const label = metric?.label?.trim();
                  const value = metric?.value?.trim();
                  if (!label || !value) return null;

                  return (
                    <div
                      key={`${label}-${value}`}
                      className="rounded-lg border bg-card p-4"
                    >
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {label}
                      </p>
                      <p className="text-2xl font-semibold mt-1">{value}</p>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </section>

          {project.technologies && project.technologies.length > 0 ? (
            <section className="rounded-2xl border bg-background p-6 md:p-7 space-y-3 shadow-sm">
              <h2 className="text-2xl font-semibold">Technology stack</h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies
                  .map((tech) => tech?.name?.trim())
                  .filter((tech): tech is string => Boolean(tech))
                  .map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                    >
                      {tech}
                    </span>
                  ))}
               </div>
             </section>
          ) : null}

          <section
            id="evidence"
            className="rounded-2xl border bg-background p-6 md:p-7 space-y-3 shadow-sm"
          >
            <h2 className="text-2xl font-semibold">Evidence and citations</h2>
            <ul className="space-y-2">
              {evidenceLinks.map((link) => (
                <li key={link.url}>
                  <Link
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-4 break-all"
                  >
                    {link.label}: {link.url}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </article>
      </div>
    </main>
  );
}
