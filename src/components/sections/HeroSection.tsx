import Link from "next/link";
import { defineQuery } from "next-sanity";
import { ObfuscatedEmail } from "@/components/ObfuscatedEmail";
import { LazyBackgroundRippleEffect } from "@/components/ui/background-ripple-effect-lazy";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { ProfileImage } from "./ProfileImage";

const HERO_QUERY = defineQuery(`*[_id == "singleton-profile"][0]{
  firstName,
  lastName,
  headline,
  headlineStaticText,
  headlineAnimatedWords,
  headlineAnimationDuration,
  shortBio,
  email,
  location,
  availability,
  socialLinks,
  profileImage {
    asset->{
      _id,
      metadata {
        lqip
      }
    }
  }
}`);

export async function HeroSection() {
  const { data: profile } = await sanityFetch({ query: HERO_QUERY });

  if (!profile) {
    return null;
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden"
    >
      {/* Background Ripple Effect */}
      <LazyBackgroundRippleEffect cellSize={56} />

      <div className="relative z-10 container mx-auto max-w-6xl">
        <div className="@container">
          <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-8 @lg:gap-12 items-center">
            {/* Text Content */}
            <div className="@container/hero space-y-4 @md/hero:space-y-6">
              <h1 className="text-4xl @md/hero:text-5xl @lg/hero:text-7xl font-bold tracking-tight">
                {profile.firstName}{" "}
                <span className="text-primary">{profile.lastName}</span>
              </h1>
              {profile.headlineStaticText &&
              profile.headlineAnimatedWords &&
              profile.headlineAnimatedWords.length > 0 ? (
                <h2 className="text-xl @md/hero:text-2xl @lg/hero:text-3xl text-muted-foreground font-medium">
                  <LayoutTextFlip
                    text={profile.headlineStaticText}
                    words={profile.headlineAnimatedWords}
                    duration={profile.headlineAnimationDuration || 3000}
                    className="text-xl @md/hero:text-2xl @lg/hero:text-3xl text-muted-foreground font-medium"
                  />
                </h2>
              ) : (
                <h2 className="text-xl @md/hero:text-2xl @lg/hero:text-3xl text-muted-foreground font-medium">
                  {profile.headline}
                </h2>
              )}
              <p className="text-base @md/hero:text-lg text-muted-foreground leading-relaxed">
                {profile.shortBio}
              </p>

              {profile.socialLinks && (
                <div className="flex flex-wrap gap-3 @md/hero:gap-4 pt-4">
                  {profile.socialLinks.github && (
                    <Link
                      href={profile.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="View GitHub profile (opens in new tab)"
                      className="px-4 py-3 @md/hero:px-6 rounded-lg border hover:bg-accent transition-colors text-sm @md/hero:text-base min-h-[44px] flex items-center"
                    >
                      GitHub
                    </Link>
                  )}
                  {profile.socialLinks.linkedin && (
                    <Link
                      href={profile.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="View LinkedIn profile (opens in new tab)"
                      className="px-4 py-3 @md/hero:px-6 rounded-lg border hover:bg-accent transition-colors text-sm @md/hero:text-base min-h-[44px] flex items-center"
                    >
                      LinkedIn
                    </Link>
                  )}
                  {profile.socialLinks.twitter && (
                    <Link
                      href={profile.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="View Twitter profile (opens in new tab)"
                      className="px-4 py-3 @md/hero:px-6 rounded-lg border hover:bg-accent transition-colors text-sm @md/hero:text-base min-h-[44px] flex items-center"
                    >
                      Twitter
                    </Link>
                  )}
                  {profile.socialLinks.website && (
                    <Link
                      href={profile.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Visit personal website (opens in new tab)"
                      className="px-4 py-3 @md/hero:px-6 rounded-lg border hover:bg-accent transition-colors text-sm @md/hero:text-base min-h-[44px] flex items-center"
                    >
                      Website
                    </Link>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-4 @md/hero:gap-6 pt-4 text-xs @md/hero:text-sm text-muted-foreground">
                {profile.email && (
                  <div className="flex items-center gap-2">
                    <span>📧</span>
                    <ObfuscatedEmail
                      email={profile.email}
                      className="truncate"
                    />
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.availability && (
                  <div className="flex items-center gap-2">
                    <span>✅</span>
                    <span>{profile.availability}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Image */}
            {profile.profileImage && (
              <ProfileImage
                imageUrl={urlFor(profile.profileImage)
                  .width(600)
                  .height(600)
                  .url()}
                lqip={
                  (profile.profileImage as any).asset?.metadata?.lqip || ""
                }
                firstName={profile.firstName || ""}
                lastName={profile.lastName || ""}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
