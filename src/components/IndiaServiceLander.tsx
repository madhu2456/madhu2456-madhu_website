import { IconArrowRight, IconMapPin } from "@tabler/icons-react";
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
import type { IndiaServiceAlias } from "@/lib/seo/service-aliases";
import { getRelatedLearning } from "@/lib/seo/service-related-learning";
import { resolveSiteUrl } from "@/lib/site-url";

type IndiaServiceLanderProps = {
  alias: IndiaServiceAlias;
  data: PortfolioData;
};

export function IndiaServiceLander({ alias, data }: IndiaServiceLanderProps) {
  const { profile, sortedNavigationItems, sortedProjects, sortedServices } =
    data;
  const siteUrl = `${resolveSiteUrl()}/`;
  const pageUrl = `${siteUrl}services/${alias.slug}/`;
  const baseService = sortedServices.find(
    (s) => s.slug === alias.baseServiceSlug,
  );
  const prefillContactUrl = `/contact/#intent=${alias.contactIntent}`;
  const relatedReading = getRelatedLearning(alias.baseServiceSlug);
  const cityFromSlug = alias.slug.match(/^ai-consultant-(.+)$/)?.[1];
  const cityLabel =
    cityFromSlug === "visakhapatnam"
      ? "Visakhapatnam"
      : cityFromSlug === "hyderabad"
        ? "Hyderabad"
        : cityFromSlug === "bengaluru"
          ? "Bengaluru"
          : cityFromSlug === "chennai"
            ? "Chennai"
            : cityFromSlug === "mumbai"
              ? "Mumbai"
              : null;
  const areaServed = cityLabel
    ? ["India", cityLabel, "Visakhapatnam", "Remote", "Worldwide"]
    : ["India", "Visakhapatnam", "Hyderabad", "Remote", "Worldwide"];
  const cityNames = Array.from(
    new Set(
      [cityLabel, "Visakhapatnam", cityLabel ? null : "Hyderabad"].filter(
        (name): name is string => Boolean(name),
      ),
    ),
  );
  const areaServedStructured = [
    ...cityNames.map((name) => ({
      "@type": "City" as const,
      name,
      containedInPlace: { "@type": "Country" as const, name: "India" },
    })),
    { "@type": "Country" as const, name: "India" },
    { "@type": "Place" as const, name: "Worldwide (remote)" },
  ];
  const tocItems: PageTocItem[] = [
    { id: "lander-summary", label: "Summary" },
    { id: "why-india", label: "Why India" },
    ...(alias.cityProof ? [{ id: "city-proof", label: "Local focus" }] : []),
    ...(baseService ? [{ id: "full-capability", label: "Capability" }] : []),
    { id: "lander-engagement", label: "Engagement" },
    ...(alias.faqs.length > 0 ? [{ id: "lander-faqs", label: "FAQ" }] : []),
    ...(relatedReading.length > 0
      ? [{ id: "related-reading", label: "Related reading" }]
      : []),
    { id: "service-area", label: "Service area" },
    { id: "lander-contact", label: "Contact" },
  ];
  const baseUrl = baseService
    ? `${siteUrl}services/${baseService.slug}/`
    : `${siteUrl}services/`;
  const fullName =
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
    "Madhu Dadi";
  const phone = profile.phone?.trim() || undefined;
  const email = profile.email?.trim() || undefined;
  const telHref = phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : undefined;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": `${pageUrl}#professional-service`,
        name: alias.title,
        url: pageUrl,
        description: alias.seoDescription,
        image: `${siteUrl}opengraph-image/`,
        provider: { "@id": `${siteUrl}#person` },
        ...(phone ? { telephone: phone } : {}),
        ...(email ? { email } : {}),
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Visakhapatnam",
          addressRegion: "Andhra Pradesh",
          addressCountry: "IN",
        },
        areaServed: areaServedStructured,
        serviceType: alias.title,
        offers: {
          "@type": "Offer",
          url: `${siteUrl}contact/`,
          availability: "https://schema.org/InStock",
          description:
            "Custom pricing based on scope, timeline, and delivery model. Select consulting only.",
        },
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        name: alias.title,
        serviceType: alias.title,
        description: alias.seoDescription,
        provider: { "@id": `${siteUrl}#person` },
        areaServed,
        url: pageUrl,
        offers: {
          "@type": "Offer",
          url: `${siteUrl}contact/`,
          availability: "https://schema.org/InStock",
          description:
            "Custom pricing based on scope, timeline, and delivery model.",
        },
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        name: alias.seoTitle,
        description: alias.seoDescription,
        url: pageUrl,
        inLanguage: "en-IN",
        isPartOf: { "@id": `${siteUrl}#website` },
        about: { "@id": `${siteUrl}#person` },
        mainEntity: { "@id": `${pageUrl}#professional-service` },
        dateModified: new Date().toISOString(),
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
            name: alias.title,
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
              { label: alias.title },
            ]}
          />

          <section className="relative rounded-2xl border border-border bg-surface/30 p-8 md:p-10">
            <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              {alias.heroEyebrow}
            </p>
            <h1 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
              {alias.title}
            </h1>
            <p className="mt-4 text-lg text-foreground/80 leading-relaxed">
              {alias.shortDescription}
            </p>
            <LastUpdated
              date={baseService?.updatedAt || data.portfolioLastUpdatedAt}
              className="mt-3 text-xs text-muted-foreground"
            />
            <ul className="mt-6 flex flex-wrap gap-2">
              {alias.locationFocus.map((loc) => (
                <li
                  key={loc}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-3 py-1 text-xs text-muted-foreground"
                >
                  <IconMapPin
                    className="h-3.5 w-3.5 text-primary"
                    aria-hidden
                  />
                  {loc}
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
              In brief
            </h2>
            {alias.directAnswer.map((para) => (
              <p
                key={para}
                className="text-sm text-foreground/90 leading-relaxed"
              >
                {para}
              </p>
            ))}
            {alias.timeline ? (
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  Typical timeline:{" "}
                </span>
                {alias.timeline}
              </p>
            ) : null}
          </section>

          <section id="why-india" className="scroll-mt-28 space-y-4">
            <h2 className="text-xl font-bold tracking-tight border-b border-border/80 pb-2">
              Why hire from India for this work?
            </h2>
            <ul className="space-y-3">
              {alias.whyIndia.map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-border/50 bg-surface/20 p-4 text-sm text-muted-foreground leading-relaxed"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {alias.cityProof ? (
            <section id="city-proof" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl font-bold tracking-tight border-b border-border/80 pb-2">
                {alias.cityProof.h2}
              </h2>
              <ul className="space-y-3">
                {alias.cityProof.bullets.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl border border-border/50 bg-surface/20 p-4 text-sm text-muted-foreground leading-relaxed"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              {alias.cityProof.relatedCaseStudyHref &&
              alias.cityProof.relatedCaseStudyLabel ? (
                <p className="text-sm text-muted-foreground">
                  Related proof:{" "}
                  <Link
                    href={alias.cityProof.relatedCaseStudyHref}
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {alias.cityProof.relatedCaseStudyLabel}
                  </Link>
                </p>
              ) : null}
            </section>
          ) : null}

          {baseService ? (
            <section id="full-capability" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl font-bold tracking-tight border-b border-border/80 pb-2">
                Full capability detail
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Stack, deliverables, and engagement depth for{" "}
                <strong className="text-foreground">{baseService.title}</strong>{" "}
                live on the dedicated service page. This lander focuses on
                India/location intent and how delivery works from Visakhapatnam
                and remote.
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
                  {alias.timeline ? ` · typical ${alias.timeline}` : ""}. No
                  public price list.
                </p>
              </li>
              <li className="rounded-xl border border-border/50 bg-surface/20 p-4">
                <p className="font-semibold text-foreground">Handover</p>
                <p className="mt-1">
                  Docs, deploy notes, and ownership so your team can run the
                  system after ship.
                </p>
              </li>
            </ul>
          </section>

          <section id="lander-faqs" className="scroll-mt-28 space-y-4">
            <h2 className="text-xl font-bold tracking-tight border-b border-border/80 pb-2">
              Common questions about {alias.title}
            </h2>
            <dl className="grid gap-4 md:grid-cols-2">
              {alias.faqs.map((faq) => (
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
            id="service-area"
            className="scroll-mt-28 space-y-3 rounded-2xl border border-border/60 bg-surface/20 p-6"
          >
            <h2 className="text-xl font-bold tracking-tight border-b border-border/80 pb-2">
              Service area &amp; contact
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Remote-first professional service. Home base is Visakhapatnam,
              Andhra Pradesh — not a storefront. On-site in{" "}
              {cityLabel || "major Indian cities"} only when scoped.
            </p>
            <address className="not-italic text-sm leading-relaxed text-foreground/90">
              <p className="font-semibold text-foreground">{fullName}</p>
              <p>Visakhapatnam, Andhra Pradesh, India</p>
              {cityLabel ? (
                <p className="text-muted-foreground">
                  Serving {cityLabel} · India · remote worldwide
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Serving India · remote worldwide
                </p>
              )}
              {phone && telHref ? (
                <p className="mt-2">
                  <a
                    href={telHref}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {phone}
                  </a>
                </p>
              ) : null}
              {email ? (
                <p>
                  <a
                    href={`mailto:${email}`}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {email}
                  </a>
                </p>
              ) : null}
              {profile.socialLinks?.googleBusiness ? (
                <p className="mt-2">
                  <a
                    href={profile.socialLinks.googleBusiness}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    View on Google
                  </a>
                </p>
              ) : null}
            </address>
          </section>

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
                  click_location: "india_lander",
                  lander_slug: alias.slug,
                }}
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium hover:border-primary/40 transition-colors"
              >
                Book a 20-min intro call
              </TrackedLink>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              <Link
                href="/ai-consultant-india/"
                className="underline-offset-4 hover:text-primary hover:underline"
              >
                India location hub
              </Link>
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              Canonical deep-dive:{" "}
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
