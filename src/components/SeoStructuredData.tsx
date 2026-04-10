import { defineQuery } from "next-sanity";
import {
  buildBreadcrumbSchema,
  buildFullGraph,
  buildOccupationSchema,
  buildPersonSchema,
  buildProfilePageSchema,
  buildProjectsListSchema,
  buildWebSiteSchema,
  buildWorkExperienceSchema,
} from "@/lib/jsonld";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";

const SEO_GRAPH_QUERY = defineQuery(`{
  "settings": *[_type == "siteSettings"][0]{
    siteTitle,
    siteDescription,
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
    tagline,
    liveUrl,
    githubUrl,
    category,
  },
  "experience": *[_type == "experience"] | order(order asc)[0...5]{
    company,
    position,
    startDate,
    endDate,
    current,
    location,
  }
}`);

export async function SeoStructuredData() {
  const { data } = await sanityFetch({ query: SEO_GRAPH_QUERY, stega: false });

  const profile = data?.profile;
  const settings = data?.settings;
  const projects = data?.projects ?? [];
  const experience = data?.experience ?? [];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in";
  const fullName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    "Madhu Dadi";
  const description =
    settings?.siteDescription || profile?.shortBio || undefined;
  const profileImageUrl = profile?.profileImage
    ? urlFor(profile.profileImage).width(800).height(800).url()
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
      dateModified: profile?._updatedAt,
    }),
    buildProjectsListSchema({ siteUrl, projects }),
    buildWorkExperienceSchema({ siteUrl, experiences: experience }),
    buildBreadcrumbSchema(siteUrl),
  ]);

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: safe — server-controlled JSON-LD only
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
