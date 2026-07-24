import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { AuthorBio } from "@/components/AuthorBio";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLdScript } from "@/components/JsonLdScript";
import { LastUpdated } from "@/components/LastUpdated";
import { PageToc, type PageTocItem } from "@/components/PageToc";
import { slimFooterProfile, slimFooterProjects } from "@/lib/home-page-data";
import type { PortfolioData } from "@/lib/portfolio-data";
import { resolveSiteUrl } from "@/lib/site-url";

export type GuideSection = {
  id: string;
  h2: string;
  paragraphs?: readonly string[];
  bullets?: readonly string[];
  steps?: readonly { title: string; body: string }[];
  table?: {
    caption: string;
    headers: readonly string[];
    rows: readonly (readonly string[])[];
  };
};

export type GuideDefinition = {
  slug: string;
  path: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  publishedAt: string;
  updatedAt: string;
  directAnswer: string;
  sections: readonly GuideSection[];
  relatedLinks: readonly { href: string; label: string }[];
};

type GuideArticleProps = {
  guide: GuideDefinition;
  data: PortfolioData;
};

export function GuideArticle({ guide, data }: GuideArticleProps) {
  const { profile, sortedNavigationItems, sortedProjects } = data;
  const siteUrl = `${resolveSiteUrl()}/`;
  const pageUrl = `${siteUrl}${guide.path.replace(/^\//, "")}`;

  const tocItems: PageTocItem[] = [
    { id: "direct-answer", label: "Summary" },
    ...guide.sections.map((s) => ({ id: s.id, label: s.h2.slice(0, 40) })),
    { id: "related", label: "Related" },
    { id: "guide-cta", label: "Contact" },
  ];

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `${pageUrl}#article`,
        headline: guide.title,
        description: guide.seoDescription,
        datePublished: guide.publishedAt,
        dateModified: guide.updatedAt,
        inLanguage: "en-IN",
        author: {
          "@type": "Person",
          "@id": `${siteUrl}#person`,
          name: `${profile.firstName} ${profile.lastName}`,
          url: siteUrl,
        },
        publisher: {
          "@type": "Person",
          "@id": `${siteUrl}#person`,
          name: `${profile.firstName} ${profile.lastName}`,
        },
        mainEntityOfPage: pageUrl,
        url: pageUrl,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          {
            "@type": "ListItem",
            position: 2,
            name: "Guides",
            item: `${siteUrl}guides/`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: guide.title,
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen">
      <JsonLdScript data={graph} />
      <Header
        profile={{ firstName: profile.firstName, lastName: profile.lastName }}
        navigationItems={sortedNavigationItems}
      />

      <main id="main-content" className="flex-1 px-6 py-28 bg-background/50">
        <article className="container mx-auto max-w-3xl space-y-10">
          <Breadcrumb
            items={[
              { label: "Guides", href: "/guides/" },
              { label: guide.title },
            ]}
          />

          <header className="space-y-4">
            <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              Guide · Measurement
            </p>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              {guide.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span>
                By {profile.firstName} {profile.lastName}
              </span>
              <span aria-hidden>·</span>
              <LastUpdated
                date={guide.updatedAt}
                className="text-sm text-muted-foreground"
              />
            </div>
          </header>

          {/* Answer-first (AEO): definition before TOC / narrative sections */}
          <section
            id="direct-answer"
            className="scroll-mt-28 rounded-2xl border border-primary/20 bg-primary/5 p-6"
          >
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
              In one paragraph
            </h2>
            <p className="mt-3 text-base leading-relaxed text-foreground/90">
              {guide.directAnswer}
            </p>
          </section>

          <PageToc items={tocItems} />

          {guide.sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-28 space-y-4"
            >
              <h2 className="text-xl md:text-2xl font-bold tracking-tight border-b border-border/80 pb-2">
                {section.h2}
              </h2>
              {section.paragraphs?.map((p) => (
                <p
                  key={p.slice(0, 48)}
                  className="text-muted-foreground leading-relaxed"
                >
                  {p}
                </p>
              ))}
              {section.steps ? (
                <ol className="space-y-4">
                  {section.steps.map((step, i) => (
                    <li
                      key={step.title}
                      className="flex gap-3 rounded-xl border border-border/50 bg-surface/20 p-4"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {step.title}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {step.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : null}
              {section.bullets ? (
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  {section.bullets.map((b) => (
                    <li key={b} className="leading-relaxed">
                      {b}
                    </li>
                  ))}
                </ul>
              ) : null}
              {section.table ? (
                <section
                  // biome-ignore lint/a11y/noNoninteractiveTabindex: axe scrollable-region-focusable (mobile) needs keyboard focus on overflow region
                  tabIndex={0}
                  aria-label={section.table.caption}
                  className="overflow-x-auto rounded-xl border border-border/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <table className="min-w-full text-sm">
                    <caption className="sr-only">
                      {section.table.caption}
                    </caption>
                    <thead className="bg-surface-elevated/40 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <tr>
                        {section.table.headers.map((h) => (
                          <th key={h} className="px-4 py-3">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {section.table.rows.map((row) => (
                        <tr key={row.join("|")}>
                          {row.map((cell) => (
                            <td
                              key={cell}
                              className="px-4 py-3 text-muted-foreground align-top"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              ) : null}
            </section>
          ))}

          <section id="related" className="scroll-mt-28 space-y-4">
            <h2 className="text-xl font-bold tracking-tight border-b border-border/80 pb-2">
              Related services and landers
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {guide.relatedLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {link.label}
                    <IconArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <AuthorBio
            profile={{
              firstName: profile.firstName,
              lastName: profile.lastName,
              headline: profile.headline,
              shortBio: profile.shortBio,
            }}
          />

          <section
            id="guide-cta"
            className="scroll-mt-28 rounded-3xl border border-border/80 bg-surface/20 p-8 text-center"
          >
            <h2 className="text-2xl font-bold tracking-tight">
              Need this implemented on your stack?
            </h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
              Free discovery call: current GA4 state, warehouse access, and
              whether export + marts are the right next step. Dual full-time +
              select consulting.
            </p>
            <Link
              href="/contact/#intent=ga4-bigquery"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
            >
              Request discovery call
              <IconArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </section>
        </article>
      </main>

      <Footer
        profile={slimFooterProfile(profile)}
        navigationItems={sortedNavigationItems}
        projects={slimFooterProjects(sortedProjects)}
      />
    </div>
  );
}
