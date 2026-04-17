"use client";

import {
  type ChangeEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type SocialLinks = {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  medium?: string;
  devto?: string;
  youtube?: string;
  stackoverflow?: string;
};

type ProfileStat = {
  label: string;
  value: string;
};

type Profile = {
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

type SiteSettings = {
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string[];
  twitterHandle?: string;
  updatedAt: string;
};

type Technology = {
  name: string;
  category?: string;
  color?: string;
};

type ExperienceItem = {
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

type EducationItem = {
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

type ImpactMetric = {
  label: string;
  value: string;
};

type Citation = {
  label: string;
  url: string;
};

type ProjectItem = {
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

type ServiceItem = {
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

type CertificationItem = {
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

type SkillItem = {
  name: string;
  category?: string;
  proficiency?: string;
  yearsOfExperience?: number;
  updatedAt: string;
};

type NavigationItem = {
  title: string;
  href: string;
  icon: string;
  isExternal?: boolean;
  order: number;
};

type PortfolioContent = {
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

type SectionKey = keyof PortfolioContent;

type CmsApiResponse = {
  content?: unknown;
  contentPath?: string;
  updatedAt?: string;
  sourceUrl?: string;
  importedAt?: string;
  error?: string;
};

type CmsUploadResponse = {
  url?: string;
  error?: string;
};

const inputClass =
  "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40";
const textareaClass =
  "min-h-[120px] w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40";

const sectionConfig: Array<{ key: SectionKey; label: string }> = [
  { key: "profile", label: "Profile" },
  { key: "siteSettings", label: "Site settings" },
  { key: "navigationItems", label: "Navigation" },
  { key: "skills", label: "Skills" },
  { key: "experiences", label: "Experience" },
  { key: "education", label: "Education" },
  { key: "projects", label: "Projects" },
  { key: "services", label: "Services" },
  { key: "certifications", label: "Certifications" },
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isPortfolioContent = (value: unknown): value is PortfolioContent => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isRecord(value.profile) &&
    isRecord(value.siteSettings) &&
    Array.isArray(value.navigationItems) &&
    Array.isArray(value.skills) &&
    Array.isArray(value.experiences) &&
    Array.isArray(value.education) &&
    Array.isArray(value.projects) &&
    Array.isArray(value.services) &&
    Array.isArray(value.certifications)
  );
};

const parseLines = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const toLineText = (items?: string[]) => (items ?? []).join("\n");

const parseTechnologies = (value: string): Technology[] =>
  parseLines(value)
    .map((line) => {
      const [name, category, color] = line
        .split("|")
        .map((item) => item.trim());
      if (!name) {
        return null;
      }

      return {
        name,
        ...(category ? { category } : {}),
        ...(color ? { color } : {}),
      };
    })
    .filter((item): item is Technology => Boolean(item));

const toTechnologyLines = (items?: Technology[]) =>
  (items ?? [])
    .map((item) =>
      [item.name, item.category ?? "", item.color ?? ""]
        .filter(Boolean)
        .join("|"),
    )
    .join("\n");

const parseImpactMetrics = (value: string): ImpactMetric[] =>
  parseLines(value)
    .map((line) => {
      const [label, metricValue] = line.split("|").map((item) => item.trim());
      if (!label || !metricValue) {
        return null;
      }

      return { label, value: metricValue };
    })
    .filter((item): item is ImpactMetric => Boolean(item));

const toImpactMetricLines = (items?: ImpactMetric[]) =>
  (items ?? []).map((item) => `${item.label}|${item.value}`).join("\n");

const parseCitations = (value: string): Citation[] =>
  parseLines(value)
    .map((line) => {
      const [label, url] = line.split("|").map((item) => item.trim());
      if (!label || !url) {
        return null;
      }

      return { label, url };
    })
    .filter((item): item is Citation => Boolean(item));

const toCitationLines = (items?: Citation[]) =>
  (items ?? []).map((item) => `${item.label}|${item.url}`).join("\n");

const toNumber = (value: string, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toOptionalNumber = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
};

function FormField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium">{label}</p>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/cms/upload", {
      method: "POST",
      body: formData,
    });

    const payload = (await response.json()) as CmsUploadResponse;
    if (!response.ok || !payload.url) {
      setUploadError(payload.error || "Image upload failed.");
      setUploading(false);
      return;
    }

    onChange(payload.url);
    setUploading(false);
  };

  return (
    <div className="space-y-2 rounded-md border p-3">
      <div className="text-sm font-medium">{label}</div>
      <input
        type="text"
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
        placeholder="/uploads/cms/your-image.png"
      />
      <div className="flex flex-wrap items-center gap-2">
        <label className="inline-flex cursor-pointer items-center rounded-md border px-3 py-2 text-sm hover:bg-accent">
          <span>{uploading ? "Uploading..." : "Upload image"}</span>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => void onFileChange(event)}
            className="hidden"
            disabled={uploading}
          />
        </label>
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
          >
            Clear
          </button>
        ) : null}
      </div>
      {uploadError ? (
        <p className="text-sm text-red-500">{uploadError}</p>
      ) : null}
    </div>
  );
}

export function CmsEditor() {
  const [content, setContent] = useState<PortfolioContent | null>(null);
  const [contentPath, setContentPath] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<SectionKey>("profile");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("");

  const sectionSummary = useMemo(() => {
    if (!content) {
      return {} as Record<SectionKey, string>;
    }

    return {
      profile:
        `${content.profile.firstName} ${content.profile.lastName}`.trim(),
      siteSettings: content.siteSettings.siteTitle || "Site settings",
      navigationItems: `${content.navigationItems.length} items`,
      skills: `${content.skills.length} items`,
      experiences: `${content.experiences.length} items`,
      education: `${content.education.length} items`,
      projects: `${content.projects.length} items`,
      services: `${content.services.length} items`,
      certifications: `${content.certifications.length} items`,
    };
  }, [content]);

  const loadContent = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");
    setStatusMessage("");

    const response = await fetch("/api/cms/content", { cache: "no-store" });
    const payload = (await response.json()) as CmsApiResponse;

    if (!response.ok) {
      throw new Error(payload.error || "Failed to load portfolio content.");
    }

    if (!isPortfolioContent(payload.content)) {
      throw new Error("CMS API returned invalid content payload.");
    }

    setContent(payload.content);
    setContentPath(payload.contentPath || "");
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadContent().catch((error: unknown) => {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load CMS content.",
      );
      setLoading(false);
    });
  }, [loadContent]);

  const updateContent = useCallback(
    (updater: (current: PortfolioContent) => PortfolioContent) => {
      setContent((current) => (current ? updater(current) : current));
    },
    [],
  );

  const saveContent = useCallback(async () => {
    if (!content) {
      return;
    }

    setSaving(true);
    setErrorMessage("");
    setStatusMessage("");

    const response = await fetch("/api/cms/content", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    const payload = (await response.json()) as CmsApiResponse;
    if (!response.ok) {
      setErrorMessage(payload.error || "Failed to save CMS content.");
      setSaving(false);
      return;
    }

    if (!isPortfolioContent(payload.content)) {
      setErrorMessage("CMS API returned invalid data after saving.");
      setSaving(false);
      return;
    }

    setContent(payload.content);
    setStatusMessage(
      payload.updatedAt
        ? `Saved successfully at ${new Date(payload.updatedAt).toLocaleString()}.`
        : "Saved successfully.",
    );
    setSaving(false);
  }, [content]);

  const onReload = useCallback(async () => {
    await loadContent().catch((error: unknown) => {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to reload content.",
      );
      setLoading(false);
    });
  }, [loadContent]);

  const syncFromLiveSite = useCallback(async () => {
    setSyncing(true);
    setErrorMessage("");
    setStatusMessage("");

    const response = await fetch("/api/cms/import-live", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sourceUrl: "https://madhudadi.in" }),
    });

    const payload = (await response.json()) as CmsApiResponse;
    if (!response.ok) {
      setErrorMessage(
        payload.error || "Failed to import content from live site.",
      );
      setSyncing(false);
      return;
    }

    if (!isPortfolioContent(payload.content)) {
      setErrorMessage("Import API returned invalid content.");
      setSyncing(false);
      return;
    }

    setContent(payload.content);
    setStatusMessage(
      payload.importedAt
        ? `Imported latest content from ${payload.sourceUrl || "live site"} at ${new Date(payload.importedAt).toLocaleString()}.`
        : "Imported latest content from live site.",
    );
    setSyncing(false);
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
        Loading local CMS content...
      </div>
    );
  }

  if (!content) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-500">
        {errorMessage || "CMS content is unavailable."}
      </div>
    );
  }

  const profile = content.profile;

  const renderSectionEditor = () => {
    switch (selectedSection) {
      case "profile":
        return (
          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="First name">
                <input
                  className={inputClass}
                  value={profile.firstName}
                  onChange={(event) =>
                    updateContent((current) => ({
                      ...current,
                      profile: {
                        ...current.profile,
                        firstName: event.target.value,
                      },
                    }))
                  }
                />
              </FormField>
              <FormField label="Last name">
                <input
                  className={inputClass}
                  value={profile.lastName}
                  onChange={(event) =>
                    updateContent((current) => ({
                      ...current,
                      profile: {
                        ...current.profile,
                        lastName: event.target.value,
                      },
                    }))
                  }
                />
              </FormField>
              <FormField label="Headline">
                <input
                  className={inputClass}
                  value={profile.headline}
                  onChange={(event) =>
                    updateContent((current) => ({
                      ...current,
                      profile: {
                        ...current.profile,
                        headline: event.target.value,
                      },
                    }))
                  }
                />
              </FormField>
              <FormField label="Headline static text">
                <input
                  className={inputClass}
                  value={profile.headlineStaticText}
                  onChange={(event) =>
                    updateContent((current) => ({
                      ...current,
                      profile: {
                        ...current.profile,
                        headlineStaticText: event.target.value,
                      },
                    }))
                  }
                />
              </FormField>
              <FormField label="Animation duration (ms)">
                <input
                  type="number"
                  className={inputClass}
                  value={profile.headlineAnimationDuration}
                  onChange={(event) =>
                    updateContent((current) => ({
                      ...current,
                      profile: {
                        ...current.profile,
                        headlineAnimationDuration: toNumber(
                          event.target.value,
                          3000,
                        ),
                      },
                    }))
                  }
                />
              </FormField>
              <FormField label="Years of experience">
                <input
                  type="number"
                  className={inputClass}
                  value={profile.yearsOfExperience}
                  onChange={(event) =>
                    updateContent((current) => ({
                      ...current,
                      profile: {
                        ...current.profile,
                        yearsOfExperience: toNumber(event.target.value, 0),
                      },
                    }))
                  }
                />
              </FormField>
              <FormField label="Email">
                <input
                  type="email"
                  className={inputClass}
                  value={profile.email}
                  onChange={(event) =>
                    updateContent((current) => ({
                      ...current,
                      profile: {
                        ...current.profile,
                        email: event.target.value,
                      },
                    }))
                  }
                />
              </FormField>
              <FormField label="Phone">
                <input
                  className={inputClass}
                  value={profile.phone ?? ""}
                  onChange={(event) =>
                    updateContent((current) => ({
                      ...current,
                      profile: {
                        ...current.profile,
                        phone: event.target.value || undefined,
                      },
                    }))
                  }
                />
              </FormField>
              <FormField label="Location">
                <input
                  className={inputClass}
                  value={profile.location}
                  onChange={(event) =>
                    updateContent((current) => ({
                      ...current,
                      profile: {
                        ...current.profile,
                        location: event.target.value,
                      },
                    }))
                  }
                />
              </FormField>
              <FormField label="Availability">
                <select
                  className={inputClass}
                  value={profile.availability}
                  onChange={(event) =>
                    updateContent((current) => ({
                      ...current,
                      profile: {
                        ...current.profile,
                        availability: event.target
                          .value as Profile["availability"],
                      },
                    }))
                  }
                >
                  <option value="available">Available</option>
                  <option value="open">Open</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </FormField>
            </div>

            <FormField label="Short bio">
              <textarea
                className={textareaClass}
                value={profile.shortBio}
                onChange={(event) =>
                  updateContent((current) => ({
                    ...current,
                    profile: {
                      ...current.profile,
                      shortBio: event.target.value,
                    },
                  }))
                }
              />
            </FormField>

            <FormField
              label="Headline animated words"
              hint="One item per line."
            >
              <textarea
                className={textareaClass}
                value={toLineText(profile.headlineAnimatedWords)}
                onChange={(event) =>
                  updateContent((current) => ({
                    ...current,
                    profile: {
                      ...current.profile,
                      headlineAnimatedWords: parseLines(event.target.value),
                    },
                  }))
                }
              />
            </FormField>

            <FormField
              label="Full bio paragraphs"
              hint="One paragraph per line."
            >
              <textarea
                className={textareaClass}
                value={toLineText(profile.fullBioParagraphs)}
                onChange={(event) =>
                  updateContent((current) => ({
                    ...current,
                    profile: {
                      ...current.profile,
                      fullBioParagraphs: parseLines(event.target.value),
                    },
                  }))
                }
              />
            </FormField>

            <ImageUploadField
              label="Profile image"
              value={profile.profileImage}
              onChange={(value) =>
                updateContent((current) => ({
                  ...current,
                  profile: {
                    ...current.profile,
                    profileImage: value || undefined,
                  },
                }))
              }
            />

            <div className="space-y-3 rounded-lg border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold">Social links</h3>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {(
                  Object.keys(profile.socialLinks) as Array<keyof SocialLinks>
                ).map((key) => (
                  <FormField key={key} label={key}>
                    <input
                      className={inputClass}
                      value={profile.socialLinks[key] ?? ""}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          profile: {
                            ...current.profile,
                            socialLinks: {
                              ...current.profile.socialLinks,
                              [key]: event.target.value || undefined,
                            },
                          },
                        }))
                      }
                    />
                  </FormField>
                ))}
              </div>
            </div>

            <div className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Stats</h3>
                <button
                  type="button"
                  onClick={() =>
                    updateContent((current) => ({
                      ...current,
                      profile: {
                        ...current.profile,
                        stats: [
                          ...current.profile.stats,
                          {
                            label: `Stat ${current.profile.stats.length + 1}`,
                            value: "",
                          },
                        ],
                      },
                    }))
                  }
                  className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
                >
                  Add stat
                </button>
              </div>
              {profile.stats.map((stat, statIndex) => (
                <div
                  key={`${stat.label}-${stat.value}`}
                  className="grid gap-3 rounded-md border p-3 md:grid-cols-[1fr_1fr_auto]"
                >
                  <input
                    className={inputClass}
                    value={stat.label}
                    onChange={(event) =>
                      updateContent((current) => ({
                        ...current,
                        profile: {
                          ...current.profile,
                          stats: current.profile.stats.map((item, index) =>
                            index === statIndex
                              ? { ...item, label: event.target.value }
                              : item,
                          ),
                        },
                      }))
                    }
                    placeholder="Label"
                  />
                  <input
                    className={inputClass}
                    value={stat.value}
                    onChange={(event) =>
                      updateContent((current) => ({
                        ...current,
                        profile: {
                          ...current.profile,
                          stats: current.profile.stats.map((item, index) =>
                            index === statIndex
                              ? { ...item, value: event.target.value }
                              : item,
                          ),
                        },
                      }))
                    }
                    placeholder="Value"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      updateContent((current) => ({
                        ...current,
                        profile: {
                          ...current.profile,
                          stats: current.profile.stats.filter(
                            (_item, index) => index !== statIndex,
                          ),
                        },
                      }))
                    }
                    className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case "siteSettings":
        return (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Site title">
                <input
                  className={inputClass}
                  value={content.siteSettings.siteTitle}
                  onChange={(event) =>
                    updateContent((current) => ({
                      ...current,
                      siteSettings: {
                        ...current.siteSettings,
                        siteTitle: event.target.value,
                      },
                    }))
                  }
                />
              </FormField>
              <FormField label="Twitter handle">
                <input
                  className={inputClass}
                  value={content.siteSettings.twitterHandle ?? ""}
                  onChange={(event) =>
                    updateContent((current) => ({
                      ...current,
                      siteSettings: {
                        ...current.siteSettings,
                        twitterHandle: event.target.value || undefined,
                      },
                    }))
                  }
                />
              </FormField>
            </div>
            <FormField label="Site description">
              <textarea
                className={textareaClass}
                value={content.siteSettings.siteDescription}
                onChange={(event) =>
                  updateContent((current) => ({
                    ...current,
                    siteSettings: {
                      ...current.siteSettings,
                      siteDescription: event.target.value,
                    },
                  }))
                }
              />
            </FormField>
            <FormField label="Site keywords" hint="One keyword per line.">
              <textarea
                className={textareaClass}
                value={toLineText(content.siteSettings.siteKeywords)}
                onChange={(event) =>
                  updateContent((current) => ({
                    ...current,
                    siteSettings: {
                      ...current.siteSettings,
                      siteKeywords: parseLines(event.target.value),
                    },
                  }))
                }
              />
            </FormField>
          </div>
        );

      case "navigationItems":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() =>
                  updateContent((current) => ({
                    ...current,
                    navigationItems: [
                      ...current.navigationItems,
                      {
                        title: `Item ${current.navigationItems.length + 1}`,
                        href: "#",
                        icon: "IconCircle",
                        order: current.navigationItems.length + 1,
                      },
                    ],
                  }))
                }
                className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
              >
                Add navigation item
              </button>
            </div>
            {content.navigationItems.map((item, itemIndex) => (
              <div
                key={`${item.title}-${item.href}-${item.order}`}
                className="space-y-3 rounded-lg border p-4"
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <FormField label="Title">
                    <input
                      className={inputClass}
                      value={item.title}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          navigationItems: current.navigationItems.map(
                            (entry, index) =>
                              index === itemIndex
                                ? { ...entry, title: event.target.value }
                                : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                  <FormField label="Href">
                    <input
                      className={inputClass}
                      value={item.href}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          navigationItems: current.navigationItems.map(
                            (entry, index) =>
                              index === itemIndex
                                ? { ...entry, href: event.target.value }
                                : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                  <FormField label="Icon name">
                    <input
                      className={inputClass}
                      value={item.icon}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          navigationItems: current.navigationItems.map(
                            (entry, index) =>
                              index === itemIndex
                                ? { ...entry, icon: event.target.value }
                                : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                  <FormField label="Order">
                    <input
                      type="number"
                      className={inputClass}
                      value={item.order}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          navigationItems: current.navigationItems.map(
                            (entry, index) =>
                              index === itemIndex
                                ? {
                                    ...entry,
                                    order: toNumber(event.target.value, 0),
                                  }
                                : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                </div>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={Boolean(item.isExternal)}
                    onChange={(event) =>
                      updateContent((current) => ({
                        ...current,
                        navigationItems: current.navigationItems.map(
                          (entry, index) =>
                            index === itemIndex
                              ? { ...entry, isExternal: event.target.checked }
                              : entry,
                        ),
                      }))
                    }
                  />
                  External link
                </label>
                <button
                  type="button"
                  onClick={() =>
                    updateContent((current) => ({
                      ...current,
                      navigationItems: current.navigationItems.filter(
                        (_entry, index) => index !== itemIndex,
                      ),
                    }))
                  }
                  className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
                >
                  Remove item
                </button>
              </div>
            ))}
          </div>
        );

      case "skills":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() =>
                  updateContent((current) => ({
                    ...current,
                    skills: [
                      ...current.skills,
                      {
                        name: `Skill ${current.skills.length + 1}`,
                        category: "",
                        proficiency: "intermediate",
                        yearsOfExperience: 1,
                        updatedAt: new Date().toISOString(),
                      },
                    ],
                  }))
                }
                className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
              >
                Add skill
              </button>
            </div>
            {content.skills.map((item, itemIndex) => (
              <div
                key={`${item.name}-${item.category ?? ""}-${item.yearsOfExperience ?? 0}`}
                className="grid gap-3 rounded-lg border p-4 md:grid-cols-4"
              >
                <FormField label="Name">
                  <input
                    className={inputClass}
                    value={item.name}
                    onChange={(event) =>
                      updateContent((current) => ({
                        ...current,
                        skills: current.skills.map((entry, index) =>
                          index === itemIndex
                            ? { ...entry, name: event.target.value }
                            : entry,
                        ),
                      }))
                    }
                  />
                </FormField>
                <FormField label="Category">
                  <input
                    className={inputClass}
                    value={item.category ?? ""}
                    onChange={(event) =>
                      updateContent((current) => ({
                        ...current,
                        skills: current.skills.map((entry, index) =>
                          index === itemIndex
                            ? {
                                ...entry,
                                category: event.target.value || undefined,
                              }
                            : entry,
                        ),
                      }))
                    }
                  />
                </FormField>
                <FormField label="Proficiency">
                  <input
                    className={inputClass}
                    value={item.proficiency ?? ""}
                    onChange={(event) =>
                      updateContent((current) => ({
                        ...current,
                        skills: current.skills.map((entry, index) =>
                          index === itemIndex
                            ? {
                                ...entry,
                                proficiency: event.target.value || undefined,
                              }
                            : entry,
                        ),
                      }))
                    }
                  />
                </FormField>
                <FormField label="Years">
                  <input
                    type="number"
                    className={inputClass}
                    value={item.yearsOfExperience ?? ""}
                    onChange={(event) =>
                      updateContent((current) => ({
                        ...current,
                        skills: current.skills.map((entry, index) =>
                          index === itemIndex
                            ? {
                                ...entry,
                                yearsOfExperience: toOptionalNumber(
                                  event.target.value,
                                ),
                              }
                            : entry,
                        ),
                      }))
                    }
                  />
                </FormField>
                <button
                  type="button"
                  onClick={() =>
                    updateContent((current) => ({
                      ...current,
                      skills: current.skills.filter(
                        (_entry, index) => index !== itemIndex,
                      ),
                    }))
                  }
                  className="rounded-md border px-3 py-2 text-sm hover:bg-accent md:col-span-4 md:justify-self-start"
                >
                  Remove skill
                </button>
              </div>
            ))}
          </div>
        );

      case "experiences":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() =>
                  updateContent((current) => ({
                    ...current,
                    experiences: [
                      ...current.experiences,
                      {
                        company: `Company ${current.experiences.length + 1}`,
                        position: "Role",
                        startDate: new Date().toISOString().slice(0, 10),
                        order: current.experiences.length + 1,
                        updatedAt: new Date().toISOString(),
                      },
                    ],
                  }))
                }
                className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
              >
                Add experience
              </button>
            </div>
            {content.experiences.map((item, itemIndex) => (
              <div
                key={`${item.company}-${item.position}-${item.startDate}`}
                className="space-y-4 rounded-lg border p-4"
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <FormField label="Company">
                    <input
                      className={inputClass}
                      value={item.company}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          experiences: current.experiences.map(
                            (entry, index) =>
                              index === itemIndex
                                ? { ...entry, company: event.target.value }
                                : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                  <FormField label="Position">
                    <input
                      className={inputClass}
                      value={item.position}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          experiences: current.experiences.map(
                            (entry, index) =>
                              index === itemIndex
                                ? { ...entry, position: event.target.value }
                                : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                  <FormField label="Employment type">
                    <input
                      className={inputClass}
                      value={item.employmentType ?? ""}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          experiences: current.experiences.map(
                            (entry, index) =>
                              index === itemIndex
                                ? {
                                    ...entry,
                                    employmentType:
                                      event.target.value || undefined,
                                  }
                                : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                  <FormField label="Location">
                    <input
                      className={inputClass}
                      value={item.location ?? ""}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          experiences: current.experiences.map(
                            (entry, index) =>
                              index === itemIndex
                                ? {
                                    ...entry,
                                    location: event.target.value || undefined,
                                  }
                                : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                  <FormField label="Start date">
                    <input
                      type="date"
                      className={inputClass}
                      value={item.startDate}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          experiences: current.experiences.map(
                            (entry, index) =>
                              index === itemIndex
                                ? { ...entry, startDate: event.target.value }
                                : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                  <FormField label="End date">
                    <input
                      type="date"
                      className={inputClass}
                      value={item.endDate ?? ""}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          experiences: current.experiences.map(
                            (entry, index) =>
                              index === itemIndex
                                ? {
                                    ...entry,
                                    endDate: event.target.value || undefined,
                                  }
                                : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                  <FormField label="Company website">
                    <input
                      className={inputClass}
                      value={item.companyWebsite ?? ""}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          experiences: current.experiences.map(
                            (entry, index) =>
                              index === itemIndex
                                ? {
                                    ...entry,
                                    companyWebsite:
                                      event.target.value || undefined,
                                  }
                                : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                  <FormField label="Order">
                    <input
                      type="number"
                      className={inputClass}
                      value={item.order}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          experiences: current.experiences.map(
                            (entry, index) =>
                              index === itemIndex
                                ? {
                                    ...entry,
                                    order: toNumber(event.target.value, 0),
                                  }
                                : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                </div>

                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={Boolean(item.current)}
                    onChange={(event) =>
                      updateContent((current) => ({
                        ...current,
                        experiences: current.experiences.map((entry, index) =>
                          index === itemIndex
                            ? { ...entry, current: event.target.checked }
                            : entry,
                        ),
                      }))
                    }
                  />
                  Current role
                </label>

                <ImageUploadField
                  label="Company logo"
                  value={item.companyLogo}
                  onChange={(value) =>
                    updateContent((current) => ({
                      ...current,
                      experiences: current.experiences.map((entry, index) =>
                        index === itemIndex
                          ? { ...entry, companyLogo: value || undefined }
                          : entry,
                      ),
                    }))
                  }
                />

                <FormField label="Description">
                  <textarea
                    className={textareaClass}
                    value={item.description ?? ""}
                    onChange={(event) =>
                      updateContent((current) => ({
                        ...current,
                        experiences: current.experiences.map((entry, index) =>
                          index === itemIndex
                            ? {
                                ...entry,
                                description: event.target.value || undefined,
                              }
                            : entry,
                        ),
                      }))
                    }
                  />
                </FormField>

                <FormField
                  label="Responsibilities"
                  hint="One responsibility per line."
                >
                  <textarea
                    className={textareaClass}
                    value={toLineText(item.responsibilities)}
                    onChange={(event) =>
                      updateContent((current) => ({
                        ...current,
                        experiences: current.experiences.map((entry, index) =>
                          index === itemIndex
                            ? {
                                ...entry,
                                responsibilities: parseLines(
                                  event.target.value,
                                ),
                              }
                            : entry,
                        ),
                      }))
                    }
                  />
                </FormField>

                <FormField
                  label="Achievements"
                  hint="One achievement per line."
                >
                  <textarea
                    className={textareaClass}
                    value={toLineText(item.achievements)}
                    onChange={(event) =>
                      updateContent((current) => ({
                        ...current,
                        experiences: current.experiences.map((entry, index) =>
                          index === itemIndex
                            ? {
                                ...entry,
                                achievements: parseLines(event.target.value),
                              }
                            : entry,
                        ),
                      }))
                    }
                  />
                </FormField>

                <FormField
                  label="Technologies"
                  hint="One per line as name|category|color."
                >
                  <textarea
                    className={textareaClass}
                    value={toTechnologyLines(item.technologies)}
                    onChange={(event) =>
                      updateContent((current) => ({
                        ...current,
                        experiences: current.experiences.map((entry, index) =>
                          index === itemIndex
                            ? {
                                ...entry,
                                technologies: parseTechnologies(
                                  event.target.value,
                                ),
                              }
                            : entry,
                        ),
                      }))
                    }
                  />
                </FormField>

                <button
                  type="button"
                  onClick={() =>
                    updateContent((current) => ({
                      ...current,
                      experiences: current.experiences.filter(
                        (_entry, index) => index !== itemIndex,
                      ),
                    }))
                  }
                  className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
                >
                  Remove experience
                </button>
              </div>
            ))}
          </div>
        );

      case "education":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() =>
                  updateContent((current) => ({
                    ...current,
                    education: [
                      ...current.education,
                      {
                        institution: `Institution ${current.education.length + 1}`,
                        degree: "Degree",
                        startDate: new Date().toISOString().slice(0, 10),
                        order: current.education.length + 1,
                        updatedAt: new Date().toISOString(),
                      },
                    ],
                  }))
                }
                className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
              >
                Add education
              </button>
            </div>
            {content.education.map((item, itemIndex) => (
              <div
                key={`${item.institution}-${item.degree}-${item.startDate}`}
                className="space-y-4 rounded-lg border p-4"
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <FormField label="Institution">
                    <input
                      className={inputClass}
                      value={item.institution}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          education: current.education.map((entry, index) =>
                            index === itemIndex
                              ? { ...entry, institution: event.target.value }
                              : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                  <FormField label="Degree">
                    <input
                      className={inputClass}
                      value={item.degree}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          education: current.education.map((entry, index) =>
                            index === itemIndex
                              ? { ...entry, degree: event.target.value }
                              : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                  <FormField label="Field of study">
                    <input
                      className={inputClass}
                      value={item.fieldOfStudy ?? ""}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          education: current.education.map((entry, index) =>
                            index === itemIndex
                              ? {
                                  ...entry,
                                  fieldOfStudy: event.target.value || undefined,
                                }
                              : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                  <FormField label="GPA">
                    <input
                      className={inputClass}
                      value={item.gpa ?? ""}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          education: current.education.map((entry, index) =>
                            index === itemIndex
                              ? {
                                  ...entry,
                                  gpa: event.target.value || undefined,
                                }
                              : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                  <FormField label="Start date">
                    <input
                      type="date"
                      className={inputClass}
                      value={item.startDate}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          education: current.education.map((entry, index) =>
                            index === itemIndex
                              ? { ...entry, startDate: event.target.value }
                              : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                  <FormField label="End date">
                    <input
                      type="date"
                      className={inputClass}
                      value={item.endDate ?? ""}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          education: current.education.map((entry, index) =>
                            index === itemIndex
                              ? {
                                  ...entry,
                                  endDate: event.target.value || undefined,
                                }
                              : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                  <FormField label="Website">
                    <input
                      className={inputClass}
                      value={item.website ?? ""}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          education: current.education.map((entry, index) =>
                            index === itemIndex
                              ? {
                                  ...entry,
                                  website: event.target.value || undefined,
                                }
                              : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                  <FormField label="Order">
                    <input
                      type="number"
                      className={inputClass}
                      value={item.order}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          education: current.education.map((entry, index) =>
                            index === itemIndex
                              ? {
                                  ...entry,
                                  order: toNumber(event.target.value, 0),
                                }
                              : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                </div>

                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={Boolean(item.current)}
                    onChange={(event) =>
                      updateContent((current) => ({
                        ...current,
                        education: current.education.map((entry, index) =>
                          index === itemIndex
                            ? { ...entry, current: event.target.checked }
                            : entry,
                        ),
                      }))
                    }
                  />
                  Current education
                </label>

                <ImageUploadField
                  label="Institution logo"
                  value={item.logo}
                  onChange={(value) =>
                    updateContent((current) => ({
                      ...current,
                      education: current.education.map((entry, index) =>
                        index === itemIndex
                          ? { ...entry, logo: value || undefined }
                          : entry,
                      ),
                    }))
                  }
                />

                <FormField label="Description">
                  <textarea
                    className={textareaClass}
                    value={item.description ?? ""}
                    onChange={(event) =>
                      updateContent((current) => ({
                        ...current,
                        education: current.education.map((entry, index) =>
                          index === itemIndex
                            ? {
                                ...entry,
                                description: event.target.value || undefined,
                              }
                            : entry,
                        ),
                      }))
                    }
                  />
                </FormField>

                <FormField
                  label="Achievements"
                  hint="One achievement per line."
                >
                  <textarea
                    className={textareaClass}
                    value={toLineText(item.achievements)}
                    onChange={(event) =>
                      updateContent((current) => ({
                        ...current,
                        education: current.education.map((entry, index) =>
                          index === itemIndex
                            ? {
                                ...entry,
                                achievements: parseLines(event.target.value),
                              }
                            : entry,
                        ),
                      }))
                    }
                  />
                </FormField>

                <button
                  type="button"
                  onClick={() =>
                    updateContent((current) => ({
                      ...current,
                      education: current.education.filter(
                        (_entry, index) => index !== itemIndex,
                      ),
                    }))
                  }
                  className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
                >
                  Remove education
                </button>
              </div>
            ))}
          </div>
        );

      case "projects":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() =>
                  updateContent((current) => ({
                    ...current,
                    projects: [
                      ...current.projects,
                      {
                        title: `Project ${current.projects.length + 1}`,
                        slug: `project-${current.projects.length + 1}`,
                        order: current.projects.length + 1,
                        updatedAt: new Date().toISOString(),
                      },
                    ],
                  }))
                }
                className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
              >
                Add project
              </button>
            </div>
            {content.projects.map((item, itemIndex) => (
              <div
                key={`${item.slug}-${item.order}`}
                className="space-y-4 rounded-lg border p-4"
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <FormField label="Title">
                    <input
                      className={inputClass}
                      value={item.title}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          projects: current.projects.map((entry, index) =>
                            index === itemIndex
                              ? { ...entry, title: event.target.value }
                              : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                  <FormField label="Slug">
                    <input
                      className={inputClass}
                      value={item.slug}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          projects: current.projects.map((entry, index) =>
                            index === itemIndex
                              ? { ...entry, slug: event.target.value }
                              : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                  <FormField label="Category">
                    <input
                      className={inputClass}
                      value={item.category ?? ""}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          projects: current.projects.map((entry, index) =>
                            index === itemIndex
                              ? {
                                  ...entry,
                                  category: event.target.value || undefined,
                                }
                              : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                  <FormField label="Order">
                    <input
                      type="number"
                      className={inputClass}
                      value={item.order}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          projects: current.projects.map((entry, index) =>
                            index === itemIndex
                              ? {
                                  ...entry,
                                  order: toNumber(event.target.value, 0),
                                }
                              : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                  <FormField label="Live URL">
                    <input
                      className={inputClass}
                      value={item.liveUrl ?? ""}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          projects: current.projects.map((entry, index) =>
                            index === itemIndex
                              ? {
                                  ...entry,
                                  liveUrl: event.target.value || undefined,
                                }
                              : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                  <FormField label="GitHub URL">
                    <input
                      className={inputClass}
                      value={item.githubUrl ?? ""}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          projects: current.projects.map((entry, index) =>
                            index === itemIndex
                              ? {
                                  ...entry,
                                  githubUrl: event.target.value || undefined,
                                }
                              : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                  <FormField label="Cover image alt">
                    <input
                      className={inputClass}
                      value={item.coverImageAlt ?? ""}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          projects: current.projects.map((entry, index) =>
                            index === itemIndex
                              ? {
                                  ...entry,
                                  coverImageAlt:
                                    event.target.value || undefined,
                                }
                              : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                </div>

                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={Boolean(item.featured)}
                    onChange={(event) =>
                      updateContent((current) => ({
                        ...current,
                        projects: current.projects.map((entry, index) =>
                          index === itemIndex
                            ? { ...entry, featured: event.target.checked }
                            : entry,
                        ),
                      }))
                    }
                  />
                  Featured project
                </label>

                <ImageUploadField
                  label="Cover image"
                  value={item.coverImage}
                  onChange={(value) =>
                    updateContent((current) => ({
                      ...current,
                      projects: current.projects.map((entry, index) =>
                        index === itemIndex
                          ? { ...entry, coverImage: value || undefined }
                          : entry,
                      ),
                    }))
                  }
                />

                <FormField label="Tagline">
                  <textarea
                    className={textareaClass}
                    value={item.tagline ?? ""}
                    onChange={(event) =>
                      updateContent((current) => ({
                        ...current,
                        projects: current.projects.map((entry, index) =>
                          index === itemIndex
                            ? {
                                ...entry,
                                tagline: event.target.value || undefined,
                              }
                            : entry,
                        ),
                      }))
                    }
                  />
                </FormField>
                <FormField label="Impact summary">
                  <textarea
                    className={textareaClass}
                    value={item.impactSummary ?? ""}
                    onChange={(event) =>
                      updateContent((current) => ({
                        ...current,
                        projects: current.projects.map((entry, index) =>
                          index === itemIndex
                            ? {
                                ...entry,
                                impactSummary: event.target.value || undefined,
                              }
                            : entry,
                        ),
                      }))
                    }
                  />
                </FormField>
                <FormField label="Problem statement">
                  <textarea
                    className={textareaClass}
                    value={item.problemStatement ?? ""}
                    onChange={(event) =>
                      updateContent((current) => ({
                        ...current,
                        projects: current.projects.map((entry, index) =>
                          index === itemIndex
                            ? {
                                ...entry,
                                problemStatement:
                                  event.target.value || undefined,
                              }
                            : entry,
                        ),
                      }))
                    }
                  />
                </FormField>
                <FormField label="Solution approach">
                  <textarea
                    className={textareaClass}
                    value={item.solutionApproach ?? ""}
                    onChange={(event) =>
                      updateContent((current) => ({
                        ...current,
                        projects: current.projects.map((entry, index) =>
                          index === itemIndex
                            ? {
                                ...entry,
                                solutionApproach:
                                  event.target.value || undefined,
                              }
                            : entry,
                        ),
                      }))
                    }
                  />
                </FormField>

                <FormField
                  label="Technologies"
                  hint="One per line as name|category|color."
                >
                  <textarea
                    className={textareaClass}
                    value={toTechnologyLines(item.technologies)}
                    onChange={(event) =>
                      updateContent((current) => ({
                        ...current,
                        projects: current.projects.map((entry, index) =>
                          index === itemIndex
                            ? {
                                ...entry,
                                technologies: parseTechnologies(
                                  event.target.value,
                                ),
                              }
                            : entry,
                        ),
                      }))
                    }
                  />
                </FormField>

                <FormField
                  label="Impact metrics"
                  hint="One per line as label|value."
                >
                  <textarea
                    className={textareaClass}
                    value={toImpactMetricLines(item.impactMetrics)}
                    onChange={(event) =>
                      updateContent((current) => ({
                        ...current,
                        projects: current.projects.map((entry, index) =>
                          index === itemIndex
                            ? {
                                ...entry,
                                impactMetrics: parseImpactMetrics(
                                  event.target.value,
                                ),
                              }
                            : entry,
                        ),
                      }))
                    }
                  />
                </FormField>

                <FormField label="Citations" hint="One per line as label|url.">
                  <textarea
                    className={textareaClass}
                    value={toCitationLines(item.citations)}
                    onChange={(event) =>
                      updateContent((current) => ({
                        ...current,
                        projects: current.projects.map((entry, index) =>
                          index === itemIndex
                            ? {
                                ...entry,
                                citations: parseCitations(event.target.value),
                              }
                            : entry,
                        ),
                      }))
                    }
                  />
                </FormField>

                <button
                  type="button"
                  onClick={() =>
                    updateContent((current) => ({
                      ...current,
                      projects: current.projects.filter(
                        (_entry, index) => index !== itemIndex,
                      ),
                    }))
                  }
                  className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
                >
                  Remove project
                </button>
              </div>
            ))}
          </div>
        );

      case "services":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() =>
                  updateContent((current) => ({
                    ...current,
                    services: [
                      ...current.services,
                      {
                        title: `Service ${current.services.length + 1}`,
                        slug: `service-${current.services.length + 1}`,
                        order: current.services.length + 1,
                        updatedAt: new Date().toISOString(),
                      },
                    ],
                  }))
                }
                className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
              >
                Add service
              </button>
            </div>
            {content.services.map((item, itemIndex) => (
              <div
                key={`${item.slug}-${item.order}`}
                className="space-y-4 rounded-lg border p-4"
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <FormField label="Title">
                    <input
                      className={inputClass}
                      value={item.title}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          services: current.services.map((entry, index) =>
                            index === itemIndex
                              ? { ...entry, title: event.target.value }
                              : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                  <FormField label="Slug">
                    <input
                      className={inputClass}
                      value={item.slug}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          services: current.services.map((entry, index) =>
                            index === itemIndex
                              ? { ...entry, slug: event.target.value }
                              : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                  <FormField label="Timeline">
                    <input
                      className={inputClass}
                      value={item.timeline ?? ""}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          services: current.services.map((entry, index) =>
                            index === itemIndex
                              ? {
                                  ...entry,
                                  timeline: event.target.value || undefined,
                                }
                              : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                  <FormField label="Order">
                    <input
                      type="number"
                      className={inputClass}
                      value={item.order}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          services: current.services.map((entry, index) =>
                            index === itemIndex
                              ? {
                                  ...entry,
                                  order: toNumber(event.target.value, 0),
                                }
                              : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                </div>

                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={Boolean(item.featured)}
                    onChange={(event) =>
                      updateContent((current) => ({
                        ...current,
                        services: current.services.map((entry, index) =>
                          index === itemIndex
                            ? { ...entry, featured: event.target.checked }
                            : entry,
                        ),
                      }))
                    }
                  />
                  Featured service
                </label>

                <ImageUploadField
                  label="Service icon"
                  value={item.icon}
                  onChange={(value) =>
                    updateContent((current) => ({
                      ...current,
                      services: current.services.map((entry, index) =>
                        index === itemIndex
                          ? { ...entry, icon: value || undefined }
                          : entry,
                      ),
                    }))
                  }
                />

                <FormField label="Short description">
                  <textarea
                    className={textareaClass}
                    value={item.shortDescription ?? ""}
                    onChange={(event) =>
                      updateContent((current) => ({
                        ...current,
                        services: current.services.map((entry, index) =>
                          index === itemIndex
                            ? {
                                ...entry,
                                shortDescription:
                                  event.target.value || undefined,
                              }
                            : entry,
                        ),
                      }))
                    }
                  />
                </FormField>
                <FormField label="Full description">
                  <textarea
                    className={textareaClass}
                    value={item.fullDescription ?? ""}
                    onChange={(event) =>
                      updateContent((current) => ({
                        ...current,
                        services: current.services.map((entry, index) =>
                          index === itemIndex
                            ? {
                                ...entry,
                                fullDescription:
                                  event.target.value || undefined,
                              }
                            : entry,
                        ),
                      }))
                    }
                  />
                </FormField>
                <FormField label="Features" hint="One feature per line.">
                  <textarea
                    className={textareaClass}
                    value={toLineText(item.features)}
                    onChange={(event) =>
                      updateContent((current) => ({
                        ...current,
                        services: current.services.map((entry, index) =>
                          index === itemIndex
                            ? {
                                ...entry,
                                features: parseLines(event.target.value),
                              }
                            : entry,
                        ),
                      }))
                    }
                  />
                </FormField>
                <FormField
                  label="Deliverables"
                  hint="One deliverable per line."
                >
                  <textarea
                    className={textareaClass}
                    value={toLineText(item.deliverables)}
                    onChange={(event) =>
                      updateContent((current) => ({
                        ...current,
                        services: current.services.map((entry, index) =>
                          index === itemIndex
                            ? {
                                ...entry,
                                deliverables: parseLines(event.target.value),
                              }
                            : entry,
                        ),
                      }))
                    }
                  />
                </FormField>
                <FormField
                  label="Technologies"
                  hint="One per line as name|category|color."
                >
                  <textarea
                    className={textareaClass}
                    value={toTechnologyLines(item.technologies)}
                    onChange={(event) =>
                      updateContent((current) => ({
                        ...current,
                        services: current.services.map((entry, index) =>
                          index === itemIndex
                            ? {
                                ...entry,
                                technologies: parseTechnologies(
                                  event.target.value,
                                ),
                              }
                            : entry,
                        ),
                      }))
                    }
                  />
                </FormField>

                <div className="rounded-md border p-3">
                  <h4 className="mb-3 font-medium">Pricing</h4>
                  <div className="grid gap-3 md:grid-cols-3">
                    <FormField label="Starting price">
                      <input
                        type="number"
                        className={inputClass}
                        value={item.pricing?.startingPrice ?? ""}
                        onChange={(event) =>
                          updateContent((current) => ({
                            ...current,
                            services: current.services.map((entry, index) =>
                              index === itemIndex
                                ? {
                                    ...entry,
                                    pricing: {
                                      ...entry.pricing,
                                      startingPrice: toOptionalNumber(
                                        event.target.value,
                                      ),
                                    },
                                  }
                                : entry,
                            ),
                          }))
                        }
                      />
                    </FormField>
                    <FormField label="Price type">
                      <select
                        className={inputClass}
                        value={item.pricing?.priceType ?? ""}
                        onChange={(event) =>
                          updateContent((current) => ({
                            ...current,
                            services: current.services.map((entry, index) =>
                              index === itemIndex
                                ? {
                                    ...entry,
                                    pricing: {
                                      ...entry.pricing,
                                      priceType:
                                        (event.target.value as
                                          | "hourly"
                                          | "project"
                                          | "monthly"
                                          | "custom"
                                          | "") || undefined,
                                    },
                                  }
                                : entry,
                            ),
                          }))
                        }
                      >
                        <option value="">Not set</option>
                        <option value="hourly">Hourly</option>
                        <option value="project">Project</option>
                        <option value="monthly">Monthly</option>
                        <option value="custom">Custom</option>
                      </select>
                    </FormField>
                    <FormField label="Pricing note">
                      <input
                        className={inputClass}
                        value={item.pricing?.description ?? ""}
                        onChange={(event) =>
                          updateContent((current) => ({
                            ...current,
                            services: current.services.map((entry, index) =>
                              index === itemIndex
                                ? {
                                    ...entry,
                                    pricing: {
                                      ...entry.pricing,
                                      description:
                                        event.target.value || undefined,
                                    },
                                  }
                                : entry,
                            ),
                          }))
                        }
                      />
                    </FormField>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    updateContent((current) => ({
                      ...current,
                      services: current.services.filter(
                        (_entry, index) => index !== itemIndex,
                      ),
                    }))
                  }
                  className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
                >
                  Remove service
                </button>
              </div>
            ))}
          </div>
        );

      case "certifications":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() =>
                  updateContent((current) => ({
                    ...current,
                    certifications: [
                      ...current.certifications,
                      {
                        name: `Certification ${current.certifications.length + 1}`,
                        order: current.certifications.length + 1,
                        updatedAt: new Date().toISOString(),
                      },
                    ],
                  }))
                }
                className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
              >
                Add certification
              </button>
            </div>
            {content.certifications.map((item, itemIndex) => (
              <div
                key={`${item.name}-${item.issuer ?? ""}-${item.order}`}
                className="space-y-4 rounded-lg border p-4"
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <FormField label="Name">
                    <input
                      className={inputClass}
                      value={item.name}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          certifications: current.certifications.map(
                            (entry, index) =>
                              index === itemIndex
                                ? { ...entry, name: event.target.value }
                                : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                  <FormField label="Issuer">
                    <input
                      className={inputClass}
                      value={item.issuer ?? ""}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          certifications: current.certifications.map(
                            (entry, index) =>
                              index === itemIndex
                                ? {
                                    ...entry,
                                    issuer: event.target.value || undefined,
                                  }
                                : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                  <FormField label="Issue date">
                    <input
                      type="date"
                      className={inputClass}
                      value={item.issueDate ?? ""}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          certifications: current.certifications.map(
                            (entry, index) =>
                              index === itemIndex
                                ? {
                                    ...entry,
                                    issueDate: event.target.value || undefined,
                                  }
                                : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                  <FormField label="Expiry date">
                    <input
                      type="date"
                      className={inputClass}
                      value={item.expiryDate ?? ""}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          certifications: current.certifications.map(
                            (entry, index) =>
                              index === itemIndex
                                ? {
                                    ...entry,
                                    expiryDate: event.target.value || undefined,
                                  }
                                : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                  <FormField label="Credential ID">
                    <input
                      className={inputClass}
                      value={item.credentialId ?? ""}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          certifications: current.certifications.map(
                            (entry, index) =>
                              index === itemIndex
                                ? {
                                    ...entry,
                                    credentialId:
                                      event.target.value || undefined,
                                  }
                                : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                  <FormField label="Credential URL">
                    <input
                      className={inputClass}
                      value={item.credentialUrl ?? ""}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          certifications: current.certifications.map(
                            (entry, index) =>
                              index === itemIndex
                                ? {
                                    ...entry,
                                    credentialUrl:
                                      event.target.value || undefined,
                                  }
                                : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                  <FormField label="Order">
                    <input
                      type="number"
                      className={inputClass}
                      value={item.order}
                      onChange={(event) =>
                        updateContent((current) => ({
                          ...current,
                          certifications: current.certifications.map(
                            (entry, index) =>
                              index === itemIndex
                                ? {
                                    ...entry,
                                    order: toNumber(event.target.value, 0),
                                  }
                                : entry,
                          ),
                        }))
                      }
                    />
                  </FormField>
                </div>

                <ImageUploadField
                  label="Certificate logo"
                  value={item.logo}
                  onChange={(value) =>
                    updateContent((current) => ({
                      ...current,
                      certifications: current.certifications.map(
                        (entry, index) =>
                          index === itemIndex
                            ? { ...entry, logo: value || undefined }
                            : entry,
                      ),
                    }))
                  }
                />

                <FormField label="Description">
                  <textarea
                    className={textareaClass}
                    value={item.description ?? ""}
                    onChange={(event) =>
                      updateContent((current) => ({
                        ...current,
                        certifications: current.certifications.map(
                          (entry, index) =>
                            index === itemIndex
                              ? {
                                  ...entry,
                                  description: event.target.value || undefined,
                                }
                              : entry,
                        ),
                      }))
                    }
                  />
                </FormField>

                <FormField
                  label="Skills"
                  hint="One per line as name|category|color."
                >
                  <textarea
                    className={textareaClass}
                    value={toTechnologyLines(item.skills)}
                    onChange={(event) =>
                      updateContent((current) => ({
                        ...current,
                        certifications: current.certifications.map(
                          (entry, index) =>
                            index === itemIndex
                              ? {
                                  ...entry,
                                  skills: parseTechnologies(event.target.value),
                                }
                              : entry,
                        ),
                      }))
                    }
                  />
                </FormField>

                <button
                  type="button"
                  onClick={() =>
                    updateContent((current) => ({
                      ...current,
                      certifications: current.certifications.filter(
                        (_entry, index) => index !== itemIndex,
                      ),
                    }))
                  }
                  className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
                >
                  Remove certification
                </button>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-4 md:p-5">
        <p className="text-sm text-muted-foreground">
          Edit each section using forms and upload images directly where needed.
        </p>
        {contentPath ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Content file:{" "}
            <span className="font-mono break-all text-foreground/80">
              {contentPath}
            </span>
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="space-y-2 rounded-xl border bg-card p-4 md:p-5">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Sections
          </h2>
          {sectionConfig.map((section) => (
            <button
              type="button"
              key={section.key}
              onClick={() => {
                setSelectedSection(section.key);
                setErrorMessage("");
                setStatusMessage("");
              }}
              className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                selectedSection === section.key
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:bg-accent"
              }`}
            >
              <span className="font-medium">{section.label}</span>
              <span className="text-xs text-muted-foreground">
                {sectionSummary[section.key]}
              </span>
            </button>
          ))}
        </aside>

        <section className="space-y-4 rounded-xl border bg-card p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-semibold">
              {sectionConfig.find((section) => section.key === selectedSection)
                ?.label || "Section"}
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void onReload()}
                className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
              >
                Reload
              </button>
              <button
                type="button"
                onClick={() => void saveContent()}
                disabled={saving || syncing}
                className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => void syncFromLiveSite()}
                disabled={saving || syncing}
                className="rounded-md border px-3 py-2 text-sm hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
              >
                {syncing ? "Syncing..." : "Sync from madhudadi.in"}
              </button>
            </div>
          </div>

          {renderSectionEditor()}

          {errorMessage ? (
            <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">
              {errorMessage}
            </p>
          ) : null}

          {!errorMessage && statusMessage ? (
            <p className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600 dark:text-emerald-400">
              {statusMessage}
            </p>
          ) : null}
        </section>
      </div>
    </div>
  );
}
