import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export const revalidate = 3600;

type SocialLinks = {
  github?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  website?: string | null;
  medium?: string | null;
  devto?: string | null;
  youtube?: string | null;
  stackoverflow?: string | null;
};

type Profile = {
  _updatedAt?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  headline?: string | null;
  shortBio?: string | null;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  availability?: string | null;
  yearsOfExperience?: number | null;
  socialLinks?: SocialLinks | null;
};

type SiteSettings = {
  _updatedAt?: string | null;
  siteTitle?: string | null;
  siteDescription?: string | null;
};

type Project = {
  _updatedAt?: string | null;
  title: string;
  slug?: string | null;
  tagline?: string | null;
  category?: string | null;
  liveUrl?: string | null;
  githubUrl?: string | null;
  impactSummary?: string | null;
  citations?: Array<{
    label?: string | null;
    url?: string | null;
  }> | null;
  featured?: boolean | null;
};

type Experience = {
  _updatedAt?: string | null;
  company: string;
  position: string;
  startDate?: string | null;
  endDate?: string | null;
  current?: boolean | null;
  location?: string | null;
};

type Service = {
  _updatedAt?: string | null;
  title: string;
  shortDescription?: string | null;
  timeline?: string | null;
  pricing?: {
    startingPrice?: number | null;
    priceType?: string | null;
    description?: string | null;
  } | null;
};

type Certification = {
  _updatedAt?: string | null;
  name?: string | null;
  issuer?: string | null;
  issueDate?: string | null;
  expiryDate?: string | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
};

type Education = {
  _updatedAt?: string | null;
  institution?: string | null;
  degree?: string | null;
  fieldOfStudy?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  current?: boolean | null;
};

type Skill = {
  _updatedAt?: string | null;
  name?: string | null;
  category?: string | null;
  proficiency?: string | null;
  yearsOfExperience?: number | null;
};

const DEFAULT_SITE_URL = "https://madhudadi.in";
const PROFICIENCY_RANK: Record<string, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  expert: 4,
};
const SKILL_ALIASES: Record<string, string> = {
  "next.js": "Next.js",
  "nextjs": "Next.js",
  "next.js.": "Next.js",
  js: "JavaScript",
  javascript: "JavaScript",
  dataiku: "Dataiku",
};

type NormalizedSkill = {
  name: string;
  category: string | null;
  categories: string[];
  proficiency: string | null;
  yearsOfExperience: number | null;
};

const toSiteUrl = (value?: string) =>
  (value?.trim() || DEFAULT_SITE_URL).replace(/\/+$/, "");

const normalizeSkillName = (name?: string | null) => {
  const normalized = name?.trim();
  if (!normalized) return null;

  return SKILL_ALIASES[normalized.toLowerCase()] ?? normalized;
};

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

const getLastModifiedISO = (values: Array<string | null | undefined>) => {
  const timestamps = values
    .filter((value): value is string => typeof value === "string")
    .map((value) => new Date(value).getTime())
    .filter((value) => !Number.isNaN(value));

  if (timestamps.length === 0) {
    return new Date().toISOString();
  }

  return new Date(Math.max(...timestamps)).toISOString();
};

const availabilityMap: Record<string, string> = {
  available: "Available for hire",
  open: "Open to opportunities",
  unavailable: "Not currently looking",
};

