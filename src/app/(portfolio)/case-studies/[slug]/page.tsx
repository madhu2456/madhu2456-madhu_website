import {
  IconArrowLeft,
  IconArrowRight,
  IconExternalLink,
} from "@tabler/icons-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CitationBox } from "@/components/CitationBox";
import { Footer } from "@/components/Footer";
import { FormattedText } from "@/components/FormattedText";
import { Header } from "@/components/Header";
import { JsonLdScript } from "@/components/JsonLdScript";
import { ShareButtons } from "@/components/ShareButtons";
import {
  normalizeImageSource,
  shouldUseUnoptimizedImage,
} from "@/lib/image-source";
import { getPortfolioData, type ProjectItem } from "@/lib/portfolio-data";
import { resolveSiteUrl } from "@/lib/site-url";

const getSiteUrl = () => {
  return `${resolveSiteUrl()}/`;
};

const toDescription = (...values: Array<string | null | undefined>) => {
  const merged = values
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value))
    .join(" - ")
    .replace(/\s+/g, " ")
    .trim();

  if (!merged) {
    return "Case study detailing implementation approach, stack, and measurable delivery outcomes.";
  }

  if (merged.length <= 160) return merged;

  const sentenceBoundary = merged.lastIndexOf(".", 160);
  if (sentenceBoundary >= 80) {
    return merged.slice(0, sentenceBoundary + 1).trim();
  }

  const boundary = merged.lastIndexOf(" ", 157);
  const safeBoundary = boundary > 0 ? boundary : 157;
  return `${merged
    .slice(0, safeBoundary)
    .trim()
    .replace(/[,\s;:!?-]+$/, "")}...`;
};

const splitIntoList = (value?: string) => {
  if (!value) return [];

  const newlineItems = value
    .split(/\n+/)
    .map((item) => item.replace(/^[-*]\s+/, "").trim())
    .filter(Boolean);

  if (newlineItems.length > 1) return newlineItems;

  return value.split(/(?<=[.!?])\s+(?=[A-Z])/).filter(Boolean);
};

const splitIntoParagraphs = (value?: string) => {
  if (!value) return [];

  const seenParagraphs = new Map<string, number>();

  return value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((text) => {
      const seenCount = seenParagraphs.get(text) ?? 0;
      seenParagraphs.set(text, seenCount + 1);

      return {
        key: seenCount > 0 ? `${text}-${seenCount}` : text,
        text,
      };
    });
};

const getProjectMeta = (project: ProjectItem) => {
  return {
    client:
      project.client ||
      (project.slug === "adticks"
        ? "Adticks"
        : project.slug === "technical-blog"
          ? "madhudadi.in/blog"
          : project.slug === "udemy-enroller-fastapi"
            ? "Open source / community"
            : project.title),
    role:
      project.role ||
      (project.slug === "adticks"
        ? "Founder & Full-stack / AI Engineer"
        : "Designer & Engineer"),
    period: project.period || `${new Date().getFullYear()} to Present`,
  };
};

