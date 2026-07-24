import {
  IconArrowRight,
  IconChevronRight,
  IconSparkles,
} from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLdScript } from "@/components/JsonLdScript";
import { SeoStructuredData } from "@/components/SeoStructuredData";
import { ServiceIcon } from "@/components/ServiceIcon";
import { slimFooterProfile, slimFooterProjects } from "@/lib/home-page-data";
import { getPortfolioData } from "@/lib/portfolio-data";
import { siteLanguageAlternates } from "@/lib/seo/hreflang";
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
      languages: siteLanguageAlternates("/services/"),
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
      {/* HowTo JSON-LD omitted: HowTo rich results retired (Google, Sept 2023). */}
      <SeoStructuredData nodes={["ServicesList"]} />
      <Header
        profile={{ firstName: profile.firstName, lastName: profile.lastName }}
        navigationItems={sortedNavigationItems}
      />

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

          {/* Pricing / engagement anchor — no public rate card; clear how work is bought */}
          <section
            id="engagement-model"
            aria-labelledby="engagement-model-heading"
            className="scroll-mt-28 max-w-4xl mx-auto rounded-2xl border border-border/80 bg-surface/30 p-6 md:p-8 backdrop-blur-md"
          >
            <div className="space-y-2 text-center md:text-left">
              <p className="text-xs font-semibold tracking-widest text-primary uppercase">
                How engagements work
              </p>
              <h2
                id="engagement-model-heading"
                className="text-xl md:text-2xl font-bold tracking-tight"
              >
                Pricing model: scoped quotes after a free discovery call
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                There is no public rate card. Work is quoted from problem,
                stack, constraints, and success metrics—not a one-size package.
                Full-time employment continues in parallel; consulting is scoped
                so employer IP and conflict policies are respected.
              </p>
            </div>
            <ul className="mt-6 grid gap-4 sm:grid-cols-3">
              <li className="rounded-xl border border-border/60 bg-background/40 p-4 text-left">
                <p className="text-sm font-semibold text-foreground">
                  1. Discovery
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  Free fit check: problem statement, current stack, timeline,
                  and whether consulting is the right model.
                </p>
              </li>
              <li className="rounded-xl border border-border/60 bg-background/40 p-4 text-left">
                <p className="text-sm font-semibold text-foreground">
                  2. Scoped build
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  Fixed outcome and timeline after discovery. Custom written
                  quote—no public price list.
                </p>
              </li>
              <li className="rounded-xl border border-border/60 bg-background/40 p-4 text-left">
                <p className="text-sm font-semibold text-foreground">
                  3. Advisory option
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  Part-time guidance when ongoing architecture or analytics
                  support fits better than a project sprint.
                </p>
              </li>
            </ul>
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 sm:justify-between">
              <p className="text-xs text-muted-foreground">
                Typical reply within 24 hours. India and remote-first.
              </p>
              <Link
                href="/contact/"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:scale-[1.02] transition-all"
              >
                Request discovery call
                <IconArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </section>

          {/* Services Grid */}
          <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {sortedServices.map((service, index) => {
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
                        <ServiceIcon
                          slug={service.slug}
                          className="h-6 w-6 text-primary"
                        />
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

          <section className="max-w-4xl mx-auto space-y-4 text-center">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              Guides
            </h2>
            <ul className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 text-sm font-semibold">
              <li>
                <Link
                  href="/guides/ga4-bigquery/"
                  className="inline-flex items-center gap-2 text-primary underline-offset-4 hover:underline"
                >
                  GA4 + BigQuery setup (2026)
                  <IconArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/marketing-mix-modeling-2026/"
                  className="inline-flex items-center gap-2 text-primary underline-offset-4 hover:underline"
                >
                  Marketing mix modeling (2026)
                  <IconArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/attribution-after-cookies/"
                  className="inline-flex items-center gap-2 text-primary underline-offset-4 hover:underline"
                >
                  Attribution after cookies
                  <IconArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/fractional-ai-playbook/"
                  className="inline-flex items-center gap-2 text-primary underline-offset-4 hover:underline"
                >
                  Fractional AI playbook
                  <IconArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </li>
            </ul>
          </section>

          {/* Commercial keyword landers (content plan) */}
          <section className="max-w-4xl mx-auto space-y-4">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-center">
              Hire by specialty
            </h2>
            <p className="text-sm text-muted-foreground text-center max-w-2xl mx-auto">
              Exact-match consulting pages for common search intents. Each links
              to the full capability service for stack and deliverables.
            </p>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <li>
                <Link
                  href="/ga4-consultant/"
                  className="block rounded-xl border border-border/60 bg-surface/20 p-4 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  GA4 consultant
                </Link>
              </li>
              <li>
                <Link
                  href="/google-analytics-consultant/"
                  className="block rounded-xl border border-border/60 bg-surface/20 p-4 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  Google Analytics consultant
                </Link>
              </li>
              <li>
                <Link
                  href="/marketing-analytics-consultant/"
                  className="block rounded-xl border border-border/60 bg-surface/20 p-4 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  Marketing analytics consultant
                </Link>
              </li>
              <li>
                <Link
                  href="/marketing-mix-modeling-consultant/"
                  className="block rounded-xl border border-border/60 bg-surface/20 p-4 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  Marketing mix modeling (MMM)
                </Link>
              </li>
              <li>
                <Link
                  href="/attribution-modeling-consultant/"
                  className="block rounded-xl border border-border/60 bg-surface/20 p-4 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  Attribution modeling
                </Link>
              </li>
              <li>
                <Link
                  href="/fractional-ai-consultant/"
                  className="block rounded-xl border border-border/60 bg-surface/20 p-4 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  Fractional AI consultant
                </Link>
              </li>
              <li>
                <Link
                  href="/ai-consultant-for-startups/"
                  className="block rounded-xl border border-border/60 bg-surface/20 p-4 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  AI consultant for startups
                </Link>
              </li>
              <li>
                <Link
                  href="/ai-automation-consultant/"
                  className="block rounded-xl border border-border/60 bg-surface/20 p-4 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  AI automation consultant
                </Link>
              </li>
            </ul>
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
        profile={slimFooterProfile(profile)}
        navigationItems={sortedNavigationItems}
        projects={slimFooterProjects(sortedProjects)}
      />
    </div>
  );
}
