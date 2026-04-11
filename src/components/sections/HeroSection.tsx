import Link from "next/link";
import { defineQuery } from "next-sanity";
import { ObfuscatedEmail } from "@/components/ObfuscatedEmail";
import { LazyBackgroundRippleEffect } from "@/components/ui/background-ripple-effect-lazy";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { ProfileImage } from "./ProfileImage";
import { AnimatedHeadline } from "./AnimatedHeadline";

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
    return (
      <section className="min-h-screen flex items-center justify-center px-6 py-20 bg-background" />
    );
  }

  const profileImageUrl = profile.profileImage
    ? urlFor(profile.profileImage).width(694).height(925).fit("crop").url()
    : "";
  
  const lqip = (profile.profileImage as any)?.asset?.metadata?.lqip || "";

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
              
              <AnimatedHeadline 
                staticText={profile.headlineStaticText || ""}
                words={profile.headlineAnimatedWords || []}
                duration={profile.headlineAnimationDuration || 3000}
                fallbackText={profile.headline || ""}
              />

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
              <div className="w-full flex justify-center">
                <div className="w-full max-w-[300px] h-[400px] @md:max-w-[340px] @md:h-[460px] @3xl:max-w-[380px] @3xl:h-[520px]">
                  <ProfileImage
                    imageUrl={profileImageUrl}
                    lqip={lqip}
                    firstName={profile.firstName || ""}
                    lastName={profile.lastName || ""}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
