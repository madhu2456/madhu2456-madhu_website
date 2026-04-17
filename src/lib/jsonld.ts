type SocialLinks = {
  github?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  website?: string | null;
  medium?: string | null;
  devto?: string | null;
  youtube?: string | null;
  stackoverflow?: string | null;
};

type Project = {
  title: string;
  slug?: string | null;
  tagline?: string | null;
  liveUrl?: string | null;
  githubUrl?: string | null;
  category?: string | null;
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

const normalizeKeywordList = (keywords?: string[] | null) =>
  Array.from(
    new Set(
      (keywords ?? [])
        .map((keyword) => keyword?.trim())
        .filter(
          (keyword): keyword is string =>
            typeof keyword === "string" && keyword.length > 0,
        ),
    ),
  );

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
}) {
  const sameAs = Object.values(socialLinks ?? {}).filter(
    (v): v is string => typeof v === "string" && v.length > 0,
  );
  const staticKnowsAbout = [
    "Software Engineering",
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
    new Set([...staticKnowsAbout, ...normalizeKeywordList(seoKeywords)]),
  );

  // Build a single description — prefer the short bio, fall back to headline,
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

  return {
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: fullName,
    url: siteUrl,
    ...(description && { description }),
    ...(headline && { jobTitle: headline }),
    ...(email && { email }),
    ...(email && {
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "professional",
          email,
          url: `${siteUrl}/#contact`,
          availableLanguage: ["English"],
        },
      ],
    }),
    ...(location && {
      address: {
        "@type": "PostalAddress",
        addressLocality: location,
      },
    }),
    ...(profileImageUrl && {
      image: {
        "@type": "ImageObject",
        "@id": `${siteUrl}/#personImage`,
        url: profileImageUrl,
        contentUrl: profileImageUrl,
      },
    }),
    ...(sameAs.length > 0 && { sameAs }),
    inLanguage: "en-US",
    mainEntityOfPage: { "@id": `${siteUrl}/#profilepage` },
    hasOccupation: { "@id": `${siteUrl}/#occupation` },
    ...(knowsAbout.length > 0 && { knowsAbout }),
    ...(nationality && {
      nationality: {
        "@type": "Country",
        name: nationality,
      },
    }),
    ...(alumniOf &&
      alumniOf.length > 0 && {
        alumniOf: alumniOf.map((edu) => ({
          "@type": "CollegeOrUniversity",
          name: edu.name,
          ...(edu.url && { url: edu.url }),
        })),
      }),
  };
}

// ---------------------------------------------------------------------------
// Occupation
// ---------------------------------------------------------------------------
export function buildOccupationSchema({
  siteUrl,
  jobTitle,
  location,
}: {
  siteUrl: string;
  jobTitle?: string | null;
  location?: string | null;
}) {
  return {
    "@type": "Occupation",
    "@id": `${siteUrl}/#occupation`,
    name: jobTitle || "AI Developer & ML Engineer",
    occupationLocation: {
      "@type": "AdministrativeArea",
      name: location ?? "Remote",
    },
    skills:
      "AI/ML Development, LLM Engineering, Full-Stack Development, React, Next.js, TypeScript, Node.js, Cloud Infrastructure",
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
  const blogUrl = `${url}/blog`;
  return {
    "@type": "WebSite",
    "@id": `${url}/#website`,
    name,
    url,
    ...(description && { description }),
    inLanguage: "en-US",
    publisher: { "@id": `${url}/#person` },
    // SiteLinksSearchBox — enables rich search in Google SERPs
    potentialAction: [
      {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${url}/?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    ],
    // Blog is a sub-site on the same domain — linking them helps search engines
    // and AI crawlers understand the relationship between portfolio and blog
    hasPart: {
      "@type": "Blog",
      "@id": `${blogUrl}/#blog`,
      name: `${name} — Technical Blog`,
      url: blogUrl,
      description:
        "A learning-focused technical blog covering AI, full-stack development, RAG systems, and software engineering best practices.",
      inLanguage: "en-US",
      author: { "@id": `${url}/#person` },
    },
  };
}

// ---------------------------------------------------------------------------
// ProfilePage  (schema.org/ProfilePage — the right type for portfolio sites)
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
  return {
    "@type": "ProfilePage",
    "@id": `${url}/#profilepage`,
    name: `${fullName} — Portfolio`,
    url,
    ...(description && { description }),
    inLanguage: "en-US",
    isPartOf: { "@id": `${url}/#website` },
    about: { "@id": `${url}/#person` },
    mainEntity: { "@id": `${url}/#person` },
    breadcrumb: { "@id": `${url}/#breadcrumb` },
    dateModified: dateModified ?? new Date().toISOString(),
    ...(profileImageUrl && {
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: profileImageUrl,
      },
    }),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#home", "#about", "#experience"],
    },
  };
}

