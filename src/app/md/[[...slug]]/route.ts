import { getPortfolioData } from "@/lib/portfolio-data";
import {
  getIndiaServiceAlias,
  INDIA_SERVICE_ALIASES,
} from "@/lib/seo/service-aliases";
import { resolveSiteUrl } from "@/lib/site-url";

export const revalidate = 3600;

/**
 * Optional markdown twins for top portfolio URLs (llmstxt / agent convenience).
 * Canonical content remains HTML. Paths mirror the site under /md/...
 *
 * Examples:
 *   /md/ → homepage summary
 *   /md/services/rag-consultant-india → service twin
 *   /md/case-studies/adticks → case study twin
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ slug?: string[] }> },
) {
  const { slug: parts = [] } = await context.params;
  const siteUrl = resolveSiteUrl().replace(/\/$/, "");
  const data = await getPortfolioData();
  const body = await buildMarkdownTwin(parts, siteUrl, data);

  if (!body) {
    return new Response("# Not found\n\nNo markdown twin for this path.\n", {
      status: 404,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "X-Robots-Tag": "noindex, follow",
        "Cache-Control": "public, max-age=300",
      },
    });
  }

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Robots-Tag": "noindex, follow",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}

async function buildMarkdownTwin(
  parts: string[],
  siteUrl: string,
  data: Awaited<ReturnType<typeof getPortfolioData>>,
): Promise<string | null> {
  const path = parts.join("/");
  const {
    profile,
    sortedServices,
    sortedProjects,
    pageContent,
    portfolioLastUpdatedAt,
  } = data;
  const fullName =
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
    "Madhu Dadi";
  const updated = portfolioLastUpdatedAt
    ? new Date(portfolioLastUpdatedAt).toISOString().split("T")[0]
    : "2026-07-21";

  // Root twin
  if (parts.length === 0 || (parts.length === 1 && parts[0] === "")) {
    const faqs = (pageContent.home.faqItems || [])
      .slice(0, 6)
      .map((f) => `### ${f.question}\n\n${f.answer}`)
      .join("\n\n");
    const services = sortedServices
      .map(
        (s) =>
          `- [${s.title}](${siteUrl}/services/${s.slug}/) — ${s.shortDescription || ""}`,
      )
      .join("\n");
    const studies = sortedProjects
      .map(
        (p) =>
          `- [${p.title}](${siteUrl}/case-studies/${p.slug}/) — ${p.tagline || ""}`,
      )
      .join("\n");

    return `# ${fullName}

> Markdown twin of ${siteUrl}/. Canonical: HTML homepage. Last updated: ${updated}.

${pageContent.home.directAnswer?.paragraphs?.join("\n\n") || profile.shortBio || ""}

## Services

${services}

## Case studies

${studies}

## FAQ

${faqs}

## Links

- [HTML home](${siteUrl}/)
- [Profile](${siteUrl}/profile/)
- [Contact](${siteUrl}/contact/)
- [llms.txt](${siteUrl}/llms.txt)
`;
  }

  if (parts[0] === "services" && parts.length === 1) {
    const lines = sortedServices
      .map(
        (s) =>
          `## ${s.title}\n\n${s.shortDescription || ""}\n\n- HTML: ${siteUrl}/services/${s.slug}/\n- MD: ${siteUrl}/md/services/${s.slug}`,
      )
      .join("\n\n");
    const aliases = INDIA_SERVICE_ALIASES.map(
      (a) =>
        `## ${a.title}\n\n${a.shortDescription}\n\n- HTML: ${siteUrl}/services/${a.slug}/\n- MD: ${siteUrl}/md/services/${a.slug}`,
    ).join("\n\n");
    return `# Services\n\n> Twin of ${siteUrl}/services/\n\n${lines}\n\n# India landers\n\n${aliases}\n`;
  }

  if (parts[0] === "services" && parts.length === 2) {
    const slug = parts[1];
    const alias = getIndiaServiceAlias(slug);
    if (alias) {
      const faqs = alias.faqs
        .map((f) => `### ${f.question}\n\n${f.answer}`)
        .join("\n\n");
      return `# ${alias.title}

> Markdown twin of ${siteUrl}/services/${slug}/. Canonical: HTML.

${alias.directAnswer.join("\n\n")}

## Why India

${alias.whyIndia.map((b) => `- ${b}`).join("\n")}

## FAQ

${faqs}

## Links

- [HTML](${siteUrl}/services/${slug}/)
- [Full capability](${siteUrl}/services/${alias.baseServiceSlug}/)
- [Contact](${siteUrl}/contact/)
`;
    }

    const service = sortedServices.find((s) => s.slug === slug);
    if (!service) return null;
    const faqs = (service.faqs || [])
      .map((f) => `### ${f.question}\n\n${f.answer}`)
      .join("\n\n");
    const features = (service.features || []).map((f) => `- ${f}`).join("\n");
    return `# ${service.title}

> Markdown twin of ${siteUrl}/services/${slug}/. Canonical: HTML.

${service.fullDescription || service.shortDescription || ""}

## Features

${features || "_See HTML page._"}

## FAQ

${faqs || "_See HTML page._"}

## Links

- [HTML](${siteUrl}/services/${slug}/)
- [Contact](${siteUrl}/contact/)
`;
  }

  if (parts[0] === "case-studies" && parts.length === 1) {
    const lines = sortedProjects
      .map(
        (p) =>
          `## ${p.title}\n\n${p.tagline || p.impactSummary || ""}\n\n- HTML: ${siteUrl}/case-studies/${p.slug}/`,
      )
      .join("\n\n");
    return `# Case studies\n\n> Twin of ${siteUrl}/case-studies/\n\n${lines}\n`;
  }

  if (parts[0] === "case-studies" && parts.length === 2) {
    const project = sortedProjects.find((p) => p.slug === parts[1]);
    if (!project) return null;
    return `# ${project.title}

> Markdown twin of ${siteUrl}/case-studies/${project.slug}/. Author: ${fullName}.

${project.tagline || ""}

## Problem

${project.problemStatement || "_See HTML._"}

## Approach

${project.solutionApproach || "_See HTML._"}

## Impact

${project.impactSummary || "_See HTML._"}

## Stack

${(project.technologies || []).map((t) => `- ${t.name}`).join("\n") || "_See HTML._"}

## Links

- [HTML](${siteUrl}/case-studies/${project.slug}/)
- [Author profile](${siteUrl}/profile/)
`;
  }

  if (parts[0] === "profile" || path === "ai-consultant-india") {
    return `# ${fullName} — ${parts[0] === "profile" ? "Profile" : "AI consultant in India"}

> Twin of ${siteUrl}/${parts.join("/")}/.

${profile.shortBio || ""}

${profile.headline || ""}

- [HTML](${siteUrl}/${parts.join("/")}/)
- [Contact](${siteUrl}/contact/)
`;
  }

  if (parts[0] === "contact") {
    return `# Contact ${fullName}

> Twin of ${siteUrl}/contact/. Prefer the HTML form for submissions.

Email: madhu.kumar245 [at] gmail.com (see HTML page for form).

- [HTML contact form](${siteUrl}/contact/)
`;
  }

  return null;
}
