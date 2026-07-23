/**
 * Pillar: Consent Mode v2 for India / DPDP-aligned GA4 (audit B3).
 * Educational guide for client implementations. This portfolio site uses DR-07
 * (GTM after interaction, no consent banner) — do not treat this page as a
 * commitment to ship a banner on madhudadi.in.
 * TechArticle + visible structure only — no FAQPage growth schema.
 */
export const CONSENT_MODE_V2_INDIA_GUIDE = {
  slug: "consent-mode-v2-india",
  path: "/guides/consent-mode-v2-india/",
  title: "Consent Mode v2 for India — DPDP-aligned GA4 in 2026",
  seoTitle: "Consent Mode v2 for India — DPDP GA4 2026 | Madhu Dadi",
  seoDescription:
    "Implement Google Consent Mode v2 for India with DPDP Act 2023 alignment: default signals, GTM setup notes, testing, and when a banner is required.",
  publishedAt: "2026-07-23",
  updatedAt: "2026-07-23",
  directAnswer:
    "Consent Mode v2 is Google’s framework for adjusting how tags behave based on user consent, using six storage signals (ad_storage, ad_user_data, ad_personalization, analytics_storage, functionality_storage, security_storage). For India in 2026, advertising and analytics signals should default to denied until the user actively consents when you rely on consent as a legal basis under the DPDP Act 2023—then update signals after a clear choice.",
  sections: [
    {
      id: "what-is-cmv2",
      h2: "Consent Mode v2 in one paragraph",
      paragraphs: [
        "Consent Mode tells Google tags what they may store and use. In v2, you declare defaults before tags load, then call an update when the user accepts, rejects, or changes preferences. Without defaults, tags may assume more access than your policy states—and modelled conversions, Ads, and Analytics behaviour become hard to defend in an audit.",
        "Consent Mode is not a cookie banner by itself. The banner (or equivalent UI) is how you collect the choice; Consent Mode is how you encode that choice for Google’s stack. You still need a privacy notice, a lawful basis story under DPDP, and validation that defaults are not overwritten by a misconfigured GTM container.",
      ],
    },
    {
      id: "dpdp-touchpoints",
      h2: "DPDP Act 2023 — the parts that touch analytics",
      paragraphs: [
        "India’s Digital Personal Data Protection Act, 2023 (DPDP / DPDPA) treats personal data processing as something that needs a clear purpose and, where required, free and informed consent. Analytics cookies and advertising identifiers often process personal data when they identify a device or user over time.",
        "Practical implications for marketing stacks: disclose what you collect, name a Data Fiduciary / grievance path, keep retention finite, and do not claim “anonymous GA4” if client IDs and events can re-identify people when joined. Consent Mode helps you align Google tags with the choice the user made; it does not replace a privacy policy or legal review for regulated sectors.",
      ],
      bullets: [
        "Name the Data Fiduciary and how to raise a grievance",
        "State retention for form data, analytics, and logs",
        "Default deny advertising/analytics storage until consent when consent is your basis",
        "Document cross-border processors (e.g. Google, email providers)",
      ],
    },
    {
      id: "six-signals",
      h2: "The six consent signals and sensible defaults",
      paragraphs: [
        "Set defaults in the page before GTM or gtag loads. Update only after a real user action—not on page view alone.",
        "If your counsel treats certain first-party analytics as legitimate use without consent, document that position—do not invent it in a blog post. Many consumer brands still default analytics_storage to denied until accept for cleaner product and Ads modelling behaviour.",
      ],
      table: {
        caption: "Consent Mode v2 signals (typical India marketing site)",
        headers: ["Signal", "Controls", "Common default before choice"],
        rows: [
          ["ad_storage", "Ads cookies / advertising storage", "denied"],
          ["ad_user_data", "Sending user data to Google for ads", "denied"],
          ["ad_personalization", "Personalized advertising", "denied"],
          [
            "analytics_storage",
            "Analytics cookies (e.g. GA)",
            "denied (if consent-based)",
          ],
          [
            "functionality_storage",
            "Functional prefs (language, etc.)",
            "granted (if strictly necessary)",
          ],
          [
            "security_storage",
            "Security / fraud related storage",
            "granted (if strictly necessary)",
          ],
        ],
      },
    },
    {
      id: "gtm-defaults",
      h2: "GTM installation with default consent",
      paragraphs: [
        "Pattern: initialize dataLayer, set consent defaults, then load GTM. On accept/reject, push a consent update and optionally a custom event your tags listen for. Keep a wait_for_update window so early hits do not race the banner.",
        "In GTM, use Consent Overview / additional consent checks on tags that fire ads or analytics. Server-side GTM should respect the same signals so first-party endpoints do not re-open denied storage via a back door.",
      ],
      bullets: [
        "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);}",
        "gtag('consent','default',{ ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied', analytics_storage:'denied', functionality_storage:'granted', security_storage:'granted', wait_for_update:500 });",
        "On accept: gtag('consent','update',{ ad_storage:'granted', ad_user_data:'granted', ad_personalization:'granted', analytics_storage:'granted' });",
        "On reject: keep ads/analytics denied; only keep strictly necessary storage granted",
      ],
    },
    {
      id: "banner-copy",
      h2: "A DPDP-aligned banner (structure, not legal advice)",
      paragraphs: [
        "A workable banner states: who you are, what categories of cookies/trackers you use (necessary, analytics, advertising), a link to the full privacy policy, Accept / Reject (or granular toggles), and that rejecting non-essential tracking will not block core site use.",
        "Avoid dark patterns: pre-ticked ad boxes, “accept” only with reject buried, or claiming the site is unusable without marketing cookies. Store the choice with a version timestamp so you can prove what policy the user saw.",
      ],
    },
    {
      id: "ssgtm",
      h2: "Server-side tagging and Consent Mode",
      paragraphs: [
        "Server-side GTM improves first-party collection and control, but it does not exempt you from consent rules. Pass consent state into the server container and gate enrichment, ad platform hits, and long-lived identifiers accordingly.",
        "If you only move the same third-party pixels to a first-party domain without honouring denied signals, you have improved stealth, not compliance.",
      ],
    },
    {
      id: "testing",
      h2: "Testing with Tag Assistant and BigQuery",
      paragraphs: [
        "Verify three states: no choice yet (defaults), accepted, rejected. In Tag Assistant / debug mode, confirm consent signals and which tags fired. In GA4 DebugView, confirm events only when analytics is granted if that is your policy.",
        "If you use BigQuery export, sample rows after a controlled test session: you should not see a flood of advertising identifiers from a session that rejected ads. Keep a short QA checklist in the engagement handover.",
      ],
      bullets: [
        "Hard-refresh with cleared site data for each state",
        "Check gtag consent commands order vs GTM load",
        "Confirm CMP (if any) writes the same state Consent Mode reads",
        "Re-test after container publish and after theme/header changes",
      ],
    },
    {
      id: "this-site",
      h2: "Note on madhudadi.in (owner policy DR-07)",
      paragraphs: [
        "This portfolio site currently defers GTM until first interaction and documents analytics in the privacy policy without a separate cookie banner (owner decision DR-07). That is a deliberate product choice for a low-risk professional site—not a template for high-volume D2C or Ads-heavy funnels.",
        "If your brand runs paid media into India at scale, expect counsel and measurement leads to require explicit consent UI + Consent Mode defaults. Use this guide as the implementation map; use discovery to decide the legal posture for your brand.",
      ],
    },
    {
      id: "faq",
      h2: "FAQ",
      paragraphs: [
        "Is Consent Mode required by Indian law by name? The Act does not say “Consent Mode v2.” It requires lawful processing and, where consent is the basis, free and informed consent. Consent Mode is Google’s technical control that helps you honour that choice in Ads/Analytics.",
        "Does default-deny break conversion tracking? It can reduce observed conversions; Google’s modelled conversions may recover some signal when Consent Mode is implemented correctly. Measure before/after with a holdout mindset.",
        "Can I only use a privacy policy and no banner? Sometimes for minimal sites with limited trackers—document the rationale. Ads-heavy and personalization-heavy sites usually need a real choice UI.",
        "Who implements this? Measurement engineers, often with a GA4/GTM consultant and legal review. See the GA4 consultant and GA4+BigQuery guide links below for the surrounding stack.",
      ],
    },
  ],
  relatedLinks: [
    { href: "/ga4-consultant/", label: "GA4 consultant lander" },
    {
      href: "/google-analytics-consultant/",
      label: "Google Analytics consultant",
    },
    { href: "/guides/ga4-bigquery/", label: "Guide: GA4 + BigQuery setup" },
    {
      href: "/guides/attribution-after-cookies/",
      label: "Guide: attribution after cookies",
    },
    {
      href: "/services/ga4-bigquery-campaign-analytics/",
      label: "GA4 + BigQuery campaign analytics service",
    },
    { href: "/privacy/", label: "This site’s privacy policy" },
    { href: "/contact/#intent=ga4-bigquery", label: "Contact / discovery" },
  ],
} as const;
