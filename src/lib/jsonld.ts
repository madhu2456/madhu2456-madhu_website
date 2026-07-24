import { normalizeKeywordList } from "@/lib/discovery-keywords";

/** Cap free-text schema fields for HTML payload (audit v5). */
function truncateSchemaText(
  value: string | null | undefined,
  max = 160,
): string | undefined {
  if (!value) return undefined;
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  const slice = normalized.slice(0, max - 1);
  const boundary = slice.lastIndexOf(" ");
  const clipped = (boundary > 80 ? slice.slice(0, boundary) : slice).replace(
    /[,\s;:.-]+$/,
    "",
  );
  return `${clipped}…`;
}

type SocialLinks = {
  github?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  website?: string | null;
  medium?: string | null;
  devto?: string | null;
  youtube?: string | null;
  stackoverflow?: string | null;
  wikidata?: string | null;
  googleBusiness?: string | null;
};

type Citation = {
  label?: string | null;
  url?: string | null;
};

type Project = {
  title: string;
  slug?: string | null;
  tagline?: string | null;
  liveUrl?: string | null;
  githubUrl?: string | null;
  category?: string | null;
  citations?: Citation[] | null;
};

type Experience = {
  company: string;
  position: string;
  startDate?: string | null;
  endDate?: string | null;
  current?: boolean | null;
  location?: string | null;
};

type Service = {
  title: string;
  slug?: string | null;
  shortDescription?: string | null;
  pricing?: {
    startingPrice?: number | null;
    priceType?: string | null;
  } | null;
};

type Certification = {
  name: string;
  issuer?: string | null;
  issueDate?: string | null;
  expiryDate?: string | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
  description?: string | null;
};

type RichService = {
  title: string;
  slug?: string | null;
  shortDescription?: string | null;
  fullDescription?: string | null;
  features?: string[] | null;
  technologies?: Array<{ name?: string | null }> | null;
  pricing?: {
    startingPrice?: number | null;
    priceType?: string | null;
    description?: string | null;
  } | null;
  timeline?: string | null;
};

type CurrentRole = {
  company: string;
  position: string;
  startDate?: string | null;
  location?: string | null;
};

const SCHEMA_LANGUAGE = "en-IN";
const TRANSACTIONAL_KNOWS_ABOUT_PATTERN =
  /\b(hire|freelance|freelancer|for hire|near me|contractor|available|remote|services? in)\b/i;
const LOCATION_KNOWS_ABOUT_PATTERN = /\s+in\s+/i;
const SELF_REFERENTIAL_KNOWS_ABOUT_PATTERN = /\bmadhu\s+dadi\b/i;

const toExpertiseKeywords = (keywords?: string[] | null) =>
  normalizeKeywordList(keywords).filter(
    (keyword) =>
      !TRANSACTIONAL_KNOWS_ABOUT_PATTERN.test(keyword) &&
      !LOCATION_KNOWS_ABOUT_PATTERN.test(keyword) &&
      !SELF_REFERENTIAL_KNOWS_ABOUT_PATTERN.test(keyword),
  );

const buildDeliveryLeadTime = (timeline: string) => {
  const rangeMatch = timeline.match(/(\d+)\s*[-–—]\s*(\d+)\s*([a-zA-Z]+)/);
  if (rangeMatch) {
    return {
      "@type": "QuantitativeValue",
      minValue: Number(rangeMatch[1]),
      maxValue: Number(rangeMatch[2]),
      unitText: rangeMatch[3].toLowerCase(),
    };
  }
  const singleMatch = timeline.match(/(\d+)\s*([a-zA-Z]+)/);
  if (singleMatch) {
    return {
      "@type": "QuantitativeValue",
      value: Number(singleMatch[1]),
      unitText: singleMatch[2].toLowerCase(),
    };
  }
  return {
    "@type": "QuantitativeValue",
    value: timeline,
  };
};

