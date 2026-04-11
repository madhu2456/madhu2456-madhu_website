import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <main className="min-h-screen relative overflow-hidden bg-background px-6 py-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.12),transparent_45%)]" />

          <div className="relative container mx-auto max-w-3xl">
            <div className="rounded-2xl border bg-card/95 backdrop-blur p-8 md:p-12 text-center shadow-sm space-y-8">
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-[0.2em] text-primary">404</p>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                  Page not found
                </h1>
                <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
                  The page you are looking for does not exist or may have been moved.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <a
                  href="/"
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Back to home
                </a>
                <a
                  href="/case-studies"
                  className="inline-flex items-center justify-center rounded-lg border px-5 py-3 text-sm font-medium transition-colors hover:bg-accent"
                >
                  View case studies
                </a>
              </div>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
