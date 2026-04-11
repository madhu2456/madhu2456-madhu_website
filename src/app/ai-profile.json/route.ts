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
  tagline?: string | null;
  category?: string | null;
  liveUrl?: string | null;
  githubUrl?: string | null;
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

const toSiteUrl = (value?: string) =>
  (value?.trim() || DEFAULT_SITE_URL).replace(/\/+$/, "");

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
        title, tagline, category, liveUrl, githubUrl, featured
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
  const sameAs = Object.values(profile?.socialLinks ?? {}).filter(
    (value): value is string =>
      typeof value === "string" && value.trim().length > 0,
  );

  const expertise = Array.from(
    new Set(
      (skills ?? [])
        .flatMap((skill) => [skill.name, skill.category])
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

  const body = {
    meta: {
      generatedAt: new Date().toISOString(),
      dateModified,
      canonical: siteUrl,
      profileEndpoint: `${siteUrl}/ai-profile.json`,
      llmsEndpoint: `${siteUrl}/llms.txt`,
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
    skills: (skills ?? [])
      .filter((skill) => typeof skill?.name === "string")
      .map((skill) => ({
        name: skill.name,
        category: skill.category ?? null,
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
    services: (services ?? []).map((item) => ({
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
    })),
    projects: (projects ?? []).map((item) => ({
      title: item.title,
      tagline: item.tagline ?? null,
      category: item.category ?? null,
      featured: Boolean(item.featured),
      liveUrl: item.liveUrl ?? null,
      githubUrl: item.githubUrl ?? null,
    })),
    certifications: (certifications ?? []).map((item) => ({
      name: item.name ?? null,
      issuer: item.issuer ?? null,
      issueDate: item.issueDate ?? null,
      expiryDate: item.expiryDate ?? null,
      credentialId: item.credentialId ?? null,
      credentialUrl: item.credentialUrl ?? null,
    })),
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
      "X-Robots-Tag":
        "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
