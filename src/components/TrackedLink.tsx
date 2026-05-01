"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackExternalClick, trackProjectEngagement } from "@/lib/gtm";

interface TrackedLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
  type?: "case_study" | "live_demo" | "github" | "external";
  projectTitle?: string;
  externalLabel?: string;
  category?: "social" | "link" | "other";
}

export function TrackedLink({
  href,
  children,
  className,
  "aria-label": ariaLabel,
  type,
  projectTitle,
  externalLabel,
  category,
}: TrackedLinkProps) {
  const handleClick = () => {
    if (!type) return;

    if (type === "external") {
      trackExternalClick(externalLabel || href, href, category || "link");
    } else if (projectTitle) {
      const actionMap = {
        case_study: "view_case_study",
        live_demo: "click_live_demo",
        github: "click_github",
      } as const;

      const action = actionMap[type as keyof typeof actionMap];
      if (action) {
        trackProjectEngagement(action, projectTitle);
      }
    }
  };

  const isExternal = href.startsWith("http");

  if (isExternal) {
    return (
      <a
        href={href}
        onClick={handleClick}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  );
}
