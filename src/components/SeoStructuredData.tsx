import { buildDiscoveryKeywords } from "@/lib/discovery-keywords";
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
import { getPortfolioData } from "@/lib/portfolio-data";

export async function SeoStructuredData() {
  const {
    featuredProjects: projects,
    profile,
    siteSettings,
    skills,
    sortedCertifications: certifications,
    sortedEducation: education,
    sortedExperiences: experience,
    sortedServices: services,
  } = await getPortfolioData();

  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in"
  ).replace(/\/+$/, "");
  const fullName =
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
    "Madhu Dadi";
  const description =
    siteSettings.siteDescription || profile.shortBio || undefined;
  const discoveryKeywords = buildDiscoveryKeywords({
    siteKeywords: siteSettings.siteKeywords,
    headline: profile.headline,
    location: profile.location,
    skills,
    services,
    projects,
  });
  const profileImageUrl = profile.profileImage
    ? `${siteUrl}${profile.profileImage}`
    : undefined;
  const updatedAtValues = [
    siteSettings.updatedAt,
    profile.updatedAt,
    ...projects.map((item) => item.updatedAt),
    ...experience.map((item) => item.updatedAt),
    ...services.map((item) => item.updatedAt),
    ...certifications.map((item) => item.updatedAt),
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
      nationality: "India",
      alumniOf: education
        .filter((edu) => edu.institution)
        .map((edu) => ({
          name: edu.institution,
          url: edu.website ?? undefined,
        })),
      seoKeywords: discoveryKeywords,
    }),
    buildOccupationSchema({
      siteUrl,
      jobTitle: profile?.headline,
      location: profile?.location,
    }),
    buildWebSiteSchema({
      name: siteSettings.siteTitle || fullName,
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
      seoKeywords: discoveryKeywords,
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
