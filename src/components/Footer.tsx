import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { SafeEmailLink } from "@/components/SafeEmailLink";
import type {
  NavigationItem,
  Profile,
  ProjectItem,
} from "@/lib/portfolio-data";

type FooterProps = {
  profile: Profile;
  projects: ProjectItem[];
  navigationItems: NavigationItem[];
};

export function Footer({ profile, projects, navigationItems }: FooterProps) {
  const sitemap = [
    {
      heading: "Explore",
      links: [
        ...navigationItems
          .filter((item) => item.title !== "Blog" && item.title !== "GitHub")
          .map((item) => ({
            label: item.title,
            href: item.href,
          })),
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
        ...(profile.socialLinks.googleBusiness
          ? [
              {
                label: "Google Business",
                href: profile.socialLinks.googleBusiness,
              },
            ]
          : []),
      ],
    },
  ];

  return (
    <footer className="mt-auto py-12 lg:py-20 relative overflow-hidden border-t border-border">
      {/* Background glow to mimic glassmorphism backdrop */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-[100%] -z-10 pointer-events-none"
        aria-hidden
      />

      <div className="mx-auto w-[min(1400px,92%)] grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Hire Me CTA */}
        <div className="rounded-3xl border border-border/80 bg-surface/30 p-8 md:p-10 flex flex-col justify-between items-start backdrop-blur-md shadow-card hover:border-border transition-colors">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              Have an idea?
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed text-sm">
              Let's build something meaningful. Available for AI, RAG, and
              full-stack engineering.
            </p>
          </div>
          <Link
            href="/contact/"
            prefetch={false}
            className="mt-8 group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.03]"
          >
            Hire me
            <IconArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </div>

        {/* Card 2: Navigation Links */}
        <nav
          aria-label="Footer"
          className="rounded-3xl border border-border/80 bg-surface/30 p-8 md:p-10 backdrop-blur-md shadow-card md:col-span-2 grid gap-8 sm:grid-cols-3 hover:border-border transition-colors"
        >
          {sitemap.map((column) => (
            <div key={column.heading}>
              <h2 className="mb-4 text-xs tracking-widest text-muted-foreground uppercase font-semibold">
                {column.heading}
              </h2>
              <ul className="space-y-3 text-sm">
                {column.links.map((link) => (
                  <li key={`${column.heading}-${link.href}`}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Card 3: NAP & Copyright */}
        <div className="rounded-3xl border border-border/80 bg-surface/30 p-8 md:p-10 backdrop-blur-md shadow-card md:col-span-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 hover:border-border transition-colors">
          <address
            className="not-italic leading-relaxed text-sm text-muted-foreground"
            itemScope
            itemType="https://schema.org/LocalBusiness"
          >
            <strong
              className="font-semibold text-foreground block mb-1"
              itemProp="name"
            >
              Madhu Dadi
            </strong>
            <div
              itemProp="address"
              itemScope
              itemType="https://schema.org/PostalAddress"
            >
              <span itemProp="addressLocality">Visakhapatnam</span>,{" "}
              <span itemProp="addressRegion">Andhra Pradesh</span>
              <br />
              <span itemProp="addressCountry">India</span>
            </div>
            {profile.phone && (
              <a
                href={`tel:${profile.phone.replace(/\s+/g, "")}`}
                className="hover:text-foreground transition-colors block mt-2"
                itemProp="telephone"
              >
                {profile.phone}
              </a>
            )}
          </address>

          <div className="flex flex-col gap-2 md:text-right text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Madhu Dadi. Built with intention.
            </p>
            <p className="flex items-center md:justify-end gap-2">
              <span
                className="h-2 w-2 rounded-full bg-primary animate-pulse"
                aria-hidden
              />
              Available worldwide
            </p>
          </div>
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
    if (href.startsWith("mailto:")) {
      return (
        <SafeEmailLink
          email={href.replace("mailto:", "")}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {children}
        </SafeEmailLink>
      );
    }
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
      prefetch={false}
      className="text-muted-foreground hover:text-foreground transition-colors"
    >
      {children}
    </Link>
  );
}
