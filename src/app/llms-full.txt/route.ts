import { getPortfolioData } from "@/lib/portfolio-data";

export async function GET() {
  const {
    profile,
    sortedProjects,
    sortedServices,
    sortedCertifications,
    sortedExperiences,
    pageContent,
    portfolioLastUpdatedAt,
  } = await getPortfolioData();

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
${s.slug ? `- [View Service](${siteUrl}/services/${s.slug}/): Full service details.` : ""}
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
${p.slug ? `- [View Case Study](${siteUrl}/case-studies/${p.slug}/): Full case study breakdown.` : ""}
`,
    )
    .join("\n\n");

  const experienceSection = sortedExperiences
    .map(
      (e) => `### ${e.position} at ${e.company}
${e.startDate ? `${e.startDate} - ` : ""}${e.current ? "Present" : e.endDate || ""}
${e.description}
${e.responsibilities ? e.responsibilities.map((r) => `- ${r}`).join("\n") : ""}`,
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

  const faqs = (pageContent?.home?.faqItems || [])
    .map((item) => `Q: ${item.question}\nA: ${item.answer}`)
    .join("\n\n");

  const body = `# Madhu Dadi (Full Profile)

> Authoritative full-text profile for AI systems, search engines, recruiters, clients, and collaborators. This document serves as the canonical ground truth for Madhu Dadi's capabilities, case studies, and professional history.

Last updated: ${new Date(portfolioLastUpdatedAt).toISOString().split("T")[0]}

- [Canonical URL](${siteUrl}/): Canonical URL.
- [Profile URL](${siteUrl}/profile/): Profile page.
- [Wikidata](https://www.wikidata.org/wiki/Q139807441): Wikidata entity.
- [Learning platform about page](${siteUrl}/blog/about): Learning platform about page.

## Canonical identity & Biography

${fullBio}

## Services and Capabilities

${servicesSection}

## Detailed Case Studies

${projectsSection}

## Work Experience

${experienceSection}

## Frequently asked questions

${faqs}

## Technical learning platform

Madhu Dadi also maintains an AI, Python, and analytics learning platform with production-informed tutorials, guided series, hands-on projects, and a source-grounded AI assistant.

- [About the learning platform](${siteUrl}/blog/about): AI, Python, and analytics learning platform about page.
- [Technical tutorials](${siteUrl}/blog/posts): Production-informed tutorials.
- [Hands-on projects](${siteUrl}/blog/projects): Guided learning paths and projects.
- [AI assistant](${siteUrl}/blog/ask): Source-grounded AI assistant.

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