export async function GET() {
  const [
    profile,
    settings,
    projects,
    experience,
    services,
    certifications,
    education,
    skills,
  ] = await Promise.all([
    client.fetch<Profile>(
      `*[_id == "singleton-profile"][0]{
        _updatedAt,
        firstName, lastName, headline, shortBio, email, phone,
        location, availability, yearsOfExperience, socialLinks
      }`,
    ),
    client.fetch<SiteSettings>(
      `*[_type == "siteSettings"][0]{
        _updatedAt,
        siteTitle, siteDescription
      }`,
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
    client.fetch<Experience[]>(
      `*[_type == "experience"] | order(order asc)[0...8]{
        _updatedAt,
        company, position, startDate, endDate, current, location
      }`,
    ),
    client.fetch<Service[]>(
      `*[_type == "service"] | order(featured desc, order asc)[0...10]{
        _updatedAt,
        title, shortDescription, timeline,
        pricing{startingPrice, priceType, description}
      }`,
    ),
    client.fetch<Certification[]>(
      `*[_type == "certification"] | order(issueDate desc)[0...12]{
        _updatedAt,
        name, issuer, issueDate, expiryDate, credentialId, credentialUrl
      }`,
    ),
    client.fetch<Education[]>(
      `*[_type == "education"] | order(endDate desc, current desc)[0...6]{
        _updatedAt,
        institution, degree, fieldOfStudy, startDate, endDate, current
      }`,
    ),
    client.fetch<Skill[]>(
      `*[_type == "skill"] | order(category asc, proficiency desc)[0...50]{
        _updatedAt,
        name, category, proficiency, yearsOfExperience
      }`,
    ),
  ]);

  const siteUrl = toSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  const fullName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    "Madhu Dadi";
  const availability = profile?.availability
    ? (availabilityMap[profile.availability] ?? profile.availability)
    : "See portfolio for current status";
  const sameAs = Array.from(
    new Set(
      Object.values(profile?.socialLinks ?? {})
        .filter(
          (value): value is string =>
            typeof value === "string" && value.trim().length > 0,
        )
        .map((value) => normalizeExternalUrl(value, siteUrl))
        .filter((value) => value !== siteUrl),
    ),
  );

  const normalizedSkillMap: Record<string, NormalizedSkill> = {};
  for (const skill of skills ?? []) {
    const normalizedName = normalizeSkillName(skill.name);
    if (!normalizedName) continue;

    const key = normalizedName.toLowerCase();
    const category = skill.category?.trim() || null;
    const proficiency = skill.proficiency?.trim().toLowerCase() || null;
    const years =
      typeof skill.yearsOfExperience === "number"
        ? skill.yearsOfExperience
        : null;

    const existing = normalizedSkillMap[key];
    if (!existing) {
      normalizedSkillMap[key] = {
        name: normalizedName,
        category,
        categories: category ? [category] : [],
        proficiency,
        yearsOfExperience: years,
      };
      continue;
    }

    const existingRank =
      existing.proficiency && PROFICIENCY_RANK[existing.proficiency]
        ? PROFICIENCY_RANK[existing.proficiency]
        : 0;
    const nextRank =
      proficiency && PROFICIENCY_RANK[proficiency]
        ? PROFICIENCY_RANK[proficiency]
        : 0;

    if (nextRank > existingRank) {
      existing.proficiency = proficiency;
    }

    const existingYears = existing.yearsOfExperience ?? -1;
    const nextYears = years ?? -1;
    if (nextYears > existingYears) {
      existing.yearsOfExperience = years;
      if (category) {
        existing.category = category;
      }
    }

    if (category && !existing.categories.includes(category)) {
      existing.categories.push(category);
    }
  }

  const normalizedSkills = Object.values(normalizedSkillMap).sort((a, b) => {
    const aYears = a.yearsOfExperience ?? -1;
    const bYears = b.yearsOfExperience ?? -1;
    if (aYears !== bYears) return bYears - aYears;
    return a.name.localeCompare(b.name);
  });

  const expertise = Array.from(
    new Set(
      normalizedSkills
        .flatMap((skill) => [skill.name, ...skill.categories])
        .filter(
          (value): value is string =>
            typeof value === "string" && value.trim().length > 0,
        ),
    ),
  ).slice(0, 30);

  const dateModified = getLastModifiedISO([
    profile?._updatedAt,
    settings?._updatedAt,
    ...(projects ?? []).map((item) => item?._updatedAt),
    ...(experience ?? []).map((item) => item?._updatedAt),
    ...(services ?? []).map((item) => item?._updatedAt),
    ...(certifications ?? []).map((item) => item?._updatedAt),
    ...(education ?? []).map((item) => item?._updatedAt),
    ...(skills ?? []).map((item) => item?._updatedAt),
  ]);

  const serviceEntries = (services ?? []).map((item) => ({
    title: item.title,
    description: item.shortDescription ?? null,
    timeline: item.timeline ?? null,
    pricing: item.pricing
      ? {
          startingPrice: item.pricing.startingPrice ?? null,
          priceType: item.pricing.priceType ?? null,
          description: item.pricing.description ?? null,
        }
      : null,
    source: "cms",
  }));

  const fallbackServices =
    serviceEntries.length > 0
      ? []
      : [
          {
            title: "AI Engineering & LLM Applications",
            description:
              "Design and implementation of AI-powered features, RAG workflows, and production-ready LLM experiences.",
            timeline: null,
            pricing: null,
            source: "inferred",
          },
          {
            title: "Marketing Analytics & Decision Intelligence",
            description:
              "Measurement strategy, predictive analytics, and automation to improve campaign and lifecycle performance.",
            timeline: null,
            pricing: null,
            source: "inferred",
          },
          {
            title: "Full-stack Web Product Development",
            description:
              "End-to-end delivery of scalable web applications with modern frontend, backend, and cloud deployment.",
            timeline: null,
            pricing: null,
            source: "inferred",
          },
        ];

  const servicesPayload = serviceEntries.length > 0 ? serviceEntries : fallbackServices;

  const projectEntries = (projects ?? []).map((item) => {
    const slug = item.slug?.trim() || null;
    const caseStudyUrl = slug ? `${siteUrl}/case-studies/${slug}` : null;
    const liveUrl = item.liveUrl ? normalizeExternalUrl(item.liveUrl, siteUrl) : null;
    const githubUrl = item.githubUrl
      ? normalizeExternalUrl(item.githubUrl, siteUrl)
      : null;

    const evidenceLinks = [
      ...(item.citations ?? [])
        .map((citation) => {
          if (!citation?.url) return null;
          return {
            label: citation.label?.trim() || "Evidence",
            url: normalizeExternalUrl(citation.url, siteUrl),
          };
        })
        .filter((entry): entry is { label: string; url: string } => Boolean(entry)),
      ...(liveUrl ? [{ label: "Live demo", url: liveUrl }] : []),
      ...(githubUrl ? [{ label: "Source code", url: githubUrl }] : []),
      ...(caseStudyUrl ? [{ label: "Case study", url: caseStudyUrl }] : []),
    ];

    return {
      title: item.title,
      slug,
      caseStudyUrl,
      tagline: item.tagline ?? null,
      impactSummary: item.impactSummary ?? null,
      category: item.category ?? null,
      featured: Boolean(item.featured),
      liveUrl,
      githubUrl,
      sourceLinks: Array.from(
        new Map(evidenceLinks.map((entry) => [entry.url, entry])).values(),
      ),
    };
  });

  const caseStudies = projectEntries
    .filter((item) => typeof item.caseStudyUrl === "string")
    .map((item) => ({
      title: item.title,
      url: item.caseStudyUrl,
      summary: item.impactSummary ?? item.tagline ?? null,
    }));

  const sourceProfiles = {
    github: sameAs.find((url) => url.includes("github.com")) ?? null,
    linkedin: sameAs.find((url) => url.includes("linkedin.com")) ?? null,
    twitter:
      sameAs.find((url) => url.includes("x.com")) ??
      sameAs.find((url) => url.includes("twitter.com")) ??
      null,
  };

  const body = {
    meta: {
      generatedAt: new Date().toISOString(),
      dateModified,
      canonical: siteUrl,
      profileEndpoint: `${siteUrl}/ai-profile.json`,
      llmsEndpoint: `${siteUrl}/llms.txt`,
      caseStudiesEndpoint: `${siteUrl}/case-studies`,
      blog: {
        url: `${siteUrl}/blog`,
        rss: `${siteUrl}/blog/feed.xml`,
        sitemap: `${siteUrl}/blog/sitemap.xml`,
        aiChat: `${siteUrl}/blog/ask`,
        description:
          "Technical blog covering AI engineering, full-stack development, RAG systems, and software architecture.",
      },
      source: "sanity-cms-nextjs",
    },
    person: {
      fullName,
      firstName: profile?.firstName ?? null,
      lastName: profile?.lastName ?? null,
      headline: profile?.headline ?? null,
      summary: profile?.shortBio ?? settings?.siteDescription ?? null,
      location: profile?.location ?? null,
      email: profile?.email ?? null,
      phone: profile?.phone ?? null,
      availability,
      yearsOfExperience: profile?.yearsOfExperience ?? null,
      website: siteUrl,
      sameAs,
    },
    expertise,
    skills: normalizedSkills.map((skill) => ({
        name: skill.name,
        category: skill.category ?? null,
        categories: skill.categories,
        proficiency: skill.proficiency ?? null,
        yearsOfExperience: skill.yearsOfExperience ?? null,
      })),
    experience: (experience ?? []).map((item) => ({
      company: item.company,
      role: item.position,
      location: item.location ?? null,
      startDate: item.startDate ?? null,
      endDate: item.current ? null : (item.endDate ?? null),
      current: Boolean(item.current),
    })),
    education: (education ?? []).map((item) => ({
      institution: item.institution ?? null,
      degree: item.degree ?? null,
      fieldOfStudy: item.fieldOfStudy ?? null,
      startDate: item.startDate ?? null,
      endDate: item.current ? null : (item.endDate ?? null),
      current: Boolean(item.current),
    })),
    services: servicesPayload,
    projects: projectEntries,
    caseStudies,
    certifications: (certifications ?? []).map((item) => ({
      name: item.name ?? null,
      issuer: item.issuer ?? null,
      issueDate: item.issueDate ?? null,
      expiryDate: item.expiryDate ?? null,
      credentialId: item.credentialId ?? null,
      credentialUrl: item.credentialUrl ?? null,
    })),
    sources: {
      canonical: siteUrl,
      profiles: sourceProfiles,
      blog: {
        url: `${siteUrl}/blog`,
        rss: `${siteUrl}/blog/feed.xml`,
      },
      caseStudies: caseStudies.slice(0, 12),
      certifications: (certifications ?? [])
        .map((item) => ({
          name: item.name ?? "Certification",
          url: item.credentialUrl ?? null,
        }))
        .filter((item) => Boolean(item.url)),
    },
    schema: {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: fullName,
      url: siteUrl,
      ...(profile?.headline && { jobTitle: profile.headline }),
      ...(profile?.shortBio && { description: profile.shortBio }),
      ...(profile?.location && {
        address: {
          "@type": "PostalAddress",
          addressLocality: profile.location,
        },
      }),
      ...(sameAs.length > 0 && { sameAs }),
      ...(expertise.length > 0 && { knowsAbout: expertise }),
      mainEntityOfPage: { "@id": `${siteUrl}/#profilepage` },
    },
  };

  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "Content-Language": "en-US",
      "Last-Modified": new Date(dateModified).toUTCString(),
      Link:
        `<${siteUrl}/llms.txt>; rel="alternate"; type="text/plain", ` +
        `<${siteUrl}/case-studies>; rel="collection", ` +
        `<${siteUrl}/blog/feed.xml>; rel="alternate"; type="application/rss+xml"; title="${fullName} Blog"`,
      "X-Robots-Tag":
        "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
