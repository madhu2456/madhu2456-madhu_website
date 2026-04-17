import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { getPortfolioData } from "@/lib/portfolio-data";

const ObfuscatedEmail = dynamic(() =>
  import("@/components/ObfuscatedEmail").then((m) => m.ObfuscatedEmail),
);

export async function HeroSection() {
  const { profile } = await getPortfolioData();
  const profileImageUrl = profile.profileImage || "/icon-512.png";
  const primaryHeadline =
    profile.headline ||
    [profile.headlineStaticText, profile.headlineAnimatedWords?.[0]]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    "Developer and AI builder";

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

      <div className="relative z-10 container mx-auto max-w-6xl">
        <div className="@container">
          <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-8 @lg:gap-12 items-center">
            {/* Text Content */}
            <div className="@container/hero space-y-4 @md/hero:space-y-6">
              <h1 className="text-4xl @md/hero:text-5xl @lg/hero:text-7xl font-bold tracking-tight">
                {profile.firstName}{" "}
                <span className="text-primary">{profile.lastName}</span>
              </h1>
              <h2 className="text-xl @md/hero:text-2xl @lg/hero:text-3xl text-muted-foreground font-medium min-h-[1.5em]">
                {primaryHeadline}
              </h2>

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
                      aria-label="Visit blog (opens in new tab)"
                      className="px-4 py-3 @md/hero:px-6 rounded-lg border hover:bg-accent transition-colors text-sm @md/hero:text-base min-h-[44px] flex items-center"
                    >
                      Blog
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
                  <div className="relative h-full rounded-xl overflow-hidden border-4 border-primary/20">
                    <Image
                      src={profileImageUrl}
                      alt={
                        `${profile.firstName || ""} ${profile.lastName || ""}`.trim() ||
                        "Madhu Dadi"
                      }
                      fill
                      priority
                      unoptimized
                      decoding="sync"
                      fetchPriority="high"
                      sizes="(max-width: 768px) min(86vw, 300px), (max-width: 1280px) 340px, 380px"
                      className="object-cover object-[center_35%]"
                      quality={60}
                    />

                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                      <span className="text-xs font-medium text-white">
                        Online
                      </span>
                    </div>

                    <div className="absolute inset-x-4 bottom-4 rounded-lg bg-black/55 backdrop-blur-sm px-4 py-3">
                      <p className="text-sm font-semibold text-white">
                        Let&apos;s build something meaningful.
                      </p>
                      <p className="text-xs text-white/80">
                        Use the chat bubble to talk to my AI twin.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
