import {
  IconArrowRight,
  IconBookmark,
  IconCircleCheck,
  IconClock,
  IconSparkles,
} from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthorBio } from "@/components/AuthorBio";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLdScript } from "@/components/JsonLdScript";
import { LastUpdated } from "@/components/LastUpdated";
import { PageToc, type PageTocItem } from "@/components/PageToc";
import { RelatedReading } from "@/components/RelatedReading";
import { ServiceIcon } from "@/components/ServiceIcon";
import { TrackedLink } from "@/components/TrackedLink";
import { getPortfolioData } from "@/lib/portfolio-data";
import { getCaseStudyLinkLabel } from "@/lib/project-display";
import { siteLanguageAlternates } from "@/lib/seo/hreflang";
import {
  getRelatedLearning,
  relatedLearningKindLabel,
} from "@/lib/seo/service-related-learning";
import { resolveSiteUrl } from "@/lib/site-url";

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static routes for the dynamic services (excluding bespoke pages)
export async function generateStaticParams() {
  const { sortedServices } = await getPortfolioData();
  return sortedServices.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const { sortedServices } = await getPortfolioData();
  const service = sortedServices.find((s) => s.slug === slug);

  if (!service) {
    return {};
  }

  const siteUrl = `${resolveSiteUrl()}/`;
  const canonicalUrl = `${siteUrl}services/${slug}/`;

  // India-qualified titles where the plan targets IN commercial intent.
  const indiaTitles: Record<string, string> = {
    "rag-consultant-india": "RAG Consultant in India",
    "ai-llm-application-development": "LLM Developer & Consultant in India",
    "marketing-analytics-consultant": "Marketing Analytics Consultant in India",
    "ai-agent-development": "AI Agent Development Consultant in India",
    "ga4-bigquery-campaign-analytics":
      "GA4 & BigQuery Analytics Consultant India",
    "full-stack-ai-product-development":
      "Full-Stack AI Product Development India",
  };
  const rawTitle =
    service.seoTitle ||
    indiaTitles[slug] ||
    (service.title.length > 45
      ? service.title
      : `${service.title} | Madhu Dadi`);
  const title = rawTitle.includes("Madhu Dadi")
    ? rawTitle
    : `${rawTitle} | Madhu Dadi`;
  const rawDescription =
    service.seoDescription ||
    service.shortDescription ||
    service.fullDescription ||
    "";
  const description =
    rawDescription.length > 160
      ? `${rawDescription
          .slice(0, 157)
          .trim()
          .replace(/[,\s;:!?-]+$/u, "")}...`
      : rawDescription;
  const image = `${siteUrl}opengraph-image/`;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: siteLanguageAlternates(`/services/${slug}/`),
    },
    openGraph: {
      title: { absolute: title },
      description,
      url: canonicalUrl,
      siteName: "Madhu Dadi",
      type: "article",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;

  const { profile, sortedServices, sortedProjects, sortedNavigationItems } =
    await getPortfolioData();
  const service = sortedServices.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const Icon = (
    <ServiceIcon slug={service.slug} className="h-8 w-8 text-primary" />
  );
  const stack = service.technologies?.map((t) => t.name) ?? [];

  // Map service slug to contact intent hash
  const SERVICE_INTENT_BY_SLUG: Record<string, string> = {
    "ai-llm-application-development": "ai-llm",
    "rag-consultant-india": "rag",
    "ai-agent-development": "ai-agent",
    "marketing-analytics-consultant": "marketing-analytics",
    "ga4-bigquery-campaign-analytics": "ga4-bigquery",
    "full-stack-ai-product-development": "full-stack-ai",
  };
  const intent = SERVICE_INTENT_BY_SLUG[service.slug];
  const prefillContactUrl = intent ? `/contact/#intent=${intent}` : "/contact/";
  const relatedCaseStudies = (() => {
    const proofSlugs = service.proofProjectSlugs ?? [];
    if (proofSlugs.length > 0) {
      return sortedProjects.filter((project) =>
        proofSlugs.includes(project.slug),
      );
    }
    return sortedProjects.filter(
      (project) => project.relatedServiceSlug === service.slug,
    );
  })();
  const relatedLearning = getRelatedLearning(service.slug);
  const displayTitle = service.heroTitle || service.title;
  const overviewParagraphs = (service.fullDescription || "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  const directAnswers =
    service.directAnswerParagraphs && service.directAnswerParagraphs.length > 0
      ? service.directAnswerParagraphs
      : null;

  const tocItems: PageTocItem[] = [
    { id: "service-summary", label: "Summary" },
    ...(directAnswers ? [{ id: "direct-answer", label: "Definition" }] : []),
    ...(service.audience && service.audience.length > 0
      ? [{ id: "who-for", label: "Who it's for" }]
      : []),
    ...(service.problemsSolved && service.problemsSolved.length > 0
      ? [{ id: "problems", label: "Problems" }]
      : []),
    ...(overviewParagraphs.length > 0
      ? [{ id: "service-overview", label: "Overview" }]
      : []),
    ...(service.capabilityCards && service.capabilityCards.length > 0
      ? [{ id: "capability-detail", label: "Capabilities" }]
      : service.features && service.features.length > 0
        ? [{ id: "key-capabilities", label: "Capabilities" }]
        : []),
    ...(service.deliverables && service.deliverables.length > 0
      ? [{ id: "deliverables", label: "Deliverables" }]
      : []),
    { id: "engagement", label: "Engagement" },
    ...(relatedCaseStudies.length > 0
      ? [{ id: "related-case-studies", label: "Case studies" }]
      : []),
    ...(relatedLearning.length > 0
      ? [{ id: "related-reading", label: "Related reading" }]
      : []),
    ...(service.faqs && service.faqs.length > 0
      ? [{ id: "service-faqs", label: "FAQ" }]
      : []),
    { id: "discuss-service", label: "Contact" },
  ];

  const siteUrl = `${resolveSiteUrl()}/`;
  const serviceSchema = {
    "@type": "Service",
    "@id": `${siteUrl}services/${slug}/#service`,
    name: service.title,
    serviceType: service.title,
    image: `${siteUrl}opengraph-image/`,
    description: service.shortDescription || service.fullDescription || "",
    provider: {
      "@id": `${siteUrl}#person`,
    },
    brand: {
      "@type": "Brand",
      name: `${profile.firstName} ${profile.lastName}`,
    },
    areaServed: ["India", "Worldwide", "Remote"],
    url: `${siteUrl}services/${slug}/`,
    offers: {
      "@type": "Offer",
      url: `${siteUrl}contact/`,
      availability: "https://schema.org/InStock",
      description:
        "Custom pricing based on scope, timeline, and delivery model.",
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
        name: "Services",
        item: `${siteUrl}services/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: service.title,
        item: `${siteUrl}services/${slug}/`,
      },
    ],
  };

  // FAQPage / HowTo / speakable omitted (2026 Google docs): not used as growth levers.
  // Visible FAQ HTML remains for humans and AEO extractors.
  const webpageSchema = {
    "@type": "WebPage",
    "@id": `${siteUrl}services/${slug}/#webpage`,
    name: service.seoTitle || service.title,
    description: service.shortDescription || service.fullDescription,
    datePublished: service.updatedAt ?? new Date().toISOString(),
    dateModified: service.updatedAt ?? new Date().toISOString(),
    image: `${siteUrl}opengraph-image/`,
    inLanguage: "en-IN",
    author: {
      "@type": "Person",
      "@id": `${siteUrl}#person`,
      name: `${profile.firstName} ${profile.lastName}`,
    },
    publisher: {
      "@type": "Organization",
      name: `${profile.firstName} ${profile.lastName}`,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}icon.png`,
      },
    },
    url: `${siteUrl}services/${slug}/`,
    isPartOf: {
      "@type": "CollectionPage",
      "@id": `${siteUrl}services/`,
    },
    mainEntity: {
      "@id": `${siteUrl}services/${slug}/#service`,
    },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <JsonLdScript
        data={{
          "@context": "https://schema.org",
          "@graph": [serviceSchema, webpageSchema, breadcrumbSchema],
        }}
      />
      <Header profile={profile} navigationItems={sortedNavigationItems} />

      <main id="main-content" className="flex-1 px-6 py-28 bg-background/50">
        <div className="container mx-auto max-w-4xl space-y-12">
          <Breadcrumb
            items={[
              { label: "Services", href: "/services/" },
              { label: displayTitle },
            ]}
          />

          {/* Hero Header Card */}
          <section className="relative rounded-2xl border border-border bg-surface/30 p-8 md:p-10 backdrop-blur-md overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 bg-primary/5 rounded-full blur-3xl -z-10" />

            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary border border-primary/10 shadow-inner">
                    {Icon}
                  </div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                    Service Capability
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                  {displayTitle}
                </h1>
                <p className="text-lg md:text-xl text-foreground/80 leading-relaxed font-medium">
                  {service.shortDescription}
                </p>
                <LastUpdated
                  date={service.updatedAt}
                  className="pt-2 text-xs text-muted-foreground"
                />
              </div>
            </div>
          </section>

          <PageToc items={tocItems} />

          {/* Direct answer — 40–60 word AEO block (content plan template) */}
          {directAnswers ? (
            <section
              id="direct-answer"
              className="scroll-mt-28 space-y-3 rounded-2xl border border-border/60 bg-surface/20 p-6"
            >
              <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
                In one paragraph
              </h2>
              {directAnswers.map((para) => (
                <p
                  key={para.slice(0, 48)}
                  className="text-base leading-relaxed text-foreground/90"
                >
                  {para}
                </p>
              ))}
            </section>
          ) : null}

          {/* AI Answer Block / TL;DR Summary */}
          <section
            id="service-summary"
            aria-label="Service summary"
            className="scroll-mt-28 p-6 rounded-2xl bg-primary/5 border border-primary/20 space-y-4"
          >
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
              <IconSparkles className="h-4 w-4" /> In brief: service summary
            </h2>
            <dl className="space-y-4">
              <div>
                <dt className="font-bold text-foreground text-sm">
                  What is the service?
                </dt>
                <dd className="text-sm text-foreground/90 mt-1">
                  {displayTitle}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-foreground text-sm">
                  What does this service involve?
                </dt>
                <dd className="text-sm text-foreground/90 mt-1">
                  {service.shortDescription}
                </dd>
              </div>
              {service.pricing?.startingPrice && (
                <div>
                  <dt className="font-bold text-foreground text-sm">
                    What is the starting price?
                  </dt>
                  <dd className="text-sm text-foreground/90 mt-1">
                    Custom (starting at ${service.pricing.startingPrice})
                  </dd>
                </div>
              )}
              {service.timeline && (
                <div>
                  <dt className="font-bold text-foreground text-sm">
                    What is the typical timeline?
                  </dt>
                  <dd className="text-sm text-foreground/90 mt-1">
                    {service.timeline}
                  </dd>
                </div>
              )}
            </dl>
          </section>

          {/* Detailed Content Split Grid */}
          <div className="grid gap-10 md:grid-cols-3">
            {/* Main detail content column */}
            <div className="md:col-span-2 space-y-8">
              {service.audience && service.audience.length > 0 ? (
                <section id="who-for" className="scroll-mt-28 space-y-4">
                  <h2 className="text-xl font-bold tracking-tight border-b border-border/80 pb-2">
                    Who is this for?
                  </h2>
                  <ul className="space-y-2.5">
                    {service.audience.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2.5 items-start text-sm text-muted-foreground"
                      >
                        <IconCircleCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-foreground/90">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {service.problemsSolved && service.problemsSolved.length > 0 ? (
                <section id="problems" className="scroll-mt-28 space-y-4">
                  <h2 className="text-xl font-bold tracking-tight border-b border-border/80 pb-2">
                    Problems this engagement solves
                  </h2>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {service.problemsSolved.map((item) => (
                      <li
                        key={item}
                        className="rounded-xl border border-border/50 bg-surface/20 p-4 text-sm leading-relaxed text-muted-foreground"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {/* Detailed narrative description */}
              {overviewParagraphs.length > 0 && (
                <section
                  id="service-overview"
                  className="scroll-mt-28 space-y-4"
                >
                  <h2 className="text-xl font-bold tracking-tight border-b border-border/80 pb-2">
                    Service Overview
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    {overviewParagraphs.map((para) => (
                      <p key={para.slice(0, 64)}>{para}</p>
                    ))}
                  </div>
                </section>
              )}

              {service.capabilityCards && service.capabilityCards.length > 0 ? (
                <section
                  id="capability-detail"
                  className="scroll-mt-28 space-y-4"
                >
                  <h2 className="text-xl font-bold tracking-tight border-b border-border/80 pb-2">
                    Key Focus Capabilities
                  </h2>
                  <ul className="grid gap-4 sm:grid-cols-2">
                    {service.capabilityCards.map((card) => (
                      <li
                        key={card.title}
                        className="rounded-xl border border-border/50 bg-surface/20 p-5 space-y-2"
                      >
                        <p className="font-semibold text-foreground">
                          {card.title}
                        </p>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {card.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : service.features && service.features.length > 0 ? (
                <section
                  id="key-capabilities"
                  className="scroll-mt-28 space-y-4"
                >
                  <h2 className="text-xl font-bold tracking-tight border-b border-border/80 pb-2">
                    Key Focus Capabilities
                  </h2>
                  <ul className="grid gap-3.5 sm:grid-cols-2">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex gap-2.5 items-start p-4 rounded-xl border border-border/50 bg-surface/20"
                      >
                        <IconCircleCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground/90">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {/* Deliverables List */}
              {service.deliverables && service.deliverables.length > 0 && (
                <section id="deliverables" className="scroll-mt-28 space-y-4">
                  <h2 className="text-xl font-bold tracking-tight border-b border-border/80 pb-2">
                    Expected Deliverables & Handover
                  </h2>
                  <ul className="space-y-2.5">
                    {service.deliverables.map((deliv) => (
                      <li
                        key={deliv}
                        className="flex gap-2 items-start text-sm text-muted-foreground"
                      >
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>{deliv}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Engagement process — answer-engine friendly steps */}
              <section id="engagement" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold tracking-tight border-b border-border/80 pb-2">
                  How does a typical engagement work?
                </h2>
                <ol className="space-y-3">
                  {[
                    {
                      step: "1",
                      title: "Discovery",
                      body: "Problem statement, constraints, stack, risk, and success metrics. You get a fit assessment—not a generic pitch deck.",
                    },
                    {
                      step: "2",
                      title: "Architecture & plan",
                      body: "Written approach, interfaces, eval hooks, and delivery milestones before heavy build spend.",
                    },
                    {
                      step: "3",
                      title: "Build & review",
                      body: "Thin vertical slice first, then iterate with logs, tests, and review checkpoints you can hand to your team.",
                    },
                    {
                      step: "4",
                      title: "Ship & handover",
                      body: service.timeline
                        ? `Deploy notes, docs, and ownership transfer. Typical window: ${service.timeline} depending on scope.`
                        : "Deploy notes, docs, and ownership transfer so the system survives after the engagement ends.",
                    },
                  ].map((item) => (
                    <li
                      key={item.step}
                      className="flex gap-3 rounded-xl border border-border/50 bg-surface/20 p-4"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                        {item.step}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {item.title}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {item.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            </div>

            {/* Sidebar metadata column */}
            <div className="space-y-6">
              {/* Pricing & Timeline card */}
              <div className="rounded-2xl border border-border bg-surface/40 p-6 space-y-6 backdrop-blur-md">
                <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                  <IconBookmark className="h-5 w-5 text-primary" /> Project
                  Engagement
                </h3>

                {service.timeline && (
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <IconClock className="h-4 w-4" /> Est. Engagement Time
                    </span>
                    <p className="text-lg font-bold text-foreground">
                      {service.timeline}
                    </p>
                  </div>
                )}

                <div className="space-y-2 border-t border-border/60 pt-4">
                  <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                    Engagement model
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>
                      <span className="font-medium text-foreground">
                        Discovery call
                      </span>{" "}
                      — free fit check (problem, stack, constraints).
                    </li>
                    <li>
                      <span className="font-medium text-foreground">
                        Scoped build
                      </span>{" "}
                      — fixed outcome and timeline after discovery; custom quote
                      (no public price list).
                    </li>
                    <li>
                      <span className="font-medium text-foreground">
                        Part-time / advisory
                      </span>{" "}
                      — available when ongoing guidance fits better than a
                      project sprint.
                    </li>
                  </ul>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <Link
                    href={prefillContactUrl}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                  >
                    Request discovery call
                    <IconArrowRight className="h-4 w-4" />
                  </Link>
                  <TrackedLink
                    href="/contact/#intent=intro"
                    gtmEvent="intro_call_click"
                    gtmData={{
                      click_location: "service_sidebar",
                      service_slug: service.slug,
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-medium hover:border-primary/40 transition-colors"
                  >
                    Book a 20-min intro call
                  </TrackedLink>
                </div>
              </div>

              {/* Related learning */}
              {relatedLearning.length > 0 && (
                <div className="rounded-2xl border border-border bg-surface/30 p-6 space-y-4">
                  <h3 className="font-semibold text-sm tracking-widest text-muted-foreground uppercase">
                    Related learning & proof
                  </h3>
                  <ul className="space-y-2.5">
                    {relatedLearning.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="group inline-flex items-start gap-2 text-sm text-foreground/90 underline-offset-4 hover:text-primary hover:underline"
                          {...(link.href.startsWith("http")
                            ? {
                                target: "_blank",
                                rel: "noopener noreferrer",
                              }
                            : {})}
                        >
                          <IconArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                          <span>
                            {link.label}
                            <span className="mt-0.5 block text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                              {relatedLearningKindLabel(link.kind)}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technologies card */}
              {stack.length > 0 && (
                <div className="rounded-2xl border border-border bg-surface/30 p-6 space-y-4">
                  <h3 className="font-semibold text-sm tracking-widest text-muted-foreground uppercase">
                    Primary Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-xl border border-border bg-background/50 px-3 py-1.5 text-xs font-mono text-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {relatedLearning.length > 0 ? (
            <RelatedReading
              items={relatedLearning}
              className="mt-6"
              title="Related reading"
            />
          ) : null}

          {/* Related case studies (hub → spoke commercial linking) */}
          {relatedCaseStudies.length > 0 && (
            <section
              id="related-case-studies"
              className="mt-6 scroll-mt-28 space-y-4"
            >
              <h2 className="text-xl font-bold tracking-tight border-b border-border/80 pb-2">
                Related case studies
              </h2>
              <ul className="grid gap-4 md:grid-cols-2">
                {relatedCaseStudies.map((project) => (
                  <li key={project.slug}>
                    <Link
                      href={`/case-studies/${project.slug}/`}
                      className="block h-full rounded-xl border border-border/50 bg-surface/20 p-5 transition-colors hover:border-primary/40"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                        {project.category || "Case study"}
                      </p>
                      <p className="mt-2 font-semibold text-foreground">
                        {project.title}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                        {project.impactSummary || project.tagline}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                        {getCaseStudyLinkLabel(project.title)}
                        <IconArrowRight className="h-4 w-4" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Visible FAQs (question H2s / AEO) — no FAQPage JSON-LD growth lever */}
          {service.faqs && service.faqs.length > 0 && (
            <div
              id="service-faqs"
              className="mt-6 scroll-mt-28 md:col-span-3 space-y-4"
            >
              <h2 className="text-xl font-bold tracking-tight border-b border-border/80 pb-2">
                Common questions about {service.title}
              </h2>
              <dl className="grid gap-4 md:grid-cols-2">
                {service.faqs.map((faq) => (
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
            </div>
          )}

          <AuthorBio profile={profile} className="mt-6" />

          {/* Conversion Section */}
          <section
            id="discuss-service"
            className="relative scroll-mt-28 rounded-3xl border border-border/80 bg-surface/20 p-8 md:p-12 overflow-hidden text-center max-w-4xl mx-auto mt-8"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 bg-primary/5 rounded-full blur-[100px] -z-10" />
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Discuss this service
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Send the problem statement, current stack, timeline, and desired
                outcome. I reply within 24 hours with fit, constraints, and a
                recommended next step—not a generic sales pitch.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href={prefillContactUrl}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:scale-[1.02] hover:shadow-glow transition-all"
                >
                  Request consultation
                  <IconArrowRight className="h-4 w-4" />
                </Link>
                <TrackedLink
                  href="/contact/#intent=intro"
                  gtmEvent="intro_call_click"
                  gtmData={{
                    click_location: "service_footer_cta",
                    service_slug: service.slug,
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium hover:border-primary/40 transition-colors"
                >
                  Book a 20-min intro call
                </TrackedLink>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
                <Link
                  href="/case-studies/"
                  className="hover:text-primary transition-colors"
                >
                  Case studies
                </Link>
                <span className="text-muted-foreground/30 select-none">|</span>
                <Link
                  href="/profile/"
                  className="hover:text-primary transition-colors"
                >
                  Professional profile
                </Link>
                <span className="text-muted-foreground/30 select-none">|</span>
                <Link
                  href="/credentials/"
                  className="hover:text-primary transition-colors"
                >
                  Verified credentials
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer
        profile={profile}
        navigationItems={sortedNavigationItems}
        projects={sortedProjects}
      />
    </div>
  );
}
