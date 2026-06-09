"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconBriefcase,
  IconCertificate,
  IconCode,
  IconCompass,
  IconDeviceFloppy,
  IconFileText,
  IconLayout2,
  IconRefresh,
  IconSchool,
  IconSettings,
  IconTools,
  IconUser,
  IconWorldWww,
} from "@tabler/icons-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  type PortfolioContentSchema,
  portfolioContentSchema,
} from "@/lib/cms-schema";
import {
  CertificationsEditor,
  EducationEditor,
  ExperiencesEditor,
  NavigationEditor,
  PageContentEditor,
  ProfileEditor,
  ProjectsEditor,
  ServicesEditor,
  SiteSettingsEditor,
  SkillsEditor,

} from "./editors";

type SectionKey = keyof PortfolioContentSchema;

type CmsApiResponse = {
  content?: unknown;
  contentPath?: string;
  updatedAt?: string;
  sourceUrl?: string;
  importedAt?: string;
  error?: string;
};

const sectionConfig: Array<{
  key: SectionKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { key: "pageContent", label: "Page Content", icon: IconFileText },
  { key: "profile", label: "Profile", icon: IconUser },
  { key: "siteSettings", label: "Site settings", icon: IconSettings },
  { key: "navigationItems", label: "Navigation", icon: IconCompass },
  { key: "skills", label: "Skills", icon: IconTools },
  { key: "experiences", label: "Experience", icon: IconBriefcase },
  { key: "education", label: "Education", icon: IconSchool },
  { key: "projects", label: "Projects", icon: IconCode },
  { key: "services", label: "Services", icon: IconLayout2 },
  { key: "certifications", label: "Certifications", icon: IconCertificate },

];

