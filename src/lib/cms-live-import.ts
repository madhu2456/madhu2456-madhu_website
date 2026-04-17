import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import type {
  CertificationItem,
  EducationItem,
  ExperienceItem,
  PortfolioContent,
  ProfileStat,
  ProjectItem,
  ServiceItem,
  SkillItem,
  Technology,
} from "@/lib/portfolio-data";

type RemoteProjectLink = {
  label?: unknown;
  url?: unknown;
};

type RemoteProfilePayload = {
  meta?: {
    dateModified?: unknown;
    canonical?: unknown;
    blog?: {
      url?: unknown;
    };
  };
  person?: {
    fullName?: unknown;
    firstName?: unknown;
    lastName?: unknown;
    headline?: unknown;
    summary?: unknown;
    location?: unknown;
    email?: unknown;
    phone?: unknown;
    availability?: unknown;
    yearsOfExperience?: unknown;
    website?: unknown;
    sameAs?: unknown;
  };
  expertise?: unknown;
  skills?: unknown;
  experience?: unknown;
  education?: unknown;
  services?: unknown;
  projects?: unknown;
  certifications?: unknown;
  sources?: {
    profiles?: {
      github?: unknown;
      linkedin?: unknown;
      twitter?: unknown;
    };
  };
};

type RemoteSkill = {
  name?: unknown;
  category?: unknown;
  proficiency?: unknown;
  yearsOfExperience?: unknown;
};

type RemoteExperience = {
  company?: unknown;
  role?: unknown;
  location?: unknown;
  startDate?: unknown;
  endDate?: unknown;
  current?: unknown;
};

type RemoteEducation = {
  institution?: unknown;
  degree?: unknown;
  fieldOfStudy?: unknown;
  startDate?: unknown;
  endDate?: unknown;
  current?: unknown;
};

type RemoteService = {
  title?: unknown;
  description?: unknown;
  timeline?: unknown;
  pricing?: {
    startingPrice?: unknown;
    priceType?: unknown;
    description?: unknown;
  } | null;
};

type RemoteProject = {
  title?: unknown;
  slug?: unknown;
  caseStudyUrl?: unknown;
  tagline?: unknown;
  impactSummary?: unknown;
  category?: unknown;
  featured?: unknown;
  liveUrl?: unknown;
  githubUrl?: unknown;
  sourceLinks?: unknown;
};

type RemoteCertification = {
  name?: unknown;
  issuer?: unknown;
  issueDate?: unknown;
  expiryDate?: unknown;
  credentialId?: unknown;
  credentialUrl?: unknown;
};

type CaseStudyDetails = {
  problemStatement?: string;
  solutionApproach?: string;
  impactSummary?: string;
  technologyNames: string[];
  citations: Array<{ label: string; url: string }>;
};

export type LiveImportResult = {
  content: PortfolioContent;
  sourceUrl: string;
  importedAt: string;
};

const DEFAULT_SOURCE_URL = "https://madhudadi.in";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const asString = (value: unknown) => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

const asBoolean = (value: unknown) =>
  typeof value === "boolean" ? value : undefined;

const asNumber = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;

const asStringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value
        .map((item) => asString(item))
        .filter((item): item is string => Boolean(item))
    : [];

const removeUndefinedValues = <T extends Record<string, unknown>>(value: T) =>
  Object.fromEntries(
    Object.entries(value).filter((entry) => entry[1] !== undefined),
  ) as T;

const IMAGE_EXTENSIONS_BY_CONTENT_TYPE: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
  "image/avif": ".avif",
};

const normalizeSourceUrl = (value?: string) =>
  (value?.trim() || DEFAULT_SOURCE_URL).replace(/\/+$/, "");

