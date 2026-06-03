"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Profile } from "@/lib/portfolio-data";

type HeaderProps = {
  profile: Profile;
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/profile/", label: "About" },
  { href: "/services/", label: "Services" },
  { href: "/credentials/", label: "Credentials" },
  { href: "/contact/", label: "Contact" },
  { href: "https://madhudadi.in/blog", label: "Blog" },
];

export function Header({ profile }: HeaderProps) {
  const pathname = usePathname();

  const getHref = (href: string) => {
    // If the link is external, return as is
    if (href.startsWith("http")) return href;

    // Ensure all internal routes have trailing slash
    if (href === "/") return "/";
    return href.endsWith("/") ? href : `${href}/`;
  };

  const isLinkActive = (href: string) => {
    if (href === "https://madhudadi.in/blog") return false;

    // Check match for root
    if (href === "/" && pathname === "/") return true;

    if (href !== "/") {
      const normalizedPath = pathname.endsWith("/") ? pathname : `${pathname}/`;
      const normalizedHref = href.endsWith("/") ? href : `${href}/`;
      return (
        normalizedPath === normalizedHref ||
        normalizedPath.startsWith(normalizedHref)
      );
    }

    return false;
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-50">
      <div className="mx-auto mt-3 flex w-[min(1400px,94%)] items-center justify-between rounded-full border border-border/90 bg-surface-elevated/85 px-3 py-2 sm:mt-4 sm:px-5 sm:py-3 shadow-lg shadow-black/20 backdrop-blur-md">
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-display text-base font-semibold tracking-tight transition-colors hover:text-primary sm:text-lg"
          aria-label="Madhu Dadi home"
        >
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-border/80 bg-surface shadow-inner transition-all duration-300 group-hover:scale-105 group-hover:border-primary/30">
            <Image
              src="/new-ui/logo.png"
              alt="Madhu Dadi"
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="text-foreground/90 transition-colors group-hover:text-foreground">
            {profile.firstName}&nbsp;{profile.lastName}
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 rounded-full border border-border/30 bg-black/30 p-1 md:flex"
        >
          {navLinks.map((link) => {
            const isActive = isLinkActive(link.href);
            const isExternal = link.href.startsWith("http");

            return (
              <Link
                key={link.href}
                href={getHref(link.href)}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noreferrer" : undefined}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all duration-300 ${
                  isActive
                    ? "bg-primary/15 text-primary border border-primary/20 shadow-sm"
                    : "text-muted-foreground border border-transparent hover:bg-white/5 hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-border/80 bg-surface/50 px-4 py-2 text-xs font-semibold text-foreground shadow-sm transition-all duration-300 hover:scale-[1.04] hover:bg-surface-elevated hover:border-primary/30 sm:px-5 sm:text-sm"
          >
            Resume
          </a>
          <Link
            href="/contact/#intent=full-time"
            className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition-all duration-300 hover:scale-[1.04] hover:shadow-glow sm:px-5 sm:text-sm"
          >
            Hire me
          </Link>
        </div>
      </div>
    </header>
  );
}
