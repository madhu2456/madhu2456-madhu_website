"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
    mode: "onChange",
  });

  const { reset, handleSubmit, watch } = methods;

  const currentContent = watch();

  const sectionSummary = useMemo(() => {
    if (!currentContent?.profile) {
      return {} as Record<SectionKey, string>;
    }

    return {
      profile:
        `${currentContent.profile.firstName} ${currentContent.profile.lastName}`.trim(),
      siteSettings: currentContent.siteSettings.siteTitle || "Site settings",
      navigationItems: `${currentContent.navigationItems?.length || 0} items`,
      skills: `${currentContent.skills?.length || 0} items`,
      experiences: `${currentContent.experiences?.length || 0} items`,
      education: `${currentContent.education?.length || 0} items`,
      projects: `${currentContent.projects?.length || 0} items`,
      services: `${currentContent.services?.length || 0} items`,
      certifications: `${currentContent.certifications?.length || 0} items`,
    };
  }, [currentContent]);

  const loadContent = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");
    setStatusMessage("");

    try {
      const response = await fetch("/api/cms/content", { cache: "no-store" });
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
      const response = await fetch("/api/cms/content", {
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="space-y-2 rounded-xl border bg-card p-4 md:p-5 h-fit lg:sticky lg:top-4">
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
            <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4 mb-4">
              <h2 className="text-base font-semibold">
                {sectionConfig.find(
                  (section) => section.key === selectedSection,
                )?.label || "Section"}
              </h2>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void loadContent()}
                  className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
                >
                  Reload
                </button>
                <button
                  type="submit"
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
              <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500 animate-in fade-in duration-200">
                {errorMessage}
              </p>
            ) : null}

            {!errorMessage && statusMessage ? (
              <p className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600 dark:text-emerald-400 animate-in fade-in duration-200">
                {statusMessage}
              </p>
            ) : null}
          </section>
        </div>
      </form>
    </FormProvider>
  );
}
