import { Geist_Mono, Inter } from "next/font/google";

// Satoshi is loaded via @font-face in globals.css to work around a Next.js 16
// Turbopack bug with next/font/local (unexpected data version in get_font_fallbacks).
// The CSS variable --font-display is set in globals.css @font-face rule.

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  preload: false,
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});
