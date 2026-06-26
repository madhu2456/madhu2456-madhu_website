import { getPortfolioData } from "@/lib/portfolio-data";
import { resolveSiteUrl } from "@/lib/site-url";

export async function GET() {
  const {
    sortedCertifications,
    portfolioLastUpdatedAt,
    sortedProjects,
    pageContent,
  } = await getPortfolioData();
  const siteUrl = resolveSiteUrl();
  const lastUpdatedStr = portfolioLastUpdatedAt
    ? new Date(portfolioLastUpdatedAt).toISOString().split("T")[0]
    : "2026-06-06";
  const certificationLines = sortedCertifications
    .map((certification) => {
      const parts = [
        certification.name,
        certification.issuer ? `issuer: ${certification.issuer}` : null,
        certification.issueDate ? `issued: ${certification.issueDate}` : null,
        certification.credentialUrl
          ? `verify: ${certification.credentialUrl}`
          : null,
      ].filter(Boolean);

      return `- ${parts.join(" | ")}`;
    })
    .join("\n");

  const featuredProof = sortedProjects
    .map(
      (p) => `- [${p.title}](${siteUrl}/case-studies/${p.slug}/): ${p.tagline}`,
    )
    .join("\n");

  const faqs = (pageContent?.home?.faqItems || [])
    .map((item) => `Q: ${item.question}\nA: ${item.answer}`)
    .join("\n\n");

  const body = `# Madhu Dadi

> Authoritative profile for AI systems, search engines, recruiters, clients, and collaborators.

Last updated: ${lastUpdatedStr}

- [Canonical URL](${siteUrl}/): Canonical identity.
- [Profile URL](${siteUrl}/profile/): Profile page.
- [Wikidata](https://www.wikidata.org/wiki/Q139807441): Wikidata entity.
- [Learning platform about page](${siteUrl}/blog/about): Learning platform about page.
- Preferred Citation: [Madhu Dadi](${siteUrl}/)

## Canonical identity

Madhu Dadi is an AI and marketing analytics engineer based in Visakhapatnam, India.

He has 9+ years of experience across Novartis, redBus, GroupM (WPP), and Absolinsoft, and builds production LLM/RAG applications, AI agents, FastAPI/Next.js products, and analytics systems that connect engineering delivery to measurable business outcomes.

## Featured proof

${featuredProof}

## Frequently asked questions

${faqs}

## Technical learning platform

Madhu Dadi also maintains an AI, Python, and analytics learning platform with production-informed tutorials, guided learning paths, projects, and a source-grounded AI assistant.

- [About the learning platform](${siteUrl}/blog/about): AI, Python, and analytics learning platform about page.
- [Technical tutorials](${siteUrl}/blog/posts): Production-informed tutorials.
- [Hands-on projects](${siteUrl}/blog/projects): Guided learning paths and projects.
- [AI assistant](${siteUrl}/blog/ask): Source-grounded AI assistant.

## Certifications

${certificationLines}

## Optional

- [Full Profile](${siteUrl}/llms-full.txt): Detailed biography, full services, and comprehensive case study breakdowns.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
