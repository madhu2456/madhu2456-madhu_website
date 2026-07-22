import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandLinkedin,
  IconBrandMedium,
  IconBrandX,
  IconBrandYoutube,
  IconMail,
  IconWriting,
} from "@tabler/icons-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { SafeEmailLink } from "@/components/SafeEmailLink";
import { TrackedLink } from "@/components/TrackedLink";
import { EXTERNAL_REL, IDENTITY_EXTERNAL_REL } from "@/lib/link-rel";
import type { Profile } from "@/lib/portfolio-data";

type SocialIconLink = {
  label: string;
  href: string;
  rel?: string;
  icon: ReactNode;
  isEmail?: boolean;
};

type SocialIconStripProps = {
  profile: Profile;
  clickLocation: string;
  emailTrackingLocation?: string;
  className?: string;
  "aria-label"?: string;
};

const iconButtonClassName =
  "inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-surface/50 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50";

export function buildSocialIconLinks(profile: Profile): SocialIconLink[] {
  const links: SocialIconLink[] = [
    {
      label: "Email",
      href: `mailto:${profile.email}`,
      icon: <IconMail className="h-4 w-4" stroke={1.75} />,
      isEmail: true,
    },
  ];

  if (profile.socialLinks.linkedin) {
    links.push({
      label: "LinkedIn",
      href: profile.socialLinks.linkedin,
      rel: IDENTITY_EXTERNAL_REL,
      icon: <IconBrandLinkedin className="h-4 w-4" stroke={1.75} />,
    });
  }

  if (profile.socialLinks.github) {
    links.push({
      label: "GitHub",
      href: profile.socialLinks.github,
      rel: IDENTITY_EXTERNAL_REL,
      icon: <IconBrandGithub className="h-4 w-4" stroke={1.75} />,
    });
  }

  if (profile.socialLinks.twitter) {
    links.push({
      label: "X",
      href: profile.socialLinks.twitter,
      rel: IDENTITY_EXTERNAL_REL,
      icon: <IconBrandX className="h-4 w-4" stroke={1.75} />,
    });
  }

  if (profile.socialLinks.website) {
    links.push({
      label: "Blog",
      href: profile.socialLinks.website,
      rel: IDENTITY_EXTERNAL_REL,
      icon: (
        <Image
          src="/new-ui/logo.png"
          alt=""
          aria-hidden="true"
          width={16}
          height={16}
          className="h-4 w-4 rounded-full object-cover"
        />
      ),
    });
  }

  if (profile.socialLinks.medium) {
    links.push({
      label: "Medium",
      href: profile.socialLinks.medium,
      rel: IDENTITY_EXTERNAL_REL,
      icon: <IconBrandMedium className="h-4 w-4" stroke={1.75} />,
    });
  }

  if (profile.socialLinks.devto) {
    links.push({
      label: "Dev.to",
      href: profile.socialLinks.devto,
      rel: IDENTITY_EXTERNAL_REL,
      icon: <IconWriting className="h-4 w-4" stroke={1.75} />,
    });
  }

  if (profile.socialLinks.youtube) {
    links.push({
      label: "YouTube",
      href: profile.socialLinks.youtube,
      rel: IDENTITY_EXTERNAL_REL,
      icon: <IconBrandYoutube className="h-4 w-4" stroke={1.75} />,
    });
  }

  if (profile.socialLinks.googleBusiness) {
    links.push({
      label: "View on Google",
      href: profile.socialLinks.googleBusiness,
      icon: <IconBrandGoogle className="h-4 w-4" stroke={1.75} />,
    });
  }

  return links;
}

/** Unique landmark names when multiple strips share a page (axe landmark-unique). */
function defaultSocialLandmarkLabel(clickLocation: string): string {
  const known: Record<string, string> = {
    homepage_contact: "Homepage contact social links",
    footer_social: "Footer social links",
    footer: "Footer social links",
  };
  if (known[clickLocation]) return known[clickLocation];
  const human = clickLocation.replace(/_/g, " ").trim();
  return human ? `Social links (${human})` : "Connect on social platforms";
}

export function SocialIconStrip({
  profile,
  clickLocation,
  emailTrackingLocation,
  className = "flex flex-wrap gap-2",
  "aria-label": ariaLabel,
}: SocialIconStripProps) {
  const links = buildSocialIconLinks(profile);
  const landmarkLabel = ariaLabel ?? defaultSocialLandmarkLabel(clickLocation);

  if (links.length === 0) {
    return null;
  }

  return (
    <section className={className} aria-label={landmarkLabel}>
      {links.map((link) => (
        <SocialIconButton
          key={link.label}
          {...link}
          clickLocation={clickLocation}
          emailTrackingLocation={emailTrackingLocation ?? clickLocation}
        />
      ))}
    </section>
  );
}

function SocialIconButton({
  label,
  href,
  rel = EXTERNAL_REL,
  icon,
  isEmail = false,
  clickLocation,
  emailTrackingLocation,
}: SocialIconLink & {
  clickLocation: string;
  emailTrackingLocation: string;
}) {
  if (isEmail) {
    return (
      <SafeEmailLink
        email={href.replace("mailto:", "")}
        trackingLocation={emailTrackingLocation}
        aria-label={label}
        title={label}
        className={iconButtonClassName}
      >
        {icon}
      </SafeEmailLink>
    );
  }

  return (
    <TrackedLink
      href={href}
      target="_blank"
      rel={rel}
      gtmEvent="outbound_click"
      gtmData={{ link_url: href, click_location: clickLocation }}
      aria-label={label}
      title={label}
      className={iconButtonClassName}
    >
      {icon}
    </TrackedLink>
  );
}
