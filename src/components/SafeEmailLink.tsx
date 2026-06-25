"use client";

import { useEffect, useState } from "react";

interface SafeEmailLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  email: string;
}

export function SafeEmailLink({
  email,
  children,
  className,
  ...props
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
    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children || email}
    </a>
  );
}
