"use client";

interface SafeEmailLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  email: string;
}

export function SafeEmailLink({
  email,
  children,
  className,
  ...props
}: SafeEmailLinkProps) {
  return (
    <a href={`mailto:${email}`} className={className} {...props}>
      {children || email}
    </a>
  );
}
