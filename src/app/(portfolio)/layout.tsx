import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Geist, Geist_Mono } from "next/font/google";
import { defineQuery } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import { SanityLive, sanityFetch } from "@/sanity/lib/live";
import "../globals.css";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { DeferredGTM } from "@/components/DeferredGTM";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/app-sidebar";

const ModeToggle = dynamic(() =>
  import("@/components/DarkModeToggle").then((m) => m.ModeToggle),
);
const FloatingDock = dynamic(() =>
  import("@/components/FloatingDock").then((m) => m.FloatingDock),
);
const SidebarToggle = dynamic(() => import("@/components/SidebarToggle"));
const DisableDraftMode = dynamic(() =>
  import("@/components/DisableDraftMode").then((m) => m.DisableDraftMode),
);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://madhudadi.in";
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

  const ogImageUrl = settings?.ogImage
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
      canonical: siteUrl,
      // Hreflang — single English site; x-default + en covers both Google requirements
      languages: {
        "en-US": siteUrl,
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
    // Explicit icon declarations so Google Search picks up the favicon
    // (file-based conventions alone can be missed if generateMetadata overrides them)
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
        { url: "/icon.png", sizes: "192x192", type: "image/png" },
      ],
      apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
      other: [
        {
          rel: "icon",
          url: "/icon-512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DeferredGTM gtmId="GTM-PBB2W9VG" />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider defaultOpen={false}>
            <SidebarInset className="">{children}</SidebarInset>

            <AppSidebar side="right" />

            <FloatingDock />
            <SidebarToggle />

            {/* Mode Toggle - Desktop: bottom right next to AI chat, Mobile: top right next to burger menu */}
            <div className="fixed md:bottom-6 md:right-24 top-4 right-18 md:top-auto md:left-auto z-20">
              <div className="w-11 h-11 md:w-12 md:h-12">
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
  );
}
