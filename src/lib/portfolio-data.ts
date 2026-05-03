import { promises as fs } from "node:fs";
import path from "node:path";
import defaultContentJson from "../../Data/portfolio-content.json";
import { portfolioContentSchema } from "./cms-schema";

export type SocialLinks = {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  medium?: string;
  devto?: string;
  youtube?: string;
  stackoverflow?: string;
};

export type ProfileStat = {
  label: string;
  value: string;
};

export type Profile = {
  firstName: string;
  lastName: string;
  headline: string;
  headlineStaticText: string;
  headlineAnimatedWords: string[];
  headlineAnimationDuration: number;
  shortBio: string;
  fullBioParagraphs: string[];
  email: string;
  phone?: string;
  location: string;
  availability: "available" | "open" | "unavailable";
  socialLinks: SocialLinks;
  yearsOfExperience: number;
  stats: ProfileStat[];
  profileImage?: string;
  updatedAt: string;
};

export type SiteSettings = {
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string[];
  twitterHandle?: string;
  updatedAt: string;
};

export type Technology = {
  name: string;
  category?: string;
  color?: string;
};

export type ExperienceItem = {
  company: string;
  position: string;
  employmentType?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  responsibilities?: string[];
  achievements?: string[];
  technologies?: Technology[];
  companyLogo?: string;
  companyWebsite?: string;
  order: number;
  updatedAt: string;
};

export type EducationItem = {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  gpa?: string;
  description?: string;
  achievements?: string[];
  logo?: string;
  website?: string;
  order: number;
  updatedAt: string;
};

export type ImpactMetric = {
  label: string;
  value: string;
};

export type Citation = {
  label: string;
  url: string;
};

export type ProjectItem = {
  title: string;
  slug: string;
  tagline?: string;
  category?: string;
  impactSummary?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  coverImage?: string;
  coverImageAlt?: string;
  technologies?: Technology[];
  problemStatement?: string;
  solutionApproach?: string;
  impactMetrics?: ImpactMetric[];
  citations?: Citation[];
  order: number;
  updatedAt: string;
};

export type ServiceItem = {
  title: string;
  slug: string;
  icon?: string;
  shortDescription?: string;
  fullDescription?: string;
  features?: string[];
  technologies?: Technology[];
  deliverables?: string[];
  pricing?: {
    startingPrice?: number;
    priceType?: "hourly" | "project" | "monthly" | "custom";
    description?: string;
  };
  timeline?: string;
  featured?: boolean;
  order: number;
  updatedAt: string;
};

export type CertificationItem = {
  name: string;
  issuer?: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  logo?: string;
  description?: string;
  skills?: Technology[];
  order: number;
  updatedAt: string;
};

export type SkillItem = {
  name: string;
  category?: string;
  proficiency?: string;
  yearsOfExperience?: number;
  updatedAt: string;
};

export type NavigationItem = {
  title: string;
  href: string;
  icon: string;
  isExternal?: boolean;
  order: number;
};

// Default content is sourced from the canonical JSON file so it never drifts
// from the committed / deployed data. If the JSON is missing at runtime,
// ensurePortfolioContentFile will recreate it from this snapshot.

export type PortfolioContent = {
  profile: Profile;
  siteSettings: SiteSettings;
  navigationItems: NavigationItem[];
  skills: SkillItem[];
  experiences: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  services: ServiceItem[];
  certifications: CertificationItem[];
};

export type PortfolioData = PortfolioContent & {
  sortedNavigationItems: NavigationItem[];
  sortedExperiences: ExperienceItem[];
  sortedEducation: EducationItem[];
  sortedProjects: ProjectItem[];
  featuredProjects: ProjectItem[];
  sortedServices: ServiceItem[];
  featuredServices: ServiceItem[];
  sortedCertifications: CertificationItem[];
  portfolioLastUpdatedAt: string;
};

const PORTFOLIO_CONTENT_FILE_PATH = path.join(
  process.cwd(),
  "Data",
  "portfolio-content.json",
);

export const defaultPortfolioContent: PortfolioContent =
  defaultContentJson as unknown as PortfolioContent;

const cloneDefaultContent = (): PortfolioContent =>
  JSON.parse(JSON.stringify(defaultPortfolioContent)) as PortfolioContent;

const isPortfolioContent = (value: unknown): value is PortfolioContent => {
  return portfolioContentSchema.safeParse(value).success;
};

const ensurePortfolioContentFile = async () => {
  try {
    await fs.access(PORTFOLIO_CONTENT_FILE_PATH);
  } catch {
    await fs.mkdir(path.dirname(PORTFOLIO_CONTENT_FILE_PATH), {
      recursive: true,
    });
    const tempPath = `${PORTFOLIO_CONTENT_FILE_PATH}.tmp`;
    await fs.writeFile(
      tempPath,
      JSON.stringify(cloneDefaultContent(), null, 2),
      "utf8",
    );
    try {
      await fs.rename(tempPath, PORTFOLIO_CONTENT_FILE_PATH);
    } catch {
      await fs.unlink(tempPath).catch(() => undefined);
      throw new Error("Failed to initialize portfolio content file.");
    }
  }
};