export function CmsEditor() {
  const [contentPath, setContentPath] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<SectionKey>("profile");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("");

  const methods = useForm<PortfolioContentSchema>({
    resolver: zodResolver(portfolioContentSchema),
  });

  const { reset, handleSubmit, watch } = methods;

  // Only watch fields needed for the sidebar summary to avoid re-rendering on every keystroke in large text fields
  const summaryData = watch([
    "profile.firstName",
    "profile.lastName",
    "siteSettings.siteTitle",
    "pageContent",
    "navigationItems",
    "skills",
    "experiences",
    "education",
    "projects",
    "services",
    "certifications",

  ]);

  const sectionSummary = useMemo(() => {
    const [
      firstName,
      lastName,
      siteTitle,
      pageContent,
      navigationItems,
      skills,
      experiences,
      education,
      projects,
      services,
      certifications,

    ] = summaryData;

    return {
      profile: `${firstName || ""} ${lastName || ""}`.trim() || "Profile",
      siteSettings: siteTitle || "Site settings",
      pageContent: "SEO and static content",
      navigationItems: `${navigationItems?.length || 0} items`,
      skills: `${skills?.length || 0} items`,
      experiences: `${experiences?.length || 0} items`,
      education: `${education?.length || 0} items`,
      projects: `${projects?.length || 0} items`,
      services: `${services?.length || 0} items`,
      certifications: `${certifications?.length || 0} items`,

      contentVersion: "v3",
    };
  }, [summaryData]);

  const loadContent = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");
    setStatusMessage("");

    try {
      const response = await fetch("/api/cms/content/", { cache: "no-store" });
      const payload = (await response.json()) as CmsApiResponse;

      if (!response.ok) {
        throw new Error(payload.error || "Failed to load portfolio content.");
      }

      const validated = portfolioContentSchema.parse(payload.content);
      reset(validated);
      setContentPath(payload.contentPath || "");
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load CMS content.",
      );
    } finally {
      setLoading(false);
    }
  }, [reset]);

  useEffect(() => {
    void loadContent();
  }, [loadContent]);

  const onSave = async (data: PortfolioContentSchema) => {
    setSaving(true);
    setErrorMessage("");
    setStatusMessage("");

    try {
      const response = await fetch("/api/cms/content/", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: data }),
      });

      const payload = (await response.json()) as CmsApiResponse;
      if (!response.ok) {
        throw new Error(payload.error || "Failed to save CMS content.");
      }

      const validated = portfolioContentSchema.parse(payload.content);
      reset(validated);
      setStatusMessage(
        payload.updatedAt
          ? `Saved successfully at ${new Date(payload.updatedAt).toLocaleString()}.`
          : "Saved successfully.",
      );
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to save CMS content.",
      );
    } finally {
      setSaving(false);
    }
  };

  const syncFromLiveSite = async () => {
    setSyncing(true);
    setErrorMessage("");
    setStatusMessage("");

    try {
      const response = await fetch("/api/cms/import-live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceUrl: "https://madhudadi.in" }),
      });

      const payload = (await response.json()) as CmsApiResponse;
      if (!response.ok) {
        throw new Error(
          payload.error || "Failed to import content from live site.",
        );
      }

      const validated = portfolioContentSchema.parse(payload.content);
      reset(validated);
      setStatusMessage(
        payload.importedAt
          ? `Imported latest content from ${payload.sourceUrl || "live site"} at ${new Date(payload.importedAt).toLocaleString()}.`
          : "Imported latest content from live site.",
      );
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to import content.",
      );
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
        Loading local CMS content...
      </div>
    );
  }

  const renderSectionEditor = () => {
    switch (selectedSection) {
      case "pageContent":
        return <PageContentEditor />;
      case "profile":
        return <ProfileEditor />;
      case "siteSettings":
        return <SiteSettingsEditor />;
      case "navigationItems":
        return <NavigationEditor />;
      case "skills":
        return <SkillsEditor />;
      case "experiences":
        return <ExperiencesEditor />;
      case "education":
        return <EducationEditor />;
      case "projects":
        return <ProjectsEditor />;
      case "services":
        return <ServicesEditor />;
      case "certifications":
        return <CertificationsEditor />;

      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSave)} className="space-y-6">
        <div className="rounded-xl border bg-card p-4 md:p-5">
          <p className="text-sm text-muted-foreground">
            Edit each section using schema-validated forms. Image uploads are
            automatically handled.
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-1 h-fit lg:sticky lg:top-4">
            <div className="mb-4 px-3">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                Data Sections
              </h2>
            </div>
            {sectionConfig.map((section) => (
              <button
                type="button"
                key={section.key}
                onClick={() => {
                  setSelectedSection(section.key);
                  setErrorMessage("");
                  setStatusMessage("");
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition-all duration-200 ${
                  selectedSection === section.key
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                }`}
              >
                <section.icon className="w-4 h-4 shrink-0" />
                <div className="flex-1 overflow-hidden">
                  <p className="font-semibold truncate">{section.label}</p>
                  {selectedSection !== section.key && (
                    <p className="text-[10px] opacity-70 truncate">
                      {sectionSummary[section.key]}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </aside>

          <section className="min-h-[600px] space-y-8 rounded-2xl border border-foreground/5 bg-card/50 p-6 md:p-8 backdrop-blur-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-foreground/5 pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {(() => {
                    const Icon = sectionConfig.find(
                      (s) => s.key === selectedSection,
                    )?.icon;
                    return Icon ? <Icon className="h-5 w-5" /> : null;
                  })()}
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">
                    {sectionConfig.find((s) => s.key === selectedSection)
                      ?.label || "Section"}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Manage your {selectedSection} details
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void loadContent()}
                  className="inline-flex items-center gap-2 rounded-lg border border-foreground/10 px-4 py-2 text-xs font-semibold transition-colors hover:bg-foreground/5"
                >
                  <IconRefresh className="h-3.5 w-3.5" />
                  Reload
                </button>
                <button
                  type="submit"
                  disabled={saving || syncing}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/10 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:scale-100"
                >
                  <IconDeviceFloppy className="h-3.5 w-3.5" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => void syncFromLiveSite()}
                  disabled={saving || syncing}
                  className="inline-flex items-center gap-2 rounded-lg border border-foreground/10 px-4 py-2 text-xs font-semibold transition-colors hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <IconWorldWww className="h-3.5 w-3.5" />
                  {syncing ? "Syncing..." : "Sync Live"}
                </button>
              </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              {renderSectionEditor()}
            </div>

            {errorMessage ? (
              <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-500 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/10">
                  <span className="font-bold">!</span>
                </div>
                <p className="font-medium">{errorMessage}</p>
              </div>
            ) : null}

            {!errorMessage && statusMessage ? (
              <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-600 dark:text-emerald-400 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                    role="img"
                    aria-labelledby="success-icon-title"
                  >
                    <title id="success-icon-title">Success Icon</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="font-medium">{statusMessage}</p>
              </div>
            ) : null}
          </section>
        </div>
      </form>
    </FormProvider>
  );
}
