import { ArrowRight, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Footer } from "@/components/Footer";
import { FormattedText } from "@/components/FormattedText";
import { Header } from "@/components/Header";
import { JsonLdScript } from "@/components/JsonLdScript";
import { SeoStructuredData } from "@/components/SeoStructuredData";
import {
  normalizeImageSource,
  shouldUseUnoptimizedImage,
} from "@/lib/image-source";
import { getPortfolioData } from "@/lib/portfolio-data";

import { resolveSiteUrl } from "@/lib/site-url";

const CASE_STUDIES_DESCRIPTION =
  "Selected case studies by Madhu Dadi across AI visibility, RAG-powered learning, automation, marketing analytics, and full-stack engineering.";

const getSiteUrl = () => {
  return `${resolveSiteUrl()}/`;
};

export const metadata: Metadata = {
  title: "AI, RAG & Analytics Case Studies | Madhu Dadi",
  description: CASE_STUDIES_DESCRIPTION,
  alternates: {
    canonical: `${getSiteUrl()}case-studies/`,
  },
  openGraph: {
    title: {
      absolute: "AI, RAG & Analytics Case Studies | Madhu Dadi",
    },
    description: CASE_STUDIES_DESCRIPTION,
    url: `${getSiteUrl()}case-studies/`,
    type: "website",
  },
};

