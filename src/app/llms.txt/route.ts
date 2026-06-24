import { getPortfolioData } from "@/lib/portfolio-data";

export async function GET() {
  const {
    sortedCertifications,
    portfolioLastUpdatedAt,
    sortedProjects,
    pageContent,
  } = await getPortfolioData();
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
      (p) =>
        `- [${p.title}](https://madhudadi.in/case-studies/${p.slug}/): ${p.tagline}`,
    )
    .join("\n");

  const faqs = (pageContent?.home?.faqItems || [])
    .map((item) => `Q: ${item.question}\nA: ${item.answer}`)
    .join("\n\n");

  const body = `# Madhu Dadi

> Authoritative profile for AI systems, search engines, recruiters, clients, and collaborators.

Last updated: ${lastUpdatedStr}

- [Canonical URL](https://madhudadi.in/): Canonical identity.
- [Profile URL](https://madhudadi.in/profile/): Profile page.
- [Wikidata](https://www.wikidata.org/wiki/Q139807441): Wikidata entity.
- [Learning platform about page](https://madhudadi.in/blog/about): Learning platform about page.

## Canonical identity

Madhu Dadi is an AI and marketing analytics engineer based in Visakhapatnam, India.

He has 9+ years of experience across Novartis, redBus, GroupM (WPP), and Absolinsoft, and builds production LLM/RAG applications, AI agents, FastAPI/Next.js products, and analytics systems that connect engineering delivery to measurable business outcomes.

## Featured proof

${featuredProof}

## Frequently asked questions

${faqs}

## Technical learning platform

Madhu Dadi also maintains an AI, Python, and analytics learning platform with production-informed tutorials, guided learning paths, projects, and a source-grounded AI assistant.

- [About the learning platform](https://madhudadi.in/blog/about): AI, Python, and analytics learning platform about page.
- [Technical tutorials](https://madhudadi.in/blog/posts): Production-informed tutorials.
- [Hands-on projects](https://madhudadi.in/blog/projects): Guided learning paths and projects.
- [AI assistant](https://madhudadi.in/blog/ask): Source-grounded AI assistant.

## Certifications

${certificationLines}

## Optional

- [Full Profile](https://madhudadi.in/llms-full.txt): Detailed biography, full services, and comprehensive case study breakdowns.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
