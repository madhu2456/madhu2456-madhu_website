import { discoveryBodyResponse } from "@/lib/http-conditional";
import { getPortfolioData } from "@/lib/portfolio-data";
import { resolveSiteUrl } from "@/lib/site-url";

/**
 * Root /llms.txt per https://llmstxt.org/
 * Optional convenience for agents that voluntarily support the format.
 * Not a Google AI Overviews / ranking signal (Search Central, 2026).
 */
export async function GET(request: Request) {
  const {
    sortedCertifications,
    portfolioLastUpdatedAt,
    sortedProjects,
    sortedServices,
    pageContent,
  } = await getPortfolioData();
  const siteUrl = resolveSiteUrl().replace(/\/$/, "");
  const lastModifiedAt = portfolioLastUpdatedAt || "2026-06-06T00:00:00.000Z";
  const lastUpdatedStr = new Date(lastModifiedAt).toISOString().split("T")[0];

  const serviceLines = sortedServices
    .map(
      (s) =>
        `- [${s.title}](${siteUrl}/services/${s.slug}/): ${s.shortDescription || s.title}`,
    )
    .join("\n");

  const caseStudyLines = sortedProjects
    .map(
      (p) =>
        `- [${p.title}](${siteUrl}/case-studies/${p.slug}/): ${p.tagline || p.impactSummary || p.title}`,
    )
    .join("\n");

  const certificationLines = sortedCertifications
    .slice(0, 8)
    .map((c) => {
      const note = [c.issuer, c.issueDate].filter(Boolean).join(", ");
      return `- [${c.name}](${c.credentialUrl || `${siteUrl}/credentials/`}): ${note || "Credential"}`;
    })
    .join("\n");

  const faqLines = (pageContent?.home?.faqItems || [])
    .slice(0, 6)
    .map((item) => `- ${item.question}: ${item.answer}`)
    .join("\n");

  const body = `# Madhu Dadi

> AI engineer and RAG & analytics consultant (Visakhapatnam, India). Optional llms.txt for tools that support the format. Canonical content is the HTML site — not a Google ranking or AI Overview file.

Madhu Dadi builds production AI agents, RAG systems, FastAPI/Next.js products, and marketing analytics infrastructure, with 9+ years across Novartis, redBus, GroupM (WPP), and Absolinsoft.

Last updated: ${lastUpdatedStr}

## Primary pages

- [Home](${siteUrl}/): Identity, services overview, case studies, FAQ, contact
- [Profile](${siteUrl}/profile/): Career history, stack, credentials
- [Services](${siteUrl}/services/): AI, RAG, agents, analytics consulting
- [Case studies](${siteUrl}/case-studies/): Production systems and architecture write-ups
- [AI consultant in India](${siteUrl}/ai-consultant-india/): Visakhapatnam, Hyderabad, remote delivery
- [Contact](${siteUrl}/contact/): Project inquiries (typical reply within 24 hours)
- [Credentials](${siteUrl}/credentials/): Certifications and public proof
- [Resume PDF](${siteUrl}/resume.pdf): Downloadable résumé

## Services

${serviceLines || `- [Services hub](${siteUrl}/services/): Consulting and implementation`}

## India service landers

- [LLM Developer in India](${siteUrl}/services/llm-developer-india/): India-intent LLM consulting lander
- [Marketing Analytics Consultant in India](${siteUrl}/services/marketing-analytics-consultant-india/): India-intent analytics lander
- [AI Consultant Visakhapatnam](${siteUrl}/services/ai-consultant-visakhapatnam/): City-intent lander

## Guides (pillars)

- [GA4 + BigQuery setup guide (2026)](${siteUrl}/guides/ga4-bigquery/): Export, schema, costs, campaign tables
- [MMM in 2026 guide](${siteUrl}/guides/marketing-mix-modeling-2026/): Robyn vs Meridian vs custom, data needs

## Commercial keyword landers

- [GA4 Consultant](${siteUrl}/ga4-consultant/): GA4 audit, migration, sGTM, BigQuery
- [Google Analytics Consultant](${siteUrl}/google-analytics-consultant/): Independent GA4/GTM/BigQuery consulting
- [Marketing Analytics Consultant](${siteUrl}/marketing-analytics-consultant/): Attribution, CLV, measurement systems
- [Marketing Mix Modeling Consultant](${siteUrl}/marketing-mix-modeling-consultant/): MMM, media mix, incrementality inputs
- [Attribution Modeling Consultant](${siteUrl}/attribution-modeling-consultant/): Post-cookie attribution, GA4 paths, tests
- [Fractional AI Consultant](${siteUrl}/fractional-ai-consultant/): Retainer AI roadmap, RAG, evals, LLM ops
- [AI Consultant for Startups](${siteUrl}/ai-consultant-for-startups/): Seed–Series B pilots, RAG/LLM shipping
- [AI Automation Consultant](${siteUrl}/ai-automation-consultant/): Agent workflows, copilots, production automation

## Optional markdown twins

- [Homepage MD](${siteUrl}/md/): Markdown twin of the homepage (noindex; HTML is canonical)
- [Services MD index](${siteUrl}/md/services): Markdown index of services

## Case studies

${caseStudyLines || `- [Case studies hub](${siteUrl}/case-studies/): Selected work`}

## Learning platform (blog)

- [Blog home](${siteUrl}/blog): AI, Python, analytics tutorials
- [Posts](${siteUrl}/blog/posts): Technical articles
- [About the learning platform](${siteUrl}/blog/about): Platform overview
- [Ask AI](${siteUrl}/blog/ask): Source-grounded assistant over blog content
- [Blog llms.txt](${siteUrl}/blog/llms.txt): Blog-scoped file list

## Certifications

${certificationLines || `- [Credentials](${siteUrl}/credentials/): Full list`}

## FAQ (visible on homepage)

${faqLines || "- See the FAQ section on the homepage for current questions and answers."}

## Optional

- [llms-full.txt](${siteUrl}/llms-full.txt): Longer biography and service detail
- [ai-profile.json](${siteUrl}/ai-profile.json): Site experiment (not an industry standard)
- [Wikidata](https://www.wikidata.org/wiki/Q139807441): Entity page
- [Privacy (portfolio)](${siteUrl}/privacy/): Portfolio privacy policy
- [Privacy (blog)](${siteUrl}/blog/privacy-policy): Learning platform privacy
- [Terms (blog)](${siteUrl}/blog/terms): Learning platform terms
`;

  return discoveryBodyResponse(request, body, {
    contentType: "text/plain; charset=utf-8",
    lastModifiedAt,
  });
}