// ---------------------------------------------------------------------------
// Person
// ---------------------------------------------------------------------------
export function buildPersonSchema({
  fullName,
  headline,
  bio,
  email,
  location,
  profileImageUrl,
  siteUrl,
  socialLinks,
  yearsOfExperience,
  nationality,
  alumniOf,
  seoKeywords,
  certifications,
  services,
  currentRole,
}: {
  fullName: string;
  headline?: string | null;
  bio?: string | null;
  email?: string | null;
  location?: string | null;
  profileImageUrl?: string;
  siteUrl: string;
  socialLinks?: SocialLinks;
  yearsOfExperience?: number | null;
  nationality?: string | null;
  alumniOf?: Array<{ name: string; url?: string }> | null;
  seoKeywords?: string[] | null;
  certifications?: Certification[] | null;
  services?: RichService[] | null;
  currentRole?: CurrentRole | null;
}) {
  const sameAs = Object.entries(socialLinks ?? {})
    .filter(([, v]) => typeof v === "string" && v.length > 0)
    .map(([, v]) => v as string);
  const staticKnowsAbout = [
    "Analytics",
    "Full-Stack Development",
    "AI & Machine Learning",
    "Large Language Models",
    "Generative AI",
    "RAG (Retrieval-Augmented Generation)",
    "Agentic AI Systems",
    "MLOps",
    "Data Analytics",
    "Digital Transformation",
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "Python",
    "FastAPI",
    "PostgreSQL",
    "Cloud Infrastructure",
    "System Design",
  ];
  const knowsAbout = Array.from(
    new Set([...staticKnowsAbout, ...toExpertiseKeywords(seoKeywords)]),
  );

  // Build a single description - prefer the short bio, fall back to headline,
  // append years of experience if available. Multiple spread of the same key
  // produces invalid JSON-LD so we consolidate here.
  const descriptionParts: string[] = [];
  if (bio) descriptionParts.push(bio);
  else if (headline) descriptionParts.push(headline);
  if (yearsOfExperience) {
    descriptionParts.push(
      `${yearsOfExperience}+ years of professional experience.`,
    );
  }
  const description = descriptionParts.join(" ") || undefined;

  const credentialNodes =
    certifications && certifications.length > 0
      ? certifications
          .filter((c) => c.credentialUrl || c.name)
          .map((c, i) => ({
            "@type": "EducationalOccupationalCredential",
            "@id": `${siteUrl}#credential-${i + 1}`,
            name: c.name,
            ...(c.credentialUrl && { url: c.credentialUrl }),
            ...(c.issuer && {
              recognizedBy: {
                "@type": "Organization",
                name: c.issuer,
              },
            }),
          }))
      : [];

  const offerNodes =
    services && services.length > 0
      ? services
          .filter((s) => s.title)
          .map((s, i) => {
            const hasPrice =
              typeof s.pricing?.startingPrice === "number" &&
              s.pricing.startingPrice > 0;
            const serviceUrl = s.slug
              ? `${siteUrl}services/${s.slug}/`
              : `${siteUrl}services/`;
            return {
              "@type": "Offer",
              "@id": s.slug
                ? `${serviceUrl}#offer`
                : `${siteUrl}#offer-${i + 1}`,
              name: s.title,
              description: truncateSchemaText(s.shortDescription),
              url: serviceUrl,
              availability: "https://schema.org/InStock",
              ...(hasPrice && {
                price: s.pricing?.startingPrice,
                priceCurrency: "USD",
              }),
              ...(s.timeline && {
                deliveryLeadTime: buildDeliveryLeadTime(s.timeline),
              }),
            };
          })
      : [];

  const worksForNode = currentRole
    ? {
        "@type": "Organization",
        name: currentRole.company,
        description: currentRole.position,
        ...(currentRole.location && {
          location: {
            "@type": "PostalAddress",
            addressLocality: currentRole.location,
          },
        }),
      }
    : undefined;

  return {
    "@type": "Person",
    "@id": `${siteUrl}#person`,
    name: fullName,
    url: `${siteUrl}profile/`,
    ...(description && { description }),
    ...(headline && { jobTitle: headline }),
    ...(email && { email }),
    ...(email && {
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "professional",
          email,
          url: `${siteUrl}contact/`,
          availableLanguage: ["English"],
          areaServed: [
            {
              "@type": "City",
              name: "Visakhapatnam",
              containedInPlace: { "@type": "Country", name: "India" },
            },
            {
              "@type": "City",
              name: "Hyderabad",
              containedInPlace: { "@type": "Country", name: "India" },
            },
            { "@type": "Country", name: "India" },
            { "@type": "Place", name: "Worldwide (remote)" },
          ],
        },
      ],
    }),
    ...(location && {
      // AUDIT DECISION DR-01 / C-01 (2026-07-19): Owner chose to KEEP BOTH
      // Visakhapatnam and Hyderabad. The `location` field intentionally reads
      // "Visakhapatnam, India; professional experience includes Hyderabad,
      // Bengaluru, and Gurugram" — Visakhapatnam is the permanent home base,
      // Hyderabad is the current Novartis work location, Bengaluru/Gurugram
      // are past work locations. This is NOT a contradiction; base city and
      // current job city are distinct concepts. The shortBio/siteDescription
      // "based in Visakhapatnam" wording is intentional and accurate. Do NOT
      // re-flag the Visakhapatnam-vs-Hyderabad location as a contradiction
      // in future audits.
      address: {
        "@type": "PostalAddress",
        addressLocality: location,
      },
    }),
    ...(profileImageUrl && {
      image: {
        "@type": "ImageObject",
        "@id": `${siteUrl}#personImage`,
        url: profileImageUrl,
        contentUrl: profileImageUrl,
      },
    }),
    ...(sameAs.length > 0 && { sameAs }),
    publishingPrinciples: `${siteUrl}blog/`,
    mainEntityOfPage: { "@id": `${siteUrl}profile/#webpage` },
    hasOccupation: { "@id": `${siteUrl}#occupation` },
    subjectOf: [
      {
        "@type": "CreativeWork",
        name: `${fullName}'s Technical Blog RSS Feed`,
        url: `${siteUrl}blog/feed.xml`,
        encodingFormat: "application/rss+xml",
      },
      {
        "@type": "CreativeWork",
        name: "Technical Articles Index",
        url: `${siteUrl}blog/posts`,
      },
      {
        "@type": "AboutPage",
        name: "About the AI, Python & Analytics Learning Platform",
        url: `${siteUrl}blog/about`,
      },
      {
        "@type": "CreativeWork",
        name: "Technical Blog AI Assistant",
        url: `${siteUrl}blog/ask`,
      },
    ],
    ...(knowsAbout.length > 0 && { knowsAbout }),
    ...(nationality && {
      nationality: {
        "@type": "Country",
        name: nationality,
      },
    }),
    ...(alumniOf &&
      alumniOf.length > 0 && {
        // CollegeOrUniversity nodes — degrees also surface as hasCredential
        // when certification-style credentials are present.
        alumniOf: alumniOf.map((edu) => ({
          "@type": "CollegeOrUniversity",
          name: edu.name,
          ...(edu.url && { url: edu.url }),
        })),
      }),
    ...(worksForNode && { worksFor: worksForNode }),
    ...(credentialNodes.length > 0 && { hasCredential: credentialNodes }),
    ...(offerNodes.length > 0 && { makesOffer: offerNodes }),
    seeks: {
      "@type": "Demand",
      name: "Select consulting and full-time opportunities in AI, analytics, and full-stack engineering",
    },
  };
}

