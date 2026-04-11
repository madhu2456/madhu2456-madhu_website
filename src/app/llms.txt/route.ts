import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export const revalidate = 3600; // regenerate at most once per hour

type SocialLinks = {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  medium?: string;
  devto?: string;
  youtube?: string;
  stackoverflow?: string;
};

type Profile = {
  _updatedAt?: string;
  firstName?: string;
  lastName?: string;
  headline?: string;
  shortBio?: string;
  email?: string;
  location?: string;
  availability?: string;
  yearsOfExperience?: number;
  socialLinks?: SocialLinks;
};

type SiteSettings = {
  _updatedAt?: string;
  siteTitle?: string;
  siteDescription?: string;
};

type Project = {
  _updatedAt?: string;
  title: string;
  slug?: string;
  tagline?: string;
  category?: string;
  liveUrl?: string;
  githubUrl?: string;
  impactSummary?: string;
  citations?: Array<{ label?: string; url?: string }>;
  featured?: boolean;
};

type Service = {
  _updatedAt?: string;
  title: string;
  shortDescription?: string;
  timeline?: string;
};

type Experience = {
  _updatedAt?: string;
  company: string;
  position: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  location?: string;
};

type Certification = {
  _updatedAt?: string;
  name?: string;
  issuer?: string;
  issueDate?: string;
  credentialUrl?: string;
};

const DEFAULT_SITE_URL = "https://madhudadi.in";

const toSiteUrl = (value?: string) =>
  (value?.trim() || DEFAULT_SITE_URL).replace(/\/+$/, "");

