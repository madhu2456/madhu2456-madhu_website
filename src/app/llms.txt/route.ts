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
    profile,
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
    .map((p) => {
      const metric = p.impactMetrics?.[0];
      const proof = metric
        ? `${metric.value} ${metric.label}`.trim()
        : p.impactSummary || p.tagline || p.title;
      return `- [${p.title}](${siteUrl}/case-studies/${p.slug}/): ${proof}`;
    })
    .join("\n");

  const certificationLines = sortedCertifications
    .slice(0, 8)
    .map((c) => {
      const note = [c.issuer, c.issueDate].filter(Boolean).join(", ");
      return `- [${c.name}](${c.credentialUrl || `${siteUrl}/credentials/`}): ${note || "Credential"}`;
    })
    .join("\n");

  const faqLines = (pageContent?.home?.faqItems || [])
    .slice(0, 8)
    .map((item) => `### ${item.question}\n\n${item.answer}`)
    .join("\n\n");

  const statsLines = (profile.stats || [])
    .filter((s) => s.value && s.label)
    .slice(0, 6)
    .map((s) => {
      const how = s.howMeasured ? ` (${s.howMeasured})` : "";
      return `- ${s.value} — ${s.label}${how}`;
    })
    .join("\n");

  const years =
    typeof profile.yearsOfExperience === "number" &&
    profile.yearsOfExperience > 0
      ? `${profile.yearsOfExperience}+ years`
      : "9+ years";

  const body = `# Madhu Dadi

> AI engineer and RAG & analytics consultant based in Visakhapatnam, India. Full-time at Novartis; select consulting only. Optional llms.txt for tools that support the format. Canonical content is the HTML site — not a Google ranking or AI Overview file.

## Who is Madhu Dadi?

Madhu Dadi is an AI engineer and RAG & analytics consultant based in Visakhapatnam, India. He has ${years} of professional experience since May 2016 across Novartis, redBus, GroupM (WPP), and Absolinsoft (plus an MBA at IIM Amritsar, 2018–2020). He builds production AI agents, RAG systems, FastAPI/Next.js products, and marketing analytics infrastructure that connect engineering delivery to measurable business outcomes.

Availability: dual path — (1) select independent consulting / contract work when capacity allows; (2) full-time opportunities. Typical reply within 24 hours via ${siteUrl}/contact/.

Last updated: ${lastUpdatedStr}

## Citation-friendly stats

${statsLines || `- ${years} professional experience since 2016\n- Production systems across AI, analytics, and full-stack delivery`}

## Primary pages

- [Home](${siteUrl}/): Identity, services overview, case studies, how I work, FAQ, contact
- [Profile](${siteUrl}/profile/): Career history, stack, credentials
- [Services](${siteUrl}/services/): AI, RAG, agents, analytics consulting
- [Guides](${siteUrl}/guides/): Free pillar guides (GA4/BigQuery, MMM, attribution, fractional AI, RAG, consent, AI search)
- [Case studies](${siteUrl}/case-studies/): Production systems and architecture write-ups
- [AI consultant in India](${siteUrl}/ai-consultant-india/): Visakhapatnam, Hyderabad, remote delivery
- [Contact](${siteUrl}/contact/): Project inquiries (typical reply within 24 hours)
- [Credentials](${siteUrl}/credentials/): Certifications and public proof
- [Resume PDF](${siteUrl}/resume.pdf): Downloadable résumé

## How engagements work

1. Discovery — free fit check (problem, stack, constraints, success metrics).
2. Architecture & plan — written approach before heavy build spend.
3. Scoped build — thin vertical slice first; custom quote after discovery (no public rate card).
4. Ship & handover — deploy notes, docs, ownership transfer.

Select consulting only alongside full-time employment; employer IP and conflict policies are respected.

## Services

${serviceLines || `- [Services hub](${siteUrl}/services/): Consulting and implementation`}

## India service landers

- [LLM Developer in India](${siteUrl}/services/llm-developer-india/): India-intent LLM consulting lander
- [Marketing Analytics Consultant in India](${siteUrl}/services/marketing-analytics-consultant-india/): India-intent analytics lander
- [AI Consultant Visakhapatnam](${siteUrl}/services/ai-consultant-visakhapatnam/): City-intent lander (home base)
- [AI Consultant Hyderabad](${siteUrl}/services/ai-consultant-hyderabad/): City-intent lander (remote-first, on-site on request)
- [AI Consultant Bengaluru](${siteUrl}/services/ai-consultant-bengaluru/): City-intent lander (remote-first, on-site on request)
- [AI Consultant Chennai](${siteUrl}/services/ai-consultant-chennai/): City-intent lander (remote-first, on-site on request)
- [AI Consultant Mumbai](${siteUrl}/services/ai-consultant-mumbai/): City-intent lander (remote-first, on-site on request)

## Guides (pillars)

- [Guides index](${siteUrl}/guides/): All free guides in one place
- [GA4 + BigQuery setup guide (2026)](${siteUrl}/guides/ga4-bigquery/): Export, schema, costs, campaign tables
- [MMM in 2026 guide](${siteUrl}/guides/marketing-mix-modeling-2026/): Robyn vs Meridian vs custom, data needs
- [Attribution after cookies](${siteUrl}/guides/attribution-after-cookies/): MTA vs MMM vs incrementality
- [Fractional AI playbook](${siteUrl}/guides/fractional-ai-playbook/): Pricing drivers, scope, 90-day plan
- [RAG vs fine-tuning 2026](${siteUrl}/guides/rag-vs-fine-tuning-2026/): Decision framework for retrieval vs weight updates
- [Consent Mode v2 for India](${siteUrl}/guides/consent-mode-v2-india/): DPDP-aligned GA4 consent defaults and GTM notes
- [AI search optimization 2026](${siteUrl}/guides/ai-search-optimization-2026/): AEO + GEO + AIO playbook
- [Guides RSS](${siteUrl}/guides/rss.xml): RSS 2.0 feed of portfolio guides

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

${faqLines || "See the FAQ section on the homepage for current questions and answers."}

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
