import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { AuthorBio } from "@/components/AuthorBio";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLdScript } from "@/components/JsonLdScript";
import { LastUpdated } from "@/components/LastUpdated";
import { PageToc, type PageTocItem } from "@/components/PageToc";
import { RelatedReading } from "@/components/RelatedReading";
import { TrackedLink } from "@/components/TrackedLink";
import { slimFooterProfile, slimFooterProjects } from "@/lib/home-page-data";
import type { PortfolioData } from "@/lib/portfolio-data";
import type { CommercialLander } from "@/lib/seo/commercial-landers";
import { getRelatedLearning } from "@/lib/seo/service-related-learning";
import { resolveSiteUrl } from "@/lib/site-url";

type CommercialServiceLanderProps = {
  lander: CommercialLander;
  data: PortfolioData;
};

export function CommercialServiceLander({
  lander,
  data,
}: CommercialServiceLanderProps) {
  const { profile, sortedNavigationItems, sortedProjects, sortedServices } =
    data;
  const siteUrl = `${resolveSiteUrl()}/`;
  const pageUrl = `${siteUrl}${lander.slug}/`;
  const baseService = sortedServices.find(
    (s) => s.slug === lander.baseServiceSlug,
  );
  const proofProject = lander.proofProjectSlug
    ? sortedProjects.find((p) => p.slug === lander.proofProjectSlug)
    : undefined;
  const prefillContactUrl = `/contact/#intent=${lander.contactIntent}`;
  const relatedReading = getRelatedLearning(lander.baseServiceSlug);
  const tocItems: PageTocItem[] = [
    { id: "lander-summary", label: "Summary" },
    { id: "value-props", label: "Why this" },
    ...(baseService ? [{ id: "full-capability", label: "Capability" }] : []),
    ...(proofProject ? [{ id: "proof", label: "Proof" }] : []),
    { id: "lander-engagement", label: "Engagement" },
    ...(lander.faqs.length > 0 ? [{ id: "lander-faqs", label: "FAQ" }] : []),
    ...(relatedReading.length > 0
      ? [{ id: "related-reading", label: "Related reading" }]
      : []),
    { id: "lander-contact", label: "Contact" },
  ];
  const baseUrl = baseService
    ? `${siteUrl}services/${baseService.slug}/`
    : `${siteUrl}services/`;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        name: lander.title,
        serviceType: lander.title,
        description: lander.seoDescription,
        provider: { "@id": `${siteUrl}#person` },
        areaServed: ["India", "Visakhapatnam", "Remote", "Worldwide"],
        url: pageUrl,
        offers: {
          "@type": "Offer",
          url: `${siteUrl}contact/`,
          availability: "https://schema.org/InStock",
          description:
            "Custom pricing based on scope, timeline, and delivery model. Free discovery; no public rate card.",
        },
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        name: lander.seoTitle,
        description: lander.seoDescription,
        url: pageUrl,
        inLanguage: "en-IN",
        isPartOf: { "@id": `${siteUrl}#website` },
        about: { "@id": `${siteUrl}#person` },
        mainEntity: { "@id": `${pageUrl}#service` },
        dateModified: baseService?.updatedAt || data.portfolioLastUpdatedAt,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          {
            "@type": "ListItem",
            position: 2,
            name: "Services",
            item: `${siteUrl}services/`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: lander.title,
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
        <div className="container mx-auto max-w-4xl space-y-12">
          <Breadcrumb
            items={[
              { label: "Services", href: "/services/" },
              { label: lander.title },
            ]}
          />

          <section className="relative rounded-2xl border border-border bg-surface/30 p-8 md:p-10">
            <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              {lander.heroEyebrow}
            </p>
            <h1 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
              {lander.title}
            </h1>
            <p className="mt-4 text-lg text-foreground/80 leading-relaxed">
              {lander.shortDescription}
            </p>
            <LastUpdated
              date={baseService?.updatedAt || data.portfolioLastUpdatedAt}
              className="mt-3 text-xs text-muted-foreground"
            />
            <ul className="mt-6 flex flex-wrap gap-2">
              {lander.focusTags.map((tag) => (
                <li
                  key={tag}
                  className="inline-flex items-center rounded-full border border-border bg-background/40 px-3 py-1 text-xs text-muted-foreground"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </section>

          <PageToc items={tocItems} />

          <section
            id="lander-summary"
            aria-label="Service summary"
            className="scroll-mt-28 p-6 rounded-2xl bg-primary/5 border border-primary/20 space-y-3"
          >
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
              In one paragraph
            </h2>
            {lander.directAnswer.map((para) => (
              <p
                key={para.slice(0, 48)}
                className="text-sm text-foreground/90 leading-relaxed"
              >
                {para}
              </p>
            ))}
            {lander.timeline ? (
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  Typical timeline:{" "}
                </span>
                {lander.timeline}
              </p>
            ) : null}
          </section>

          <section id="value-props" className="scroll-mt-28 space-y-4">
            <h2 className="text-xl font-bold tracking-tight border-b border-border/80 pb-2">
              Why work this way
            </h2>
            <ul className="space-y-3">
              {lander.valueProps.map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-border/50 bg-surface/20 p-4 text-sm text-muted-foreground leading-relaxed"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {baseService ? (
            <section id="full-capability" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl font-bold tracking-tight border-b border-border/80 pb-2">
                Full capability detail
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Stack, deliverables, and technical depth for{" "}
                <strong className="text-foreground">{baseService.title}</strong>{" "}
                live on the dedicated service page. This lander targets the
                commercial keyword; the service page is the deep capability
                document.
              </p>
              <Link
                href={`/services/${baseService.slug}/`}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Open full service page
                <IconArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              {baseService.features && baseService.features.length > 0 ? (
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {baseService.features.map((feature) => (
                    <li
                      key={feature}
                      className="rounded-lg border border-border/40 bg-surface/10 px-3 py-2 text-sm text-foreground/90"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ) : null}

          {proofProject ? (
            <section id="proof" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl font-bold tracking-tight border-b border-border/80 pb-2">
                Related proof
              </h2>
              <Link
                href={`/case-studies/${proofProject.slug}/`}
                className="block rounded-xl border border-border/50 bg-surface/20 p-5 transition-colors hover:border-primary/40"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Case study
                </p>
                <p className="mt-2 font-semibold text-foreground">
                  {proofProject.title}
                </p>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                  {proofProject.impactSummary || proofProject.tagline}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Read case study
                  <IconArrowRight className="h-4 w-4" aria-hidden />
                </span>
              </Link>
            </section>
          ) : null}

          <section id="lander-engagement" className="scroll-mt-28 space-y-4">
            <h2 className="text-xl font-bold tracking-tight border-b border-border/80 pb-2">
              How does engagement work?
            </h2>
            <ul className="grid gap-3 sm:grid-cols-3 text-sm text-muted-foreground">
              <li className="rounded-xl border border-border/50 bg-surface/20 p-4">
                <p className="font-semibold text-foreground">Discovery</p>
                <p className="mt-1">
                  Free fit check: problem, stack, constraints, and whether
                  consulting is appropriate alongside full-time duties.
                </p>
              </li>
              <li className="rounded-xl border border-border/50 bg-surface/20 p-4">
                <p className="font-semibold text-foreground">Scoped build</p>
                <p className="mt-1">
                  Custom quote after discovery
                  {lander.timeline ? ` · typical ${lander.timeline}` : ""}. No
                  public price list.
                </p>
              </li>
              <li className="rounded-xl border border-border/50 bg-surface/20 p-4">
                <p className="font-semibold text-foreground">Handover</p>
                <p className="mt-1">
                  Docs, QA notes, and ownership so your team can run the system
                  after ship.
                </p>
              </li>
            </ul>
          </section>

          {lander.faqs.length > 0 ? (
            <section id="lander-faqs" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl font-bold tracking-tight border-b border-border/80 pb-2">
                Common questions
              </h2>
              <dl className="grid gap-4 md:grid-cols-2">
                {lander.faqs.map((faq) => (
                  <div
                    key={faq.question}
                    className="rounded-xl border border-border/50 bg-surface/20 p-5"
                  >
                    <dt className="font-semibold text-foreground text-sm">
                      {faq.question}
                    </dt>
                    <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          <AuthorBio
            profile={{
              firstName: profile.firstName,
              lastName: profile.lastName,
              headline: profile.headline,
              shortBio: profile.shortBio,
            }}
          />

          {relatedReading.length > 0 ? (
            <RelatedReading items={relatedReading} className="mt-2" />
          ) : null}

          <section
            id="lander-contact"
            className="relative scroll-mt-28 rounded-3xl border border-border/80 bg-surface/20 p-8 md:p-12 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Discuss this engagement
            </h2>
            <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Send the problem statement, current stack, timeline, and desired
              outcome. Reply within 24 hours with fit, constraints, and a
              recommended next step.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={prefillContactUrl}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:scale-[1.02] transition-all"
              >
                Request discovery call
                <IconArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <TrackedLink
                href="/contact/#intent=intro"
                gtmEvent="intro_call_click"
                gtmData={{
                  click_location: "commercial_lander",
                  lander_slug: lander.slug,
                }}
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium hover:border-primary/40 transition-colors"
              >
                Book a 20-min intro call
              </TrackedLink>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              <Link
                href="/services/"
                className="underline-offset-4 hover:text-primary hover:underline"
              >
                All services
              </Link>
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              Capability deep-dive:{" "}
              <a href={baseUrl} className="text-primary hover:underline">
                {baseService?.title || "related service"}
              </a>
            </p>
          </section>
        </div>
      </main>

      <Footer
        profile={slimFooterProfile(profile)}
        navigationItems={sortedNavigationItems}
        projects={slimFooterProjects(sortedProjects)}
      />
    </div>
  );
}
