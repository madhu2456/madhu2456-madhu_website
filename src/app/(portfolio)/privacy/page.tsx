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

          <div className="overflow-x-auto rounded-xl border border-border bg-surface/20">
            <table className="min-w-full text-sm">
              <tbody className="divide-y divide-border/60">
                <tr>
                  <th
                    scope="row"
                    className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap"
                  >
                    Last updated
                  </th>
                  <td className="px-4 py-3 text-muted-foreground">
                    22 July 2026
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap"
                  >
                    Scope
                  </th>
                  <td className="px-4 py-3 text-muted-foreground">
                    Portfolio site at{" "}
                    <a href="https://madhudadi.in/" className="inline-link">
                      madhudadi.in
                    </a>{" "}
                    (contact form, portfolio assistant, analytics). The learning
                    platform at{" "}
                    <a
                      href="https://madhudadi.in/blog"
                      className="inline-link"
                    >
                      madhudadi.in/blog
                    </a>{" "}
                    has a separate{" "}
                    <a
                      href="https://madhudadi.in/blog/privacy-policy"
                      className="inline-link"
                    >
                      Privacy Policy
                    </a>
                    .
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap"
                  >
                    Data Fiduciary
                  </th>
                  <td className="px-4 py-3 text-muted-foreground">
                    Madhu Dadi (sole operator of madhudadi.in)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">
              1. Data Fiduciary &amp; Grievance Redressal
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Under India&apos;s Digital Personal Data Protection Act, 2023
              (DPDP Act / DPDPA), the{" "}
              <strong className="text-foreground font-semibold">
                Data Fiduciary
              </strong>{" "}
              for personal data processed through this portfolio site is:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>
                <strong className="text-foreground font-semibold">
                  Name:
                </strong>{" "}
                Madhu Dadi
              </li>
              <li>
                <strong className="text-foreground font-semibold">
                  Role:
                </strong>{" "}
                Data Fiduciary and Grievance Officer (sole proprietor /
                individual operator)
              </li>
              <li>
                <strong className="text-foreground font-semibold">
                  Contact:
                </strong>{" "}
                <SafeEmailLink email={profile.email} className="inline-link">
                  {profile.email}
                </SafeEmailLink>
              </li>
              <li>
                <strong className="text-foreground font-semibold">
                  Address for notices:
                </strong>{" "}
                Visakhapatnam, Andhra Pradesh, India (remote-first practice)
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              To raise a privacy grievance or exercise your rights as a Data
              Principal, email the Grievance Officer at the address above with
              the subject line &quot;DPDP grievance&quot; or &quot;Data Principal
              request&quot;. I aim to acknowledge within 72 hours and resolve
              within the timelines prescribed under applicable DPDP rules. If
              you are not satisfied with the response, you may escalate to the
              Data Protection Board of India as provided under the Act.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">2. Information I Collect</h2>
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
              I use Google Tag Manager for aggregated usage analytics and Core
              Web Vitals monitoring. After you interact with the page (scroll,
              click, or keypress), GTM may set analytics cookies such as{" "}
              <code className="text-xs">_ga</code> and{" "}
              <code className="text-xs">_gid</code>. These are used for
              statistical measurement, not for selling personal data or building
              advertising profiles on this site. There is no separate cookie
              consent banner (owner decision DR-07): analytics load only after
              first interaction, and this policy discloses the cookies and your
              right to withdraw. You can also block cookies in your browser.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">
              3. How I Use Your Information
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
              4. Data Storage and Security
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
            <h2 className="text-xl font-semibold">5. Third-Party Services</h2>
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
            <h2 className="text-xl font-semibold">
              6. Your Rights as a Data Principal
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Under India&apos;s Digital Personal Data Protection Act, 2023, as
              a Data Principal you have the right to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>
                Right to access a summary of personal data I process about you
                and the processing activities involved
              </li>
              <li>
                Right to correction and erasure of inaccurate or incomplete
                personal data
              </li>
              <li>
                Right to data erasure when the purpose is served or consent is
                withdrawn (subject to legal retention needs)
              </li>
              <li>
                Right to withdraw consent for processing that relies on consent
                (for example, optional analytics cookies)
              </li>
              <li>
                Right to nominate another individual to exercise your rights in
                the event of death or incapacity, where applicable
              </li>
              <li>
                Right to grievance redressal with the Data Fiduciary and, if
                unresolved, complaint to the Data Protection Board of India
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              To exercise any of these rights, contact the Grievance Officer at{" "}
              <SafeEmailLink email={profile.email} className="inline-link">
                {profile.email}
              </SafeEmailLink>
              .
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">7. Children&apos;s Data</h2>
            <p className="text-muted-foreground leading-relaxed">
              This portfolio is intended for adult professionals exploring
              consulting, hiring, or technical collaboration. It is not directed
              at children (individuals under 18). I do not knowingly collect
              personal data from children. If you believe a child has submitted
              personal data through the contact form or portfolio assistant,
              contact the Grievance Officer and I will delete that data promptly
              where required under the DPDP Act, 2023 (including §9 on
              children&apos;s data and verifiable parental consent).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">
              8. Cross-Border Data Transfers
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              I am based in India. Some processing needed to operate this site
              may occur outside India when you use third-party services listed
              above:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>
                <strong>Resend</strong> — delivers contact-form email
              </li>
              <li>
                <strong>OpenAI</strong> — processes portfolio assistant messages
                when you use the assistant
              </li>
              <li>
                <strong>Google (GTM / Analytics)</strong> — aggregated usage and
                Core Web Vitals measurement after you interact with the page
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              Cross-border processing is limited to what those providers need to
              provide their service. By submitting the contact form or using the
              portfolio assistant, you understand that the personal data you
              provide may be transferred to and processed in jurisdictions
              outside India solely for the purposes described in this policy
              (DPDP Act considerations on cross-border transfer, including
              §16). I do not sell personal data.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">9. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about this privacy policy, please contact
              Madhu Dadi (Data Fiduciary) at{" "}
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
