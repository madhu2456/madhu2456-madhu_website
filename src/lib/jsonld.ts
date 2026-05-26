import { normalizeKeywordList } from "@/lib/discovery-keywords";

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
  priceRange,
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
  priceRange?: string | null;
}) {
  const sameAs = Object.values(socialLinks ?? {}).filter(
    (v): v is string => typeof v === "string" && v.length > 0,
  );
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
            return {
              "@type": "Offer",
              "@id": `${siteUrl}#offer-${i + 1}`,
              name: s.title,
              description: s.shortDescription ?? undefined,
              url: `${siteUrl}#services`,
              availability: "https://schema.org/InStock",
              ...(hasPrice && {
                price: s.pricing?.startingPrice,
                priceCurrency: "USD",
              }),
              ...(s.timeline && {
                deliveryLeadTime: {
                  "@type": "QuantitativeValue",
                  value: s.timeline,
                },
              }),
            };
          })
      : [];

  const worksForNode = currentRole
    ? {
        "@type": "OrganizationRole",
        roleName: currentRole.position,
        ...(currentRole.startDate && { startDate: currentRole.startDate }),
        memberOf: {
          "@type": "Organization",
          name: currentRole.company,
          ...(currentRole.location && {
            location: {
              "@type": "PostalAddress",
              addressLocality: currentRole.location,
            },
          }),
        },
      }
    : undefined;

  return {
    "@type": "Person",
    "@id": `${siteUrl}#person`,
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
          url: `${siteUrl}#contact`,
          availableLanguage: ["English"],
          areaServed: {
            "@type": "Country",
            name: "India",
          },
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
        "@id": `${siteUrl}#personImage`,
        url: profileImageUrl,
        contentUrl: profileImageUrl,
      },
    }),
    ...(sameAs.length > 0 && { sameAs }),
    publishingPrinciples: `${siteUrl}blog/`,
    inLanguage: "en-US",
    mainEntityOfPage: { "@id": `${siteUrl}#profilepage` },
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
        url: `${siteUrl}blog/posts/`,
      },
      {
        "@type": "CreativeWork",
        name: "Technical Blog AI Assistant",
        url: `${siteUrl}blog/ask/`,
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
        alumniOf: alumniOf.map((edu) => ({
          "@type": "CollegeOrUniversity",
          name: edu.name,
          ...(edu.url && { url: edu.url }),
        })),
      }),
    ...(worksForNode && { worksFor: worksForNode }),
    ...(credentialNodes.length > 0 && { hasCredential: credentialNodes }),
    ...(offerNodes.length > 0 && { makesOffer: offerNodes }),
    ...(priceRange && { priceRange }),
    areaServed: [
      { "@type": "Country", name: "India" },
      { "@type": "Place", name: "Global (Remote)" },
    ],
    availableLanguage: ["English"],
    seeks: {
      "@type": "Demand",
      name: "Freelance, consulting, and full-time opportunities in AI, analytics, and full-stack engineering",
    },
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
    "@id": `${siteUrl}#occupation`,
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
// Organization
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
  const blogUrl = `${url}blog/`;
  return {
    "@type": "WebSite",
    "@id": `${url}#website`,
    name,
    url,
    ...(description && { description }),
    inLanguage: "en-US",
    publisher: { "@id": `${url}#organization` },
    significantLink: [`${blogUrl}ask/`, `${blogUrl}posts/`],
    relatedLink: [blogUrl],
    // SiteLinksSearchBox — enables rich search in Google SERPs
    potentialAction: [
      {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${url}search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    ],
    // Blog is a sub-site on the same domain — linking them helps search engines
    // and AI crawlers understand the relationship between portfolio and blog
    hasPart: {
      "@type": "Blog",
      "@id": `${blogUrl}#blog`,
      name: `${name} — Technical Blog`,
      url: blogUrl,
      description:
        "A learning-focused technical blog covering AI engineering, full-stack development, RAG systems, and analytics best practices.",
      inLanguage: "en-US",
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
          urlTemplate: `${blogUrl}search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
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
    "@id": `${url}#profilepage`,
    name: `${fullName} — Portfolio`,
    url,
    ...(description && { description }),
    inLanguage: "en-US",
    isPartOf: { "@id": `${url}#website` },
    about: { "@id": `${url}#person` },
    mainEntity: { "@id": `${url}#person` },
    breadcrumb: { "@id": `${url}#breadcrumb` },
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
          "@id": `${siteUrl}#service-${i + 1}`,
          name: service.title,
          serviceType: service.title,
          url: `${siteUrl}#services`,
          provider: { "@id": `${siteUrl}#person` },
          ...(service.shortDescription && {
            description: service.shortDescription,
          }),
          ...(hasPrice && {
            offers: {
              "@type": "Offer",
              price: startingPrice,
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              url: `${siteUrl}#services`,
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
        ...((p.slug && { url: `${siteUrl}case-studies/${p.slug}/` }) ||
          (p.liveUrl && { url: p.liveUrl })),
        ...(p.githubUrl && { codeRepository: p.githubUrl }),
        ...(p.category && { applicationCategory: p.category }),
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
    "@id": `${siteUrl}#faq`,
    mainEntity: [
      {
        "@type": "Question",
        name: `Who is ${fullName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: profileSummary
            ? `${fullName} is a technology professional focused on ${profileSummary}.`
            : `${fullName} is a technology professional focused on AI and analytics.`,
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
              ? `${fullName}'s portfolio features ${projectCount} highlighted software projects across product and engineering domains. Detailed case studies are available at ${siteUrl}case-studies/`
              : `${fullName}'s portfolio includes practical software projects with implementation and outcomes.`,
        },
      },
      {
        "@type": "Question",
        name: `Does ${fullName} have a technical blog?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes. ${fullName} maintains an authoritative technical blog at ${siteUrl}blog/, focusing on AI engineering, RAG systems, and LLM application development. The blog provides deep dives into agentic AI, software architecture, and modern web engineering, serving as a core evidence source for his technical expertise. It features an AI-powered Q&A assistant for rapid discovery and an RSS feed at ${siteUrl}blog/feed.xml.`,
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
      {
        "@type": "Question",
        name: `What is the typical engagement process?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The typical process starts with a brief review of your needs, followed by a discovery call, a detailed proposal with timeline and pricing, and then project kickoff with weekly updates. See the step-by-step guide at ${siteUrl}#howto-hire.`,
        },
      },
      {
        "@type": "Question",
        name: `What industries has ${fullName} worked in?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${fullName} has delivered projects across pharmaceuticals (Novartis), travel-tech (redBus), media and advertising (GroupM / WPP), and education technology. This cross-industry experience brings adaptable frameworks and proven playbooks to every engagement.`,
        },
      },
      {
        "@type": "Question",
        name: `Does ${fullName} work remotely?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes. ${fullName} is based in India and works with clients globally. Remote collaboration is supported through async communication, scheduled video calls, and shared project management tools.`,
        },
      },
      {
        "@type": "Question",
        name: `What is the pricing model?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${fullName} offers project-based pricing with clear milestones. Typical engagements start from $2,000 depending on scope. A detailed proposal with fixed pricing is provided after the discovery call.`,
        },
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// HowTo — step-by-step guide for hiring / engaging
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
