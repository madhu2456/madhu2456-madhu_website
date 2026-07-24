import Link from "next/link";

export type AuthorBioProfile = {
  firstName?: string | null;
  lastName?: string | null;
  headline?: string | null;
  shortBio?: string | null;
};

type AuthorBioProps = {
  profile: AuthorBioProfile;
  /** Optional short override; defaults to profile.shortBio */
  blurb?: string;
  className?: string;
};

/**
 * Visible author / E-E-A-T block for case studies and service leaves.
 * Complements Person schema — humans and AI extractors both see who wrote the page.
 */
export function AuthorBio({ profile, blurb, className = "" }: AuthorBioProps) {
  const fullName =
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
    "Madhu Dadi";
  const text =
    blurb?.trim() ||
    profile.shortBio?.trim() ||
    `${fullName} is an AI engineer and RAG & analytics consultant based in Visakhapatnam, India.`;

  return (
    <aside
      className={`rounded-2xl border border-border/60 bg-surface/30 p-6 ${className}`.trim()}
      aria-labelledby="author-bio-heading"
    >
      <h2
        id="author-bio-heading"
        className="text-sm font-bold tracking-wider text-primary uppercase"
      >
        About the author
      </h2>
      <p className="mt-3 text-base font-semibold text-foreground">{fullName}</p>
      {profile.headline ? (
        <p className="mt-1 text-sm text-muted-foreground">{profile.headline}</p>
      ) : null}
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {text}
      </p>
      <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        <Link
          href="/profile/"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Full profile
        </Link>
        <Link
          href="/ai-consultant-india/"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          India / location
        </Link>
        <Link
          href="/contact/"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Contact
        </Link>
      </p>
    </aside>
  );
}
