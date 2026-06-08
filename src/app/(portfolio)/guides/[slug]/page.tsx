import {
  ArrowRight,
  Calendar,
  Clock,
  Link as LinkIcon,
  User,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { GuideArticle } from "@/components/guides/GuideArticle";
import { GuideTableOfContents } from "@/components/guides/GuideTableOfContents";
import { extractTableOfContents } from "@/lib/guide-markdown";
import { shouldUseUnoptimizedImage } from "@/lib/image-source";
import { getGuideBySlug, getPortfolioData } from "@/lib/portfolio-data";
import {
  buildFullGraph,
  buildArticleSchema,
  buildBreadcrumbSchema,
} from "@/lib/jsonld";
import { resolveAbsoluteImageUrl } from "@/lib/image-source";

const DEFAULT_SITE_URL = "https://madhudadi.in";

const getSiteUrl = () => {
  const url = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(
    /\/+$/,
    "",
  );
  return `${url}/`;
};

// Calculate reading time from markdown text
function getReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  const wpm = 225; // Average reading speed
  return Math.max(1, Math.ceil(words / wpm));
}

export async function generateStaticParams() {
  const { publishedGuides } = await getPortfolioData();
  return publishedGuides.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);

  if (!guide) {
    return {};
  }

  const siteUrl = getSiteUrl();
  const url = `${siteUrl}guides/${guide.slug}/`;

  return {
    title: guide.seoTitle || `${guide.title} | Madhu Dadi`,
    description: guide.seoDescription || guide.summary,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: guide.seoTitle || guide.title,
      description: guide.seoDescription || guide.summary,
      url,
      type: "article",
      publishedTime: guide.publishedAt || guide.updatedAt,
      modifiedTime: guide.updatedAt,
      authors: ["Madhu Dadi"],
      images: [
        {
          url: guide.coverImage
            ? `${siteUrl}${guide.coverImage.replace(/^\/+/, "")}`
            : `${siteUrl}opengraph-image?ext=.png`,
          width: 1200,
          height: 630,
          alt: guide.coverImageAlt || guide.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.seoTitle || guide.title,
      description: guide.seoDescription || guide.summary,
      images: [
        guide.coverImage
          ? `${siteUrl}${guide.coverImage.replace(/^\/+/, "")}`
          : `${siteUrl}opengraph-image?ext=.png`,
      ],
      creator: "@madhu245",
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { sortedNavigationItems, sortedServices, sortedProjects, profile } =
    await getPortfolioData();
  const guide = await getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const siteUrl = getSiteUrl();
  const url = `${siteUrl}guides/${guide.slug}/`;
  const readingTime = getReadingTime(guide.bodyMarkdown || "");
  const toc = await extractTableOfContents(guide.bodyMarkdown || "");

  const articleNode = buildArticleSchema({
    siteUrl,
    url,
    headline: guide.seoTitle || guide.title,
    description: guide.seoDescription || guide.summary || "",
    image: resolveAbsoluteImageUrl(guide.coverImage),
    datePublished:
      guide.publishedAt || guide.updatedAt || new Date().toISOString(),
    dateModified: guide.updatedAt || new Date().toISOString(),
    authorName: "Madhu Dadi",
    authorUrl: siteUrl,
    publisherName: "Madhu Dadi",
  });

  const breadcrumbNode = buildBreadcrumbSchema(url, [
    { name: "Guides", item: `${siteUrl}guides/` },
    { name: guide.title, item: url },
  ]);

  const graph = buildFullGraph([articleNode, breadcrumbNode]);

  const relatedServices = sortedServices.filter((s) =>
    guide.relatedServiceSlugs?.includes(s.slug),
  );
  const relatedProjects = sortedProjects.filter((p) =>
    guide.relatedProjectSlugs?.includes(p.slug),
  );

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: server-side JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />
      <div className="flex min-h-screen flex-col bg-background selection:bg-primary/20">
        <Header profile={profile} navigationItems={sortedNavigationItems} />

        <main className="flex-1 pb-24 pt-32 md:pt-40">
          <article className="mx-auto w-full max-w-7xl px-6 md:px-12">
            {/* Guide Header */}
            <header className="mx-auto max-w-3xl mb-16 text-center">
              <div className="mb-6 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground uppercase tracking-widest font-semibold">
                <span className="text-primary">{guide.primaryTopic}</span>
                <span>•</span>
                <span>{guide.guideType.replace("-", " ")}</span>
              </div>
              <h1 className="mb-8 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
                {guide.title}
              </h1>
              <p className="mb-8 text-xl leading-relaxed text-muted-foreground text-balance">
                {guide.summary}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium text-foreground">
                    Madhu Dadi
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={guide.publishedAt || guide.updatedAt}>
                    {new Date(
                      guide.publishedAt || guide.updatedAt,
                    ).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{readingTime} min read</span>
                </div>
              </div>
            </header>

            {/* Cover Image */}
            {guide.coverImage && (
              <div className="mb-16 md:mb-24 relative mx-auto max-w-5xl overflow-hidden rounded-2xl bg-muted aspect-video md:aspect-[2.4/1]">
                <Image
                  src={
                    guide.coverImage.startsWith("/")
                      ? guide.coverImage
                      : `/${guide.coverImage}`
                  }
                  alt={guide.coverImageAlt || guide.title}
                  fill
                  className="object-cover"
                  priority
                  unoptimized={shouldUseUnoptimizedImage(guide.coverImage)}
                />
              </div>
            )}

            {/* Layout: Sidebar + Content */}
            <div className="mx-auto flex max-w-6xl flex-col items-start gap-12 lg:flex-row lg:gap-16">
              {/* Sidebar */}
              <aside className="w-full shrink-0 lg:sticky lg:top-32 lg:w-[240px] space-y-8 order-2 lg:order-1">
                <GuideTableOfContents toc={toc} />

                {/* Related Links */}
                {(relatedServices.length > 0 || relatedProjects.length > 0) && (
                  <div className="space-y-4 pt-8 border-t">
                    <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                      Related Resources
                    </h3>
                    <div className="flex flex-col gap-3">
                      {relatedServices.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/services/${s.slug}/`}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          Service: {s.title}
                        </Link>
                      ))}
                      {relatedProjects.map((p) => (
                        <Link
                          key={p.slug}
                          href={`/case-studies/${p.slug}/`}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          Case Study: {p.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </aside>

              {/* Main Content */}
              <div className="min-w-0 flex-1 order-1 lg:order-2 w-full">
                <GuideArticle content={guide.bodyMarkdown || ""} />

                {/* Citations */}
                {guide.citations && guide.citations.length > 0 && (
                  <div className="mt-16 pt-8 border-t max-w-[70ch] mx-auto">
                    <h2 className="mb-6 font-display text-2xl font-bold tracking-tight text-foreground">
                      References & Citations
                    </h2>
                    <ul className="space-y-4">
                      {guide.citations.map((c, i) => (
                        <li
                          key={i}
                          className="text-sm text-muted-foreground flex items-start gap-3"
                        >
                          <span className="font-mono text-xs opacity-50 mt-0.5">
                            [{i + 1}]
                          </span>
                          <div>
                            <p className="font-medium text-foreground">
                              {c.label}
                            </p>
                            {c.url ? (
                              <a
                                href={c.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline flex items-center gap-1 mt-1"
                              >
                                {c.url} <LinkIcon className="h-3 w-3" />
                              </a>
                            ) : null}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Artifacts (Benchmarks) */}
                {guide.artifacts && guide.artifacts.length > 0 && (
                  <div className="mt-12 pt-8 border-t max-w-[70ch] mx-auto">
                    <h2 className="mb-6 font-display text-2xl font-bold tracking-tight text-foreground">
                      Artifacts & Downloads
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {guide.artifacts.map((a, i) => (
                        <a
                          key={i}
                          href={a.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-4 rounded-xl border bg-card p-4 hover:border-primary/50 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-foreground truncate">
                              {a.label}
                            </p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                              {a.type}
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Benchmark Details (if benchmark-results) */}
                {guide.guideType === "benchmark-results" &&
                  guide.benchmarkDetails && (
                    <div className="mt-12 pt-8 border-t max-w-[70ch] mx-auto">
                      <h2 className="mb-6 font-display text-2xl font-bold tracking-tight text-foreground">
                        Benchmark Methodology
                      </h2>
                      <div className="rounded-2xl border bg-muted/30 p-6 space-y-4 text-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">
                              Embedding Model
                            </span>
                            <span className="font-medium">
                              {guide.benchmarkDetails.embeddingModel || "N/A"}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">
                              Repetitions
                            </span>
                            <span className="font-medium">
                              {guide.benchmarkDetails.repetitions || "N/A"}
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">
                            Methodology Summary
                          </span>
                          <span className="font-medium">
                            {guide.benchmarkDetails.methodologySummary || "N/A"}
                          </span>
                        </div>
                        {guide.benchmarkDetails.repositoryUrl && (
                          <div className="pt-2">
                            <a
                              href={guide.benchmarkDetails.repositoryUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center gap-1 font-medium"
                            >
                              View Benchmark Repository{" "}
                              <LinkIcon className="h-3 w-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                {/* CTA */}
                <div className="mt-24 rounded-3xl bg-primary/5 p-8 md:p-12 text-center max-w-[70ch] mx-auto border border-primary/10">
                  <h2 className="mb-4 font-display text-2xl font-bold md:text-3xl">
                    Need help implementing these patterns?
                  </h2>
                  <p className="mb-8 text-muted-foreground text-balance">
                    Get expert guidance on building robust AI agents, scalable
                    RAG systems, and advanced analytics infrastructure.
                  </p>
                  <Link
                    href={`mailto:${profile.email}`}
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    Consult with Madhu
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </main>
      </div>
    </>
  );
}
