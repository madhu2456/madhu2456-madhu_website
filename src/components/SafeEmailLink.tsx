"use client";

import { type ReactNode, useEffect, useState } from "react";

interface SafeEmailLinkProps {
  email: string;
  children?: ReactNode;
  className?: string;
}

export function SafeEmailLink({
  email,
  children,
  className,
}: SafeEmailLinkProps) {
  const [href, setHref] = useState<string>("#");

  useEffect(() => {
    setHref(`mailto:${email}`);
  }, [email]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href === "#") {
      e.preventDefault();
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children || email}
    </a>
  );
}
