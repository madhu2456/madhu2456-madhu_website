import type { Metadata, Viewport } from "next";

import { Geist_Mono, Instrument_Serif, Inter } from "next/font/google";
import { AppSidebar } from "@/components/app-sidebar";
import { ClientChrome } from "@/components/ClientChrome";
import { DeferredGTM } from "@/components/DeferredGTM";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { getPortfolioData } from "@/lib/portfolio-data";
import "../globals.css";
import { resolveSiteUrl } from "@/lib/site-url";

const THEME_COLOR = "#1a1410";
const MAX_META_DESCRIPTION_LENGTH = 160;

const SITE_URL = `${resolveSiteUrl()}/`;

const normalizeWhitespace = (value: string) =>
  value.replace(/\s+/g, " ").trim();

const toMetaDescription = (text: string, maxLength: number) => {
  const normalized = normalizeWhitespace(text);
  if (normalized.length <= maxLength) {
    return normalized;
  }

  const sentenceBoundary = normalized.lastIndexOf(".", maxLength);
  if (sentenceBoundary >= 80) {
    return normalized.slice(0, sentenceBoundary + 1).trim();
  }

  const boundary = normalized.lastIndexOf(" ", maxLength);
  const safeBoundary = boundary > 0 ? boundary : maxLength;
  const clipped = normalized
    .slice(0, safeBoundary)
    .trim()
    .replace(/[\s,;:!?-]+$/, "");

  return clipped.endsWith(".") ? clipped : `${clipped}.`;
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: THEME_COLOR,
};

export async function generateMetadata(): Promise<Metadata> {
  const { profile, siteSettings } = await getPortfolioData();
  const siteUrl = `${resolveSiteUrl()}/`;
  const fullName =
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
    "Madhu Dadi";
  const siteName =
    siteSettings.siteName ||
    siteSettings.siteTitle ||
    `${fullName} - Portfolio`;
  const title = siteSettings.siteTitle || siteName;
  const rawDescription =
    siteSettings.siteDescription ||
    profile.shortBio ||
    `Portfolio of ${fullName} - developer, builder, and problem solver.`;
  const description = toMetaDescription(
    rawDescription,
    MAX_META_DESCRIPTION_LENGTH,
  );

  const twitterHandle = siteSettings.twitterHandle?.replace(/^@/, "");
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

  const ogImageUrl = `${siteUrl}opengraph-image?ext=.png`;

  return {
    metadataBase: new URL(siteUrl),
    title: title,
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
      languages: {
        "en-IN": `${siteUrl}in/`,
        "x-default": siteUrl,
      },
      types: {
        "application/rss+xml": [
          {
            url: `${siteUrl}blog/feed.xml`,
            title: "MadhuDadi Blog - RSS Feed",
          },
        ],
      },
    },
    openGraph: {
      title: {
        template: "%s | Madhu Dadi",
        default: title,
      },
      description,
      url: siteUrl,
      siteName: siteName,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${title} - Open Graph preview`,
        },
      ],
      ...(profile.firstName && { firstName: profile.firstName }),
      ...(profile.lastName && { lastName: profile.lastName }),
    },
    twitter: {
      card: "summary_large_image",
      ...(twitterHandle && {
        creator: `@${twitterHandle}`,
        site: `@${twitterHandle}`,
      }),
    },
    other: {
      "ai-crawl-rate": "fast",
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
        <link rel="llms" href={`${SITE_URL}llms.txt`} />
        <link rel="ai-profile" href={`${SITE_URL}ai-profile.json`} />
      </head>
      <body
        className={`${inter.variable} ${instrumentSerif.variable} ${geistMono.variable} antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-foreground"
        >
          Skip to content
        </a>
        <DeferredGTM
          gtmId={process.env.NEXT_PUBLIC_GTM_ID?.trim() || "GTM-PBB2W9VG"}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SidebarProvider defaultOpen={false}>
            <SidebarInset>{children}</SidebarInset>

            <AppSidebar side="right" />

            <ClientChrome />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
