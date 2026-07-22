import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SafeEmailLink } from "@/components/SafeEmailLink";
import { SeoStructuredData } from "@/components/SeoStructuredData";
import { getPortfolioData } from "@/lib/portfolio-data";
import { siteLanguageAlternates } from "@/lib/seo/hreflang";
import { resolveSiteUrl } from "@/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = `${resolveSiteUrl()}/`;
  const title = "Privacy Policy | Madhu Dadi";
  const description =
    "Privacy policy for madhudadi.in. Learn how personal data collected via the contact form is handled.";
  const url = `${siteUrl}privacy/`;
  const image = `${siteUrl}opengraph-image/`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: siteLanguageAlternates("/privacy/"),
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: {
        absolute: title,
      },
      description,
      url,
      siteName: "Madhu Dadi",
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${title} - Open Graph preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function PrivacyPage() {
  const { profile, sortedProjects, sortedNavigationItems } =
    await getPortfolioData();

  return (
    <div className="flex flex-col min-h-screen">
      <SeoStructuredData nodes={["Breadcrumb"]} />
      <Header profile={profile} navigationItems={sortedNavigationItems} />

      <main id="main-content" className="flex-1 px-6 py-28 bg-background/50">
        <div className="container mx-auto max-w-3xl space-y-8">
          <Breadcrumb items={[{ label: "Privacy Policy" }]} />

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Privacy Policy
          </h1>

          <p className="text-sm text-muted-foreground">
            Last updated: July 2026
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This policy covers the portfolio site at{" "}
            <a href="https://madhudadi.in/" className="inline-link">
              madhudadi.in
            </a>
            . The technical learning platform at{" "}
            <a href="https://madhudadi.in/blog" className="inline-link">
              madhudadi.in/blog
            </a>{" "}
            has a separate{" "}
            <a
              href="https://madhudadi.in/blog/privacy-policy"
              className="inline-link"
            >
              Privacy Policy
            </a>{" "}
            for accounts, quizzes, and payments. Keep both dates in mind when
            reviewing data practices.
          </p>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">1. Information I Collect</h2>
            <p className="text-muted-foreground leading-relaxed">
              When you use the contact form or portfolio assistant on this
              website, I collect the following information:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Your name</li>
              <li>Your email address</li>
              <li>The subject of your message</li>
              <li>Your message content</li>
              <li>
                Portfolio assistant messages and recent conversation context
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              I use Google Tag Manager for anonymous usage analytics and Core
              Web Vitals monitoring. Google Tag Manager may set functional
              cookies (such as _ga, _gid) for analytics purposes. These cookies
              do not contain personally identifiable information. No personally
              identifiable information is collected through these technologies
              for the purpose of identifying you individually.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">
              2. How I Use Your Information
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The information you submit through the contact form is used to
              respond to your inquiry and to communicate with you about
              potential projects, consulting engagements, or job opportunities.
              Portfolio assistant messages are used to generate a response about
              my experience, services, projects, and skills.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Do not submit confidential, sensitive, or regulated information
              through the portfolio assistant.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">
              3. Data Storage and Security
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Contact form submissions are delivered via email using Resend (a
              third-party email service). I do not store your personal data in a
              database. Your information is retained only in my email inbox for
              the purpose of our correspondence.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Portfolio assistant messages are processed to answer your question
              and are not stored in a website database by this portfolio app.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">4. Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              This website uses the following third-party services:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>
                <strong>Google Tag Manager</strong> — for anonymous usage
                analytics and Core Web Vitals monitoring. No personally
                identifiable information is collected through GTM.
              </li>
              <li>
                <strong>Resend</strong> — for delivering contact form
                submissions via email.
              </li>
              <li>
                <strong>OpenAI</strong> — for generating portfolio assistant
                responses when the assistant is used.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">5. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              Under India&apos;s Digital Personal Data Protection Act (DPDPA)
              2023, you have the right to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Access the personal data I hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request erasure of your data</li>
              <li>Withdraw consent for data processing</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              To exercise any of these rights, please contact me at{" "}
              <SafeEmailLink email={profile.email} className="inline-link">
                {profile.email}
              </SafeEmailLink>
              .
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">6. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about this privacy policy, please contact me
              at{" "}
              <SafeEmailLink email={profile.email} className="inline-link">
                {profile.email}
              </SafeEmailLink>
              .
            </p>
          </section>
        </div>
      </main>

      <Footer
        profile={profile}
        navigationItems={sortedNavigationItems}
        projects={sortedProjects}
      />
    </div>
  );
}