// ---------------------------------------------------------------------------
// Occupation
// ---------------------------------------------------------------------------
const staticOccupationSkills = [
  "AI/ML Development",
  "LLM Engineering",
  "Full-Stack Development",
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Cloud Infrastructure",
];

export function buildOccupationSchema({
  siteUrl,
  jobTitle,
  location,
  skills,
}: {
  siteUrl: string;
  jobTitle?: string | null;
  location?: string | null;
  skills?: Array<{ name: string } | string> | null;
}) {
  const derivedSkills =
    skills && skills.length > 0
      ? skills.map((s) => (typeof s === "string" ? s : s.name)).filter(Boolean)
      : staticOccupationSkills;

  return {
    "@type": "Occupation",
    "@id": `${siteUrl}#occupation`,
    name: jobTitle || "AI Developer & ML Engineer",
    occupationLocation: {
      "@type": "AdministrativeArea",
      name: location ?? "Remote",
    },
    skills: derivedSkills.join(", "),
  };
}

// ---------------------------------------------------------------------------
// Organization
//
// AUDIT DECISION DR-05 (2026-07-19): Owner confirmed "Madhu Dadi" is a
// PERSONAL BRAND — no registered business entity (no Pvt Ltd, LLP, or GST
// registration). Option A chosen. Organization name intentionally mirrors
// Person name; no legalName, taxID, foundingDate, or registered address is
// added. No LocalBusiness node is emitted (would require real premises and
// risks Google manual action). Founder link connects Organization → Person
// per Google's canonical personal-portfolio pattern. Do NOT re-flag the
// Organization == Person name overlap in future audits.
// ---------------------------------------------------------------------------
export function buildOrganizationSchema({
  siteUrl,
  name,
  logoUrl,
  description,
  socialLinks,
}: {
  siteUrl: string;
  name: string;
  logoUrl?: string;
  description?: string;
  socialLinks?: SocialLinks;
}) {
  const sameAs = socialLinks
    ? Object.values(socialLinks).filter(
        (v): v is string => typeof v === "string" && v.length > 0,
      )
    : [];
  return {
    "@type": "Organization",
    "@id": `${siteUrl}#organization`,
    name,
    url: siteUrl,
    logo: logoUrl ? { "@type": "ImageObject", url: logoUrl } : undefined,
    founder: { "@id": `${siteUrl}#person` },
    ...(description && { description }),
    ...(sameAs.length > 0 && { sameAs }),
  };
}

