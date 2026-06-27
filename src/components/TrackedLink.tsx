"use client";

import type React from "react";
import { pushToDataLayer } from "@/lib/gtm";

interface TrackedLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  gtmEvent: string;
  gtmData?: Record<string, unknown>;
}

/**
 * An anchor tag that fires a GTM event on click.
 * Use for tracking CTA clicks, download clicks, etc.
 */
export function TrackedLink({
  gtmEvent,
  gtmData,
  onClick,
  children,
  ...props
}: TrackedLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    pushToDataLayer({
      event: gtmEvent,
      ...gtmData,
    });
    onClick?.(e);
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: anchor is interactive via href — onClick adds analytics only
    // biome-ignore lint/a11y/useValidAnchor: anchor IS used for navigation — href comes from spread props
    <a onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
