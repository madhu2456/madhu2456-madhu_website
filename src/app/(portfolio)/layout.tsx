import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { defineQuery } from "next-sanity";
import { SanityLive, sanityFetch } from "@/sanity/lib/live";
import { urlFor } from "@/sanity/lib/image";
import "../globals.css";
import { GoogleTagManager } from "@next/third-parties/google";
import { draftMode } from "next/headers";
import Script from "next/script";
import { VisualEditing } from "next-sanity/visual-editing";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/DarkModeToggle";
import { DisableDraftMode } from "@/components/DisableDraftMode";
import { FloatingDock } from "@/components/FloatingDock";
import SidebarToggle from "@/components/SidebarToggle";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const METADATA_QUERY = defineQuery(`{
  "settings": *[_type == "siteSettings"][0]{
    siteTitle,
    siteDescription,
    siteKeywords,
    ogImage,
    twitterHandle,
  },
  "profile": *[_id == "singleton-profile"][0]{
    firstName,
    lastName,
    headline,
    shortBio,
    profileImage,
    socialLinks,
    location,
  }
}`);

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({ query: METADATA_QUERY });
  const settings = data?.settings;
  const profile = data?.profile;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.com";
  const fullName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    "Madhu Dadi";
  const title = settings?.siteTitle || `${fullName} - Portfolio`;

  // Google truncates meta descriptions beyond ~155 chars; audit tools flag >130.
  // Truncate at the last word boundary within 130 chars to stay clean.
  const rawDescription =
    settings?.siteDescription ||
    profile?.shortBio ||
    `Portfolio of ${fullName} — developer, builder, and problem solver.`;
  const description =
    rawDescription.length > 130
      ? `${rawDescription.slice(0, rawDescription.lastIndexOf(" ", 130))}…`
      : rawDescription;

  const keywords = (settings?.siteKeywords as string[] | undefined) ?? [];

  const ogImageUrl =
    settings?.ogImage
      ? urlFor(settings.ogImage).width(1200).height(630).url()
      : profile?.profileImage
        ? urlFor(profile.profileImage).width(1200).height(630).url()
        : undefined;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${fullName}`,
    },
    description,
    ...(keywords.length > 0 && { keywords }),
    authors: [{ name: fullName, url: siteUrl }],
    creator: fullName,
    publisher: fullName,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: "/",
      // Hreflang — single English site; x-default + en covers both Google requirements
      languages: {
        "en": siteUrl,
        "x-default": siteUrl,
      },
    },
    openGraph: {
      type: "profile",
      locale: "en_US",
      url: siteUrl,
      siteName: title,
      title,
      description,
      ...(ogImageUrl && {
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
      }),
      ...(profile?.firstName && { firstName: profile.firstName }),
      ...(profile?.lastName && { lastName: profile.lastName }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(settings?.twitterHandle && {
        creator: `@${settings.twitterHandle}`,
        site: `@${settings.twitterHandle}`,
      }),
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
    other: {
      "theme-color": "#7c3aed",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <GoogleTagManager gtmId="GTM-PBB2W9VG" />
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Script
              src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
              strategy="afterInteractive"
            />

            <SidebarProvider defaultOpen={false}>
              <SidebarInset className="">{children}</SidebarInset>

              <AppSidebar side="right" />

              <FloatingDock />
              <SidebarToggle />

              {/* Mode Toggle - Desktop: bottom right next to AI chat, Mobile: top right next to burger menu */}
              <div className="fixed md:bottom-6 md:right-24 top-4 right-18 md:top-auto md:left-auto z-20">
                <div className="w-10 h-10 md:w-12 md:h-12">
                  <ModeToggle />
                </div>
              </div>
            </SidebarProvider>

            {/* Live content API */}
            <SanityLive />

            {(await draftMode()).isEnabled && (
              <>
                <VisualEditing />
                <DisableDraftMode />
              </>
            )}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
