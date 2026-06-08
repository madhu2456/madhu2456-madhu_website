import { z } from "zod";

export const isoDateTimeSchema = z.string().datetime({ offset: true });
export const optionalIsoDateTimeSchema = z
  .string()
  .datetime({ offset: true })
  .optional()
  .or(z.literal(""));
export const isoDateSchema = z.string().date();

export const localOrAbsoluteUrlSchema = z.string().refine(
  (val) => {
    if (!val) return true;
    try {
      new URL(val);
      return true;
    } catch {
      return val.startsWith("/");
    }
  },
  { message: "Must be a valid local path (starting with /) or absolute URL" },
);

export const socialLinksSchema = z.object({
  github: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  medium: z.string().url().optional().or(z.literal("")),
  devto: z.string().url().optional().or(z.literal("")),
  youtube: z.string().url().optional().or(z.literal("")),
  stackoverflow: z.string().url().optional().or(z.literal("")),
  wikidata: z.string().url().optional().or(z.literal("")),
  googleBusiness: z.string().url().optional().or(z.literal("")),
});

export const profileStatSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
});

export const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  headline: z.string().min(1, "Headline is required"),
  headlineStaticText: z.string().min(1, "Static text is required"),
  headlineAnimatedWords: z.array(z.string()),
  headlineAnimationDuration: z.number().min(0),
  shortBio: z.string().min(1, "Short bio is required"),
  fullBioParagraphs: z.array(z.string()),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  availability: z.enum(["available", "open", "unavailable"]),
  socialLinks: socialLinksSchema,
  yearsOfExperience: z.number().min(0),
  stats: z.array(profileStatSchema),
  profileImage: z.string().optional(),
  updatedAt: isoDateTimeSchema,
});

export const siteSettingsSchema = z.object({
  siteTitle: z.string().min(1, "Site title is required"),
  siteDescription: z.string().min(1, "Site description is required"),
  siteKeywords: z.array(z.string()),
  twitterHandle: z.string().optional(),
  updatedAt: isoDateTimeSchema,
});

export const technologySchema = z.object({
  name: z.string().min(1, "Tech name is required"),
  category: z.string().optional(),
  color: z.string().optional(),
});
export type Technology = z.infer<typeof technologySchema>;

export const experienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  employmentType: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().optional(),
  responsibilities: z.array(z.string()).optional(),
  achievements: z.array(z.string()).optional(),
  technologies: z.array(technologySchema).optional(),
  companyLogo: z.string().optional(),
  companyWebsite: z.string().url().optional().or(z.literal("")),
  order: z.number().int(),
  updatedAt: isoDateTimeSchema,
});

export const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  gpa: z.string().optional(),
  description: z.string().optional(),
  achievements: z.array(z.string()).optional(),
  logo: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  order: z.number().int(),
  updatedAt: isoDateTimeSchema,
});

export const impactMetricSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});
export type ImpactMetric = z.infer<typeof impactMetricSchema>;

export const citationSchema = z.object({
  label: z.string().min(1),
  url: z.string().url().or(z.literal("")),
});
export type Citation = z.infer<typeof citationSchema>;

export const faqItemSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});
export type FaqItemSchema = z.infer<typeof faqItemSchema>;

export const guideTypeSchema = z.enum([
  "framework",
  "guide",
  "benchmark-methodology",
  "benchmark-results",
]);

export const guideCitationSchema = z.object({
  label: z.string().min(1),
  publisher: z.string().optional(),
  url: z.string().url(),
  accessedAt: isoDateSchema.optional().or(z.literal("")),
});

export const guideArtifactSchema = z.object({
  label: z.string().min(1),
  url: localOrAbsoluteUrlSchema.min(1),
  type: z.enum(["repository", "dataset", "download", "demo", "worksheet"]),
});

export const benchmarkDetailsSchema = z
  .object({
    methodologySummary: z.string(),
    datasetDescription: z.string().optional(),
    embeddingModel: z.string().optional(),
    testedSystems: z.array(z.string()).optional(),
    hardwareDescription: z.string().optional(),
    repetitions: z.number().int().positive().optional(),
    repositoryUrl: z.string().url().optional().or(z.literal("")),
    rawResultsUrl: z.string().url().optional().or(z.literal("")),
  })
  .optional();

