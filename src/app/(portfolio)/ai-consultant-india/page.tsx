import { IconArrowRight, IconMapPin, IconWorld } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLdScript } from "@/components/JsonLdScript";
import { slimFooterProfile, slimFooterProjects } from "@/lib/home-page-data";
import { getPortfolioData } from "@/lib/portfolio-data";
import { siteLanguageAlternates } from "@/lib/seo/hreflang";
import { resolveSiteUrl } from "@/lib/site-url";

// ≤60 chars for SERP (v2 audit): front-load AI/RAG + India; cities stay in body/desc
const PAGE_TITLE = "AI Consultant in India | RAG, Agents, GA4 | Madhu Dadi";
const PAGE_DESCRIPTION =
  "Fractional AI consultant in India. Production RAG, LLM apps, agents, and GA4→BigQuery analytics for startups and enterprise. Book a discovery call.";

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = `${resolveSiteUrl()}/`;
  const canonicalUrl = `${siteUrl}ai-consultant-india/`;
  const image = `${siteUrl}opengraph-image/`;

  return {
    title: { absolute: PAGE_TITLE },
    description: PAGE_DESCRIPTION,
    alternates: {
      canonical: canonicalUrl,
      languages: siteLanguageAlternates("/ai-consultant-india/"),
    },
    openGraph: {
      title: { absolute: PAGE_TITLE },
      description: PAGE_DESCRIPTION,
      url: canonicalUrl,
      siteName: "Madhu Dadi",
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: PAGE_TITLE,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      images: [image],
    },
  };
}

