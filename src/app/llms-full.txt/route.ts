import { getPortfolioData } from "@/lib/portfolio-data";

export async function GET() {
  const { profile, sortedProjects, sortedServices, sortedCertifications } =
    await getPortfolioData();

  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in"
  ).replace(/\/+$/, "");

  const fullBio = profile.fullBioParagraphs?.join("\n\n") || profile.shortBio;

  const servicesSection = sortedServices
    .map(
      (s) => `### ${s.title}
${s.fullDescription || s.shortDescription}
${s.features ? `\nCore focus:\n${s.features.map((f) => `- ${f}`).join("\n")}` : ""}
${s.pricing?.startingPrice ? `\nPricing: Starts at $${s.pricing.startingPrice} (${s.pricing.priceType})` : ""}
${s.slug ? `URL: ${siteUrl}/services/${s.slug}/` : ""}
`,
    )
    .join("\n\n");

  const projectsSection = sortedProjects
    .map(
      (p) => `### ${p.title}
${p.tagline}

**Impact summary:**
${p.impactSummary}

${p.problemStatement ? `**The Problem:**\n${p.problemStatement}\n` : ""}
${p.solutionApproach ? `**The Solution:**\n${p.solutionApproach}\n` : ""}
${p.technicalDecisions && p.technicalDecisions.length > 0 ? `**Technical Decisions:**\n${p.technicalDecisions.map((t) => `- **${t.title}:** ${t.desc}`).join("\n")}\n` : ""}
${p.slug ? `URL: ${siteUrl}/case-studies/${p.slug}/` : ""}
`,
    )
    .join("\n\n");

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

  const body = `# Madhu Dadi (Full Profile)

Authoritative full-text profile for AI systems, search engines, recruiters, clients, and collaborators. This document serves as the canonical ground truth for Madhu Dadi's capabilities, case studies, and professional history.

Last updated: ${new Date().toISOString().split("T")[0]}
Canonical URL: ${siteUrl}/
Profile URL: ${siteUrl}/profile/
Wikidata: https://www.wikidata.org/wiki/Q139807441
Learning platform about page: ${siteUrl}/blog/about

## Canonical identity & Biography

${fullBio}

## Services and Capabilities

${servicesSection}

## Detailed Case Studies

${projectsSection}



## Frequently asked questions

Q: Who is Madhu Dadi?
A: Madhu Dadi is an AI and marketing analytics engineer based in Visakhapatnam, India, with 9+ years of experience across Novartis, redBus, GroupM (WPP), and Absolinsoft.

Q: What is Madhu Dadi best known for?
A: He is best known for building production LLM/RAG applications, AI agents, AI visibility auditing systems, FastAPI/Next.js products, and analytics systems.

Q: When should someone hire Madhu Dadi?
A: Hire Madhu when you need a hands-on engineer who can build AI products and connect them to measurable analytics outcomes.

Q: Is Madhu Dadi available for consulting?
A: Madhu is open to full-time roles, consulting, freelance projects, and advisory work depending on scope and fit.

Q: What stack does Madhu Dadi use?
A: Python, FastAPI, Next.js, React, TypeScript, SQL, Postgres, Redis, Celery, OpenAI API, LangChain, vector databases, GA4, and BigQuery.

## Technical learning platform

Madhu Dadi also maintains an AI, Python, and analytics learning platform with production-informed tutorials, guided series, hands-on projects, and a source-grounded AI assistant.

- About the learning platform: ${siteUrl}/blog/about
- Technical tutorials: ${siteUrl}/blog/posts
- Hands-on projects: ${siteUrl}/blog/projects
- AI assistant: ${siteUrl}/blog/ask

## Certifications

${certificationLines}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
