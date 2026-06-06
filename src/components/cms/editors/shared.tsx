"use client";

import { type ChangeEvent, type ReactNode, useState } from "react";
import type { Citation, ImpactMetric, Technology } from "@/lib/cms-schema";

export const inputClass =
  "w-full rounded-lg border border-foreground/10 bg-background px-4 py-2.5 text-sm transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none";
export const textareaClass =
  "min-h-[140px] w-full rounded-lg border border-foreground/10 bg-background px-4 py-2.5 text-sm transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none resize-none";

export const parseLines = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

export const toLineText = (items?: string[]) => (items ?? []).join("\n");

export const resizeTextarea = (el: HTMLTextAreaElement | null) => {
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
};

export function AutoResizeTextarea({
  value,
  onChange,
  className,
  placeholder,
  hint,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div className="space-y-1">
      <textarea
        className={className}
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value);
          resizeTextarea(e.target);
        }}
        ref={(el) => {
          if (el) resizeTextarea(el);
        }}
      />
      {hint && <p className="text-[11px] text-muted-foreground/70">{hint}</p>}
    </div>
  );
}

export const parseTechnologies = (value: string): Technology[] =>
  parseLines(value)
    .map((line) => {
      const parts = line.split("|").map((p) => p.trim());
      const name = parts[0];
      const category = parts[1];
      const color = parts[2];

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

export const toTechnologyLines = (items?: Technology[]) =>
  (items ?? [])
    .map((item) =>
      [item.name, item.category ?? "", item.color ?? ""]
        .filter((val) => val !== undefined)
        .join("|"),
    )
    .join("\n");

export const parseImpactMetrics = (value: string): ImpactMetric[] =>
  parseLines(value)
    .map((line) => {
      const [label, metricValue] = line.split("|").map((p) => p.trim());
      if (!label || !metricValue) {
        return null;
      }

      return { label, value: metricValue };
    })
    .filter((item): item is ImpactMetric => Boolean(item));

export const toImpactMetricLines = (items?: ImpactMetric[]) =>
  (items ?? []).map((item) => `${item.label}|${item.value}`).join("\n");

export const parseCitations = (value: string): Citation[] =>
  parseLines(value)
    .map((line) => {
      const [label, url] = line.split("|").map((p) => p.trim());
      if (!label || !url) {
        return null;
      }

      return { label, url };
    })
    .filter((item): item is Citation => Boolean(item));

export const toCitationLines = (items?: Citation[]) =>
  (items ?? []).map((item) => `${item.label}|${item.url}`).join("\n");

export const toNumber = (value: string | number, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const toOptionalNumber = (value: string | number | undefined) => {
  if (value === undefined || value === "") {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export function FormField({
  label,
  hint,
  children,
  error,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
          {label}
        </div>
        {error && (
          <span className="text-[10px] font-bold text-red-500 uppercase tracking-tight">
            {error}
          </span>
        )}
      </div>
      {children}
      {hint && !error && (
        <p className="text-[11px] text-muted-foreground/60 leading-relaxed italic">
          {hint}
        </p>
      )}
    </div>
  );
}

type CmsUploadResponse = {
  url?: string;
  error?: string;
};

export function ImageUploadField({
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
    <div className="space-y-4 rounded-xl border border-foreground/5 bg-foreground/[0.02] p-6 transition-all hover:border-foreground/10">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
          {label}
        </div>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-[10px] font-bold uppercase tracking-tight text-red-500 hover:text-red-600"
          >
            Remove Image
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <input
            type="text"
            value={value ?? ""}
            onChange={(event) => onChange(event.target.value)}
            className={inputClass}
            placeholder="/uploads/cms/your-image.png"
          />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-foreground/10 bg-background px-4 py-2.5 text-xs font-bold transition-all hover:bg-foreground/5 hover:scale-[1.02] active:scale-[0.98]">
            {uploading ? (
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                Processing...
              </span>
            ) : (
              "Upload New"
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(event) => void onFileChange(event)}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {uploadError ? (
        <p className="text-xs font-medium text-red-500">{uploadError}</p>
      ) : null}
    </div>
  );
}