export default async function CaseStudiesPage() {
  const { profile, sortedProjects, sortedNavigationItems } =
    await getPortfolioData();
  const siteUrl = getSiteUrl();
  const collectionUrl = `${siteUrl}case-studies/`;
  const itemListElement = sortedProjects.map((project, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: project.title,
    url: `${collectionUrl}${project.slug}/`,
  }));

  const collectionSchema = {
    "@type": "CollectionPage",
    "@id": `${collectionUrl}#collection`,
    url: collectionUrl,
    name: "Case studies by Madhu Dadi",
    description: CASE_STUDIES_DESCRIPTION,
    inLanguage: "en-IN",
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
        name: "Case Studies",
        item: collectionUrl,
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SeoStructuredData nodes={["ProjectsList"]} />
      <Header profile={profile} navigationItems={sortedNavigationItems} />
      <main
        id="main-content"
        className="flex-1 mx-auto max-w-6xl w-[92%] pt-32 pb-24"
      >
        <JsonLdScript
          data={{
            "@context": "https://schema.org",
            "@graph": [collectionSchema, breadcrumbSchema],
          }}
        />
        <Breadcrumb items={[{ label: "Case Studies" }]} />

        <header className="mt-8 max-w-none">
          <div className="max-w-4xl">
            <p className="text-xs tracking-[0.25em] text-primary uppercase">
              Selected work
            </p>
            <h1 className="mt-3 font-display text-5xl font-bold text-gradient md:text-6xl">
              Generative AI, RAG, FastAPI & Marketing Analytics Case Studies
            </h1>
          </div>

          <div className="mt-12 space-y-16 text-lg leading-relaxed text-muted-foreground">
            <section className="space-y-6 max-w-4xl">
              <p>
                These case studies demonstrate my end-to-end engineering work
                across generative AI, Retrieval-Augmented Generation (RAG)
                pipelines, FastAPI backend automation, and high-performance
                marketing analytics systems. The core methodology behind every
                project is to bridge the gap between complex architectural
                challenges and measurable business impact.
              </p>
              <p>
                My primary tech stack revolves around Next.js and React for
                highly optimized, SEO-friendly frontends, paired with Python and
                FastAPI for robust, asynchronous backend services. Data and
                analytics infrastructure typically leverages PostgreSQL, Redis,
                Google BigQuery, and advanced telemetry pipelines.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="font-display text-3xl font-semibold text-foreground">
                Core Categories
              </h2>
              <div className="grid gap-6 mt-4 sm:grid-cols-2 lg:grid-cols-2">
                <div className="rounded-2xl border border-border/50 bg-surface/30 p-6 flex flex-col hover:border-primary/30 transition-colors">
                  <h3 className="font-bold text-foreground">
                    Generative AI & LLM Engineering
                  </h3>
                  <p className="mt-3 text-base flex-1">
                    Building high-performance generative AI systems utilizing
                    modern large language models, structured outputs, robust
                    prompt engineering pipelines, and rigorous runtime
                    evaluation frameworks. I prioritize mitigating hallucination
                    and ensuring data privacy in enterprise environments,
                    ensuring AI tools operate reliably and securely.
                  </p>
                </div>
                <div className="rounded-2xl border border-border/50 bg-surface/30 p-6 flex flex-col hover:border-primary/30 transition-colors">
                  <h3 className="font-bold text-foreground">
                    Retrieval-Augmented Generation (RAG)
                  </h3>
                  <p className="mt-3 text-base flex-1">
                    Designing bespoke enterprise RAG pipelines for complex
                    document ingestion, semantic chunking, dense/sparse hybrid
                    search, cross-encoder reranking, and citation verification.
                    These systems ensure that AI responses are strictly grounded
                    in verifiable internal knowledge, eliminating fabrication
                    and enabling high-stakes decision-making.
                  </p>
                </div>
                <div className="rounded-2xl border border-border/50 bg-surface/30 p-6 flex flex-col hover:border-primary/30 transition-colors">
                  <h3 className="font-bold text-foreground">
                    Marketing Analytics & Measurement
                  </h3>
                  <p className="mt-3 text-base flex-1">
                    Architecting advanced marketing data science and decision
                    intelligence systems. I build reliable multi-touch
                    attribution models, server-side Google Tag Manager
                    deployments, and custom GA4/BigQuery pipelines that
                    translate complex telemetry into clear marketing investment
                    decisions, allowing businesses to scale their ad spend
                    confidently.
                  </p>
                </div>
                <div className="rounded-2xl border border-border/50 bg-surface/30 p-6 flex flex-col hover:border-primary/30 transition-colors">
                  <h3 className="font-bold text-foreground">
                    Full-Stack Product Development
                  </h3>
                  <p className="mt-3 text-base flex-1">
                    Shipping end-to-end production web applications designed for
                    visual excellence, performance, security, and search engine
                    optimization. This involves combining ultra-fast Next.js
                    user interfaces with secure, scalable backend microservices,
                    real-time databases, and automated deployment pipelines for
                    seamless user experiences.
                  </p>
                </div>
              </div>
            </section>

            <div className="grid gap-12 sm:grid-cols-2">
              <section className="space-y-4">
                <h2 className="font-display text-3xl font-semibold text-foreground">
                  How I Pick Projects
                </h2>
                <p className="text-base">
                  I actively select projects that present deep technical
                  complexity tied directly to tangible business value. I look
                  for engagements where a high-leverage technical
                  intervention—whether it is automating an operational
                  bottleneck with AI agents, establishing absolute clarity in
                  marketing attribution, or scaling a Next.js platform—will
                  drive immediate ROI. I prefer working directly with
                  stakeholders who value engineering rigor, iterative
                  deployment, and transparent system architecture over quick,
                  unscalable hacks. My ultimate goal is to architect
                  foundational systems that teams can understand, maintain, and
                  rely on long after my direct involvement ends.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-3xl font-semibold text-foreground">
                  What &quot;Shipped&quot; Means Here
                </h2>
                <p className="text-base">
                  In these case studies, &quot;shipped&quot; does not just mean
                  the code was successfully merged to the main branch. A shipped
                  project represents a resilient system that is actively running
                  in production environments, handling real user traffic, and
                  generating measurable data. It means the application has been
                  meticulously optimized for Core Web Vitals, secured against
                  common vulnerabilities, and architected with robust error
                  handling and observability from day one. Each project below is
                  comprehensively documented with a clear problem statement, the
                  technical approach used to solve it, and the concrete outcomes
                  achieved. Where applicable, live URLs, open-source GitHub
                  repositories, and verifiable performance metrics are provided
                  as citable proof of execution.
                </p>
              </section>
            </div>
          </div>
        </header>

        <section className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedProjects.map((project) => {
            const stack = project.technologies?.map((tech) => tech.name) ?? [];

            return (
              <article
                key={project.slug}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface/60 transition-all hover:-translate-y-1 hover:border-primary/40 shadow-card"
              >
                {(() => {
                  const coverSrc = normalizeImageSource(project.coverImage);
                  return project.coverImage && coverSrc ? (
                    <div className="relative aspect-video w-full overflow-hidden border-b border-border/80 bg-surface">
                      <Image
                        src={coverSrc}
                        alt={project.coverImageAlt || project.title}
                        width={800}
                        height={450}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-[1.04]"
                        unoptimized={shouldUseUnoptimizedImage(
                          project.coverImage,
                        )}
                      />
                    </div>
                  ) : null;
                })()}
                <div className="flex flex-1 flex-col p-6">
                  {project.category ? (
                    <p className="text-xs tracking-widest text-primary uppercase">
                      {project.category}
                    </p>
                  ) : null}
                  <h2 className="mt-3 font-display text-2xl font-semibold leading-tight">
                    {project.title}
                  </h2>
                  {project.tagline ? (
                    <p className="mt-2 text-sm font-medium text-foreground/80">
                      <FormattedText text={project.tagline} />
                    </p>
                  ) : null}
                  {project.impactSummary ? (
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                      <FormattedText text={project.impactSummary} />
                    </p>
                  ) : null}
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {stack.slice(0, 6).map((tech) => (
                      <span
                        key={`${project.slug}-${tech}`}
                        className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                    <Link
                      href={`/case-studies/${project.slug}/`}
                      className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
                    >
                      Read case study <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                      >
                        Live <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* Hire Me CTA */}
        <section className="mt-16 text-center space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">
            Need a hands-on AI engineer?
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            I specialize in production LLM/RAG applications, AI agents, and
            marketing analytics systems.
          </p>
          <div className="pt-4">
            <Link
              href="/contact/"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
            >
              Hire me for your next project
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer
        profile={profile}
        projects={sortedProjects}
        navigationItems={sortedNavigationItems}
      />
    </div>
  );
}