// ---------------------------------------------------------------------------
// ProfessionalService - helps with local/search visibility
// ---------------------------------------------------------------------------
export function buildProfessionalServiceSchema({
  siteUrl,
}: {
  siteUrl: string;
}) {
  return {
    "@type": "Service",
    "@id": `${siteUrl}#service`,
    name: "Madhu Dadi - AI & Analytics Engineering",
    url: `${siteUrl}ai-consultant-india/`,
    description:
      "AI and marketing analytics engineering consulting — LLM/RAG applications, AI agents, FastAPI/Next.js products, and marketing analytics systems.",
    areaServed: [
      {
        "@type": "City",
        name: "Visakhapatnam",
        containedInPlace: { "@type": "Country", name: "India" },
      },
      {
        "@type": "City",
        name: "Hyderabad",
        containedInPlace: { "@type": "Country", name: "India" },
      },
      {
        "@type": "City",
        name: "Bengaluru",
        containedInPlace: { "@type": "Country", name: "India" },
      },
      { "@type": "Country", name: "India" },
      { "@type": "Place", name: "Worldwide (remote)" },
    ],
    provider: { "@id": `${siteUrl}#person` },
  };
}

// ---------------------------------------------------------------------------
// WebSite
// ---------------------------------------------------------------------------
export function buildWebSiteSchema({
  name,
  url,
  description,
}: {
  name: string;
  url: string;
  description?: string | null;
}) {
  const blogUrl = `${url}blog`;
  return {
    "@type": "WebSite",
    "@id": `${url}#website`,
    name,
    url,
    ...(description && { description }),
    inLanguage: SCHEMA_LANGUAGE,
    publisher: { "@id": `${url}#organization` },
    // SiteLinksSearchBox - enables rich search in Google SERPs
    potentialAction: [
      {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${url}search/?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    ],
    // Blog is a sub-site on the same domain - linking them helps search engines
    // and AI crawlers understand the relationship between portfolio and blog
    hasPart: {
      "@type": "Blog",
      "@id": `${blogUrl}#blog`,
      name: `${name} - Technical Blog`,
      url: blogUrl,
      description:
        "A learning-focused technical blog covering AI engineering, full-stack development, RAG systems, and analytics best practices.",
      inLanguage: SCHEMA_LANGUAGE,
      author: { "@id": `${url}#person` },
      copyrightHolder: { "@id": `${url}#person` },
      publisher: { "@id": `${url}#person` },
      about: [
        { "@type": "Thing", name: "Artificial Intelligence" },
        { "@type": "Thing", name: "Machine Learning" },
        { "@type": "Thing", name: "Full-Stack Development" },
        { "@type": "Thing", name: "Analytics" },
        { "@type": "Thing", name: "RAG Systems" },
        { "@type": "Thing", name: "Agentic AI" },
      ],
      keywords:
        "AI engineering, LLM development, RAG systems, Next.js, React, TypeScript, Python, FastAPI, Software Architecture",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${blogUrl}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  };
}

// ---------------------------------------------------------------------------
// ProfilePage  (schema.org/ProfilePage - the right type for portfolio sites)
// ---------------------------------------------------------------------------
export function buildProfilePageSchema({
  fullName,
  url,
  description,
  profileImageUrl,
  dateModified,
}: {
  fullName: string;
  url: string;
  description?: string | null;
  profileImageUrl?: string;
  dateModified?: string;
}) {
  const profileUrl = `${url}profile/`;

  return {
    "@type": "ProfilePage",
    "@id": `${profileUrl}#webpage`,
    name: `${fullName} - Portfolio`,
    url: profileUrl,
    ...(description && { description }),
    inLanguage: SCHEMA_LANGUAGE,
    isPartOf: { "@id": `${url}#website` },
    about: { "@id": `${url}#person` },
    mainEntity: { "@id": `${url}#person` },
    breadcrumb: { "@id": `${profileUrl}#breadcrumb` },
    dateModified: dateModified ?? new Date().toISOString(),
    ...(profileImageUrl && {
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: profileImageUrl,
      },
    }),
    // speakable omitted: Google Speakable is BETA / news-only (not eligible for
    // a personal engineering portfolio). Not used for AI Overviews.
  };
}

// ---------------------------------------------------------------------------
// Services - ItemList of Service nodes
// ---------------------------------------------------------------------------
export function buildServicesListSchema({
  siteUrl,
  services,
}: {
  siteUrl: string;
  services: Service[];
}) {
  if (services.length === 0) return null;

  const unitTextByPriceType: Record<string, string> = {
    hourly: "hour",
    project: "project",
    monthly: "month",
  };

  return {
    "@type": "ItemList",
    "@id": `${siteUrl}#services`,
    name: "Professional Services",
    description: "Consulting and development services offered by Madhu Dadi",
    numberOfItems: services.length,
    itemListElement: services.map((service, i) => {
      const startingPrice = service.pricing?.startingPrice;
      const priceType = service.pricing?.priceType ?? undefined;
      const hasPrice =
        typeof startingPrice === "number" &&
        startingPrice > 0 &&
        priceType !== "custom";

      return {
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Service",
          "@id": service.slug
            ? `${siteUrl}services/${service.slug}/#service`
            : `${siteUrl}#service-${i + 1}`,
          name: service.title,
          serviceType: service.title,
          url: service.slug
            ? `${siteUrl}services/${service.slug}/`
            : `${siteUrl}services/`,
          provider: { "@id": `${siteUrl}#person` },
          ...(service.shortDescription && {
            description: truncateSchemaText(service.shortDescription),
          }),
          ...(hasPrice && {
            offers: {
              "@type": "Offer",
              price: startingPrice,
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              url: service.slug
                ? `${siteUrl}services/${service.slug}/`
                : `${siteUrl}services/`,
              ...(priceType &&
                unitTextByPriceType[priceType] && {
                  priceSpecification: {
                    "@type": "UnitPriceSpecification",
                    price: startingPrice,
                    priceCurrency: "USD",
                    unitText: unitTextByPriceType[priceType],
                  },
                }),
            },
          }),
        },
      };
    }),
  };
}

