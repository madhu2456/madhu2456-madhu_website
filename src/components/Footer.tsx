import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { SafeEmailLink } from "@/components/SafeEmailLink";
import { SocialIconStrip } from "@/components/SocialIconStrip";
import { TrackedLink } from "@/components/TrackedLink";
import { EXTERNAL_REL } from "@/lib/link-rel";
import type {
  NavigationItem,
  Profile,
  ProjectItem,
} from "@/lib/portfolio-data";

type FooterSitemapLink = {
  label: string;
  href: string;
  rel?: string;
};

type FooterProps = {
  profile: Profile;
  projects: ProjectItem[];
  navigationItems: NavigationItem[];
};

export function Footer({ profile, projects, navigationItems }: FooterProps) {
  const sitemap: Array<{ heading: string; links: FooterSitemapLink[] }> = [
    {
      heading: "Explore",
      links: [
        ...navigationItems
          .filter(
            (item) =>
              item.title !== "Blog" &&
              !item.href.endsWith(".pdf") &&
              !item.href.startsWith("http"),
          )
          .map((item) => ({
            label: item.title,
            href: normalizeFooterHref(item.href),
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
      heading: "Legal",
      links: [{ label: "Privacy Policy", href: "/privacy/" }],
    },
  ];

  return (
    <footer className="mt-auto border-t border-border py-10 lg:py-14 relative overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[320px] bg-primary/5 blur-[100px] rounded-[100%] -z-10 pointer-events-none"
        aria-hidden
      />

      <div className="mx-auto flex w-[min(1400px,92%)] flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(260px,340px)_1fr]">
          <div className="flex flex-col gap-5 rounded-3xl border border-border/80 bg-surface/30 p-6 lg:p-8 backdrop-blur-md shadow-card hover:border-border transition-colors">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Ready to talk?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Prefer the full form and project brief? Use the contact page —
                one place for email, phone, and a 24-hour reply commitment.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <Link
                href="/contact/"
                className="group inline-flex w-fit items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.03]"
              >
                Go to contact
                <IconArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>

              <SocialIconStrip
                profile={profile}
                clickLocation="footer_social"
                emailTrackingLocation="footer"
                aria-label="Footer social links"
              />
            </div>
          </div>

          <nav
            aria-label="Footer"
            className="grid gap-6 rounded-3xl border border-border/80 bg-surface/30 p-6 sm:grid-cols-3 lg:gap-8 lg:p-8 backdrop-blur-md shadow-card hover:border-border transition-colors"
          >
            {sitemap.map((column) => (
              <div key={column.heading}>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {column.heading}
                </h2>
                <ul className="space-y-2.5 text-sm">
                  {column.links.map((link) => (
                    <li key={`${column.heading}-${link.href}`}>
                      <FooterLink href={link.href} rel={link.rel}>
                        {link.label}
                      </FooterLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4 rounded-3xl border border-border/80 bg-surface/30 px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8 backdrop-blur-md shadow-card hover:border-border transition-colors">
          <address
            className="not-italic text-sm leading-relaxed text-muted-foreground"
            itemScope
            itemType="https://schema.org/Person"
          >
            <strong
              className="mb-0.5 block font-semibold text-foreground"
              itemProp="name"
            >
              Madhu Dadi
            </strong>
            <div
              itemProp="address"
              itemScope
              itemType="https://schema.org/PostalAddress"
            >
              <span itemProp="addressLocality">{profile.location}</span>
            </div>
            <p className="mt-1">
              <Link
                href="/contact/"
                className="text-primary underline-offset-4 hover:underline"
              >
                Contact details
              </Link>
              <span className="text-muted-foreground/50"> · </span>
              <Link
                href="/ai-consultant-india/"
                className="underline-offset-4 hover:text-foreground hover:underline"
              >
                AI consultant in India
              </Link>
            </p>
          </address>

          <div className="flex flex-col gap-1 text-sm text-muted-foreground lg:text-right">
            <p>
              © {new Date().getFullYear()} Madhu Dadi. Built with intention.
            </p>
            <p className="flex items-center gap-2 lg:justify-end">
              <span
                className="h-2 w-2 rounded-full bg-primary animate-pulse"
                aria-hidden
              />
              Available worldwide · remote-first
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function normalizeFooterHref(href: string) {
  return href.startsWith("#") ? `/${href}` : href;
}

function FooterLink({
  href,
  rel = EXTERNAL_REL,
  children,
}: {
  href: string;
  rel?: string;
  children: ReactNode;
}) {
  const isExternal =
    href.startsWith("http") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:");

  if (isExternal) {
    if (href.startsWith("mailto:")) {
      return (
        <SafeEmailLink
          email={href.replace("mailto:", "")}
          trackingLocation="footer"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          {children}
        </SafeEmailLink>
      );
    }
    return (
      <TrackedLink
        href={href}
        target="_blank"
        rel={rel}
        gtmEvent="outbound_click"
        gtmData={{ link_url: href, click_location: "footer" }}
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        {children}
      </TrackedLink>
    );
  }

  return (
    <Link
      href={href}
      className="text-muted-foreground transition-colors hover:text-foreground"
    >
      {children}
    </Link>
  );
}
