import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getPortfolioData } from "@/lib/portfolio-data";

const RESULT_LIMIT_PER_SECTION = 6;
const TOTAL_RESULT_LIMIT = 24;

type SearchParams = Promise<{
  q?: string | string[];
}>;

type SearchResult = {
  id: string;
  title: string;
  description: string;
  href: string;
  label: "Project" | "Service" | "Skill" | "Experience" | "Certification";
};

const toQuery = (value?: string | string[]) => {
  const raw = Array.isArray(value) ? value[0] : value;
  return (raw ?? "").trim().replace(/\s+/g, " ");
};

const queryToTokens = (query: string) =>
  query.toLowerCase().split(/\s+/).filter(Boolean).slice(0, 8);

const matchesQuery = (queryTokens: string[], values: Array<string | null>) => {
  if (queryTokens.length === 0) return false;
  const haystack = values
    .filter((value): value is string => Boolean(value))
    .join(" ")
    .toLowerCase();
  return queryTokens.every((token) => haystack.includes(token));
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: SearchParams;
}): Promise<Metadata> {
  const resolvedParams = searchParams ? await searchParams : {};
  const query = toQuery(resolvedParams.q);
  const encodedQuery = encodeURIComponent(query);
  let title = query
    ? `Search results for "${query}" | Madhu Dadi`
    : "Search AI, Python & Analytics Projects | Madhu Dadi";
  if (title.length > 65) {
    const maxQueryLen = 65 - 'Search results for "" | Madhu Dadi'.length - 3;
    const truncatedQuery = query
      .slice(0, maxQueryLen)
      .trim()
      .replace(/[\s,;:!?-]+$/, "");
    title = `Search results for "${truncatedQuery}..." | Madhu Dadi`;
  }
  const description = query
    ? `View search results for "${query}" across projects, services, skills, and professional experience in Madhu Dadi's AI & Analytics Portfolio website.`
    : "Search across Madhu Dadi's AI & Analytics Portfolio to discover detailed AI projects, marketing analytics case studies, technical skills, and experience.";
  const url = query ? `/search/?q=${encodedQuery}` : "/search/";

  return {
    title,
    description,
    alternates: {
      canonical: "/search/",
    },
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Madhu Dadi portfolio search",
        },
      ],
    },
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  const query = toQuery(resolvedParams.q);
  const queryTokens = queryToTokens(query);
  const {
    profile,
    sortedCertifications,
    sortedExperiences,
    sortedProjects,
    sortedServices,
    sortedNavigationItems,
    skills,
  } = await getPortfolioData();

  const projectResults: SearchResult[] = sortedProjects
    .filter((project) =>
      matchesQuery(queryTokens, [
        project.title,
        project.tagline ?? null,
        project.impactSummary ?? null,
        project.category ?? null,
        ...(project.technologies ?? []).map((technology) => technology.name),
      ]),
    )
    .slice(0, RESULT_LIMIT_PER_SECTION)
    .map((project) => ({
      id: `project-${project.slug || project.title}`,
      title: project.title,
      description:
        project.impactSummary ||
        project.tagline ||
        "Project case study with architecture and delivery outcomes.",
      href: project.slug ? `/case-studies/${project.slug}/` : "/#projects",
      label: "Project",
    }));

  const serviceResults: SearchResult[] = sortedServices
    .filter((service) =>
      matchesQuery(queryTokens, [
        service.title,
        service.shortDescription ?? null,
        service.timeline ?? null,
        ...(service.technologies ?? []).map((technology) => technology.name),
        ...(service.features ?? []),
      ]),
    )
    .slice(0, RESULT_LIMIT_PER_SECTION)
    .map((service) => ({
      id: `service-${service.slug || service.title}`,
      title: service.title,
      description:
        service.shortDescription ||
        "Service delivery focused on practical business outcomes.",
      href: "/#services",
      label: "Service",
    }));

  const skillResults: SearchResult[] = skills
    .filter((skill) =>
      matchesQuery(queryTokens, [skill.name, skill.category ?? null]),
    )
    .slice(0, RESULT_LIMIT_PER_SECTION)
    .map((skill) => ({
      id: `skill-${skill.name}`,
      title: skill.name,
      description: `${skill.category ?? "Technical skill"}${skill.yearsOfExperience ? ` · ${skill.yearsOfExperience}+ years` : ""}`,
      href: "/#about",
      label: "Skill",
    }));

  const experienceResults: SearchResult[] = sortedExperiences
    .filter((experience) =>
      matchesQuery(queryTokens, [
        experience.company,
        experience.position,
        experience.description ?? null,
        experience.location ?? null,
        ...(experience.technologies ?? []).map((technology) => technology.name),
      ]),
    )
    .slice(0, RESULT_LIMIT_PER_SECTION)
    .map((experience) => ({
      id: `experience-${experience.company}-${experience.position}`,
      title: `${experience.position} at ${experience.company}`,
      description:
        experience.description || "Professional role with measurable outcomes.",
      href: "/#experience",
      label: "Experience",
    }));

  const certificationResults: SearchResult[] = sortedCertifications
    .filter((certification) =>
      matchesQuery(queryTokens, [
        certification.name,
        certification.issuer ?? null,
        certification.description ?? null,
        ...(certification.skills ?? []).map((skill) => skill.name),
      ]),
    )
    .slice(0, RESULT_LIMIT_PER_SECTION)
    .map((certification) => ({
      id: `certification-${certification.name}`,
      title: certification.name,
      description:
        certification.description ||
        "Professional certification and credentials.",
      href: "/#certifications",
      label: "Certification",
    }));

  const allResults = [
    ...projectResults,
    ...serviceResults,
    ...skillResults,
    ...experienceResults,
    ...certificationResults,
  ].slice(0, TOTAL_RESULT_LIMIT);

  return (
    <>
      <Header profile={profile} navigationItems={sortedNavigationItems} />
      <main id="main-content" className="min-h-screen py-16 px-6 bg-muted/10">
        <div className="container mx-auto max-w-4xl space-y-8">
          <header className="rounded-2xl border bg-background p-6 md:p-8 space-y-4 shadow-sm">
            <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Link
                href="/"
                className="hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <span>/</span>
              <span className="text-foreground">Search</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-bold">Portfolio Search</h1>

            <form
              method="GET"
              action="/search/"
              className="flex w-full max-w-lg gap-2 pt-2 pb-2"
            >
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Search projects, skills, experience..."
                className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Search
              </button>
            </form>

            <p className="text-muted-foreground text-sm">
              {query
                ? `Showing results for "${query}"`
                : "Use the search bar to find projects, services, skills, and experience."}
            </p>
          </header>

          {query.length === 0 ? (
            <section className="rounded-2xl border bg-background p-6 md:p-8 space-y-4 shadow-sm">
              <p className="text-muted-foreground">
                Example:{" "}
                <code className="font-mono">/search/?q=rag+consulting</code>
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/search/?q=ai+consulting"
                  className="inline-flex items-center rounded-full border px-4 py-2 text-sm hover:bg-accent"
                >
                  AI consulting
                </Link>
                <Link
                  href="/search/?q=rag"
                  className="inline-flex items-center rounded-full border px-4 py-2 text-sm hover:bg-accent"
                >
                  RAG
                </Link>
                <Link
                  href="/search/?q=next.js"
                  className="inline-flex items-center rounded-full border px-4 py-2 text-sm hover:bg-accent"
                >
                  Next.js
                </Link>
              </div>
            </section>
          ) : allResults.length === 0 ? (
            <section className="rounded-2xl border bg-background p-6 md:p-8 text-muted-foreground shadow-sm">
              No matches found for "{query}". Try broader terms such as{" "}
              <Link href="/search/?q=ai" className="text-primary underline">
                AI
              </Link>
              ,{" "}
              <Link
                href="/search/?q=analytics"
                className="text-primary underline"
              >
                analytics
              </Link>
              , or{" "}
              <Link
                href="/search/?q=full-stack"
                className="text-primary underline"
              >
                full-stack
              </Link>
              .
            </section>
          ) : (
            <section className="space-y-4">
              {allResults.map((result) => (
                <article
                  key={result.id}
                  className="rounded-2xl border bg-background p-5 md:p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="inline-flex rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      {result.label}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold">
                    <Link href={result.href} className="hover:underline">
                      {result.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    {result.description}
                  </p>
                </article>
              ))}
            </section>
          )}
        </div>
      </main>
      <Footer
        profile={profile}
        projects={sortedProjects}
        navigationItems={sortedNavigationItems}
      />
    </>
  );
}