// ---------------------------------------------------------------------------
// Certifications - ItemList of EducationalOccupationalCredential nodes
// ---------------------------------------------------------------------------
export function buildCertificationsListSchema({
  siteUrl,
  certifications,
}: {
  siteUrl: string;
  certifications: Certification[];
}) {
  if (certifications.length === 0) return null;

  return {
    "@type": "ItemList",
    "@id": `${siteUrl}#certifications`,
    name: "Professional Certifications",
    numberOfItems: certifications.length,
    itemListElement: certifications.map((certification, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "EducationalOccupationalCredential",
        "@id": `${siteUrl}#credential-${i + 1}`,
        name: certification.name,
        credentialCategory: "Professional Certification",
        // Omit long free-text descriptions from list schema (audit v5 HTML size).
        // Name + issuer + ids/urls remain for verification.
        ...(certification.issueDate && {
          dateCreated: certification.issueDate,
        }),
        ...(certification.expiryDate && { expires: certification.expiryDate }),
        ...(certification.credentialId && {
          identifier: {
            "@type": "PropertyValue",
            name: "Credential ID",
            value: certification.credentialId,
          },
        }),
        ...(certification.credentialUrl && {
          url: certification.credentialUrl,
        }),
        ...(certification.issuer && {
          recognizedBy: {
            "@type": "Organization",
            name: certification.issuer,
          },
        }),
      },
    })),
  };
}