const resolveAbsoluteUrl = (value: string, sourceUrl: string) => {
  try {
    return new URL(value, sourceUrl).toString();
  } catch {
    return undefined;
  }
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const decodeHtmlEntities = (value: string) =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x([0-9a-fA-F]+);/g, (_full, hex: string) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replace(/&#([0-9]+);/g, (_full, decimal: string) =>
      String.fromCodePoint(Number.parseInt(decimal, 10)),
    );

const stripHtml = (value: string) =>
  decodeHtmlEntities(value.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();

const normalizeAvailability = (
  value?: string,
): "available" | "open" | "unavailable" => {
  const normalizedValue = value?.toLowerCase() || "";
  if (normalizedValue.includes("open")) return "open";
  if (normalizedValue.includes("available")) return "available";
  return "unavailable";
};

const decodeNextImageUrl = (value: string, sourceUrl: string) => {
  try {
    const resolvedUrl = new URL(value, sourceUrl);
    const encodedOriginalUrl = resolvedUrl.searchParams.get("url");

    if (encodedOriginalUrl) {
      return decodeURIComponent(encodedOriginalUrl);
    }

    return resolvedUrl.toString();
  } catch {
    return value;
  }
};

const inferExtension = (url: string, contentType: string | null) => {
  const normalizedContentType = asString(contentType?.split(";")[0]);
  if (
    normalizedContentType &&
    IMAGE_EXTENSIONS_BY_CONTENT_TYPE[normalizedContentType]
  ) {
    return IMAGE_EXTENSIONS_BY_CONTENT_TYPE[normalizedContentType];
  }

  try {
    const pathname = new URL(url).pathname.toLowerCase();
    const extensionMatch = pathname.match(/\.(png|jpe?g|webp|gif|svg|avif)$/);
    if (extensionMatch) {
      return extensionMatch[0];
    }
  } catch {
    // Ignore URL parsing errors and fallback to PNG extension.
  }

  return ".png";
};

const persistImageLocally = async (
  imageUrl: string,
  sourceUrl: string,
  fileBaseName: string,
) => {
  if (imageUrl.startsWith("/uploads/")) {
    return imageUrl;
  }

  const absoluteImageUrl = resolveAbsoluteUrl(imageUrl, sourceUrl);
  if (!absoluteImageUrl) {
    return undefined;
  }

  const response = await fetch(absoluteImageUrl, { cache: "no-store" });
  if (!response.ok) {
    return undefined;
  }

  const imageBytes = Buffer.from(await response.arrayBuffer());
  if (imageBytes.length === 0) {
    return undefined;
  }

  const hash = createHash("sha1").update(imageBytes).digest("hex").slice(0, 12);
  const extension = inferExtension(
    absoluteImageUrl,
    response.headers.get("content-type"),
  );
  const safeBaseName = slugify(fileBaseName) || "image";
  const fileName = `${safeBaseName}-${hash}${extension}`;

  const outputDirectory = path.join(
    process.cwd(),
    "public",
    "uploads",
    "imported",
  );
  const outputPath = path.join(outputDirectory, fileName);
  await fs.mkdir(outputDirectory, { recursive: true });

  try {
    await fs.access(outputPath);
  } catch {
    await fs.writeFile(outputPath, imageBytes);
  }

  return `/uploads/imported/${fileName}`;
};

const normalizeUrlForDedupe = (url: string) => url.replace(/\/+$/, "");

const parseHomeStats = (html: string): ProfileStat[] => {
  const textContent = stripHtml(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " "),
  );

  const statLabels = [
    "Projects Completed",
    "Client Satisfaction",
    "Years Experience",
    "Technologies Mastered",
  ];

  const parsedStats: ProfileStat[] = [];
  for (const label of statLabels) {
    const regex = new RegExp(`([0-9][0-9,.+%]*)\\s+${label}`, "i");
    const match = textContent.match(regex);
    const statValue = asString(match?.[1]);
    if (!statValue) {
      continue;
    }

    parsedStats.push({
      label,
      value: statValue,
    });
  }

  return parsedStats;
};

const parseCaseStudyCoverImages = (html: string, sourceUrl: string) => {
  const imageMap = new Map<string, string>();
  const imageRegex = /<img[^>]*alt="([^"]+?) preview"[^>]*src="([^"]+?)"/gi;

  for (const match of html.matchAll(imageRegex)) {
    const title = asString(decodeHtmlEntities(match[1]))?.toLowerCase();
    const imageUrl = asString(match[2]);
    if (!title || !imageUrl) {
      continue;
    }

    imageMap.set(title, decodeNextImageUrl(imageUrl, sourceUrl));
  }

  return imageMap;
};

const parseProfileImage = (
  html: string,
  sourceUrl: string,
  fullName: string,
) => {
  const escapedName = fullName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(
    `<img[^>]*alt="${escapedName}"[^>]*src="([^"]+)"`,
    "i",
  );
  const match = html.match(regex);
  const imageUrl = asString(match?.[1]);
  return imageUrl ? decodeNextImageUrl(imageUrl, sourceUrl) : undefined;
};

const extractSectionParagraph = (html: string, heading: string) => {
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(
    `<h2[^>]*>\\s*${escapedHeading}\\s*<\\/h2>\\s*<p[^>]*>([\\s\\S]*?)<\\/p>`,
    "i",
  );
  const sectionMatch = html.match(regex);
  return sectionMatch?.[1] ? stripHtml(sectionMatch[1]) : undefined;
};

const extractTechnologyNames = (html: string) => {
  const sectionMatch = html.match(
    /<h2[^>]*>\s*Technology stack\s*<\/h2>([\s\S]*?)<\/section>/i,
  );
  if (!sectionMatch) {
    return [];
  }

  const technologyNames = Array.from(
    sectionMatch[1].matchAll(/<span[^>]*>([\s\S]*?)<\/span>/gi),
  )
    .map((match) => stripHtml(match[1]))
    .filter(Boolean);

  return Array.from(new Set(technologyNames));
};

const extractEvidenceLinks = (html: string) => {
  const evidenceSectionMatch = html.match(
    /<section[^>]*id="evidence"[\s\S]*?<\/section>/i,
  );
  if (!evidenceSectionMatch) {
    return [] as Array<{ label: string; url: string }>;
  }

  const links = Array.from(
    evidenceSectionMatch[0].matchAll(
      /<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi,
    ),
  )
    .map((match) => {
      const url = asString(match[1]);
      const label = asString(
        stripHtml(match[2]).replace(/:\s*https?:\/\/.+$/i, ""),
      );
      if (!url || !label) {
        return null;
      }

      return {
        label,
        url,
      };
    })
    .filter((item): item is { label: string; url: string } => Boolean(item));

  return Array.from(
    new Map(
      links.map((item) => [normalizeUrlForDedupe(item.url), item]),
    ).values(),
  );
};

const fetchRemoteJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url} (status ${response.status}).`);
  }

  return (await response.json()) as T;
};

const fetchRemoteText = async (url: string) => {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url} (status ${response.status}).`);
  }

  return response.text();
};

