import { promises as fs } from "node:fs";
import path from "node:path";
import { cache } from "react";
import defaultContentJson from "../../Data/portfolio-content.json";
import {
  type PortfolioContentSchema,
  portfolioContentSchema,
} from "./cms-schema";
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
export const defaultPortfolioContent =
  defaultContentJson as unknown as PortfolioContent;

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

const isSame = (a: any, b: any) => {
  if (a === b) return true;
  if (!a || !b || typeof a !== "object" || typeof b !== "object") return false;
  const replacer = (key: string, value: any) =>
    key === "updatedAt" ? undefined : value;
  return JSON.stringify(a, replacer) === JSON.stringify(b, replacer);
};

export const normalizeContentForSave = (
  next: PortfolioContent,
  previous: PortfolioContent | null,
  nowOverride?: string,
): PortfolioContent => {
  const now = nowOverride || new Date().toISOString();
  if (!previous) {
    return {
      ...next,
      profile: { ...next.profile, updatedAt: now },
      siteSettings: { ...next.siteSettings, updatedAt: now },
      skills: next.skills.map((s) => ({ ...s, updatedAt: now })),
      experiences: next.experiences.map((s) => ({ ...s, updatedAt: now })),
      education: next.education.map((s) => ({ ...s, updatedAt: now })),
      projects: next.projects.map((s) => ({ ...s, updatedAt: now })),
      services: next.services.map((s) => ({ ...s, updatedAt: now })),
      certifications: next.certifications.map((s) => ({
        ...s,
        updatedAt: now,
      })),
    };
  }

  const getUpdated = (n: any, p: any) =>
    isSame(n, p) ? p.updatedAt || now : now;

  const normalizeArray = (
    nextArr: any[],
    prevArr: any[],
    idKeyFn: (item: any) => string,
  ) => {
    const prevMap = new Map(prevArr.map((p) => [idKeyFn(p), p]));
    return nextArr.map((n) => {
      const id = idKeyFn(n);
      const p = prevMap.get(id);
      if (!p) return { ...n, updatedAt: now };
      return { ...n, updatedAt: getUpdated(n, p) };
    });
  };

  return {
    ...next,
    profile: {
      ...next.profile,
      updatedAt: getUpdated(next.profile, previous.profile),
    },
    siteSettings: {
      ...next.siteSettings,
      updatedAt: getUpdated(next.siteSettings, previous.siteSettings),
    },
    skills: normalizeArray(next.skills, previous.skills, (s) => s.name),
    experiences: normalizeArray(
      next.experiences,
      previous.experiences,
      (s) => `${s.company}-${s.position}-${s.startDate}`,
    ),
    education: normalizeArray(
      next.education,
      previous.education,
      (s) => `${s.institution}-${s.degree}-${s.startDate}`,
    ),
    projects: normalizeArray(next.projects, previous.projects, (s) => s.slug),
    services: normalizeArray(next.services, previous.services, (s) => s.slug),
    certifications: normalizeArray(
      next.certifications,
      previous.certifications,
      (s) => s.credentialId || `${s.name}-${s.issuer}`,
    ),
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

  let migrated = { ...raw };

  // V1 to V2 Migration
  if (!migrated.contentVersion || migrated.contentVersion === 1) {
    const v2Defaults = buildV2PageContentDefaults();
    migrated = {
      ...migrated,
      contentVersion: 2,
      pageContent: migrated.pageContent
        ? { ...v2Defaults, ...migrated.pageContent }
        : v2Defaults,
      services: (migrated.services || []).map((s: any) => {
        if (!s.seoTitle) {
          return upgradeServiceDefaults(s);
        }
        return s;
      }),
    };
  }

  // V2 to V3 Migration
  if (migrated.contentVersion === 2) {
    migrated = {
      ...migrated,
      contentVersion: 3,
    };
  }

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
  } catch (_err) {
    throw new Error(
      "Invalid JSON in portfolio content file. Please fix it or restore from a backup.",
    );
  }

  // Attempt Migration
  parsedContent = migratePortfolioContent(parsedContent);

  const validationResult = portfolioContentSchema.safeParse(parsedContent);
  if (!validationResult.success) {
    console.error(
      "Portfolio content validation errors:",
      JSON.stringify(validationResult.error.format(), null, 2),
    );
    throw new Error(
      "Portfolio content fails schema validation. Check the console logs for detailed Zod errors, fix the file, or restore from a backup.",
    );
  }

  return validationResult.data as PortfolioContent;
}

export async function savePortfolioContent(
  nextContent: PortfolioContent,
): Promise<PortfolioContent> {
  if (!isPortfolioContent(nextContent)) {
    throw new Error("Cannot save invalid portfolio content.");
  }

  let previous: PortfolioContent | null = null;
  try {
    const raw = await fs.readFile(PORTFOLIO_CONTENT_FILE_PATH, "utf8");
    previous = JSON.parse(raw);
  } catch {}

  const normalizedContent = normalizeContentForSave(nextContent, previous);

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

    // Keep last 10 backups
    const dir = path.dirname(PORTFOLIO_CONTENT_FILE_PATH);
    const files = await fs.readdir(dir);
    const backups = files.filter((f) =>
      f.startsWith("portfolio-content.backup-"),
    );
    if (backups.length > 10) {
      backups.sort();
      const toDelete = backups.slice(0, backups.length - 10);
      for (const file of toDelete) {
        await fs.unlink(path.join(dir, file)).catch(() => {});
      }
    }
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

export const getPortfolioData = cache(async (): Promise<PortfolioData> => {
  const content = await readPortfolioContent();
  return buildDerivedData(content);
});

export async function getProjectBySlug(slug: string) {
  const { sortedProjects } = await getPortfolioData();
  return sortedProjects.find((item) => item.slug === slug);
}
