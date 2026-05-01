"use client";

import { type ChangeEvent, type ReactNode, useState } from "react";
import type { Citation, ImpactMetric, Technology } from "@/lib/cms-schema";

export const inputClass =
  "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40";
export const textareaClass =
  "min-h-[120px] w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40";

export const parseLines = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
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

export const toTechnologyLines = (items?: Technology[]) =>
  (items ?? [])
    .map((item) =>
      [item.name, item.category ?? "", item.color ?? ""]
        .filter(Boolean)
        .join("|"),
    )
    .join("\n");

export const parseImpactMetrics = (value: string): ImpactMetric[] =>
  parseLines(value)
    .map((line) => {
      const [label, metricValue] = line.split("|").map((item) => item.trim());
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
      const [label, url] = line.split("|").map((item) => item.trim());
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
    <div className="space-y-1.5">
      <p className="text-sm font-medium">{label}</p>
      {children}
      {error ? (
        <p className="text-xs font-medium text-red-500">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
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
