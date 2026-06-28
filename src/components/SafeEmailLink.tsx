"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { pushToDataLayer } from "@/lib/gtm";

interface SafeEmailLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  email: string;
  trackingLocation?: string;
}

export function SafeEmailLink({
  email,
  children,
  className,
  onClick,
  trackingLocation = "email_link",
  ...props
}: SafeEmailLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    pushToDataLayer({
      event: "contact_click",
      contact_type: "email",
      contact_location: trackingLocation,
    });
    onClick?.(event);
  };

  return (
    <a
      href={`mailto:${email}`}
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children || email}
    </a>
  );
}