export const guideSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  guideType: guideTypeSchema,
  status: z.enum(["draft", "published"]),
  featured: z.boolean().optional(),
  summary: z.string().min(1),
  seoTitle: z.string().min(1),
  seoDescription: z.string().min(1),
  bodyMarkdown: z.string().min(1),
  coverImage: localOrAbsoluteUrlSchema.optional().or(z.literal("")),
  coverImageAlt: z.string().optional(),
  primaryTopic: z.string().min(1),
  supportingTopics: z.array(z.string()).optional(),
  citations: z.array(guideCitationSchema),
  artifacts: z.array(guideArtifactSchema).optional(),
  relatedServiceSlugs: z.array(z.string()).optional(),
  relatedProjectSlugs: z.array(z.string()).optional(),
  benchmarkDetails: benchmarkDetailsSchema,
  publishedAt: optionalIsoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
});
export type GuideItem = z.infer<typeof guideSchema>;

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  tagline: z.string().optional(),
  category: z.string().optional(),
  relatedServiceSlug: z.string().optional(),
  impactSummary: z.string().optional(),
  liveUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().optional(),
  coverImage: localOrAbsoluteUrlSchema.optional().or(z.literal("")),
  coverImageAlt: z.string().optional(),
  client: z.string().optional(),
  role: z.string().optional(),
  period: z.string().optional(),
  technologies: z.array(technologySchema).optional(),
  problemStatement: z.string().optional(),
  solutionApproach: z.string().optional(),
  architecture: z.string().optional(),
  lessonsLearned: z.string().optional(),
  impactMetrics: z.array(impactMetricSchema).optional(),
  citations: z.array(citationSchema).optional(),

  // CMS-owned case study page fields
  citableFacts: z
    .array(
      z.object({
        label: z.string(),
        val: z.string(),
      }),
    )
    .optional(),
  technicalDecisions: z
    .array(
      z.object({
        title: z.string(),
        desc: z.string(),
      }),
    )
    .optional(),
  measuredOutcomes: z
    .array(
      z.object({
        metric: z.string(),
        label: z.string(),
        desc: z.string(),
      }),
    )
    .optional(),
  faqs: z.array(faqItemSchema).optional(),
  gallery: z
    .array(
      z.object({
        url: z.string(),
        alt: z.string().optional(),
        caption: z.string().optional(),
      }),
    )
    .optional(),

  order: z.number().int(),
  updatedAt: isoDateTimeSchema,
});

export const certificationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  issuer: z.string().optional(),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url().optional().or(z.literal("")),
  logo: z.string().optional(),
  description: z.string().optional(),
  skills: z.array(technologySchema).optional(),
  order: z.number().int(),
  updatedAt: isoDateTimeSchema,
});

export const navigationItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  href: z.string().min(1, "Href is required"),
  icon: z.string().min(1, "Icon name is required"),
  isExternal: z.boolean().optional(),
  order: z.number().int(),
});

// --- NEW SCHEMAS FOR PAGE CONTENT ---
export const seoSchema = z.object({
  title: z.string().min(1, "SEO title is required"),
  description: z.string().min(1, "SEO description is required"),
  canonicalPath: z.string().optional(),
  robots: z
    .object({
      index: z.boolean(),
      follow: z.boolean(),
    })
    .optional(),
});
export type SeoSchema = z.infer<typeof seoSchema>;

export const ctaSchema = z.object({
  label: z.string().min(1, "Label is required"),
  href: z.string().min(1, "Href is required"),
  variant: z.enum(["primary", "secondary", "link"]).optional(),
});

export const linkSchema = z.object({
  label: z.string().min(1, "Label is required"),
  url: z.string().url().or(z.literal("")),
});

export const richTextPageSchema = z.object({
  seo: seoSchema,
  eyebrow: z.string().optional(),
  heroTitle: z.string().min(1, "Hero title is required"),
  heroSubtitle: z.string().optional(),
  introParagraphs: z.array(z.string()).optional(),
  directAnswerParagraphs: z.array(z.string()).optional(),
  primaryCta: ctaSchema.optional(),
  secondaryCta: ctaSchema.optional(),
});

