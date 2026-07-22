import type { Metadata } from "next";
import Link from "next/link";
import { geistMono, inter } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Page Not Found | Madhu Dadi",
  description:
    "The requested page could not be found. Return to Madhu Dadi's portfolio, services, case studies, or contact page.",
  // Do NOT set robots here. Next.js already injects <meta name="robots" content="noindex">
  // for not-found / global-not-found. Adding robots again produces a second meta tag
  // (e.g. "noindex" + "noindex, follow") which auditors flag as duplicate/conflicting.
};

const recoveryLinks = [
  { href: "/", label: "Home", primary: true },
  { href: "/services/", label: "Services" },
  { href: "/case-studies/", label: "Case studies" },
  { href: "/profile/", label: "Profile" },
  { href: "/contact/", label: "Contact" },
  { href: "/credentials/", label: "Credentials" },
] as const;

export default function GlobalNotFound() {
  return (
    <html
      lang="en-IN"
      className={`${inter.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
          <div className="grain absolute inset-0" aria-hidden />
          <div className="bg-hero-glow absolute inset-0" aria-hidden />

          <div className="relative max-w-lg text-center">
            <p className="text-xs tracking-[0.25em] text-primary uppercase">
              404
            </p>
            <h1 className="mt-4 font-display text-6xl text-gradient md:text-7xl">
              Page not found
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              The page you&apos;re looking for doesn&apos;t exist or has been
              moved. Try one of these destinations:
            </p>
            <nav
              aria-label="Recovery links"
              className="mt-8 flex flex-wrap justify-center gap-2"
            >
              {recoveryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    "primary" in link && link.primary
                      ? "rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      : "rounded-full border border-border bg-surface/60 px-4 py-2.5 text-sm font-medium hover:bg-surface-elevated focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  }
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </main>
      </body>
    </html>
  );
}
