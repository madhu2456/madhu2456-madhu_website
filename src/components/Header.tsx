"use client";

import { IconMenu2, IconX } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { TrackedLink } from "@/components/TrackedLink";
import type { NavigationItem, Profile } from "@/lib/portfolio-data";

type HeaderProps = {
  profile: Profile;
  navigationItems: NavigationItem[];
};

export function Header({ profile, navigationItems }: HeaderProps) {
  const pathname = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close mobile menu when viewport resizes past md breakpoint
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setIsMobileMenuOpen(false);
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    // Move focus into the menu on open
    requestAnimationFrame(() => {
      const firstLink =
        menuRef.current?.querySelector<HTMLElement>("a, button");
      firstLink?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        toggleRef.current?.focus();
        return;
      }

      // Focus trap: cycle through focusable elements within the menu
      if (event.key === "Tab" && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current?.contains(target) ||
        toggleRef.current?.contains(target)
      ) {
        return;
      }
      setIsMobileMenuOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const getHref = (href: string) => {
    // If the link is external, return as is
    if (href.startsWith("http")) return href;

    // Handle hash links (anchor links)
    if (href.startsWith("#")) {
      // If we are not on the homepage, prefix with / so it navigates back home first
      return pathname === "/" ? href : `/${href}`;
    }

    // Ensure all internal routes have trailing slash
    if (href === "/") return "/";
    return href.endsWith("/") ? href : `${href}/`;
  };

  const isLinkActive = (href: string) => {
    if (href.startsWith("http")) return false;

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
              alt=""
              width={32}
              height={32}
              priority
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
          {navigationItems.map((link) => {
            const isActive = isLinkActive(link.href);
            const isExternal = link.isExternal || link.href.startsWith("http");

            return (
              <Link
                key={link.href}
                href={getHref(link.href)}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all duration-300 ${
                  isActive
                    ? "bg-primary/15 text-primary border border-primary/20 shadow-sm"
                    : "text-muted-foreground border border-transparent hover:bg-white/5 hover:text-foreground"
                }`}
              >
                {link.title}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <TrackedLink
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            gtmEvent="resume_download"
            gtmData={{ download_type: "pdf", download_location: "header" }}
            className="hidden sm:inline-block rounded-full border border-border/80 bg-surface/50 px-4 py-2 text-xs font-semibold text-foreground shadow-sm transition-all duration-300 hover:scale-[1.04] hover:bg-surface-elevated hover:border-primary/30 sm:px-5 sm:text-sm"
          >
            Resume
          </TrackedLink>
          <TrackedLink
            href="/contact/#intent=full-time"
            gtmEvent="hire_me_click"
            gtmData={{ click_location: "header" }}
            className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition-all duration-300 hover:scale-[1.04] hover:shadow-glow sm:px-5 sm:text-sm"
          >
            Hire me
          </TrackedLink>
          <button
            type="button"
            ref={toggleRef}
            className="md:hidden flex items-center justify-center h-11 w-11 rounded-full border border-border/80 bg-surface/50 text-foreground transition-colors hover:bg-surface-elevated hover:text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMobileMenuOpen ? (
              <IconX className="h-5 w-5" />
            ) : (
              <IconMenu2 className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div
          ref={menuRef}
          className="absolute top-full left-0 right-0 mt-2 px-3 sm:px-5 md:hidden"
        >
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="flex flex-col gap-1 rounded-2xl border border-border/90 bg-surface-elevated/95 p-3 shadow-lg shadow-black/20 backdrop-blur-xl"
          >
            {navigationItems.map((link) => {
              const isActive = isLinkActive(link.href);
              const isExternal =
                link.isExternal || link.href.startsWith("http");

              return (
                <Link
                  key={link.href}
                  href={getHref(link.href)}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold tracking-wide transition-all ${
                    isActive
                      ? "bg-primary/15 text-primary border border-primary/20"
                      : "text-muted-foreground border border-transparent hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  {link.title}
                </Link>
              );
            })}
            <TrackedLink
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              gtmEvent="resume_download"
              gtmData={{
                download_type: "pdf",
                download_location: "mobile_nav",
              }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-2 text-center rounded-xl border border-border/80 bg-surface/50 px-4 py-3 text-sm font-semibold text-foreground transition-all hover:bg-surface-elevated hover:text-primary"
            >
              Resume
            </TrackedLink>
            <TrackedLink
              href="/contact/#intent=full-time"
              gtmEvent="hire_me_click"
              gtmData={{ click_location: "mobile_nav" }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition-all hover:scale-[1.02]"
            >
              Hire me
            </TrackedLink>
          </nav>
        </div>
      )}
    </header>
  );
}