export const pageContentSchema = z.object({
  home: richTextPageSchema.extend({
    heroAvailabilityText: z.string().optional(),
    workedAtLabel: z.string().optional(),
    directAnswer: z
      .object({
        title: z.string(),
        paragraphs: z.array(z.string()),
      })
      .optional(),
    faqItems: z.array(faqItemSchema).optional(),
  }),
  profile: richTextPageSchema.extend({
    coreStackGroups: z
      .array(
        z.object({
          title: z.string(),
          items: z.array(z.string()),
        }),
      )
      .optional(),
  }),
  servicesIndex: richTextPageSchema.extend({
    outcomeCallout: z
      .object({
        title: z.string(),
        description: z.string(),
        cta: ctaSchema,
      })
      .optional(),
  }),
  caseStudiesIndex: richTextPageSchema,
  guidesIndex: richTextPageSchema.extend({}),
  credentials: richTextPageSchema.extend({
    resumeCallout: z
      .object({
        title: z.string(),
        description: z.string(),
        href: z.string(),
      })
      .optional(),
    proofLinks: z.array(
      z.object({
        type: z.enum(["Credential", "Award", "Project", "Profile"]),
        proof: z.string(),
        linkText: z.string(),
        linkUrl: z.string(), // can be an absolute URL or a relative path or an anchor
      }),
    ),
    awards: z.array(
      z.object({
        title: z.string(),
        organization: z.string(),
        description: z.string(),
      }),
    ),
    externalProfiles: z.array(
      z.object({
        name: z.string(),
        url: z.string().url().or(z.literal("")),
        description: z.string(),
      }),
    ),
  }),
  contact: richTextPageSchema.extend({
    bestFitAreas: z.array(z.string()),
    responseTimeText: z.string().optional(),
  }),
});
export type PageContentSchema = z.infer<typeof pageContentSchema>;

// --- UPDATED SERVICE SCHEMA ---
export const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  icon: z.string().optional(),
  shortDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  features: z.array(z.string()).optional(),
  technologies: z.array(technologySchema).optional(),
  deliverables: z.array(z.string()).optional(),
  pricing: z
    .object({
      startingPrice: z.number().optional(),
      priceType: z.enum(["hourly", "project", "monthly", "custom"]).optional(),
      description: z.string().optional(),
    })
    .optional(),
  timeline: z.string().optional(),
  featured: z.boolean().optional(),
  order: z.number().int(),
  updatedAt: isoDateTimeSchema,

  // CMS-owned service page fields
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  heroTitle: z.string().optional(),
  heroEyebrow: z.string().optional(),
  directAnswerParagraphs: z.array(z.string()).optional(),
  targetQueries: z.array(z.string()).optional(),
  audience: z.array(z.string()).optional(),
  problemsSolved: z.array(z.string()).optional(),
  capabilityCards: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
      }),
    )
    .optional(),
  techStackGroups: z
    .array(
      z.object({
        category: z.string(),
        items: z.array(z.string()),
      }),
    )
    .optional(),
  faqs: z.array(faqItemSchema).optional(),
  proofProjectSlugs: z.array(z.string()).optional(),
  contactIntent: z.string().optional(),
  offerCatalog: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
      }),
    )
    .optional(),
});
export type ServiceItem = z.infer<typeof serviceSchema>;

