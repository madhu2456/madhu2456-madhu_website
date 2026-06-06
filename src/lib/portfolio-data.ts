import { promises as fs } from "node:fs";
import path from "node:path";
import defaultContentJson from "../../Data/portfolio-content.json";
import { portfolioContentSchema, PortfolioContentSchema } from "./cms-schema";
import {
  buildV2PageContentDefaults,
  upgradeServiceDefaults,
} from "./cms-v2-defaults";

export type PortfolioContent = PortfolioContentSchema;
export type Profile = PortfolioContent["profile"];
export type SiteSettings = PortfolioContent["siteSettings"];
export type NavigationItem = PortfolioContent["navigationItems"][number];
export type SkillItem = PortfolioContent["skills"][number];
export type ExperienceItem = PortfolioContent["experiences"][number];
export type EducationItem = PortfolioContent["education"][number];
export type ProjectItem = PortfolioContent["projects"][number];
export type ServiceItem = PortfolioContent["services"][number];
export type CertificationItem = PortfolioContent["certifications"][number];
export type Technology = NonNullable<
  PortfolioContent["projects"][number]["technologies"]
>[number];
export type ImpactMetric = NonNullable<
  PortfolioContent["projects"][number]["impactMetrics"]
>[number];
export type Citation = NonNullable<
  PortfolioContent["projects"][number]["citations"]
>[number];
export type PageContent = PortfolioContent["pageContent"];
export type SocialLinks = Profile["socialLinks"];
export type ProfileStat = Profile["stats"][number];

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

// We keep the old shape around for fallback scenarios where the file is unreadable.
export const defaultPortfolioContent: any = defaultContentJson;

const cloneDefaultContent = (): any =>
  JSON.parse(JSON.stringify(defaultPortfolioContent));

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
    const migrated = migratePortfolioContent(cloneDefaultContent());
    await fs.writeFile(tempPath, JSON.stringify(migrated, null, 2), "utf8");
    try {
      await fs.rename(tempPath, PORTFOLIO_CONTENT_FILE_PATH);
    } catch {
      await fs.unlink(tempPath).catch(() => undefined);
      throw new Error("Failed to initialize portfolio content file.");
    }
  }
};

const withUpdatedAt = <T extends { updatedAt?: string }>(
  items: T[],
  updatedAt: string,
) =>
  items.map((item) => ({
    ...item,
    updatedAt: item.updatedAt || updatedAt, // keep existing if present, otherwise set now
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
  ].filter(Boolean) as string[];

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

export function migratePortfolioContent(raw: any): PortfolioContent {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid raw data for migration");
  }

  // If already v2 and has pageContent, just ensure shape
  if (raw.contentVersion === 2 && raw.pageContent) {
    return raw as PortfolioContent;
  }

  // V1 to V2 Migration
  const v2Defaults = buildV2PageContentDefaults();
  const migrated = {
    ...raw,
    contentVersion: 2,
    pageContent: raw.pageContent
      ? { ...v2Defaults, ...raw.pageContent }
      : v2Defaults,
    services: (raw.services || []).map((s: any) => {
      // If service lacks seoTitle, it's likely a v1 service. Upgrade it.
      if (!s.seoTitle) {
        return upgradeServiceDefaults(s);
      }
      return s;
    }),
  };

  return migrated as PortfolioContent;
}

export async function readPortfolioContent(): Promise<PortfolioContent> {
  await ensurePortfolioContentFile();
  let rawContent: string;
  try {
    rawContent = await fs.readFile(PORTFOLIO_CONTENT_FILE_PATH, "utf8");
  } catch {
    // If read fails (permissions, corruption), recreate from defaults
    const fallback = migratePortfolioContent(cloneDefaultContent());
    await savePortfolioContent(fallback);
    return fallback;
  }

  let parsedContent: any;
  try {
    parsedContent = JSON.parse(rawContent);
  } catch {
    // Invalid JSON — recreate from defaults
    const fallback = migratePortfolioContent(cloneDefaultContent());
    await savePortfolioContent(fallback);
    return fallback;
  }

  // Attempt Migration
  try {
    parsedContent = migratePortfolioContent(parsedContent);
  } catch (e) {
    const fallback = migratePortfolioContent(cloneDefaultContent());
    await savePortfolioContent(fallback);
    return fallback;
  }

  if (!isPortfolioContent(parsedContent)) {
    // Schema mismatch — recreate from defaults
    const fallback = migratePortfolioContent(cloneDefaultContent());
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

  // Create a backup before overwriting
  const now = new Date();
  const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}-${now.getHours().toString().padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}${now.getSeconds().toString().padStart(2, "0")}`;
  const backupPath = path.join(
    path.dirname(PORTFOLIO_CONTENT_FILE_PATH),
    `portfolio-content.backup-${timestamp}.json`,
  );

  try {
    const existingData = await fs.readFile(PORTFOLIO_CONTENT_FILE_PATH, "utf8");
    await fs.writeFile(backupPath, existingData, "utf8");
  } catch {
    // ignore backup creation failure if original doesn't exist
  }

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