// ---------------------------------------------------------------------------
// Services — ItemList of Service nodes
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
    "@id": `${siteUrl}/#services`,
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
          "@id": `${siteUrl}/#service-${i + 1}`,
          name: service.title,
          serviceType: service.title,
          url: `${siteUrl}/#services`,
          provider: { "@id": `${siteUrl}/#person` },
          ...(service.shortDescription && {
            description: service.shortDescription,
          }),
          ...(hasPrice && {
            offers: {
              "@type": "Offer",
              price: startingPrice,
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              url: `${siteUrl}/#services`,
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
// Certifications — ItemList of EducationalOccupationalCredential nodes
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
    "@id": `${siteUrl}/#certifications`,
    name: "Professional Certifications",
    numberOfItems: certifications.length,
    itemListElement: certifications.map((certification, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "EducationalOccupationalCredential",
        "@id": `${siteUrl}/#credential-${i + 1}`,
        name: certification.name,
        credentialCategory: "Professional Certification",
        ...(certification.description && {
          description: certification.description,
        }),
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
// Projects — ItemList of SoftwareApplication nodes
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
    "@id": `${siteUrl}/#projects`,
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
        ...((p.slug && { url: `${siteUrl}/case-studies/${p.slug}` }) ||
          (p.liveUrl && { url: p.liveUrl })),
        ...(p.githubUrl && { codeRepository: p.githubUrl }),
        ...(p.category && { applicationCategory: p.category }),
        author: { "@id": `${siteUrl}/#person` },
      },
    })),
  };
}

// ---------------------------------------------------------------------------
// WorkExperience — ItemList of WorkExperience nodes
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
    "@id": `${siteUrl}/#workexperience`,
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
export function buildBreadcrumbSchema(url: string) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${url}/#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: url,
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// FAQPage — answer-engine friendly Q&A summary for portfolio intent
// ---------------------------------------------------------------------------
export function buildFaqSchema({
  siteUrl,
  fullName,
  headline,
  location,
  yearsOfExperience,
  projects,
  services,
  seoKeywords,
}: {
  siteUrl: string;
  fullName: string;
  headline?: string | null;
  location?: string | null;
  yearsOfExperience?: number | null;
  projects: Project[];
  services: Service[];
  seoKeywords?: string[] | null;
}) {
  const projectCount = projects.length;
  const normalizedKeywords = normalizeKeywordList(seoKeywords);
  const consultingKeywordHighlights = normalizedKeywords
    .filter((keyword) =>
      /consult|services|llm|rag|agent|chatbot|automation|strategy/i.test(
        keyword,
      ),
    )
    .slice(0, 6);
  const keywordSummary =
    consultingKeywordHighlights.length > 0
      ? consultingKeywordHighlights.join(", ")
      : "generative AI consulting, LLM consulting, RAG development services, AI agent development services, and AI chatbot development services";
  const topServices = services
    .map((service) => service.title)
    .filter(Boolean)
    .slice(0, 3);
  const serviceSummary =
    topServices.length > 0
      ? topServices.join(", ")
      : "AI engineering, full-stack development, and technical consulting";
  const experienceSummary =
    typeof yearsOfExperience === "number" && yearsOfExperience > 0
      ? `${yearsOfExperience}+ years of professional experience`
      : "strong hands-on professional experience";
  const profileSummary = [headline, experienceSummary, location]
    .filter(Boolean)
    .join(" · ");

  return {
    "@type": "FAQPage",
    "@id": `${siteUrl}/#faq`,
    mainEntity: [
      {
        "@type": "Question",
        name: `Who is ${fullName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: profileSummary
            ? `${fullName} is a technology professional focused on ${profileSummary}.`
            : `${fullName} is a technology professional focused on AI and software engineering.`,
        },
      },
      {
        "@type": "Question",
        name: `What services does ${fullName} provide?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${fullName} provides services including ${serviceSummary}. Common engagement areas include ${keywordSummary}.`,
        },
      },
      {
        "@type": "Question",
        name: `What projects has ${fullName} built?`,
        acceptedAnswer: {
          "@type": "Answer",
          text:
            projectCount > 0
              ? `${fullName}'s portfolio features ${projectCount} highlighted software projects across product and engineering domains. Detailed case studies are available at ${siteUrl}/case-studies.`
              : `${fullName}'s portfolio includes practical software projects with implementation and outcomes.`,
        },
      },
      {
        "@type": "Question",
        name: `Does ${fullName} have a technical blog?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes. ${fullName} writes in-depth technical articles on AI, full-stack development, RAG systems, and software engineering at ${siteUrl}/blog. The blog features series-style learning paths, an AI-powered Q&A assistant, and RSS feed at ${siteUrl}/blog/feed.xml.`,
        },
      },
      {
        "@type": "Question",
        name: `Does ${fullName} offer generative AI and LLM consulting?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes. ${fullName} supports consulting and implementation across ${keywordSummary}, with practical delivery focused on measurable outcomes.`,
        },
      },
      {
        "@type": "Question",
        name: `How can I contact ${fullName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Use the contact section on ${siteUrl} or connect via the linked professional profiles for hiring and collaboration.`,
        },
      },
      {
        "@type": "Question",
        name: `Is ${fullName} available for freelance or consulting work?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${fullName}'s current availability is listed on the portfolio at ${siteUrl}. Services include ${serviceSummary}, including ${keywordSummary}. Use the contact form or professional profile links to get in touch.`,
        },
      },
      {
        "@type": "Question",
        name: `What technologies does ${fullName} specialize in?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${fullName} specializes in AI/ML engineering (LLMs, RAG systems, agentic pipelines), full-stack development with Next.js, React, TypeScript, Node.js, Python, FastAPI, and PostgreSQL, as well as cloud infrastructure and system design.`,
        },
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Unified @graph — bundles all schemas into one linked-data document
// This lets search engines and AI models understand the full knowledge graph
// in a single <script> rather than multiple disconnected ones.
// ---------------------------------------------------------------------------
export function buildFullGraph(nodes: (object | null)[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter((node): node is object => Boolean(node)),
  };
}
