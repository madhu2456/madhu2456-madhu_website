import type { Metadata, Viewport } from "next";
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

const DEFAULT_SITE_URL = "https://madhudadi.in";
const THEME_COLOR = "#7c3aed";
const MAX_META_DESCRIPTION_LENGTH = 155;

const resolveSiteUrl = (rawUrl?: string) =>
  (rawUrl?.trim() || DEFAULT_SITE_URL).replace(/\/+$/, "");

const truncateDescription = (text: string, maxLength: number) => {
  if (text.length <= maxLength) {
    return text;
  }

  const boundary = text.lastIndexOf(" ", maxLength);
  const safeBoundary = boundary > 0 ? boundary : maxLength;

  return `${text.slice(0, safeBoundary).trimEnd()}…`;
};

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

export const viewport: Viewport = {
  themeColor: THEME_COLOR,
};

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({ query: METADATA_QUERY, stega: false });
  const settings = data?.settings;
  const profile = data?.profile;

  const siteUrl = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  const fullName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    "Madhu Dadi";
  const siteName = settings?.siteTitle || `${fullName} - Portfolio`;
  const title = siteName;
  const rawDescription =
    settings?.siteDescription ||
    profile?.shortBio ||
    `Portfolio of ${fullName} — developer, builder, and problem solver.`;
  const description = truncateDescription(
    rawDescription,
    MAX_META_DESCRIPTION_LENGTH,
  );

  const keywords = (settings?.siteKeywords as string[] | undefined) ?? [];
  const twitterHandle = settings?.twitterHandle?.replace(/^@/, "");
  const googleSiteVerification =
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
    process.env.GOOGLE_SITE_VERIFICATION;
  const yandexSiteVerification =
    process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION ||
    process.env.YANDEX_SITE_VERIFICATION;
  const bingSiteVerification =
    process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ||
    process.env.BING_SITE_VERIFICATION;

  const verification: Metadata["verification"] =
    googleSiteVerification || yandexSiteVerification || bingSiteVerification
      ? {
          ...(googleSiteVerification && { google: googleSiteVerification }),
          ...(yandexSiteVerification && { yandex: yandexSiteVerification }),
          ...(bingSiteVerification && {
            other: {
              "msvalidate.01": bingSiteVerification,
            },
          }),
        }
      : undefined;

  const ogImageUrl = settings?.ogImage
    ? urlFor(settings.ogImage).width(1200).height(630).url()
    : profile?.profileImage
      ? urlFor(profile.profileImage).width(1200).height(630).url()
      : `${siteUrl}/opengraph-image`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${fullName}`,
    },
    description,
    applicationName: siteName,
    referrer: "strict-origin-when-cross-origin",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    category: "technology",
    manifest: "/manifest.webmanifest",
    ...(keywords.length > 0 && { keywords }),
    authors: [{ name: fullName, url: siteUrl }],
    creator: fullName,
    publisher: fullName,
    ...(verification && { verification }),
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
      languages: {
        en: "/",
        "en-US": "/",
        "x-default": "/",
      },
    },
    openGraph: {
      type: "profile",
      locale: "en_US",
      url: "/",
      siteName,
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${title} — Open Graph preview`,
        },
      ],
      ...(profile?.firstName && { firstName: profile.firstName }),
      ...(profile?.lastName && { lastName: profile.lastName }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(twitterHandle && {
        creator: `@${twitterHandle}`,
        site: `@${twitterHandle}`,
      }),
      images: [{ url: ogImageUrl, alt: `${title} — social preview` }],
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