const extractTwitterHandle = (profileUrl?: string) => {
  if (!profileUrl) {
    return undefined;
  }

  const match = profileUrl.match(
    /(?:x\.com|twitter\.com)\/([A-Za-z0-9_]+)\/?$/i,
  );
  return asString(match?.[1]);
};

const mapTechnologies = (names: string[]): Technology[] =>
  names.map((name) => ({ name }));

const parseRemoteProjectLinks = (value: unknown) => {
  if (!Array.isArray(value)) {
    return [] as Array<{ label: string; url: string }>;
  }

  const links = value
    .map((item) => {
      if (!isRecord(item)) {
        return null;
      }

      const label = asString((item as RemoteProjectLink).label) || "Evidence";
      const url = asString((item as RemoteProjectLink).url);
      if (!url) {
        return null;
      }

      return {
        label,
        url,
      };
    })
    .filter((item): item is { label: string; url: string } => Boolean(item));

  return Array.from(new Map(links.map((item) => [item.url, item])).values());
};

const fetchCaseStudyDetails = async (
  sourceUrl: string,
  slug: string,
): Promise<CaseStudyDetails> => {
  const caseStudyUrl = `${sourceUrl}/case-studies/${slug}`;

  try {
    const html = await fetchRemoteText(caseStudyUrl);

    return {
      problemStatement: extractSectionParagraph(html, "Problem"),
      solutionApproach: extractSectionParagraph(html, "Solution"),
      impactSummary: extractSectionParagraph(html, "Impact"),
      technologyNames: extractTechnologyNames(html),
      citations: extractEvidenceLinks(html),
    };
  } catch {
    return {
      technologyNames: [],
      citations: [],
    };
  }
};

