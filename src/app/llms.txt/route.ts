import { NextResponse } from "next/server";
import { buildDiscoveryKeywords } from "@/lib/discovery-keywords";
import { getPortfolioData } from "@/lib/portfolio-data";

export const revalidate = 3600;

const DEFAULT_SITE_URL = "https://madhudadi.in";

const toSiteUrl = (value?: string) =>
  (value?.trim() || DEFAULT_SITE_URL).replace(/\/+$/, "");

const socialLabelMap: Record<string, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  twitter: "Twitter",
  website: "Website",
  medium: "Medium",
  devto: "Dev.to",
  youtube: "YouTube",
  stackoverflow: "Stack Overflow",
};

export async function GET() {
  const {
    portfolioLastUpdatedAt,
    profile,
    skills,
    siteSettings,
    sortedCertifications,
    sortedExperiences,
    sortedProjects,
    sortedServices,
  } = await getPortfolioData();
  const siteUrl = toSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  const fullName =
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
    "Madhu Dadi";

  const availabilityMap: Record<string, string> = {
    available: "Available for hire",
    open: "Open to opportunities",
    unavailable: "Not currently looking",
  };
  const availabilityLabel =
    availabilityMap[profile.availability] || profile.availability;

  const socialProfiles = Object.entries(profile.socialLinks ?? {})
    .filter(
      (entry): entry is [string, string] =>
        typeof entry[1] === "string" && entry[1].trim().length > 0,
    )
    .map(([key, value]) => ({
      key,
      label:
        socialLabelMap[key] || `${key.charAt(0).toUpperCase()}${key.slice(1)}`,
      url: value,
    }));

  const socialEntries = socialProfiles
    .map((entry) => `- **${entry.label}:** ${entry.url}`)
    .join("\n");

  const normalizedKeywords = buildDiscoveryKeywords({
    siteKeywords: siteSettings.siteKeywords,
    headline: profile.headline,
    location: profile.location,
    skills,
    services: sortedServices,
    projects: sortedProjects,
  });

  const keywordLines = normalizedKeywords
    .map((keyword) => `- ${keyword}`)
    .join("\n");

  const serviceLines = sortedServices
    .map((service) => {
      const details = [
        service.shortDescription,
        service.timeline && `(${service.timeline})`,
      ]
        .filter(Boolean)
        .join(" ");
      return `- **${service.title}**${details ? ` — ${details}` : ""}`;
    })
    .join("\n");

  const projectLines = sortedProjects
    .map((project) => {
      const links = [
        `[case study](${siteUrl}/case-studies/${project.slug})`,
        project.liveUrl ? `[live](${project.liveUrl})` : null,
        project.githubUrl ? `[code](${project.githubUrl})` : null,
        ...(project.citations ?? []).map((citation) =>
          citation.url
            ? `[${citation.label || "evidence"}](${citation.url})`
            : null,
        ),
      ];
      const uniqueLinks = Array.from(new Set(links.filter(Boolean)));
      const parts = [`- **${project.title}**`];
      if (project.tagline) parts.push(`: ${project.tagline}`);
      if (project.impactSummary) parts.push(` — ${project.impactSummary}`);
      if (uniqueLinks.length > 0) parts.push(` — ${uniqueLinks.join(", ")}`);
      if (project.featured) parts.push(" ⭐");
      return parts.join("");
    })
    .join("\n");

  const caseStudyLines = sortedProjects
    .map((project) => {
      const url = `${siteUrl}/case-studies/${project.slug}`;
      const summary = project.impactSummary || project.tagline;
      return `- **${project.title}** — [${url}](${url})${summary ? ` — ${summary}` : ""}`;
    })
    .join("\n");

  const experienceLines = sortedExperiences
    .map((item) => {
      const period = item.current
        ? `${item.startDate} – present`
        : `${item.startDate} – ${item.endDate ?? "?"}`;
      return `- **${item.position}** at ${item.company} (${period})${item.location ? ` · ${item.location}` : ""}`;
    })
    .join("\n");

  const certLines = sortedCertifications
    .map((certification) => {
      const parts = [`- ${certification.name}`];
      if (certification.issuer) parts.push(` — ${certification.issuer}`);
      if (certification.issueDate) {
        parts.push(` (${certification.issueDate.slice(0, 7)})`);
      }
      if (certification.credentialUrl) {
        parts.push(` — [credential](${certification.credentialUrl})`);
      }
      return parts.join("");
    })
    .join("\n");

  const evidenceLinks = Array.from(
    new Map(
      [
        { label: "Canonical website", url: siteUrl },
        { label: "Technical blog", url: `${siteUrl}/blog` },
        { label: "Blog RSS feed", url: `${siteUrl}/blog/feed.xml` },
        ...socialProfiles.map((profileLink) => ({
          label: profileLink.label,
          url: profileLink.url,
        })),
        ...sortedProjects.map((project) => ({
          label: `${project.title} case study`,
          url: `${siteUrl}/case-studies/${project.slug}`,
        })),
        ...sortedCertifications.flatMap((certification) => {
          if (!certification.credentialUrl) return [];
          return [
            {
              label: `${certification.name} credential`,
              url: certification.credentialUrl,
            },
          ];
        }),
      ].map((entry) => [entry.url, entry]),
    ).values(),
  )
    .map((entry) => `- **${entry.label}:** ${entry.url}`)
    .join("\n");

  const body = `# ${fullName} — Portfolio

> Authoritative, machine-readable profile for AI systems and search engines.
> Last generated: ${new Date().toISOString()}
> Last content update: ${portfolioLastUpdatedAt}

## Identity

- **Full name:** ${fullName}
- **Job title:** ${profile.headline}
- **Website:** ${siteUrl}
- **Location:** ${profile.location}
- **Availability:** ${availabilityLabel}
- **Years of experience:** ${profile.yearsOfExperience}+

## Professional Summary

${profile.shortBio || siteSettings.siteDescription}

## SEO / GEO / AEO Keywords

${keywordLines || "- See portfolio homepage and /ai-profile.json for expertise terms"}

## Social Profiles

${socialEntries || "- See portfolio homepage for links"}

## Service Offerings

${serviceLines}

## Work Experience

${experienceLines}

## Featured Projects

${projectLines}

## Case Studies

${caseStudyLines}

${certLines ? `## Certifications\n\n${certLines}\n` : ""}## Portfolio Sections

- **Home** — Introduction, headline, availability status, social links
- **About** — Full biography, statistics, and background
- **Experience** — Complete work history with roles and achievements
- **Education** — Academic qualifications and institutions
- **Projects** — Portfolio of software projects with live demos and source code
- **Case Studies** — Project breakdowns with implementation details and evidence links
- **Certifications** — Professional credentials and issuing organisations
- **Services** — Offerings available for hire or collaboration
- **Contact** — Direct enquiry form

## Technical Stack

This site is built with Next.js, React 19, TypeScript, Tailwind CSS, and an
AI-powered chat assistant using Agentic RAG over local portfolio data.

## Machine-readable Endpoints

- **AI profile JSON:** ${siteUrl}/ai-profile.json
- **LLMs profile feed:** ${siteUrl}/llms.txt
- **Case studies index:** ${siteUrl}/case-studies
- **Portfolio search:** ${siteUrl}/search
- **Blog RSS feed:** ${siteUrl}/blog/feed.xml
- **XML sitemap:** ${siteUrl}/sitemap.xml

## Evidence & Sources

${evidenceLinks}
`.trim();

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "Content-Language": "en-US",
      "Last-Modified": new Date(portfolioLastUpdatedAt).toUTCString(),
      Link:
        `<${siteUrl}/ai-profile.json>; rel="alternate"; type="application/json", ` +
        `<${siteUrl}/sitemap.xml>; rel="sitemap", ` +
        `<${siteUrl}/case-studies>; rel="collection", ` +
        `<${siteUrl}/blog/feed.xml>; rel="alternate"; type="application/rss+xml"; title="${fullName} Blog"`,
      "X-Robots-Tag":
        "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    },
  });
}