// ---------------------------------------------------------------------------
// Projects - ItemList of SoftwareApplication nodes
// ---------------------------------------------------------------------------
export function buildProjectsListSchema({
  siteUrl,
  projects,
}: {
  siteUrl: string;
  projects: Project[];
}) {
  if (projects.length === 0) return null;

  return {
    "@type": "ItemList",
    "@id": `${siteUrl}#projects`,
    name: "Portfolio Projects",
    description: "Software projects built by Madhu Dadi",
    numberOfItems: projects.length,
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "SoftwareApplication",
        name: p.title,
        ...(p.tagline && { description: p.tagline }),
        ...(p.slug
          ? { url: `${siteUrl}case-studies/${p.slug}/` }
          : p.liveUrl
            ? { url: p.liveUrl }
            : {}),
        ...(p.category && { applicationCategory: p.category }),
        operatingSystem: "All",
        author: { "@id": `${siteUrl}#person` },
        ...(p.citations &&
          p.citations.length > 0 && {
            citation: p.citations.map((c) => ({
              "@type": "CreativeWork",
              name: c.label || "Evidence",
              url: c.url,
            })),
          }),
      },
    })),
  };
}

// ---------------------------------------------------------------------------
// WorkExperience - ItemList of OrganizationRole nodes
// ---------------------------------------------------------------------------
export function buildWorkExperienceSchema({
  siteUrl,
  experiences,
}: {
  siteUrl: string;
  experiences: Experience[];
}) {
  if (experiences.length === 0) return null;

  return {
    "@type": "ItemList",
    "@id": `${siteUrl}#workexperience`,
    name: "Work Experience",
    numberOfItems: experiences.length,
    description: "Professional roles and responsibilities held by Madhu Dadi",
    itemListElement: experiences.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "OrganizationRole",
        roleName: e.position,
        ...(e.startDate && { startDate: e.startDate }),
        ...(!e.current && e.endDate && { endDate: e.endDate }),
        memberOf: {
          "@type": "Organization",
          name: e.company,
          ...(e.location && {
            location: {
              "@type": "PostalAddress",
              addressLocality: e.location,
            },
          }),
        },
      },
    })),
  };
}

// ---------------------------------------------------------------------------
// BreadcrumbList
// ---------------------------------------------------------------------------
export function buildBreadcrumbSchema(
  url: string,
  items: Array<{ name: string; item: string }> = [],
) {
  const baseItems = [{ name: "Home", item: url }];
  const allItems = [...baseItems, ...items];

  return {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: allItems.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.item,
    })),
  };
}

