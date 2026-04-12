import { defineQuery } from "next-sanity";
import {
  buildBreadcrumbSchema,
  buildCertificationsListSchema,
  buildFaqSchema,
  buildFullGraph,
  buildOccupationSchema,
  buildPersonSchema,
  buildProfilePageSchema,
  buildProjectsListSchema,
  buildServicesListSchema,
  buildWebSiteSchema,
  buildWorkExperienceSchema,
} from "@/lib/jsonld";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/fetch";

const SEO_GRAPH_QUERY = defineQuery(`{
  "settings": *[_type == "siteSettings"][0]{
    siteTitle,
    siteDescription,
    _updatedAt,
  },
  "profile": *[_id == "singleton-profile"][0]{
    firstName,
    lastName,
    headline,
    shortBio,
    email,
    location,
    profileImage,
    socialLinks,
    yearsOfExperience,
    _updatedAt,
  },
  "projects": *[_type == "project" && featured == true] | order(order asc)[0...6]{
    title,
    "slug": slug.current,
    tagline,
    liveUrl,
    githubUrl,
    category,
    _updatedAt,
  },
  "experience": *[_type == "experience"] | order(order asc)[0...5]{
    company,
    position,
    startDate,
    endDate,
    current,
    location,
    _updatedAt,
  },
  "services": *[_type == "service"] | order(featured desc, order asc)[0...8]{
    title,
    shortDescription,
    pricing,
    _updatedAt,
  },
  "certifications": *[_type == "certification"] | order(issueDate desc)[0...8]{
    name,
    issuer,
    issueDate,
    expiryDate,
    credentialId,
    credentialUrl,
    description,
    _updatedAt,
  }
}`);

export async function SeoStructuredData() {
  const { data } = await sanityFetch({ query: SEO_GRAPH_QUERY, stega: false });

  const profile = data?.profile;
  const settings = data?.settings;
  const projects = data?.projects ?? [];
  const experience = data?.experience ?? [];
  const services = data?.services ?? [];
  const certifications = data?.certifications ?? [];

  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in"
  ).replace(/\/+$/, "");
  const fullName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    "Madhu Dadi";
  const description =
    settings?.siteDescription || profile?.shortBio || undefined;
  const profileImageUrl = profile?.profileImage
    ? urlFor(profile.profileImage).width(800).height(800).url()
    : undefined;
  const updatedAtValues = [
    settings?._updatedAt,
    profile?._updatedAt,
    ...projects.map((item: { _updatedAt?: string | null }) => item?._updatedAt),
    ...experience.map((item: { _updatedAt?: string | null }) => item?._updatedAt),
    ...services.map((item: { _updatedAt?: string | null }) => item?._updatedAt),
    ...certifications.map((item: { _updatedAt?: string | null }) => item?._updatedAt),
  ].filter((value): value is string => typeof value === "string");
  const updatedAtTimestamps = updatedAtValues
    .map((value) => new Date(value).getTime())
    .filter((value) => !Number.isNaN(value));
  const dateModified =
    updatedAtTimestamps.length > 0
      ? new Date(Math.max(...updatedAtTimestamps)).toISOString()
      : undefined;

  const graph = buildFullGraph([
    buildPersonSchema({
      fullName,
      headline: profile?.headline,
      bio: profile?.shortBio,
      email: profile?.email,
      location: profile?.location,
      profileImageUrl,
      siteUrl,
      socialLinks: profile?.socialLinks ?? undefined,
      yearsOfExperience: profile?.yearsOfExperience,
    }),
    buildOccupationSchema({
      siteUrl,
      jobTitle: profile?.headline,
      location: profile?.location,
    }),
    buildWebSiteSchema({
      name: settings?.siteTitle || fullName,
      url: siteUrl,
      description,
    }),
    buildProfilePageSchema({
      fullName,
      url: siteUrl,
      description,
      profileImageUrl,
      dateModified,
    }),
    buildProjectsListSchema({ siteUrl, projects }),
    buildServicesListSchema({ siteUrl, services }),
    buildWorkExperienceSchema({ siteUrl, experiences: experience }),
    buildCertificationsListSchema({ siteUrl, certifications }),
    buildBreadcrumbSchema(siteUrl),
    buildFaqSchema({
      siteUrl,
      fullName,
      headline: profile?.headline,
      location: profile?.location,
      yearsOfExperience: profile?.yearsOfExperience,
      projects,
      services,
    }),
  ]);

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: safe — server-controlled JSON-LD only
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