const makeEvidenceLinks = (project: ProjectItem, _siteUrl: string) => {
  const links: Array<{ label: string; url: string }> = [];

  if (project.liveUrl) links.push({ label: "Live demo", url: project.liveUrl });
  if (project.githubUrl)
    links.push({ label: "Source code", url: project.githubUrl });

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

  const title =
    project.slug === "adticks"
      ? "Adticks AI Visibility Case Study | Madhu Dadi"
      : `${project.title} Case Study | Madhu Dadi`;
  const description = toDescription(project.tagline, project.impactSummary);
  const url = `/case-studies/${slug}/`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: { absolute: title },
      description,
      url,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { sortedProjects, sortedNavigationItems, profile } =
    await getPortfolioData();

  const project = sortedProjects.find((item) => item.slug === slug);

  if (!project) notFound();

  const siteUrl = getSiteUrl();
  const caseStudyUrl = `${siteUrl}case-studies/${slug}/`;
  const description = toDescription(project.tagline, project.impactSummary);
  const evidenceLinks = makeEvidenceLinks(project, siteUrl);
  const meta = getProjectMeta(project);
  const approach = splitIntoList(project.solutionApproach);
  const outcomes =
    project.impactMetrics?.map((metric) => `${metric.value} ${metric.label}`) ??
    splitIntoList(project.impactSummary);
  const stack = project.technologies?.map((tech) => tech.name) ?? [];
  const architectureParagraphs = splitIntoParagraphs(project.architecture);
  const lessonsLearnedParagraphs = splitIntoParagraphs(project.lessonsLearned);

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${caseStudyUrl}#case-study`,
        headline: project.title,
        description,
        datePublished: project.updatedAt ?? new Date().toISOString(),
        dateModified: project.updatedAt ?? new Date().toISOString(),
        image: `${siteUrl}opengraph-image/?ext=.png`,
        about: project.category || "Case Study",
        url: caseStudyUrl,
        author: {
          "@type": "Person",
          "@id": `${siteUrl}#person`,
          name: `${profile.firstName} ${profile.lastName}`,
          url: siteUrl,
        },
        publisher: {
          "@type": "Organization",
          name: `${profile.firstName} ${profile.lastName}`,
          logo: {
            "@type": "ImageObject",
            url: `${siteUrl}icon.png`,
          },
        },
        isPartOf: {
          "@type": "CollectionPage",
          "@id": `${siteUrl}case-studies/`,
        },
        citation: evidenceLinks.map((link) => link.url),
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [
            "#main-content h1",
            "#main-content h2",
            "#main-content p",
          ],
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${caseStudyUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          {
            "@type": "ListItem",
            position: 2,
            name: "Case Studies",
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
    <div className="flex flex-col min-h-screen bg-[#050505]">
      <Header profile={profile} navigationItems={sortedNavigationItems} />
      <main
        id="main-content"
        className="mx-auto w-[min(1100px,92%)] pt-32 pb-24"
      >
        <JsonLdScript data={graph} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8">
          <Link
            href="/case-studies/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            <IconArrowLeft className="h-4 w-4" aria-hidden />
            All case studies
          </Link>
          {project.relatedServiceSlug && (
            <Link
              href={`/services/${project.relatedServiceSlug}/`}
              className="inline-flex items-center gap-2 text-sm text-primary underline-offset-4 hover:text-primary/80 hover:underline"
            >
              Related service
              <IconArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          )}
        </div>

        {project.category ? (
          <p className="mt-8 text-xs tracking-[0.25em] text-muted-foreground uppercase">
            {project.category}
          </p>
        ) : null}
        <p className="mt-6 text-sm text-muted-foreground/80">
          By Madhu Dadi &middot; Updated{" "}
          <time dateTime={project.updatedAt ?? new Date().toISOString()}>
            {new Date(project.updatedAt ?? new Date()).toLocaleDateString(
              "en-US",
              {
                month: "long",
                year: "numeric",
              },
            )}
          </time>
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold text-gradient md:text-6xl">
          {project.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          {project.tagline || description}
        </p>

        {/* AI Answer Block / Executive Summary */}
        <section
          aria-label="Quick Answer"
          className="mt-8 p-6 rounded-2xl bg-surface/40 border border-border/60 space-y-4"
        >
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            Quick Answer: Case Study Summary
          </h2>
          <dl className="space-y-4">
            {project.category && (
              <div>
                <dt className="font-bold text-foreground text-sm">
                  What is the focus area of this project?
                </dt>
                <dd className="text-sm text-foreground/90 mt-1">
                  {project.category}
                </dd>
              </div>
            )}
            {project.technologies && project.technologies.length > 0 && (
              <div>
                <dt className="font-bold text-foreground text-sm">
                  What core stack was used?
                </dt>
                <dd className="text-sm text-foreground/90 mt-1">
                  {project.technologies.map((t) => t.name).join(", ")}
                </dd>
              </div>
            )}
            {project.impactMetrics && project.impactMetrics.length > 0 && (
              <div>
                <dt className="font-bold text-foreground text-sm">
                  What was the key impact?
                </dt>
                <dd className="text-sm text-foreground/90 mt-1">
                  {project.impactMetrics[0]?.value}{" "}
                  {project.impactMetrics[0]?.label}
                </dd>
              </div>
            )}
            <div>
              <dt className="font-bold text-foreground text-sm">
                What was the project outcome?
              </dt>
              <dd className="text-sm text-foreground/90 mt-1">
                {project.tagline || description}
              </dd>
            </div>
          </dl>
        </section>

        {project.coverImage ? (
          <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-glow">
            <Image
              src={normalizeImageSource(project.coverImage) || ""}
              alt={project.coverImageAlt || project.title}
              width={1280}
              height={720}
              sizes="(max-width: 1200px) 100vw, 1100px"
              className="object-cover w-full h-full"
              priority
              unoptimized={shouldUseUnoptimizedImage(project.coverImage)}
            />
          </div>
        ) : null}

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
            <FormattedText
              text={
                project.problemStatement ||
                "The project addressed a real-world workflow bottleneck and focused on improving decision speed, reliability, and usability."
              }
            />
          </p>
        </section>

        {approach.length > 0 ? (
          <section className="mt-10">
            <h2 className="font-display text-2xl font-bold">Approach</h2>
            <ul className="mt-3 space-y-2">
              {approach.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 rounded-xl border border-border bg-surface/40 px-4 py-3 text-sm leading-relaxed"
                >
                  <span className="text-primary mt-0.5">◆</span>
                  <span>
                    <FormattedText text={item} />
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {architectureParagraphs.length > 0 ? (
          <section className="mt-10">
            <h2 className="font-display text-2xl font-bold">Architecture</h2>
            <div className="prose prose-invert mt-4 max-w-none text-muted-foreground">
              {architectureParagraphs.map((paragraph) => (
                <p key={`architecture-${paragraph.key}`}>
                  <FormattedText text={paragraph.text} />
                </p>
              ))}
            </div>
          </section>
        ) : null}

        {outcomes.length > 0 ? (
          <section className="mt-10">
            <h2 className="font-display text-2xl font-bold">Results</h2>
            <ul className="mt-3 space-y-2">
              {outcomes.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 rounded-xl border border-border bg-surface/40 px-4 py-3 text-sm leading-relaxed"
                >
                  <span className="text-primary mt-0.5">✓</span>
                  <span>
                    <FormattedText text={item} />
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {lessonsLearnedParagraphs.length > 0 ? (
          <section className="mt-10">
            <h2 className="font-display text-2xl font-bold">
              What I&apos;d do differently
            </h2>
            <div className="prose prose-invert mt-4 max-w-none text-muted-foreground">
              {lessonsLearnedParagraphs.map((paragraph) => (
                <p key={`lessons-${paragraph.key}`}>
                  <FormattedText text={paragraph.text} />
                </p>
              ))}
            </div>
          </section>
        ) : null}

        {project.gallery && project.gallery.length > 0 ? (
          <section className="mt-10">
            <h2 className="sr-only">Gallery</h2>
            <div className="mt-6 flex flex-col gap-8">
              {project.gallery.map((img, _i) => (
                <figure
                  key={img.url}
                  className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card"
                >
                  <div className="relative aspect-video w-full">
                    <Image
                      src={normalizeImageSource(img.url) || ""}
                      alt={img.alt || project.title}
                      width={1920}
                      height={1080}
                      sizes="(max-width: 1200px) 100vw, 1100px"
                      className="object-cover w-full h-full"
                      unoptimized={shouldUseUnoptimizedImage(img.url)}
                    />
                  </div>
                  {img.caption ? (
                    <figcaption className="border-t border-border/80 p-4 text-sm text-muted-foreground bg-surface/50">
                      {img.caption}
                    </figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
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
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-4 py-2 text-sm hover:bg-surface-elevated hover:border-primary/30 transition-all duration-300"
                >
                  {link.label}
                  <IconExternalLink className="h-3.5 w-3.5" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </section>

        {project.citations && project.citations.length > 0 ? (
          <section className="mt-10">
            <h2 className="font-display text-2xl font-bold">
              Sources / further reading
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {project.citations.map((citation, i) => (
                <li key={citation.url || i}>
                  {citation.url ? (
                    <a
                      href={citation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary underline underline-offset-4 flex items-center gap-2"
                    >
                      {citation.label || citation.url}
                      <IconExternalLink
                        className="h-3 w-3 inline-block"
                        aria-hidden
                      />
                    </a>
                  ) : (
                    <span>{citation.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <ShareButtons
          url={caseStudyUrl}
          title={`${project.title} - Case Study by Madhu Dadi`}
          description={description}
        />
        <CitationBox
          title={project.title}
          url={caseStudyUrl}
          authorName="Madhu Dadi"
        />
      </main>
      <Footer
        profile={profile}
        navigationItems={sortedNavigationItems}
        projects={sortedProjects}
      />
    </div>
  );
}