export async function importPortfolioContentFromWebsite(
  currentContent: PortfolioContent,
  sourceUrlInput?: string,
): Promise<LiveImportResult> {
  const sourceUrl = normalizeSourceUrl(sourceUrlInput);
  const remoteProfile = await fetchRemoteJson<RemoteProfilePayload>(
    `${sourceUrl}/ai-profile.json`,
  );

  const remotePerson = isRecord(remoteProfile.person)
    ? remoteProfile.person
    : {};
  const firstName =
    asString(remotePerson.firstName) ||
    asString(asString(remotePerson.fullName)?.split(" ")[0]) ||
    currentContent.profile.firstName;
  const lastName =
    asString(remotePerson.lastName) ||
    asString(asString(remotePerson.fullName)?.split(" ").slice(1).join(" ")) ||
    currentContent.profile.lastName;
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

  const remoteMeta = isRecord(remoteProfile.meta) ? remoteProfile.meta : {};
  const remoteBlog = isRecord(remoteMeta.blog) ? remoteMeta.blog : {};
  const importedAt =
    asString(remoteMeta.dateModified) || new Date().toISOString();

  const [homepageHtml, caseStudiesHtml] = await Promise.all([
    fetchRemoteText(sourceUrl),
    fetchRemoteText(`${sourceUrl}/case-studies`),
  ]);
  const parsedStats = parseHomeStats(homepageHtml);
  const coverImagesByTitle = parseCaseStudyCoverImages(
    caseStudiesHtml,
    sourceUrl,
  );
  const profileImage = parseProfileImage(
    homepageHtml,
    sourceUrl,
    fullName || "Madhu Dadi",
  );
  const localProfileImage = profileImage
    ? await persistImageLocally(profileImage, sourceUrl, "profile-image")
    : undefined;

  const sameAs = asStringArray(remotePerson.sameAs);
  const sourceProfiles = isRecord(remoteProfile.sources)
    ? isRecord(remoteProfile.sources.profiles)
      ? remoteProfile.sources.profiles
      : {}
    : {};
  const githubProfile =
    sameAs.find((url) => url.includes("github.com")) ||
    asString(sourceProfiles.github);
  const linkedinProfile =
    sameAs.find((url) => url.includes("linkedin.com")) ||
    asString(sourceProfiles.linkedin);
  const twitterProfile =
    sameAs.find(
      (url) => url.includes("x.com") || url.includes("twitter.com"),
    ) || asString(sourceProfiles.twitter);

  const websiteUrl =
    asString(remoteBlog.url) ||
    asString(remotePerson.website) ||
    asString(remoteMeta.canonical) ||
    currentContent.profile.socialLinks.website ||
    sourceUrl;

  const remoteSkillsRaw = Array.isArray(remoteProfile.skills)
    ? (remoteProfile.skills as RemoteSkill[])
    : [];
  const mappedSkills: SkillItem[] =
    remoteSkillsRaw.length > 0
      ? remoteSkillsRaw
          .map((item) => {
            const name = asString(item.name);
            if (!name) {
              return null;
            }

            const category = asString(item.category);
            const proficiency = asString(item.proficiency);
            const yearsOfExperience = asNumber(item.yearsOfExperience);

            return removeUndefinedValues({
              name,
              category,
              proficiency,
              yearsOfExperience,
              updatedAt: importedAt,
            }) as SkillItem;
          })
          .filter((item): item is SkillItem => Boolean(item))
      : currentContent.skills;

  const existingExperiencesByKey = new Map(
    currentContent.experiences.map((item) => [
      `${item.company.toLowerCase()}::${item.position.toLowerCase()}`,
      item,
    ]),
  );
  const remoteExperiencesRaw = Array.isArray(remoteProfile.experience)
    ? (remoteProfile.experience as RemoteExperience[])
    : [];
  const mappedExperiences: ExperienceItem[] =
    remoteExperiencesRaw.length > 0
      ? remoteExperiencesRaw
          .map((item, index) => {
            const company = asString(item.company);
            const position = asString(item.role);
            const startDate = asString(item.startDate);
            if (!company || !position || !startDate) {
              return null;
            }

            const existingExperience = existingExperiencesByKey.get(
              `${company.toLowerCase()}::${position.toLowerCase()}`,
            );

            return removeUndefinedValues({
              company,
              position,
              employmentType: existingExperience?.employmentType || "Full-time",
              location: asString(item.location) || existingExperience?.location,
              startDate,
              endDate: asString(item.endDate),
              current:
                asBoolean(item.current) ??
                (Boolean(existingExperience?.current) ||
                  !asString(item.endDate)),
              description: existingExperience?.description,
              responsibilities: existingExperience?.responsibilities,
              achievements: existingExperience?.achievements,
              technologies: existingExperience?.technologies,
              companyLogo: existingExperience?.companyLogo,
              companyWebsite: existingExperience?.companyWebsite,
              order: index + 1,
              updatedAt: importedAt,
            }) as ExperienceItem;
          })
          .filter((item): item is ExperienceItem => Boolean(item))
      : currentContent.experiences;

  const existingEducationByKey = new Map(
    currentContent.education.map((item) => [
      `${item.institution.toLowerCase()}::${item.degree.toLowerCase()}`,
      item,
    ]),
  );
  const remoteEducationRaw = Array.isArray(remoteProfile.education)
    ? (remoteProfile.education as RemoteEducation[])
    : [];
  const mappedEducation: EducationItem[] =
    remoteEducationRaw.length > 0
      ? remoteEducationRaw
          .map((item, index) => {
            const institution = asString(item.institution);
            const degree = asString(item.degree);
            const startDate = asString(item.startDate);
            if (!institution || !degree || !startDate) {
              return null;
            }

            const existingEducation = existingEducationByKey.get(
              `${institution.toLowerCase()}::${degree.toLowerCase()}`,
            );

            return removeUndefinedValues({
              institution,
              degree,
              fieldOfStudy:
                asString(item.fieldOfStudy) || existingEducation?.fieldOfStudy,
              startDate,
              endDate: asString(item.endDate),
              current:
                asBoolean(item.current) ??
                (Boolean(existingEducation?.current) ||
                  !asString(item.endDate)),
              gpa: existingEducation?.gpa,
              description: existingEducation?.description,
              achievements: existingEducation?.achievements,
              logo: existingEducation?.logo,
              website: existingEducation?.website,
              order: index + 1,
              updatedAt: importedAt,
            }) as EducationItem;
          })
          .filter((item): item is EducationItem => Boolean(item))
      : currentContent.education;

  const existingServicesBySlug = new Map(
    currentContent.services.map((item) => [item.slug, item]),
  );
  const remoteServicesRaw = Array.isArray(remoteProfile.services)
    ? (remoteProfile.services as RemoteService[])
    : [];
  const mappedServices: ServiceItem[] =
    remoteServicesRaw.length > 0
      ? remoteServicesRaw
          .map((item, index) => {
            const title = asString(item.title);
            if (!title) {
              return null;
            }

            const slug = slugify(title);
            const existingService = existingServicesBySlug.get(slug);
            const remotePricing = isRecord(item.pricing) ? item.pricing : null;

            return removeUndefinedValues({
              title,
              slug,
              icon: existingService?.icon,
              shortDescription:
                asString(item.description) || existingService?.shortDescription,
              fullDescription: existingService?.fullDescription,
              features: existingService?.features,
              technologies: existingService?.technologies,
              deliverables: existingService?.deliverables,
              pricing:
                remotePricing || existingService?.pricing
                  ? {
                      startingPrice:
                        asNumber(remotePricing?.startingPrice) ??
                        existingService?.pricing?.startingPrice,
                      priceType:
                        (asString(remotePricing?.priceType) as
                          | "hourly"
                          | "project"
                          | "monthly"
                          | "custom"
                          | undefined) ?? existingService?.pricing?.priceType,
                      description:
                        asString(remotePricing?.description) ??
                        existingService?.pricing?.description,
                    }
                  : undefined,
              timeline: asString(item.timeline) || existingService?.timeline,
              featured:
                existingService?.featured !== undefined
                  ? existingService.featured
                  : index < 2,
              order: index + 1,
              updatedAt: importedAt,
            }) as ServiceItem;
          })
          .filter((item): item is ServiceItem => Boolean(item))
      : currentContent.services;

  const existingProjectsBySlug = new Map(
    currentContent.projects.map((item) => [item.slug, item]),
  );
  const remoteProjectsRaw = Array.isArray(remoteProfile.projects)
    ? (remoteProfile.projects as RemoteProject[])
    : [];
  const mappedProjects: ProjectItem[] =
    remoteProjectsRaw.length > 0
      ? (
          await Promise.all(
            remoteProjectsRaw.map(async (item, index) => {
              const title = asString(item.title);
              if (!title) {
                return null;
              }

              const slug = asString(item.slug) || slugify(title);
              const existingProject = existingProjectsBySlug.get(slug);
              const caseStudyDetails = await fetchCaseStudyDetails(
                sourceUrl,
                slug,
              );
              const remoteProjectLinks = parseRemoteProjectLinks(
                item.sourceLinks,
              );
              const citations = Array.from(
                new Map(
                  [
                    ...remoteProjectLinks,
                    ...caseStudyDetails.citations,
                    ...(existingProject?.citations ?? []),
                  ].map((link) => [normalizeUrlForDedupe(link.url), link]),
                ).values(),
              );

              const importedCoverImage =
                coverImagesByTitle.get(title.toLowerCase()) ||
                existingProject?.coverImage;
              const coverImage = importedCoverImage
                ? (await persistImageLocally(
                    importedCoverImage,
                    sourceUrl,
                    `${slug}-cover`,
                  )) || importedCoverImage
                : undefined;
              const coverImageAlt = coverImage
                ? `${title} preview`
                : existingProject?.coverImageAlt;
              const technologyNames =
                caseStudyDetails.technologyNames.length > 0
                  ? caseStudyDetails.technologyNames
                  : (existingProject?.technologies ?? []).map(
                      (tech) => tech.name,
                    );

              return removeUndefinedValues({
                title,
                slug,
                tagline: asString(item.tagline) || existingProject?.tagline,
                category: asString(item.category) || existingProject?.category,
                impactSummary:
                  asString(item.impactSummary) ||
                  caseStudyDetails.impactSummary ||
                  existingProject?.impactSummary,
                liveUrl: asString(item.liveUrl) || existingProject?.liveUrl,
                githubUrl:
                  asString(item.githubUrl) || existingProject?.githubUrl,
                featured:
                  asBoolean(item.featured) ??
                  Boolean(existingProject?.featured),
                coverImage,
                coverImageAlt,
                technologies:
                  technologyNames.length > 0
                    ? mapTechnologies(technologyNames)
                    : existingProject?.technologies,
                problemStatement:
                  caseStudyDetails.problemStatement ||
                  existingProject?.problemStatement,
                solutionApproach:
                  caseStudyDetails.solutionApproach ||
                  existingProject?.solutionApproach,
                impactMetrics: existingProject?.impactMetrics,
                citations,
                order: index + 1,
                updatedAt: importedAt,
              }) as ProjectItem;
            }),
          )
        ).filter((item): item is ProjectItem => Boolean(item))
      : currentContent.projects;

  const existingCertificationsByName = new Map(
    currentContent.certifications.map((item) => [
      item.name.toLowerCase(),
      item,
    ]),
  );
  const remoteCertificationsRaw = Array.isArray(remoteProfile.certifications)
    ? (remoteProfile.certifications as RemoteCertification[])
    : [];
  const mappedCertifications: CertificationItem[] =
    remoteCertificationsRaw.length > 0
      ? remoteCertificationsRaw
          .map((item, index) => {
            const name = asString(item.name);
            if (!name) {
              return null;
            }

            const existingCertification = existingCertificationsByName.get(
              name.toLowerCase(),
            );

            return removeUndefinedValues({
              name,
              issuer: asString(item.issuer) || existingCertification?.issuer,
              issueDate:
                asString(item.issueDate) || existingCertification?.issueDate,
              expiryDate:
                asString(item.expiryDate) || existingCertification?.expiryDate,
              credentialId:
                asString(item.credentialId) ||
                existingCertification?.credentialId,
              credentialUrl:
                asString(item.credentialUrl) ||
                existingCertification?.credentialUrl,
              logo: existingCertification?.logo,
              description: existingCertification?.description,
              skills: existingCertification?.skills,
              order: index + 1,
              updatedAt: importedAt,
            }) as CertificationItem;
          })
          .filter((item): item is CertificationItem => Boolean(item))
      : currentContent.certifications;

  const expertise = asStringArray(remoteProfile.expertise);
  const summary = asString(remotePerson.summary);
  const fullBioParagraphs = summary
    ? summary
        .split(/(?<=[.!?])\s+/)
        .map((item) => item.trim())
        .filter(Boolean)
    : currentContent.profile.fullBioParagraphs;

  const existingNavigationItems = currentContent.navigationItems;
  const updatedNavigationItems = existingNavigationItems.map((item) => {
    if (item.title.toLowerCase() === "blog" && websiteUrl) {
      return {
        ...item,
        href: websiteUrl,
        isExternal: true,
      };
    }

    if (item.title.toLowerCase() === "github" && githubProfile) {
      return {
        ...item,
        href: githubProfile,
        isExternal: true,
      };
    }

    return item;
  });

  const projectsCompletedStat =
    parsedStats.length > 0
      ? parsedStats
      : [
          {
            label: "Projects Completed",
            value: `${mappedProjects.length}+`,
          },
          {
            label: "Years Experience",
            value: `${asNumber(remotePerson.yearsOfExperience) ?? currentContent.profile.yearsOfExperience}+`,
          },
          {
            label: "Skills",
            value: `${mappedSkills.length}+`,
          },
          {
            label: "Certifications",
            value: `${mappedCertifications.length}+`,
          },
        ];

  const newContent: PortfolioContent = {
    ...currentContent,
    profile: {
      ...currentContent.profile,
      firstName,
      lastName,
      headline:
        asString(remotePerson.headline) || currentContent.profile.headline,
      shortBio: summary || currentContent.profile.shortBio,
      fullBioParagraphs,
      email: asString(remotePerson.email) || currentContent.profile.email,
      phone: asString(remotePerson.phone) || currentContent.profile.phone,
      location:
        asString(remotePerson.location) || currentContent.profile.location,
      availability: normalizeAvailability(asString(remotePerson.availability)),
      socialLinks: {
        ...currentContent.profile.socialLinks,
        github: githubProfile || currentContent.profile.socialLinks.github,
        linkedin:
          linkedinProfile || currentContent.profile.socialLinks.linkedin,
        twitter: twitterProfile || currentContent.profile.socialLinks.twitter,
        website: websiteUrl || currentContent.profile.socialLinks.website,
      },
      yearsOfExperience:
        asNumber(remotePerson.yearsOfExperience) ||
        currentContent.profile.yearsOfExperience,
      stats:
        projectsCompletedStat.length > 0
          ? projectsCompletedStat
          : currentContent.profile.stats,
      profileImage: localProfileImage || currentContent.profile.profileImage,
      headlineAnimatedWords:
        mappedServices.length > 0
          ? mappedServices.map((item) => item.title).slice(0, 4)
          : currentContent.profile.headlineAnimatedWords,
      updatedAt: importedAt,
    },
    siteSettings: {
      ...currentContent.siteSettings,
      siteTitle: fullName
        ? `${fullName} - Portfolio`
        : currentContent.siteSettings.siteTitle,
      siteDescription: summary || currentContent.siteSettings.siteDescription,
      siteKeywords:
        expertise.length > 0
          ? Array.from(
              new Set([
                fullName || "Madhu Dadi",
                ...expertise.slice(0, 12),
                "Portfolio",
              ]),
            )
          : currentContent.siteSettings.siteKeywords,
      twitterHandle:
        extractTwitterHandle(twitterProfile) ||
        currentContent.siteSettings.twitterHandle,
      updatedAt: importedAt,
    },
    navigationItems: updatedNavigationItems,
    skills: mappedSkills,
    experiences: mappedExperiences,
    education: mappedEducation,
    projects: mappedProjects,
    services: mappedServices,
    certifications: mappedCertifications,
  };

  return {
    content: newContent,
    sourceUrl,
    importedAt,
  };
}