const withUpdatedAt = <T extends { updatedAt: string }>(
  items: T[],
  updatedAt: string,
) =>
  items.map((item) => ({
    ...item,
    updatedAt,
  }));

const normalizeContentForSave = (
  content: PortfolioContent,
): PortfolioContent => {
  const now = new Date().toISOString();

  return {
    ...content,
    profile: {
      ...content.profile,
      updatedAt: now,
    },
    siteSettings: {
      ...content.siteSettings,
      updatedAt: now,
    },
    skills: withUpdatedAt(content.skills, now),
    experiences: withUpdatedAt(content.experiences, now),
    education: withUpdatedAt(content.education, now),
    projects: withUpdatedAt(content.projects, now),
    services: withUpdatedAt(content.services, now),
    certifications: withUpdatedAt(content.certifications, now),
  };
};

const buildDerivedData = (content: PortfolioContent): PortfolioData => {
  const sortedNavigationItems = [...content.navigationItems].sort(
    (a, b) => a.order - b.order,
  );
  const sortedExperiences = [...content.experiences].sort((a, b) =>
    b.startDate.localeCompare(a.startDate),
  );
  const sortedEducation = [...content.education].sort((a, b) =>
    (b.endDate || b.startDate).localeCompare(a.endDate || a.startDate),
  );
  const sortedProjects = [...content.projects].sort(
    (a, b) => a.order - b.order,
  );
  const featuredProjects = sortedProjects.filter((item) => item.featured);
  const sortedServices = [...content.services].sort(
    (a, b) => a.order - b.order,
  );
  const featuredServices = sortedServices.filter((item) => item.featured);
  const sortedCertifications = [...content.certifications].sort((a, b) =>
    (b.issueDate || "").localeCompare(a.issueDate || ""),
  );

  const updatedDates = [
    content.profile.updatedAt,
    content.siteSettings.updatedAt,
    ...sortedExperiences.map((item) => item.updatedAt),
    ...sortedEducation.map((item) => item.updatedAt),
    ...sortedProjects.map((item) => item.updatedAt),
    ...sortedServices.map((item) => item.updatedAt),
    ...sortedCertifications.map((item) => item.updatedAt),
    ...content.skills.map((item) => item.updatedAt),
  ];

  const timestamps = updatedDates
    .map((item) => new Date(item).getTime())
    .filter((item) => !Number.isNaN(item));
  const portfolioLastUpdatedAt = new Date(
    timestamps.length > 0 ? Math.max(...timestamps) : Date.now(),
  ).toISOString();

  return {
    ...content,
    sortedNavigationItems,
    sortedExperiences,
    sortedEducation,
    sortedProjects,
    featuredProjects,
    sortedServices,
    featuredServices,
    sortedCertifications,
    portfolioLastUpdatedAt,
  };
};

export const getPortfolioContentPath = () => PORTFOLIO_CONTENT_FILE_PATH;

export async function readPortfolioContent(): Promise<PortfolioContent> {
  await ensurePortfolioContentFile();
  let rawContent: string;
  try {
    rawContent = await fs.readFile(PORTFOLIO_CONTENT_FILE_PATH, "utf8");
  } catch {
    // If read fails (permissions, corruption), recreate from defaults
    const fallback = cloneDefaultContent();
    await savePortfolioContent(fallback);
    return fallback;
  }

  let parsedContent: unknown;
  try {
    parsedContent = JSON.parse(rawContent);
  } catch {
    // Invalid JSON — recreate from defaults
    const fallback = cloneDefaultContent();
    await savePortfolioContent(fallback);
    return fallback;
  }

  if (!isPortfolioContent(parsedContent)) {
    // Schema mismatch — recreate from defaults
    const fallback = cloneDefaultContent();
    await savePortfolioContent(fallback);
    return fallback;
  }

  return parsedContent;
}

export async function savePortfolioContent(
  nextContent: PortfolioContent,
): Promise<PortfolioContent> {
  if (!isPortfolioContent(nextContent)) {
    throw new Error("Cannot save invalid portfolio content.");
  }

  const normalizedContent = normalizeContentForSave(nextContent);

  await fs.mkdir(path.dirname(PORTFOLIO_CONTENT_FILE_PATH), {
    recursive: true,
  });

  const tempPath = `${PORTFOLIO_CONTENT_FILE_PATH}.tmp`;
  await fs.writeFile(
    tempPath,
    JSON.stringify(normalizedContent, null, 2),
    "utf8",
  );

  try {
    await fs.rename(tempPath, PORTFOLIO_CONTENT_FILE_PATH);
  } catch {
    // Clean up temp file if rename fails so it doesn't leak
    await fs.unlink(tempPath).catch(() => undefined);
    throw new Error("Failed to finalize portfolio content save.");
  }

  return normalizedContent;
}

export async function getPortfolioData(): Promise<PortfolioData> {
  const content = await readPortfolioContent();
  return buildDerivedData(content);
}

export async function getProjectBySlug(slug: string) {
  const { sortedProjects } = await getPortfolioData();
  return sortedProjects.find((item) => item.slug === slug);
}
