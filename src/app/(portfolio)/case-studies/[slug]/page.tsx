import { ArrowLeft, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPortfolioData, type ProjectItem } from "@/lib/portfolio-data";

const DEFAULT_SITE_URL = "https://madhudadi.in";

const getSiteUrl = () => {
  const url = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(
    /\/+$/,
    "",
  );
  return `${url}/`;
};

const toDescription = (...values: Array<string | null | undefined>) => {
  const merged = values
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value))
    .join(" ");

  if (!merged) {
    return "Case study detailing implementation approach, stack, and measurable delivery outcomes.";
  }

  if (merged.length <= 160) return merged;

  const boundary = merged.lastIndexOf(" ", 160);
  const safeBoundary = boundary > 0 ? boundary : 160;
  return `${merged
    .slice(0, safeBoundary)
    .trim()
    .replace(/[,\s;:!?-]+$/, "")}.`;
};

const splitIntoList = (value?: string) => {
  if (!value) return [];

  const newlineItems = value
    .split(/\n+/)
    .map((item) => item.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);

  if (newlineItems.length > 1) return newlineItems;

  return value
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 5);
};

const getProjectMeta = (project: ProjectItem) => {
  if (project.slug === "adticks") {
    return {
      client: "Adticks",
      role: "Founder & Full-stack / AI Engineer",
      period: "2024 to Present",
    };
  }

  if (project.slug === "technical-blog") {
    return {
      client: "madhudadi.in/blog",
      role: "Designer & Engineer",
      period: "2024 to Present",
    };
  }

  if (project.slug === "udemy-enroller-fastapi") {
    return {
      client: "Open source / community",
      role: "Designer & Engineer",
      period: "2023 to Present",
    };
  }

  return {
    client: project.title,
    role: "Designer & Engineer",
    period: "Recent project",
  };
};

const makeEvidenceLinks = (project: ProjectItem, siteUrl: string) => {
  const links: Array<{ label: string; url: string }> = [
    {
      label: "Case study",
      url: `${siteUrl}case-studies/${project.slug}/`,
    },
  ];

  if (project.liveUrl) links.push({ label: "Live demo", url: project.liveUrl });
  if (project.githubUrl)
    links.push({ label: "Source code", url: project.githubUrl });

  for (const citation of project.citations ?? []) {
    if (citation.url) {
      links.push({ label: citation.label || "Evidence", url: citation.url });
    }
  }

  return Array.from(new Map(links.map((link) => [link.url, link])).values());
};

export async function generateStaticParams() {
  const { sortedProjects } = await getPortfolioData();
  return sortedProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { sortedProjects } = await getPortfolioData();
  const project = sortedProjects.find((item) => item.slug === slug);

  if (!project) {
    return {
      title: "Case Study Not Found",
      alternates: { canonical: `/case-studies/${slug}/` },
      robots: { index: false, follow: true },
    };
  }

  const siteUrl = getSiteUrl();
  const title = `${project.title} Case Study | ${project.category || "Work"} · Madhu Dadi`;
  const description = toDescription(project.impactSummary, project.tagline);
  const url = `/case-studies/${slug}/`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [
        {
          url: `${siteUrl}opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${project.title} case study by Madhu Dadi`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}opengraph-image`],
      creator: "@madhu245",
      site: "@madhu245",
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { profile, sortedProjects } = await getPortfolioData();
  const project = sortedProjects.find((item) => item.slug === slug);

  if (!project) notFound();

  const siteUrl = getSiteUrl();
  const caseStudyUrl = `${siteUrl}case-studies/${slug}/`;
  const description = toDescription(project.impactSummary, project.tagline);
  const evidenceLinks = makeEvidenceLinks(project, siteUrl);
  const meta = getProjectMeta(project);
  const approach = splitIntoList(project.solutionApproach);
  const outcomes =
    project.impactMetrics?.map((metric) => `${metric.value} ${metric.label}`) ??
    splitIntoList(project.impactSummary);
  const stack = project.technologies?.map((tech) => tech.name) ?? [];

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${caseStudyUrl}#case-study`,
        headline: project.title,
        description,
        dateModified: project.updatedAt ?? new Date().toISOString(),
        url: caseStudyUrl,
        author: {
          "@type": "Person",
          "@id": `${siteUrl}#person`,
          name: `${profile.firstName} ${profile.lastName}`,
          url: siteUrl,
        },
        isPartOf: {
          "@type": "CollectionPage",
          "@id": `${siteUrl}case-studies/`,
        },
        citation: evidenceLinks.map((link) => link.url),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${caseStudyUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          {
            "@type": "ListItem",
            position: 2,
            name: "Case studies",
            item: `${siteUrl}case-studies/`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: project.title,
            item: caseStudyUrl,
          },
        ],
      },
    ],
  };

  return (
    <main className="mx-auto w-[min(1100px,92%)] pt-32 pb-24">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: server-side JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />

      <Link
        href="/case-studies/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        All case studies
      </Link>

      {project.category ? (
        <p className="mt-8 text-xs tracking-[0.25em] text-primary uppercase">
          {project.category}
        </p>
      ) : null}
      <h1 className="mt-3 font-display text-4xl font-bold text-gradient md:text-6xl">
        {project.title}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        {project.tagline || description}
      </p>

      <dl className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-border bg-surface/40 p-6 text-sm md:grid-cols-3">
        <div>
          <dt className="text-xs tracking-widest text-muted-foreground uppercase">
            Client
          </dt>
          <dd className="mt-1">{meta.client}</dd>
        </div>
        <div>
          <dt className="text-xs tracking-widest text-muted-foreground uppercase">
            Role
          </dt>
          <dd className="mt-1">{meta.role}</dd>
        </div>
        <div>
          <dt className="text-xs tracking-widest text-muted-foreground uppercase">
            Period
          </dt>
          <dd className="mt-1">{meta.period}</dd>
        </div>
      </dl>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold">Problem</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          {project.problemStatement ||
            "The project addressed a real-world workflow bottleneck and focused on improving decision speed, reliability, and usability."}
        </p>
      </section>

      {approach.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold">Approach</h2>
          <ul className="mt-3 space-y-2">
            {approach.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-xl border border-border bg-surface/40 px-4 py-3 text-sm"
              >
                <span className="text-primary">◆</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {outcomes.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold">Outcomes</h2>
          <ul className="mt-3 space-y-2">
            {outcomes.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-xl border border-border bg-surface/40 px-4 py-3 text-sm"
              >
                <span className="text-primary">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {stack.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold">Stack</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {stack.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-border bg-surface/60 px-3 py-1 text-xs"
              >
                {tech}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section id="evidence" className="mt-10">
        <h2 className="font-display text-2xl font-bold">Links</h2>
        <ul className="mt-3 flex flex-wrap gap-3">
          {evidenceLinks.map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-2 text-sm hover:bg-surface-elevated"
              >
                {link.label}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