// --- UPDATED PORTFOLIO CONTENT SCHEMA ---
export const portfolioContentSchema = z
  .object({
    contentVersion: z.literal(3),
    pageContent: pageContentSchema,
    profile: profileSchema,
    siteSettings: siteSettingsSchema,
    navigationItems: z.array(navigationItemSchema),
    skills: z.array(
      z.object({
        name: z.string().min(1, "Skill name is required"),
        category: z.string().optional(),
        proficiency: z.string().optional(),
        yearsOfExperience: z.number().optional(),
        updatedAt: isoDateTimeSchema,
      }),
    ),
    experiences: z.array(experienceSchema),
    education: z.array(educationSchema),
    projects: z.array(projectSchema),
    services: z.array(serviceSchema),
    certifications: z.array(certificationSchema),
    guides: z.array(guideSchema),
  })
  .superRefine((data, ctx) => {
    // Validate unique slugs for projects
    const projectSlugs = data.projects.map((p) => p.slug);
    const duplicateProjectSlugs = projectSlugs.filter(
      (s, i) => projectSlugs.indexOf(s) !== i,
    );
    if (duplicateProjectSlugs.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate project slugs found: ${duplicateProjectSlugs.join(", ")}`,
        path: ["projects"],
      });
    }

    // Validate unique slugs for services
    const serviceSlugs = data.services.map((s) => s.slug);
    const duplicateServiceSlugs = serviceSlugs.filter(
      (s, i) => serviceSlugs.indexOf(s) !== i,
    );
    if (duplicateServiceSlugs.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate service slugs found: ${duplicateServiceSlugs.join(", ")}`,
        path: ["services"],
      });
    }

    // Validate unique slugs for guides
    const guideSlugs = data.guides.map((g) => g.slug);
    const duplicateGuideSlugs = guideSlugs.filter(
      (s, i) => guideSlugs.indexOf(s) !== i,
    );
    if (duplicateGuideSlugs.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate guide slugs found: ${duplicateGuideSlugs.join(", ")}`,
        path: ["guides"],
      });
    }

    // Validate guide states
    data.guides.forEach((guide, idx) => {
      if (guide.coverImage && !guide.coverImageAlt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Guide cover image requires alt text.",
          path: ["guides", idx, "coverImageAlt"],
        });
      }
      if (guide.status === "published") {
        if (!guide.publishedAt) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Published guide must have a publishedAt date.",
            path: ["guides", idx, "publishedAt"],
          });
        }
        if (!guide.citations || guide.citations.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Published guide requires at least one citation.",
            path: ["guides", idx, "citations"],
          });
        }
        if (!guide.bodyMarkdown || guide.bodyMarkdown.trim().length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Published guide requires a markdown body.",
            path: ["guides", idx, "bodyMarkdown"],
          });
        }
        if (!guide.summary || guide.summary.trim().length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Published guide requires a summary.",
            path: ["guides", idx, "summary"],
          });
        }
        if (!guide.seoTitle || guide.seoTitle.trim().length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Published guide requires an SEO title.",
            path: ["guides", idx, "seoTitle"],
          });
        }
        if (!guide.primaryTopic || guide.primaryTopic.trim().length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Published guide requires a primary topic.",
            path: ["guides", idx, "primaryTopic"],
          });
        }
      }
      if (guide.guideType === "benchmark-results") {
        if (!guide.benchmarkDetails) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Benchmark results require benchmarkDetails.",
            path: ["guides", idx, "benchmarkDetails"],
          });
        } else {
          if (
            !guide.benchmarkDetails.methodologySummary ||
            guide.benchmarkDetails.methodologySummary.trim().length === 0
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Benchmark results require a methodology summary.",
              path: ["guides", idx, "benchmarkDetails", "methodologySummary"],
            });
          }
          const hasRepo = !!guide.benchmarkDetails.repositoryUrl;
          const hasRaw = !!guide.benchmarkDetails.rawResultsUrl;
          if (!hasRepo && !hasRaw) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message:
                "Benchmark results require repositoryUrl or rawResultsUrl.",
              path: ["guides", idx, "benchmarkDetails"],
            });
          }
        }
      }
      if (guide.relatedServiceSlugs) {
        const invalidServices = guide.relatedServiceSlugs.filter(
          (slug) => !serviceSlugs.includes(slug),
        );
        if (invalidServices.length > 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Guide '${guide.slug}' references missing services: ${invalidServices.join(", ")}`,
            path: ["guides", idx, "relatedServiceSlugs"],
          });
        }
      }
      if (guide.relatedProjectSlugs) {
        const invalidProjects = guide.relatedProjectSlugs.filter(
          (slug) => !projectSlugs.includes(slug),
        );
        if (invalidProjects.length > 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Guide '${guide.slug}' references missing projects: ${invalidProjects.join(", ")}`,
            path: ["guides", idx, "relatedProjectSlugs"],
          });
        }
      }
    });
  });

export type PortfolioContentSchema = z.infer<typeof portfolioContentSchema>;
