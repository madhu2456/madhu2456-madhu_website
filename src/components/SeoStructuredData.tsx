import { buildDiscoveryKeywords } from "@/lib/discovery-keywords";
import { resolveAbsoluteImageUrl } from "@/lib/image-source";
import {
  buildBreadcrumbSchema,
  buildCertificationsListSchema,
  buildFaqSchema,
  buildFullGraph,
  buildHowToHireSchema,
  buildOccupationSchema,
  buildOrganizationSchema,
  buildPersonSchema,
  buildProfessionalServiceSchema,
  buildProfilePageSchema,
  buildProjectsListSchema,
  buildServicesListSchema,
  buildSoftwareApplicationSchema,
  buildWebSiteSchema,
  buildWorkExperienceSchema,
} from "@/lib/jsonld";
import { getPortfolioData } from "@/lib/portfolio-data";
import { serializeJsonLd } from "@/lib/seo/json-ld";
import { resolveSiteUrl } from "@/lib/site-url";

export type SeoGraphNode =
  | "Person"
  | "ProfessionalService"
  | "Occupation"
  | "Organization"
  | "WebSite"
  | "SoftwareApplication"
  | "ProfilePage"
  | "WebPage"
  | "ProjectsList"
  | "ServicesList"
  | "WorkExperience"
  | "CertificationsList"
  | "Breadcrumb"
  | "FAQ"
  | "HowToHire";

interface SeoStructuredDataProps {
  nodes?: SeoGraphNode[];
}

export async function SeoStructuredData({
  nodes,
}: SeoStructuredDataProps = {}) {
  const {
    featuredProjects: projects,
    profile,
    siteSettings,
    skills,
    sortedCertifications: certifications,
    sortedEducation: education,
    sortedExperiences: experience,
    sortedServices: services,
    pageContent,
  } = await getPortfolioData();

  const siteUrl = `${resolveSiteUrl()}/`;
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
  const profileImageUrl =
    resolveAbsoluteImageUrl(profile.profileImage) || undefined;
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

  const currentRole = experience.find((e) => e.current);

  const includeNode = (node: SeoGraphNode) => !nodes || nodes.includes(node);

  const graphNodes = [
    includeNode("Person")
      ? buildPersonSchema({
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
          certifications,
          services,
          currentRole: currentRole
            ? {
                company: currentRole.company,
                position: currentRole.position,
                startDate: currentRole.startDate,
                location: currentRole.location,
              }
            : undefined,
        })
      : null,
    includeNode("ProfessionalService")
      ? buildProfessionalServiceSchema({
          siteUrl,
          name: siteSettings.siteTitle || fullName,
          alternateName: fullName,
          description: description || "AI & Marketing Analytics Consulting",
          image: `${siteUrl}opengraph-image`,
          telephone: profile?.phone,
          email: profile?.email,
          addressLocality: profile?.location,
          priceRange: "$$",
          socialLinks: profile?.socialLinks ?? undefined,
        })
      : null,
    includeNode("Occupation")
      ? buildOccupationSchema({
          siteUrl,
          jobTitle: profile?.headline,
          location: profile?.location,
        })
      : null,
    includeNode("Organization")
      ? buildOrganizationSchema({
          siteUrl,
          name: siteSettings.siteName || fullName,
          logoUrl: `${siteUrl}icon-512.png`,
          description,
          socialLinks: profile?.socialLinks ?? undefined,
        })
      : null,
    includeNode("WebSite")
      ? buildWebSiteSchema({
          name: siteSettings.siteName || fullName,
          url: siteUrl,
          description,
        })
      : null,
    includeNode("SoftwareApplication")
      ? buildSoftwareApplicationSchema({
          siteUrl,
          name: siteSettings.siteName || fullName,
          description,
        })
      : null,
    includeNode("ProfilePage")
      ? buildProfilePageSchema({
          fullName,
          url: siteUrl,
          description,
          profileImageUrl,
          dateModified,
        })
      : null,
    includeNode("WebPage")
      ? {
          "@type": "WebPage",
          "@id": `${siteUrl}#webpage`,
          url: siteUrl,
          name: siteSettings.siteTitle || fullName,
          description: description,
          dateModified: dateModified,
          isPartOf: { "@id": `${siteUrl}#website` },
          about: { "@id": `${siteUrl}#person` },
          speakable: {
            "@type": "SpeakableSpecification",
            cssSelector: ["main"],
          },
        }
      : null,
    includeNode("ProjectsList")
      ? buildProjectsListSchema({ siteUrl, projects })
      : null,
    includeNode("ServicesList")
      ? buildServicesListSchema({ siteUrl, services })
      : null,
    includeNode("WorkExperience")
      ? buildWorkExperienceSchema({ siteUrl, experiences: experience })
      : null,
    includeNode("CertificationsList")
      ? buildCertificationsListSchema({ siteUrl, certifications })
      : null,
    includeNode("Breadcrumb") ? buildBreadcrumbSchema(siteUrl) : null,
    includeNode("FAQ")
      ? buildFaqSchema({
          siteUrl,
          fullName,
          headline: profile?.headline,
          location: profile?.location,
          yearsOfExperience: profile?.yearsOfExperience,
          projects,
          services,
          seoKeywords: discoveryKeywords,
          faqItems: pageContent.home.faqItems,
        })
      : null,
    includeNode("HowToHire")
      ? buildHowToHireSchema({ siteUrl, fullName })
      : null,
  ].filter(Boolean);

  const graph = buildFullGraph(graphNodes);

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is escaped by serializeJsonLd
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(graph) }}
    />
  );
}