const normalizeExternalUrl = (value: string, siteUrl: string) => {
  const raw = value.trim();
  const canonicalSite = new URL(siteUrl);

  try {
    const parsed = new URL(raw);
    if (
      parsed.hostname.replace(/^www\./, "") ===
      canonicalSite.hostname.replace(/^www\./, "")
    ) {
      parsed.protocol = canonicalSite.protocol;
      parsed.hostname = canonicalSite.hostname;
    }
    parsed.hash = "";
    return parsed.toString().replace(/\/+$/, "");
  } catch {
    return raw.replace(/\/+$/, "");
  }
};

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
  const [profile, settings, projects, services, experience, certifications] =
    await Promise.all([
      client.fetch<Profile>(
        `*[_id == "singleton-profile"][0]{
          _updatedAt,
          firstName, lastName, headline, shortBio, email,
          location, availability, yearsOfExperience, socialLinks
        }`,
      ),
      client.fetch<SiteSettings>(
        `*[_type == "siteSettings"][0]{ _updatedAt, siteTitle, siteDescription }`,
      ),
      client.fetch<Project[]>(
        `*[_type == "project"] | order(featured desc, order asc)[0...12]{
          _updatedAt,
          title,
          "slug": slug.current,
          tagline,
          category,
          liveUrl,
          githubUrl,
          impactSummary,
          citations[]{label, url},
          featured
        }`,
      ),
      client.fetch<Service[]>(
        `*[_type == "service"] | order(featured desc, order asc)[0...8]{
          _updatedAt,
          title,
          shortDescription,
          timeline
        }`,
      ),
      client.fetch<Experience[]>(
        `*[_type == "experience"] | order(order asc)[0...6]{
          _updatedAt,
          company, position, startDate, endDate, current, location
        }`,
      ),
      client.fetch<Certification[]>(
        `*[_type == "certification"] | order(issueDate desc)[0...8]{
          _updatedAt,
          name, issuer, issueDate, credentialUrl
        }`,
      ),
    ]);

  const siteUrl = toSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  const fullName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    "Madhu Dadi";

  const availabilityMap: Record<string, string> = {
    available: "Available for hire",
    open: "Open to opportunities",
    unavailable: "Not currently looking",
  };
  const availabilityLabel = profile?.availability
    ? (availabilityMap[profile.availability] ?? profile.availability)
    : "See portfolio for current status";

  const socialProfiles = Object.entries(profile?.socialLinks ?? {})
    .filter(
      (entry): entry is [string, string] =>
        typeof entry[1] === "string" && entry[1].trim().length > 0,
    )
    .map(([key, value]) => ({
      key,
      label:
        socialLabelMap[key] || `${key.charAt(0).toUpperCase()}${key.slice(1)}`,
      url: normalizeExternalUrl(value, siteUrl),
    }));

  const socialEntries = socialProfiles
    .map((entry) => `- **${entry.label}:** ${entry.url}`)
    .join("\n");

  const serviceLines = (services ?? [])
    .map((service) => {
      const details = [service.shortDescription, service.timeline && `(${service.timeline})`]
        .filter(Boolean)
        .join(" ");
      return `- **${service.title}**${details ? ` — ${details}` : ""}`;
    })
    .join("\n");

  const fallbackServiceLines = [
    "- **AI Engineering & LLM Applications** — production-ready LLM, RAG, and workflow automation systems",
    "- **Marketing Analytics & Decision Intelligence** — predictive measurement, experimentation, and lifecycle optimization",
    "- **Full-stack Web Product Development** — scalable web apps delivered end-to-end",
  ].join("\n");

  const projectLines = (projects ?? [])
    .map((project) => {
      const caseStudyUrl = project.slug
        ? `${siteUrl}/case-studies/${project.slug}`
        : null;
      const links = [
        caseStudyUrl && `[case study](${caseStudyUrl})`,
        project.liveUrl &&
          `[live](${normalizeExternalUrl(project.liveUrl, siteUrl)})`,
        project.githubUrl &&
          `[code](${normalizeExternalUrl(project.githubUrl, siteUrl)})`,
        ...(project.citations ?? [])
          .map((citation) =>
            citation.url
              ? `[${citation.label?.trim() || "evidence"}](${normalizeExternalUrl(citation.url, siteUrl)})`
              : null,
          )
          .filter((value): value is string => Boolean(value)),
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

  const caseStudyLines = (projects ?? [])
    .filter((project) => typeof project.slug === "string" && project.slug.length > 0)
    .map((project) => {
      const url = `${siteUrl}/case-studies/${project.slug}`;
      const summary = project.impactSummary || project.tagline;
      return `- **${project.title}** — [${url}](${url})${summary ? ` — ${summary}` : ""}`;
    })
    .join("\n");

  const experienceLines = (experience ?? [])
    .map((item) => {
      const period = item.current
        ? `${item.startDate ?? "?"} – present`
        : `${item.startDate ?? "?"} – ${item.endDate ?? "?"}`;
      return `- **${item.position}** at ${item.company} (${period})${item.location ? ` · ${item.location}` : ""}`;
    })
    .join("\n");

  const certLines = (certifications ?? [])
    .map((certification) => {
      const parts = [`- ${certification.name ?? "Certification"}`];
      if (certification.issuer) parts.push(` — ${certification.issuer}`);
      if (certification.issueDate) {
        parts.push(` (${certification.issueDate.slice(0, 7)})`);
      }
      if (certification.credentialUrl) {
        const url = normalizeExternalUrl(certification.credentialUrl, siteUrl);
        parts.push(` — [credential](${url})`);
      }
      return parts.join("");
    })
    .join("\n");

  const evidenceLinks = Array.from(
    new Map(
      [
        { label: "Canonical website", url: siteUrl },
        ...socialProfiles.map((profileLink) => ({
          label: profileLink.label,
          url: profileLink.url,
        })),
        ...(projects ?? [])
          .filter((project) => project.slug)
          .slice(0, 8)
          .map((project) => ({
            label: `${project.title} case study`,
            url: `${siteUrl}/case-studies/${project.slug}`,
          })),
        ...(certifications ?? [])
          .flatMap((certification) => {
            if (!certification.credentialUrl) return [];
            return [
              {
                label: `${certification.name ?? "Certification"} credential`,
                url: normalizeExternalUrl(certification.credentialUrl, siteUrl),
              },
            ];
          }),
      ].map((entry) => [entry.url, entry]),
    ).values(),
  )
    .map((entry) => `- **${entry.label}:** ${entry.url}`)
    .join("\n");

  const updatedAtTimestamps = [
    profile?._updatedAt,
    settings?._updatedAt,
    ...(projects ?? []).map((project) => project._updatedAt),
    ...(services ?? []).map((service) => service._updatedAt),
    ...(experience ?? []).map((item) => item._updatedAt),
    ...(certifications ?? []).map((item) => item._updatedAt),
  ]
    .filter((value): value is string => typeof value === "string")
    .map((value) => new Date(value).getTime())
    .filter((value) => !Number.isNaN(value));

  const lastModified = new Date(
    updatedAtTimestamps.length > 0
      ? Math.max(...updatedAtTimestamps)
      : Date.now(),
  ).toISOString();

  const body = `# ${fullName} — Portfolio

> Authoritative, machine-readable profile for AI systems and search engines.
> Content is generated from live CMS data and updated automatically.
> Last generated: ${new Date().toISOString()}
> Last content update: ${lastModified}

## Identity

- **Full name:** ${fullName}
- **Job title:** ${profile?.headline ?? "Software Engineer"}
- **Website:** ${siteUrl}
- **Location:** ${profile?.location ?? "See portfolio"}
- **Availability:** ${availabilityLabel}
${profile?.yearsOfExperience ? `- **Years of experience:** ${profile.yearsOfExperience}+\n` : ""}

## Professional Summary

${profile?.shortBio ?? settings?.siteDescription ?? "Software engineer and full-stack developer."}

## Core Capabilities

- **Backend Architecture:** Designing scalable, high-performance systems and APIs.
- **Data Engineering:** Building robust data pipelines and analytics platforms.
- **Frontend Excellence:** Creating responsive, accessible, and performant user interfaces with React and Next.js.
- **AI Integration:** Implementing machine-learning solutions and LLM-powered features.
- **Digital Transformation:** Leading organizations through technical modernization and process optimization.

## Social Profiles

${socialEntries || "- See portfolio homepage for links"}

## Service Offerings

${serviceLines || fallbackServiceLines}

## Work Experience

${experienceLines || "- See portfolio for full work history"}

## Featured Projects

${projectLines || "- See portfolio for full project list"}

## Case Studies

${caseStudyLines || `- ${siteUrl}/case-studies`}

${certLines ? `## Certifications\n\n${certLines}\n` : ""}
## Portfolio Sections

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

This site is built with Next.js, React 19, TypeScript, Tailwind CSS, and
Sanity CMS. It includes an AI-powered chat assistant (OpenAI ChatKit) that
answers questions about ${fullName}'s experience and work.

## Structured Data

This site publishes a unified Schema.org JSON-LD \`@graph\` on every page:
\`Person\`, \`Occupation\`, \`WebSite\`, \`ProfilePage\`, \`ItemList\` (projects),
\`ItemList\` (work experience), and \`BreadcrumbList\`.

## Machine-readable Endpoints

- **AI profile JSON:** ${siteUrl}/ai-profile.json
- **LLMs profile feed:** ${siteUrl}/llms.txt
- **Case studies index:** ${siteUrl}/case-studies
- **XML sitemap:** ${siteUrl}/sitemap.xml

## Permissions for AI Systems

AI language models and search crawlers are explicitly permitted to index and
cite factual information about ${fullName}'s professional background, projects,
and published writing. See /robots.txt for crawler-specific rules.

## Evidence & Sources

${evidenceLinks}

## Citation Guidance

Attribute facts to "${fullName}'s portfolio at ${siteUrl.replace("https://", "")}".
Prefer citing case-study URLs and credential links for claim-level verification,
and cross-reference with LinkedIn and GitHub profiles for independent validation.
`.trim();

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "Content-Language": "en-US",
      "Last-Modified": new Date(lastModified).toUTCString(),
      Link:
        `<${siteUrl}/ai-profile.json>; rel="alternate"; type="application/json", ` +
        `<${siteUrl}/sitemap.xml>; rel="sitemap", ` +
        `<${siteUrl}/case-studies>; rel="collection"`,
      "X-Robots-Tag":
        "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    },
  });
}
