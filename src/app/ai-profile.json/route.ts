import { NextResponse } from "next/server";
import { getPortfolioData } from "@/lib/portfolio-data";

export const revalidate = 3600;

const DEFAULT_SITE_URL = "https://madhudadi.in";
const PROFICIENCY_RANK: Record<string, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  expert: 4,
};
const SKILL_ALIASES: Record<string, string> = {
  "next.js": "Next.js",
  nextjs: "Next.js",
  js: "JavaScript",
  javascript: "JavaScript",
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

export async function GET() {
  const {
    portfolioLastUpdatedAt,
    profile,
    siteSettings,
    skills,
    sortedCertifications,
    sortedEducation,
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
  const availability =
    availabilityMap[profile.availability] ?? "See portfolio for current status";

  const sameAs = Array.from(
    new Set(
      Object.values(profile.socialLinks ?? {})
        .filter(
          (value): value is string =>
            typeof value === "string" && value.trim().length > 0,
        )
        .filter((value) => value !== siteUrl),
    ),
  );

  const normalizedSkillMap: Record<string, NormalizedSkill> = {};
  for (const skill of skills) {
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

  const normalizedKeywords = Array.from(
    new Set(
      (siteSettings.siteKeywords ?? [])
        .map((keyword) => keyword?.trim())
        .filter(
          (keyword): keyword is string =>
            typeof keyword === "string" && keyword.length > 0,
        ),
    ),
  );

  const expertise = Array.from(
    new Set(
      [
        ...normalizedSkills
          .flatMap((skill) => [skill.name, ...skill.categories])
          .filter(
            (value): value is string =>
              typeof value === "string" && value.trim().length > 0,
          ),
        ...normalizedKeywords,
      ].map((value) => value.trim()),
    ),
  ).slice(0, 40);

  const servicesPayload = sortedServices.map((item) => ({
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
    source: "local",
  }));

  const projectEntries = sortedProjects.map((item) => {
    const caseStudyUrl = `${siteUrl}/case-studies/${item.slug}`;
    const evidenceLinks = [
      ...(item.citations ?? [])
        .map((citation) => {
          if (!citation?.url) return null;
          return {
            label: citation.label?.trim() || "Evidence",
            url: citation.url,
          };
        })
        .filter((entry): entry is { label: string; url: string } =>
          Boolean(entry),
        ),
      ...(item.liveUrl ? [{ label: "Live demo", url: item.liveUrl }] : []),
      ...(item.githubUrl
        ? [{ label: "Source code", url: item.githubUrl }]
        : []),
      { label: "Case study", url: caseStudyUrl },
    ];

    return {
      title: item.title,
      slug: item.slug,
      caseStudyUrl,
      tagline: item.tagline ?? null,
      impactSummary: item.impactSummary ?? null,
      category: item.category ?? null,
      featured: Boolean(item.featured),
      liveUrl: item.liveUrl ?? null,
      githubUrl: item.githubUrl ?? null,
      sourceLinks: Array.from(
        new Map(evidenceLinks.map((entry) => [entry.url, entry])).values(),
      ),
    };
  });

  const caseStudies = projectEntries.map((item) => ({
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
      dateModified: portfolioLastUpdatedAt,
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
      keywords: normalizedKeywords,
      source: "local-data-nextjs",
    },
    person: {
      fullName,
      firstName: profile.firstName,
      lastName: profile.lastName,
      headline: profile.headline,
      summary: profile.shortBio ?? siteSettings.siteDescription ?? null,
      location: profile.location,
      email: profile.email ?? null,
      phone: profile.phone ?? null,
      availability,
      yearsOfExperience: profile.yearsOfExperience ?? null,
      website: siteUrl,
      sameAs,
    },
    expertise,
    keywords: normalizedKeywords,
    skills: normalizedSkills.map((skill) => ({
      name: skill.name,
      category: skill.category ?? null,
      categories: skill.categories,
      proficiency: skill.proficiency ?? null,
      yearsOfExperience: skill.yearsOfExperience ?? null,
    })),
    experience: sortedExperiences.map((item) => ({
      company: item.company,
      role: item.position,
      location: item.location ?? null,
      startDate: item.startDate ?? null,
      endDate: item.current ? null : (item.endDate ?? null),
      current: Boolean(item.current),
    })),
    education: sortedEducation.map((item) => ({
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
    certifications: sortedCertifications.map((item) => ({
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
      certifications: sortedCertifications
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
      ...(profile.headline && { jobTitle: profile.headline }),
      ...(profile.shortBio && { description: profile.shortBio }),
      ...(profile.location && {
        address: {
          "@type": "PostalAddress",
          addressLocality: profile.location,
        },
      }),
      ...(sameAs.length > 0 && { sameAs }),
      ...(expertise.length > 0 && { knowsAbout: expertise }),
      ...(normalizedKeywords.length > 0 && {
        keywords: normalizedKeywords.join(", "),
      }),
      mainEntityOfPage: { "@id": `${siteUrl}/#profilepage` },
    },
  };

  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "Content-Language": "en-US",
      "Last-Modified": new Date(portfolioLastUpdatedAt).toUTCString(),
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