// ---------------------------------------------------------------------------
// FAQPage — visible on-page FAQ only (mirrors pageContent.home.faqItems).
// Not used to chase Google FAQ rich results: that feature is restricted /
// deprecated for general sites. Keep schema only while FAQs remain visible
// and useful for humans; do not add FAQ markup solely for SERP gadgets.
// ---------------------------------------------------------------------------
export function buildFaqSchema({
  siteUrl,
  faqItems,
}: {
  siteUrl: string;
  fullName: string;
  headline?: string | null;
  location?: string | null;
  yearsOfExperience?: number | null;
  projects?: Project[];
  services?: Service[];
  seoKeywords?: string[] | null;
  faqItems?: { question: string; answer: string }[];
}) {
  if (!faqItems || faqItems.length === 0) return null;

  return {
    "@type": "FAQPage",
    "@id": `${siteUrl}#faq`,
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

// ---------------------------------------------------------------------------
// HowTo - step-by-step guide for hiring / engaging
// Helps AI search engines answer "how do I hire Madhu Dadi?"
// ---------------------------------------------------------------------------
export function buildHowToHireSchema({
  siteUrl,
  fullName,
}: {
  siteUrl: string;
  fullName: string;
}) {
  return {
    "@type": "HowTo",
    "@id": `${siteUrl}#howto-hire`,
    name: `How to Hire ${fullName}`,
    description: `A simple guide to engaging ${fullName} for AI consulting, analytics, or full-stack development projects.`,
    totalTime: "PT48H",
    supply: [
      { "@type": "HowToSupply", name: "Project brief or problem statement" },
      { "@type": "HowToSupply", name: "Budget range and timeline" },
    ],
    tool: [
      { "@type": "HowToTool", name: "Email or contact form" },
      { "@type": "HowToTool", name: "LinkedIn" },
    ],
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Review services and case studies",
        text: `Explore the portfolio at ${siteUrl} to understand services, past projects, and case studies.`,
        url: `${siteUrl}case-studies/`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Prepare your project brief",
        text: "Outline your business problem, desired outcomes, timeline, and budget range.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Initiate contact",
        text: `Use the contact form at ${siteUrl}#contact or reach out via LinkedIn to schedule an initial discussion.`,
        url: `${siteUrl}#contact`,
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Discovery call and proposal",
        text: "A 30-minute call to align on scope, followed by a detailed proposal with timeline and pricing.",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Kickoff and delivery",
        text: "Project kickoff with weekly updates, transparent communication, and delivery against agreed milestones.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Unified @graph - bundles all schemas into one linked-data document
// This lets search engines and AI models understand the full knowledge graph
// in a single <script> rather than multiple disconnected ones.
// ---------------------------------------------------------------------------
export function buildFullGraph(nodes: (object | null)[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter((node): node is object => Boolean(node)),
  };
}

// ---------------------------------------------------------------------------
// Article schema for guides/case studies.
// Type is descriptive (Article), not an authority multiplier. Prefer the
// schema.org type that best matches visible page content; TechArticle is fine
// when the page is genuinely a technical article, but Google does not treat it
// as more authoritative than Article/BlogPosting solely by type name.
// ---------------------------------------------------------------------------
export function buildArticleSchema({
  siteUrl,
  url,
  headline,
  description,
  image,
  datePublished,
  dateModified,
  authorName,
  authorUrl,
  publisherName,
  publisherLogo,
  keywords,
}: {
  siteUrl: string;
  url: string;
  headline: string;
  description: string;
  image?: string | null;
  datePublished: string;
  dateModified: string;
  authorName: string;
  authorUrl: string;
  publisherName: string;
  publisherLogo?: string;
  keywords?: string[];
}) {
  return {
    "@type": "Article",
    "@id": `${url}#article`,
    headline,
    description,
    url,
    ...(image && { image }),
    datePublished,
    dateModified,
    author: {
      "@type": "Person",
      "@id": `${siteUrl}#person`,
      name: authorName,
      url: authorUrl,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${siteUrl}#organization`,
      name: publisherName,
      ...(publisherLogo && {
        logo: {
          "@type": "ImageObject",
          url: publisherLogo,
        },
      }),
    },
    ...(keywords && keywords.length > 0 && { keywords: keywords.join(", ") }),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}
