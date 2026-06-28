import type { Metadata } from "next";
import Link from "next/link";
import { geistMono, inter } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Page Not Found | Madhu Dadi",
  description:
    "The requested page could not be found. Return to Madhu Dadi's portfolio, services, case studies, or contact page.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function GlobalNotFound() {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
          <div className="grain absolute inset-0" aria-hidden />
          <div className="bg-hero-glow absolute inset-0" aria-hidden />

          <div className="relative max-w-md text-center">
            <p className="text-xs tracking-[0.25em] text-primary uppercase">
              404
            </p>
            <h1 className="mt-4 font-display text-6xl text-gradient md:text-7xl">
              Page not found
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              The page you&apos;re looking for doesn&apos;t exist or has been
              moved.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/"
                className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
              >
                Go home
              </Link>
              <Link
                href="/case-studies/"
                className="rounded-full border border-border bg-surface/60 px-5 py-3 text-sm font-medium hover:bg-surface-elevated"
              >
                View case studies
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
