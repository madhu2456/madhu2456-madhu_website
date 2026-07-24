import { IconArrowRight } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLdScript } from "@/components/JsonLdScript";
import { slimFooterProfile, slimFooterProjects } from "@/lib/home-page-data";
import { getPortfolioData } from "@/lib/portfolio-data";
import { PORTFOLIO_GUIDES } from "@/lib/seo/guides-catalog";
import { siteLanguageAlternates } from "@/lib/seo/hreflang";
import { resolveSiteUrl } from "@/lib/site-url";

const GUIDES_TITLE = "AI, RAG & Analytics Guides | Madhu Dadi";
const GUIDES_DESCRIPTION =
  "Guides by Madhu Dadi: GA4/BigQuery, MMM, attribution, fractional AI, RAG vs fine-tuning, Consent Mode v2 India, and AI search optimization 2026.";

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = `${resolveSiteUrl()}/`;
  const canonicalUrl = `${siteUrl}guides/`;
  const image = `${siteUrl}opengraph-image/`;
  return {
    title: { absolute: GUIDES_TITLE },
    description: GUIDES_DESCRIPTION,
    alternates: {
      canonical: canonicalUrl,
      languages: siteLanguageAlternates("/guides/"),
    },
    openGraph: {
      title: { absolute: GUIDES_TITLE },
      description: GUIDES_DESCRIPTION,
      url: canonicalUrl,
      siteName: "Madhu Dadi",
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: GUIDES_TITLE,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: GUIDES_TITLE,
      description: GUIDES_DESCRIPTION,
      images: [image],
    },
  };
}

export default async function GuidesIndexPage() {
  const { profile, sortedNavigationItems, sortedProjects } =
    await getPortfolioData();
  const siteUrl = `${resolveSiteUrl()}/`;
  const collectionUrl = `${siteUrl}guides/`;

  const sortedGuides = [...PORTFOLIO_GUIDES].sort((a, b) => {
    const ta = Date.parse(a.updatedAt || a.publishedAt);
    const tb = Date.parse(b.updatedAt || b.publishedAt);
    return (Number.isNaN(tb) ? 0 : tb) - (Number.isNaN(ta) ? 0 : ta);
  });

  const collectionSchema = {
    "@type": "CollectionPage",
    "@id": `${collectionUrl}#collection`,
    url: collectionUrl,
    name: "Guides by Madhu Dadi",
    description: GUIDES_DESCRIPTION,
    inLanguage: "en-IN",
    isPartOf: { "@id": `${siteUrl}#website` },
    mainEntity: {
      "@type": "ItemList",
      "@id": `${collectionUrl}#items`,
      numberOfItems: sortedGuides.length,
      itemListElement: sortedGuides.map((guide, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "TechArticle",
          name: guide.title,
          url: `${siteUrl}${guide.path.replace(/^\//, "")}`,
          description: guide.description,
        },
      })),
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

  return (
    <div className="flex flex-col min-h-screen">
      <JsonLdScript
        data={{
          "@context": "https://schema.org",
          "@graph": [collectionSchema, breadcrumbSchema],
        }}
      />
      <Header
        profile={{ firstName: profile.firstName, lastName: profile.lastName }}
        navigationItems={sortedNavigationItems}
      />
      <main
        id="main-content"
        className="flex-1 mx-auto max-w-6xl w-[92%] pt-32 pb-24"
      >
        <Breadcrumb items={[{ label: "Guides" }]} />

        <header className="mt-8 max-w-3xl space-y-4">
          <p className="text-xs tracking-[0.25em] text-primary uppercase">
            Free guides
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl text-gradient">
            AI, measurement &amp; analytics guides
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            Production-informed playbooks on GA4/BigQuery, attribution, MMM,
            fractional AI, RAG vs fine-tuning, Consent Mode v2 in India, and AI
            search optimization. Written for operators who ship systems—not
            vanity slides.
          </p>
          <p className="text-sm text-muted-foreground">
            <Link
              href="/guides/rss.xml"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Guides RSS
            </Link>
            {" · "}
            <Link
              href="/services/"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Services
            </Link>
            {" · "}
            <Link
              href="/contact/#intent=intro"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Book a 20-min intro
            </Link>
          </p>
        </header>

        <section className="mt-12 grid gap-5 sm:grid-cols-2">
          {sortedGuides.map((guide) => {
            const href = guide.path.startsWith("/")
              ? guide.path
              : `/${guide.path}`;
            const updated = guide.updatedAt || guide.publishedAt;
            return (
              <article
                key={guide.slug}
                className="group flex flex-col rounded-2xl border border-border bg-surface/50 p-6 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40"
              >
                <h2 className="font-display text-xl font-semibold leading-snug">
                  <Link
                    href={href}
                    className="text-foreground transition-colors hover:text-primary"
                  >
                    {guide.title}
                  </Link>
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {guide.description}
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
                  {updated ? (
                    <time
                      dateTime={updated}
                      className="text-xs text-muted-foreground"
                    >
                      Updated{" "}
                      {new Date(updated).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  ) : (
                    <span />
                  )}
                  <Link
                    href={href}
                    className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Read guide
                    <IconArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      </main>
      <Footer
        profile={slimFooterProfile(profile)}
        projects={slimFooterProjects(sortedProjects)}
        navigationItems={sortedNavigationItems}
      />
    </div>
  );
}
