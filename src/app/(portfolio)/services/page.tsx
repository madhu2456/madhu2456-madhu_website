import {
  IconArrowRight,
  IconBrain,
  IconChartBar,
  IconChevronRight,
  IconCode,
  IconCpu,
  IconDatabase,
  IconSettings,
  IconSparkles,
} from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLdScript } from "@/components/JsonLdScript";
import { SeoStructuredData } from "@/components/SeoStructuredData";
import { getPortfolioData } from "@/lib/portfolio-data";
import { resolveSiteUrl } from "@/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = `${resolveSiteUrl()}/`;
  const canonicalUrl = `${siteUrl}services/`;

  return {
    title: "AI, RAG, AI Agents & Analytics Services | Madhu Dadi",
    description:
      "Hire Madhu Dadi for production AI/LLM development, RAG systems, AI agents, marketing analytics, GA4/BigQuery pipelines, and full-stack FastAPI/Next.js apps.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: {
        absolute: "AI, RAG, AI Agents & Analytics Services | Madhu Dadi",
      },
      description:
        "Hire Madhu Dadi for production AI/LLM development, RAG systems, AI agents, marketing analytics, GA4/BigQuery pipelines, and full-stack FastAPI/Next.js apps.",
      url: canonicalUrl,
      siteName: "Madhu Dadi",
      type: "website",
    },
  };
}

export default async function ServicesHubPage() {
  const { profile, sortedServices, sortedProjects, sortedNavigationItems } =
    await getPortfolioData();

  // Helper to map slugs to premium icons
  const getServiceIcon = (slug: string) => {
    switch (slug) {
      case "ai-llm-application-development":
        return <IconBrain className="h-6 w-6 text-primary" />;
      case "rag-consultant-india":
        return <IconDatabase className="h-6 w-6 text-primary" />;
      case "ai-agent-development":
        return <IconCpu className="h-6 w-6 text-primary" />;
      case "marketing-analytics-consultant":
        return <IconChartBar className="h-6 w-6 text-primary" />;
      case "ga4-bigquery-campaign-analytics":
        return <IconSettings className="h-6 w-6 text-primary" />;
      case "full-stack-ai-product-development":
        return <IconCode className="h-6 w-6 text-primary" />;
      default:
        return <IconSparkles className="h-6 w-6 text-primary" />;
    }
  };

  const siteUrl = `${resolveSiteUrl()}/`;
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
    ],
  };

  return (
    <div className="flex flex-col min-h-screen">
      <JsonLdScript data={breadcrumbSchema} />
      <SeoStructuredData nodes={["ServicesList", "HowToHire"]} />
      <Header profile={profile} navigationItems={sortedNavigationItems} />

      <main id="main-content" className="flex-1 px-6 py-28 bg-background/50">
        <div className="container mx-auto max-w-6xl space-y-16">
          <Breadcrumb items={[{ label: "Services" }]} />
          {/* Hero Section */}
          <section className="text-center space-y-4 max-w-3xl mx-auto pt-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <IconSparkles className="h-3.5 w-3.5" /> High-Outcome Engineering
              Delivery
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Generative AI, RAG, AI Agents &{" "}
              <span className="text-gradient">Marketing Analytics</span>{" "}
              Services
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              I help teams build production AI and analytics systems: LLM/RAG
              applications, AI agents, FastAPI/Next.js products, GA4/BigQuery
              analytics, dashboards, and campaign measurement workflows.
            </p>
          </section>

          {/* Services Grid */}
          <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {sortedServices.map((service, index) => {
              const Icon = getServiceIcon(service.slug);
              const stack = service.technologies?.map((t) => t.name) ?? [];

              return (
                <article
                  key={service.slug}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface/30 p-8 shadow-card backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/45 hover:bg-surface-elevated/40"
                >
                  <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 rounded-full blur-3xl -z-10 transition-opacity group-hover:opacity-100 opacity-60" />

                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary border border-primary/10 shadow-inner group-hover:scale-105 transition-transform duration-300">
                        {Icon}
                      </div>
                      <span
                        aria-hidden="true"
                        className="text-xs font-mono text-muted-foreground bg-surface-elevated px-2.5 py-1 rounded-full border border-border/50"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-3">
                      <h2 className="font-display text-2xl font-bold tracking-tight">
                        {service.title}
                      </h2>
                      <p className="text-sm leading-relaxed text-muted-foreground min-h-18">
                        {service.shortDescription}
                      </p>
                    </div>

                    {/* Features list */}
                    {service.features && service.features.length > 0 && (
                      <ul className="space-y-2 text-xs border-t border-border/55 pt-5">
                        {service.features.slice(0, 3).map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-2 text-foreground/80"
                          >
                            <IconChevronRight
                              className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0"
                              aria-hidden="true"
                            />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Footer & CTA */}
                  <div className="mt-8 pt-5 border-t border-border/55 space-y-6">
                    {/* Stack tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {stack.slice(0, 4).map((tech) => (
                        <span
                          key={`${service.slug}-${tech}`}
                          className="rounded-full border border-border bg-background/40 px-2 py-0.5 text-[10px] font-mono text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="flex items-center justify-end gap-4">
                      <Link
                        href={`/services/${service.slug}/`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover group/link transition-colors"
                      >
                        Explore service
                        <IconChevronRight className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          {/* Outcomes Summary Callout */}
          <section className="relative rounded-3xl border border-border/80 bg-surface/20 p-8 md:p-12 overflow-hidden text-center max-w-4xl mx-auto">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 bg-primary/5 rounded-full blur-[100px] -z-10" />
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Need a custom technical capability?
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Whether it is building custom LLM evaluation scripts, optimizing
                large scale vector ingestion databases, or building private
                server-side analytics, I specialize in solving hard, atypical
                engineering challenges.
              </p>
              <div className="pt-4">
                <Link
                  href="/contact/"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                >
                  Schedule a technical discovery call
                  <IconArrowRight className="h-4 w-4" />
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