export default async function AiConsultantIndiaPage() {
  const { profile, sortedProjects, sortedServices, sortedNavigationItems } =
    await getPortfolioData();
  const siteUrl = `${resolveSiteUrl()}/`;
  const pageUrl = `${siteUrl}ai-consultant-india/`;

  const areas = [
    {
      name: "Visakhapatnam",
      role: "Home base",
      copy: "Based in Visakhapatnam, Andhra Pradesh. Ideal for teams that want an India-based AI engineer with production delivery habits—not slideware.",
      href: "/services/ai-consultant-visakhapatnam/",
    },
    {
      name: "Hyderabad",
      role: "On-site on request",
      copy: "Professional experience includes Hyderabad. Hybrid discovery, stakeholder workshops, and on-site kickoffs when the engagement warrants it.",
      href: "/services/ai-consultant-hyderabad/",
    },
    {
      name: "Bengaluru",
      role: "On-site on request",
      copy: "Remote-first fractional AI for product teams; on-site workshops available for founder and engineering alignment.",
      href: "/services/ai-consultant-bengaluru/",
    },
    {
      name: "Chennai",
      role: "On-site on request",
      copy: "Production RAG, LLM apps, and analytics for Chennai teams — async delivery with optional kickoffs.",
      href: "/services/ai-consultant-chennai/",
    },
    {
      name: "Mumbai",
      role: "On-site on request",
      copy: "Fractional AI plus measurement (attribution, MMM) for Mumbai brands and growth teams.",
      href: "/services/ai-consultant-mumbai/",
    },
    {
      name: "Remote India & worldwide",
      role: "Default delivery mode",
      copy: "Remote-first for design, implementation, and handoff. Async-friendly with clear written specs, telemetry, and review checkpoints that work across time zones.",
    },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        isPartOf: { "@id": `${siteUrl}#website` },
        about: { "@id": `${siteUrl}#person` },
        dateModified: profile.updatedAt || new Date().toISOString(),
        inLanguage: "en-IN",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
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
            name: "AI consultant in India",
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "ProfessionalService",
        "@id": `${pageUrl}#service`,
        name: "AI, RAG & Analytics Consulting — India & remote",
        url: pageUrl,
        description: PAGE_DESCRIPTION,
        provider: { "@id": `${siteUrl}#person` },
        areaServed: [
          {
            "@type": "City",
            name: "Visakhapatnam",
            containedInPlace: {
              "@type": "Country",
              name: "India",
            },
          },
          {
            "@type": "City",
            name: "Hyderabad",
            containedInPlace: {
              "@type": "Country",
              name: "India",
            },
          },
          {
            "@type": "City",
            name: "Bengaluru",
            containedInPlace: {
              "@type": "Country",
              name: "India",
            },
          },
          {
            "@type": "City",
            name: "Chennai",
            containedInPlace: {
              "@type": "Country",
              name: "India",
            },
          },
          {
            "@type": "City",
            name: "Mumbai",
            containedInPlace: {
              "@type": "Country",
              name: "India",
            },
          },
          {
            "@type": "Country",
            name: "India",
          },
          {
            "@type": "Place",
            name: "Worldwide (remote)",
          },
        ],
        serviceType: [
          "RAG systems",
          "AI agents",
          "Generative AI applications",
          "Marketing analytics",
          "FastAPI / Next.js products",
        ],
      },
      // FAQPage omitted (2026 policy): visible FAQ HTML below only.
    ],
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        profile={{ firstName: profile.firstName, lastName: profile.lastName }}
        navigationItems={sortedNavigationItems}
      />
      <main
        id="main-content"
        className="mx-auto w-[min(1100px,92%)] flex-1 pt-32 pb-24"
      >
        <JsonLdScript data={schema} />
        <Breadcrumb items={[{ label: "AI consultant in India" }]} />

        <header className="mt-8 max-w-3xl space-y-5">
          <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            <IconMapPin className="h-3.5 w-3.5" aria-hidden />
            Local & remote delivery
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight text-gradient md:text-5xl">
            AI Consultant in India — RAG, Agents, and Analytics That Ship
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Most “AI consulting” is either a slide deck or a POC that never
            leaves a notebook. I ship production systems—evaluated, monitored,
            and cheap enough to run—for companies that have decided AI is a line
            item, not an experiment.
          </p>
          <p className="text-base leading-relaxed text-muted-foreground">
            Madhu Dadi is an AI engineer and RAG &amp; analytics consultant
            based in Visakhapatnam, India, with professional experience in
            Hyderabad, Bengaluru, and Gurugram. Remote-first delivery: agents,
            RAG pipelines, FastAPI/Next.js products, and marketing analytics
            infrastructure. Select consulting alongside full-time employment.
          </p>
        </header>

        <section className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => {
            const body = (
              <>
                <p className="text-xs font-semibold tracking-widest text-primary uppercase">
                  {area.role}
                </p>
                <h2 className="mt-2 font-display text-xl font-semibold">
                  {area.name}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {area.copy}
                </p>
                {"href" in area && area.href ? (
                  <p className="mt-4 text-sm font-semibold text-primary">
                    City page →
                  </p>
                ) : null}
              </>
            );
            return (
              <article
                key={area.name}
                className="rounded-2xl border border-border bg-surface/50 p-6 shadow-card transition-colors hover:border-primary/30"
              >
                {"href" in area && area.href ? (
                  <Link
                    href={area.href}
                    prefetch={false}
                    className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {body}
                  </Link>
                ) : (
                  body
                )}
              </article>
            );
          })}
        </section>

        <section className="mt-16 space-y-6">
          <h2 className="font-display text-2xl font-semibold">
            What teams hire me for
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {sortedServices.slice(0, 6).map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}/`}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-surface/40 px-4 py-3 text-sm transition-colors hover:border-primary/40"
                >
                  <span>{service.title}</span>
                  <IconArrowRight
                    className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 space-y-6">
          <h2 className="font-display text-2xl font-semibold">
            Proof from shipped systems
          </h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {sortedProjects.slice(0, 3).map((project) => (
              <li key={project.slug}>
                <Link
                  href={`/case-studies/${project.slug}/`}
                  className="block h-full rounded-2xl border border-border bg-surface/50 p-5 transition-colors hover:border-primary/40"
                >
                  <h3 className="font-display text-lg font-semibold leading-snug">
                    {project.title}
                  </h3>
                  {project.impactSummary ? (
                    <p className="mt-2 line-clamp-4 text-sm text-muted-foreground">
                      {project.impactSummary}
                    </p>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 space-y-4 rounded-2xl border border-border bg-surface/40 p-8">
          <h2 className="flex items-center gap-2 font-display text-2xl font-semibold">
            <IconWorld className="h-6 w-6 text-primary" aria-hidden />
            Frequently asked
          </h2>
          <dl className="space-y-5 text-sm leading-relaxed">
            <div>
              <dt className="font-semibold text-foreground">
                Do you work with teams outside Visakhapatnam?
              </dt>
              <dd className="mt-1 text-muted-foreground">
                Yes. Delivery is remote-first worldwide. Visakhapatnam is the
                home base; professional experience includes Hyderabad,
                Bengaluru, and Gurugram. On-site kickoffs in India are possible
                when the engagement needs them.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">
                Who is this page for?
              </dt>
              <dd className="mt-1 text-muted-foreground">
                Teams searching for an AI engineer, RAG consultant, or analytics
                consultant in Visakhapatnam, Hyderabad, or remote India who need
                production delivery—not only demos.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">How do I start?</dt>
              <dd className="mt-1 text-muted-foreground">
                Send the problem, stack, timeline, and desired outcome via the{" "}
                <Link
                  href="/contact/"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  contact form
                </Link>
                . Typical reply is within 24 hours.
              </dd>
            </div>
          </dl>
        </section>

        <section className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/contact/#intent=ai-llm"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02]"
          >
            Discuss an India or remote engagement
            <IconArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="/contact/#intent=intro"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium hover:border-primary/40 transition-colors"
          >
            Book a 20-min intro call
          </Link>
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
