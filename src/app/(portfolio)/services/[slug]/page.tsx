import {
  IconArrowRight,
  IconBookmark,
  IconBrain,
  IconChartBar,
  IconChevronLeft,
  IconCircleCheck,
  IconClock,
  IconCode,
  IconCoin,
  IconCpu,
  IconDatabase,
  IconSettings,
  IconSparkles,
} from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getPortfolioData } from "@/lib/portfolio-data";

export const revalidate = 3600;

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static routes for the dynamic services (excluding bespoke pages)
export async function generateStaticParams() {
  const { sortedServices } = await getPortfolioData();
  return sortedServices
    .filter(
      (service) =>
        service.slug !== "ai-llm-application-development" &&
        service.slug !== "rag-consultant-india" &&
        service.slug !== "ai-agent-development" &&
        service.slug !== "marketing-analytics-consultant" &&
        service.slug !== "full-stack-ai-product-development" &&
        service.slug !== "ga4-bigquery-campaign-analytics",
    )
    .map((service) => ({
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

  const siteUrl = `${(process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in").replace(/\/+$/, "")}/`;
  const canonicalUrl = `${siteUrl}services/${slug}/`;

  return {
    title: `${service.title} | Services | Madhu Dadi`,
    description: service.shortDescription || service.fullDescription,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;

  if (slug === "ga4-bigquery-campaign-analytics") {
    redirect("/services/marketing-analytics-consultant/");
  }

  const { profile, sortedServices, sortedProjects } = await getPortfolioData();
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

  // Build high-intent prefill subject and message
  const prefillSubject = `${service.title} project inquiry`;
  const prefillMessage = `Hi Madhu,\n\nI'm interested in your ${service.title} service.\n\nContext / Problem statement:\nWhat we want to build:\nTarget Timeline:\nEstimated budget range:\n\nLooking forward to speaking with you!`;
  const encodedSubject = encodeURIComponent(prefillSubject);
  const encodedMessage = encodeURIComponent(prefillMessage);
  const prefillContactUrl = `/contact/?subject=${encodedSubject}&message=${encodedMessage}`;

  const siteUrl = `${(process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in").replace(/\/+$/, "")}/`;
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl}services/${slug}/#service`,
    name: service.title,
    serviceType: service.title,
    description: service.shortDescription || service.fullDescription || "",
    provider: {
      "@id": `${siteUrl}#person`,
    },
    areaServed: ["India", "Worldwide", "Remote"],
    url: `${siteUrl}services/${slug}/`,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
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

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: safe — server-controlled JSON-LD only
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: safe — server-controlled JSON-LD only
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Header profile={profile} />

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

                {service.pricing && (
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <IconCoin className="h-4 w-4" /> Pricing Model
                    </span>
                    <p className="text-2xl font-bold text-foreground">
                      {service.pricing.description}
                    </p>
                    <span className="text-xs text-muted-foreground block">
                      Based on scope and deliverables type.
                    </span>
                  </div>
                )}

                {service.timeline && (
                  <div className="space-y-1 pt-4 border-t border-border/60">
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

      <Footer profile={profile} projects={sortedProjects} />
    </div>
  );
}
