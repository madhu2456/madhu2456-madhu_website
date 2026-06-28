import {
  IconArrowRight,
  IconBookmark,
  IconBrain,
  IconChartBar,
  IconChevronLeft,
  IconCircleCheck,
  IconClock,
  IconCode,
  IconCpu,
  IconDatabase,
  IconSettings,
  IconSparkles,
} from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getPortfolioData } from "@/lib/portfolio-data";
import { serializeJsonLd } from "@/lib/seo/json-ld";
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

  const rawTitle =
    service.seoTitle ||
    (service.title.length > 45
      ? service.title
      : `${service.title} | Madhu Dadi`);
  const title = rawTitle.includes("Madhu Dadi")
    ? rawTitle
    : `${rawTitle} | Madhu Dadi`;
  const description = service.shortDescription || service.fullDescription;
  const image = `${siteUrl}opengraph-image/?ext=.png`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
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

  // Helper to map slugs to premium icons
  const getServiceIcon = (slug: string) => {
    switch (slug) {
      case "ai-llm-application-development":
        return <IconBrain className="h-8 w-8 text-primary" />;
      case "rag-consultant-india":
        return <IconDatabase className="h-8 w-8 text-primary" />;
      case "ai-agent-development":
        return <IconCpu className="h-8 w-8 text-primary" />;
      case "marketing-analytics-consultant":
        return <IconChartBar className="h-8 w-8 text-primary" />;
      case "ga4-bigquery-campaign-analytics":
        return <IconSettings className="h-8 w-8 text-primary" />;
      case "full-stack-ai-product-development":
        return <IconCode className="h-8 w-8 text-primary" />;
      default:
        return <IconSparkles className="h-8 w-8 text-primary" />;
    }
  };

  const Icon = getServiceIcon(service.slug);
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

  const siteUrl = `${resolveSiteUrl()}/`;
  const serviceSchema = {
    "@type": "Service",
    "@id": `${siteUrl}services/${slug}/#service`,
    name: service.title,
    serviceType: service.title,
    image: `${siteUrl}opengraph-image/?ext=.png`,
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

  const faqSchema =
    service.faqs && service.faqs.length > 0
      ? {
          "@type": "FAQPage",
          "@id": `${siteUrl}services/${slug}/#faq`,
          mainEntity: service.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  const webpageSchema = {
    "@type": "WebPage",
    "@id": `${siteUrl}services/${slug}/#webpage`,
    name: service.seoTitle || service.title,
    description: service.shortDescription || service.fullDescription,
    datePublished: service.updatedAt ?? new Date().toISOString(),
    dateModified: service.updatedAt ?? new Date().toISOString(),
    image: `${siteUrl}opengraph-image/?ext=.png`,
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
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#main-content h1", "#main-content h2", "#main-content p"],
    },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is escaped by serializeJsonLd
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd({
            "@context": "https://schema.org",
            "@graph": [
              serviceSchema,
              webpageSchema,
              breadcrumbSchema,
              ...(faqSchema ? [faqSchema] : []),
            ],
          }),
        }}
      />
      <Header profile={profile} navigationItems={sortedNavigationItems} />

      <main id="main-content" className="flex-1 px-6 py-28 bg-background/50">
        <div className="container mx-auto max-w-4xl space-y-12">
          {/* Back Button */}
          <div>
            <Link
              href="/services/"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <IconChevronLeft className="h-4 w-4" /> Back to Services
            </Link>
          </div>

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
                  {service.title}
                </h1>
                <p className="text-lg md:text-xl text-foreground/80 leading-relaxed font-medium">
                  {service.shortDescription}
                </p>
              </div>
            </div>
          </section>

          {/* AI Answer Block / TL;DR Summary */}
          <section
            aria-label="Quick Answer"
            className="p-6 rounded-2xl bg-primary/5 border border-primary/20 space-y-4"
          >
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
              <IconSparkles className="h-4 w-4" /> Quick Answer: Service Summary
            </h2>
            <dl className="space-y-4">
              <div>
                <dt className="font-bold text-foreground text-sm">
                  What is the service?
                </dt>
                <dd className="text-sm text-foreground/90 mt-1">
                  {service.title}
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
              {/* Detailed narrative description */}
              {service.fullDescription && (
                <section className="space-y-4">
                  <h2 className="text-xl font-bold tracking-tight border-b border-border/80 pb-2">
                    Service Overview
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.fullDescription}
                  </p>
                </section>
              )}

              {/* Service Features / Core Offerings */}
              {service.features && service.features.length > 0 && (
                <section className="space-y-4">
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
              )}

              {/* Deliverables List */}
              {service.deliverables && service.deliverables.length > 0 && (
                <section className="space-y-4">
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

                <div className="pt-4 border-t border-border/60">
                  <Link
                    href={prefillContactUrl}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                  >
                    Start a project
                    <IconArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

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

          {/* FAQs Section */}
          {service.faqs && service.faqs.length > 0 && (
            <div className="mt-6 md:col-span-3 space-y-4">
              <h2 className="text-xl font-bold tracking-tight border-b border-border/80 pb-2">
                Frequently Asked Questions
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

          {/* Conversion Section */}
          <section className="relative rounded-3xl border border-border/80 bg-surface/20 p-8 md:p-12 overflow-hidden text-center max-w-4xl mx-auto mt-8">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 bg-primary/5 rounded-full blur-[100px] -z-10" />
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Let&apos;s build together
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Send a summary of your requirements, current tech stack, and
                goals. I respond with a structured initial proposal within 24
                hours.
              </p>
              <div className="pt-4 flex flex-col items-center gap-4">
                <Link
                  href={prefillContactUrl}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:scale-[1.02] hover:shadow-glow transition-all"
                >
                  Book {service.title.split(" ")[0]} project consultation
                  <IconArrowRight className="h-4 w-4" />
                </Link>
                <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground mt-2">
                  <Link
                    href="/profile/"
                    className="hover:text-primary transition-colors"
                  >
                    About Madhu Dadi (Profile)
                  </Link>
                  <span className="text-muted-foreground/30 select-none">
                    |
                  </span>
                  <Link
                    href="/credentials/"
                    className="hover:text-primary transition-colors"
                  >
                    Verified Credentials & Proof
                  </Link>
                </div>
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
