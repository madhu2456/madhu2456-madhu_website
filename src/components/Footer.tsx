import Link from "next/link";
import type { ReactNode } from "react";
import type { Profile, ProjectItem } from "@/lib/portfolio-data";

type FooterProps = {
  profile: Profile;
  projects: ProjectItem[];
};

export function Footer({ profile, projects }: FooterProps) {
  const sitemap = [
    {
      heading: "Explore",
      links: [
        { label: "Home", href: "/" },
        { label: "About", href: "/profile/" },
        { label: "Services", href: "/services/" },
        { label: "Credentials", href: "/credentials/" },
        { label: "Contact", href: "/contact/" },
      ],
    },
    {
      heading: "Case studies",
      links: [
        ...projects.slice(0, 3).map((project) => ({
          label: project.title,
          href: `/case-studies/${project.slug}/`,
        })),
        { label: "All case studies", href: "/case-studies/" },
      ],
    },
    {
      heading: "Connect",
      links: [
        { label: "Email", href: `mailto:${profile.email}` },
        ...(profile.socialLinks.linkedin
          ? [{ label: "LinkedIn", href: profile.socialLinks.linkedin }]
          : []),
        ...(profile.socialLinks.github
          ? [{ label: "GitHub", href: profile.socialLinks.github }]
          : []),
        ...(profile.socialLinks.website
          ? [{ label: "Blog", href: profile.socialLinks.website }]
          : []),
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-surface/30 py-12 mt-auto">
      <div className="mx-auto w-[min(1400px,92%)]">
        <nav
          aria-label="Footer"
          className="grid gap-8 sm:grid-cols-2 md:grid-cols-3"
        >
          {sitemap.map((column) => (
            <div key={column.heading}>
              <h2 className="mb-3 text-xs tracking-widest text-muted-foreground uppercase">
                {column.heading}
              </h2>
              <ul className="space-y-2 text-sm">
                {column.links.map((link) => (
                  <li key={`${column.heading}-${link.href}`}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-6 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Madhu Dadi. Built with intention.</p>
          <p>{profile.location} · Available worldwide</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  const isExternal =
    href.startsWith("http") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:");

  if (isExternal) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer" : undefined}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className="text-muted-foreground hover:text-foreground transition-colors"
    >
      {children}
    </Link>
  );
}
