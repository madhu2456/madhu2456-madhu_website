import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { getPortfolioData } from "@/lib/portfolio-data";

const DEFAULT_SITE_URL = "https://madhudadi.in";

const getSiteUrl = () => {
  const url = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(
    /\/+$/,
    "",
  );
  return `${url}/`;
};

export async function generateMetadata(): Promise<Metadata> {
  const { pageContent } = await getPortfolioData();
  const guidesIndex = pageContent.guidesIndex;

  return {
    title:
      guidesIndex?.seo?.title ||
      "Technical Guides & Architecture Frameworks | Madhu Dadi",
    description:
      guidesIndex?.seo?.description ||
      "Evergreen frameworks, technical analysis, and benchmarks covering AI agents, vector databases, and analytics infrastructure.",
    alternates: {
      canonical: guidesIndex?.seo?.canonicalPath || "/guides/",
    },
    openGraph: {
      title:
        guidesIndex?.seo?.title ||
        "Technical Guides & Architecture Frameworks | Madhu Dadi",
      description:
        guidesIndex?.seo?.description ||
        "Evergreen frameworks, technical analysis, and benchmarks covering AI agents, vector databases, and analytics infrastructure.",
      url: "/guides/",
      type: "website",
      images: [
        {
          url: `${getSiteUrl()}opengraph-image?ext=.png`,
          width: 1200,
          height: 630,
          alt: "Madhu Dadi technical guides",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title:
        guidesIndex?.seo?.title ||
        "Technical Guides & Architecture Frameworks | Madhu Dadi",
      description:
        guidesIndex?.seo?.description ||
        "Evergreen frameworks, technical analysis, and benchmarks covering AI agents, vector databases, and analytics infrastructure.",
      images: [`${getSiteUrl()}opengraph-image?ext=.png`],
      creator: "@madhu245",
      site: "@madhu245",
    },
  };
}

export default async function GuidesPage() {
  const { profile, sortedNavigationItems, publishedGuides, pageContent } =
    await getPortfolioData();
  const siteUrl = getSiteUrl();
  const collectionUrl = `${siteUrl}guides/`;

  const guidesIndex = pageContent.guidesIndex;

  const itemListElement = publishedGuides.map((guide, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: guide.title,
    url: `${collectionUrl}${guide.slug}/`,
  }));

  const collectionSchema = {
    "@type": "CollectionPage",
    "@id": `${collectionUrl}#collection`,
    url: collectionUrl,
    name: guidesIndex?.seo?.title || "Technical Guides by Madhu Dadi",
    description: guidesIndex?.seo?.description || "",
    inLanguage: "en-US",
    isPartOf: { "@id": `${siteUrl}#website` },
    mainEntity: {
      "@type": "ItemList",
      "@id": `${collectionUrl}#items`,
      numberOfItems: itemListElement.length,
      itemListElement,
    },
  };

  const breadcrumbSchema = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Guides",
        item: collectionUrl,
      },
    ],
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [collectionSchema, breadcrumbSchema],
  };

  // Group by guideType
  const groupedGuides = publishedGuides.reduce(
    (acc, guide) => {
      const type = guide.guideType;
      if (!acc[type]) acc[type] = [];
      acc[type].push(guide);
      return acc;
    },
    {} as Record<string, typeof publishedGuides>,
  );

  const getGuideTypeLabel = (type: string) => {
    switch (type) {
      case "framework":
        return "Frameworks";
      case "guide":
        return "Technical Guides";
      case "benchmark-methodology":
        return "Benchmark Methodologies";
      case "benchmark-results":
        return "Benchmark Results";
      default:
        return type;
    }
  };

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
          <div className="mx-auto w-full max-w-5xl px-6 md:px-12">
            <header className="mb-16 md:mb-24">
              <h1 className="font-display text-4xl font-bold tracking-tight text-gradient md:text-6xl">
                {guidesIndex?.heroTitle || "Technical Guides"}
              </h1>
              {guidesIndex?.introParagraphs &&
                guidesIndex.introParagraphs.length > 0 && (
                  <div className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                    {guidesIndex.introParagraphs.map((p, i) => (
                      <p key={i} className={i > 0 ? "mt-4" : ""}>
                        {p}
                      </p>
                    ))}
                  </div>
                )}
            </header>

            <div className="space-y-24">
              {Object.keys(groupedGuides)
                .sort()
                .map((type) => (
                  <section key={type}>
                    <h2 className="mb-8 font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                      {getGuideTypeLabel(type)}
                    </h2>
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
                      {groupedGuides[type].map((guide) => (
                        <Link
                          key={guide.slug}
                          href={`/guides/${guide.slug}/`}
                          className="group relative flex flex-col rounded-2xl border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                          <div className="flex flex-col h-full">
                            <p className="mb-3 text-xs tracking-[0.25em] text-muted-foreground uppercase font-semibold">
                              {guide.primaryTopic}
                            </p>
                            <h3 className="mb-3 font-display text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                              {guide.title}
                            </h3>
                            <p className="mb-6 text-sm leading-relaxed text-muted-foreground flex-grow">
                              {guide.summary}
                            </p>
                            <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
                              <time
                                dateTime={guide.publishedAt || guide.updatedAt}
                              >
                                {new Date(
                                  guide.publishedAt || guide.updatedAt,
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </time>
                              <span className="flex items-center gap-1 font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                                Read more <ArrowRight className="h-3 w-3" />
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                ))}

              {publishedGuides.length === 0 && (
                <p className="text-muted-foreground text-center py-12">
                  New guides and frameworks are being written. Check back soon.
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
