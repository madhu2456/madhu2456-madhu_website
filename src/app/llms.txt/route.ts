import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export const revalidate = 3600; // regenerate at most once per hour

export async function GET() {
  const [profile, settings, projects, experience, certifications] =
    await Promise.all([
      client.fetch<{
        firstName?: string;
        lastName?: string;
        headline?: string;
        shortBio?: string;
        email?: string;
        location?: string;
        availability?: string;
        yearsOfExperience?: number;
        socialLinks?: {
          github?: string;
          linkedin?: string;
          twitter?: string;
          website?: string;
          medium?: string;
          devto?: string;
          youtube?: string;
          stackoverflow?: string;
        };
      }>(
        `*[_id == "singleton-profile"][0]{
          firstName, lastName, headline, shortBio, email,
          location, availability, yearsOfExperience, socialLinks
        }`,
      ),
      client.fetch<{ siteTitle?: string; siteDescription?: string }>(
        `*[_type == "siteSettings"][0]{ siteTitle, siteDescription }`,
      ),
      client.fetch<
        Array<{
          title: string;
          tagline?: string;
          category?: string;
          liveUrl?: string;
          githubUrl?: string;
          featured?: boolean;
        }>
      >(
        `*[_type == "project"] | order(featured desc, order asc)[0...10]{
          title, tagline, category, liveUrl, githubUrl, featured
        }`,
      ),
      client.fetch<
        Array<{
          company: string;
          position: string;
          startDate?: string;
          endDate?: string;
          current?: boolean;
          location?: string;
        }>
      >(
        `*[_type == "experience"] | order(order asc)[0...6]{
          company, position, startDate, endDate, current, location
        }`,
      ),
      client.fetch<Array<{ title?: string; issuer?: string; date?: string }>>(
        `*[_type == "certification"] | order(date desc)[0...8]{
          title, issuer, date
        }`,
      ),
    ]);

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://madhudadi.in";
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

  // Build social links section only for links that exist
  const socialEntries = Object.entries(profile?.socialLinks ?? {})
    .filter(([ , v]) => typeof v === "string" && v.length > 0)
    .map(([k, v]) => `- **${k.charAt(0).toUpperCase() + k.slice(1)}:** ${v}`)
    .join("\n");

  // Build projects section
  const projectLines = (projects ?? [])
    .map((p) => {
      const parts = [`- **${p.title}**`];
      if (p.tagline) parts.push(`: ${p.tagline}`);
      const links = [p.liveUrl && `[live](${p.liveUrl})`, p.githubUrl && `[code](${p.githubUrl})`].filter(Boolean).join(", ");
      if (links) parts.push(` — ${links}`);
      if (p.featured) parts.push(" ⭐");
      return parts.join("");
    })
    .join("\n");

  // Build experience section
  const experienceLines = (experience ?? [])
    .map((e) => {
      const period = e.current
        ? `${e.startDate ?? "?"} – present`
        : `${e.startDate ?? "?"} – ${e.endDate ?? "?"}`;
      return `- **${e.position}** at ${e.company} (${period})${e.location ? ` · ${e.location}` : ""}`;
    })
    .join("\n");

  // Build certifications section
  const certLines = (certifications ?? [])
    .map((c) => {
      const parts = [`- ${c.title ?? "Certification"}`];
      if (c.issuer) parts.push(` — ${c.issuer}`);
      if (c.date) parts.push(` (${c.date.slice(0, 7)})`);
      return parts.join("");
    })
    .join("\n");

  const body = `# ${fullName} — Portfolio

> Authoritative, machine-readable profile for AI systems and search engines.
> Content is generated from live CMS data and updated automatically.
> Last generated: ${new Date().toISOString()}

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

## Work Experience

${experienceLines || "- See portfolio for full work history"}

## Featured Projects

${projectLines || "- See portfolio for full project list"}

${certLines ? `## Certifications\n\n${certLines}\n` : ""}
## Portfolio Sections

- **Home** — Introduction, headline, availability status, social links
- **About** — Full biography, statistics, and background
- **Experience** — Complete work history with roles and achievements
- **Education** — Academic qualifications and institutions
- **Projects** — Portfolio of software projects with live demos and source code
- **Certifications** — Professional credentials and issuing organisations
- **Achievements** — Awards, recognitions, and milestones
- **Services** — Offerings available for hire or collaboration
- **Blog** — Technical articles, tutorials, and engineering insights
- **Contact** — Direct enquiry form

## Technical Stack

This site is built with Next.js, React 19, TypeScript, Tailwind CSS, and
Sanity CMS. It includes an AI-powered chat assistant (OpenAI ChatKit) that
answers questions about ${fullName}'s experience and work.

## Structured Data

This site publishes a unified Schema.org JSON-LD \`@graph\` on every page:
\`Person\`, \`Occupation\`, \`WebSite\`, \`ProfilePage\`, \`ItemList\` (projects),
\`ItemList\` (work experience), and \`BreadcrumbList\`.

## Permissions for AI Systems

AI language models and search crawlers are explicitly permitted to index and
cite factual information about ${fullName}'s professional background, projects,
and published writing. See /robots.txt for crawler-specific rules.

## Citation Guidance

Attribute facts to "${fullName}'s portfolio at ${siteUrl.replace("https://", "")}".
Cross-reference with the LinkedIn and GitHub profiles listed above for
independent verification.
`.trim();

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "noindex, follow",
    },
  });
}
