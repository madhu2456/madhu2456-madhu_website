"use client";

import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useState } from "react";

interface CitationBoxProps {
  title: string;
  url: string;
  authorName: string;
}

export function CitationBox({ title, url, authorName }: CitationBoxProps) {
  const [copiedType, setCopiedType] = useState<"html" | "markdown" | null>(
    null,
  );

  const markdownSnippet = `[${authorName}: ${title}](${url})`;
  const htmlSnippet = `<a href="${url}">${authorName}: ${title}</a>`;

  const copyToClipboard = async (text: string, type: "html" | "markdown") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="mt-8 rounded-2xl border border-border bg-surface/40 overflow-hidden">
      <div className="border-b border-border bg-surface/50 px-5 py-3 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold tracking-wide text-foreground">
          Cite this article
        </h3>
      </div>
      <div className="p-5 space-y-4">
        {/* Markdown */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs tracking-widest text-muted-foreground uppercase">
              Markdown
            </span>
            <button
              type="button"
              onClick={() => copyToClipboard(markdownSnippet, "markdown")}
              className="group flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground"
            >
              {copiedType === "markdown" ? (
                <IconCheck className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <IconCopy className="h-3.5 w-3.5 group-hover:text-primary" />
              )}
              {copiedType === "markdown" ? "Copied!" : "Copy"}
            </button>
          </div>
          <code className="block rounded-lg bg-black/40 p-3 text-sm text-foreground/80 break-all select-all font-mono">
            {markdownSnippet}
          </code>
        </div>

        {/* HTML */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs tracking-widest text-muted-foreground uppercase">
              HTML
            </span>
            <button
              type="button"
              onClick={() => copyToClipboard(htmlSnippet, "html")}
              className="group flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground"
            >
              {copiedType === "html" ? (
                <IconCheck className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <IconCopy className="h-3.5 w-3.5 group-hover:text-primary" />
              )}
              {copiedType === "html" ? "Copied!" : "Copy"}
            </button>
          </div>
          <code className="block rounded-lg bg-black/40 p-3 text-sm text-foreground/80 break-all select-all font-mono">
            {htmlSnippet}
          </code>
        </div>
      </div>
    </div>
  );
}
