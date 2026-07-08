import { describe, expect, test } from "vitest";
import {
  buildPersonSchema,
  buildProfilePageSchema,
  buildProjectsListSchema,
  buildServicesListSchema,
  buildWebSiteSchema,
  buildWorkExperienceSchema,
} from "../jsonld";
import { serializeJsonLd } from "../seo/json-ld";

describe("buildProjectsListSchema", () => {
  const siteUrl = "https://madhudadi.com/";

  test("returns null if projects array is empty", () => {
    const schema = buildProjectsListSchema({ siteUrl, projects: [] });
    expect(schema).toBeNull();
  });

  test("maps projects to ItemList of SoftwareApplication", () => {
    const projects = [
      {
        title: "Project One",
        tagline: "A cool project",
        slug: "project-one",
        category: "Artificial Intelligence",
        githubUrl: "https://github.com/madhu/project-one",
      },
    ];

    const schema = buildProjectsListSchema({ siteUrl, projects });

    expect(schema).toMatchObject({
      "@type": "ItemList",
      "@id": "https://madhudadi.com/#projects",
      name: "Portfolio Projects",
      description: "Software projects built by Madhu Dadi",
      numberOfItems: 1,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "SoftwareApplication",
            name: "Project One",
            description: "A cool project",
            url: "https://madhudadi.com/case-studies/project-one/",
            operatingSystem: "All",
            applicationCategory: "Artificial Intelligence",
            author: { "@id": "https://madhudadi.com/#person" },
          },
        },
      ],
    });
  });

  test("maps project citations to citation property", () => {
    const projects = [
      {
        title: "Project with Citations",
        slug: "project-with-citations",
        citations: [
          { label: "Case Study", url: "https://example.com/case-study" },
          { label: null, url: "https://example.com/evidence" },
        ],
      },
    ];

    const schema = buildProjectsListSchema({ siteUrl, projects });

    expect(schema?.itemListElement[0].item).toMatchObject({
      citation: [
        {
          "@type": "CreativeWork",
          name: "Case Study",
          url: "https://example.com/case-study",
        },
        {
          "@type": "CreativeWork",
          name: "Evidence",
          url: "https://example.com/evidence",
        },
      ],
    });
  });
});

describe("buildPersonSchema", () => {
  const siteUrl = "https://madhudadi.com/";
  const fullName = "Madhu Dadi";

  test("includes subjectOf property with blog links", () => {
    const schema = buildPersonSchema({ fullName, siteUrl });

    expect(schema.url).toBe("https://madhudadi.com/profile/");
    expect(schema.mainEntityOfPage).toEqual({
      "@id": "https://madhudadi.com/profile/#webpage",
    });
    expect(schema.subjectOf).toEqual([
      {
        "@type": "CreativeWork",
        name: "Madhu Dadi's Technical Blog RSS Feed",
        url: "https://madhudadi.com/blog/feed.xml",
        encodingFormat: "application/rss+xml",
      },
      {
        "@type": "CreativeWork",
        name: "Technical Articles Index",
        url: "https://madhudadi.com/blog/posts",
      },
      {
        "@type": "AboutPage",
        name: "About the AI, Python & Analytics Learning Platform",
        url: "https://madhudadi.com/blog/about",
      },
      {
        "@type": "CreativeWork",
        name: "Technical Blog AI Assistant",
        url: "https://madhudadi.com/blog/ask",
      },
    ]);
  });

  test("keeps transactional intent keywords out of knowsAbout", () => {
    const schema = buildPersonSchema({
      fullName,
      siteUrl,
      seoKeywords: [
        "RAG system development",
        "agentic ai consulting",
        "hire ai developer india",
        "remote ai engineer for hire",
        "rag system development in visakhapatnam, india",
        "enterprise genai solutions in visakhapatnam, india",
        "Madhu Dadi blog",
      ],
    });

    expect(schema.knowsAbout).toContain("RAG system development");
    expect(schema.knowsAbout).toContain("agentic ai consulting");
    expect(schema.knowsAbout).not.toContain("hire ai developer india");
    expect(schema.knowsAbout).not.toContain("remote ai engineer for hire");
    expect(schema.knowsAbout).not.toContain(
      "rag system development in visakhapatnam, india",
    );
    expect(schema.knowsAbout).not.toContain(
      "enterprise genai solutions in visakhapatnam, india",
    );
    expect(schema.knowsAbout).not.toContain("Madhu Dadi blog");
  });

  test("emits deliveryLeadTime as numeric minValue/maxValue with unitText", () => {
    const schema = buildPersonSchema({
      fullName,
      siteUrl,
      services: [
        { title: "RAG Consulting", slug: "rag", timeline: "3-8 weeks" },
      ],
    });

    expect(schema.makesOffer?.[0]?.deliveryLeadTime).toEqual({
      "@type": "QuantitativeValue",
      minValue: 3,
      maxValue: 8,
      unitText: "weeks",
    });
  });

  test("includes googleBusiness in sameAs alongside real profiles", () => {
    const schema = buildPersonSchema({
      fullName,
      siteUrl,
      socialLinks: {
        github: "https://github.com/madhu2456",
        linkedin: "https://www.linkedin.com/in/madhu-dadi-54684531",
        medium: "https://medium.com/@madhu.kumar245",
        googleBusiness: "https://madhudadi.in/google",
      },
    });

    expect(schema.sameAs).toContain("https://github.com/madhu2456");
    expect(schema.sameAs).toContain("https://medium.com/@madhu.kumar245");
    expect(schema.sameAs).toContain("https://madhudadi.in/google");
  });
});

describe("buildProfilePageSchema", () => {
  test("uses /profile/ as the canonical ProfilePage URL", () => {
    const schema = buildProfilePageSchema({
      fullName: "Madhu Dadi",
      url: "https://madhudadi.com/",
    });

    expect(schema.url).toBe("https://madhudadi.com/profile/");
    expect(schema["@id"]).toBe("https://madhudadi.com/profile/#webpage");
    expect(schema.breadcrumb).toEqual({
      "@id": "https://madhudadi.com/profile/#breadcrumb",
    });
  });
});

describe("buildWebSiteSchema", () => {
  const url = "https://madhudadi.com/";
  const name = "Madhu Dadi";

  test("includes the technical blog as part of the website", () => {
    const schema = buildWebSiteSchema({ name, url });

    expect(schema).toMatchObject({
      inLanguage: "en-IN",
      potentialAction: [
        {
          target: {
            urlTemplate: "https://madhudadi.com/search/?q={search_term_string}",
          },
        },
      ],
      hasPart: {
        "@type": "Blog",
        "@id": "https://madhudadi.com/blog#blog",
        url: "https://madhudadi.com/blog",
        inLanguage: "en-IN",
        author: { "@id": "https://madhudadi.com/#person" },
        potentialAction: {
          target: {
            urlTemplate:
              "https://madhudadi.com/blog/search?q={search_term_string}",
          },
        },
      },
    });
  });
});

describe("buildServicesListSchema", () => {
  test("links service items to their canonical detail pages", () => {
    const schema = buildServicesListSchema({
      siteUrl: "https://madhudadi.com/",
      services: [
        {
          title: "RAG System Development",
          slug: "rag-consultant-india",
          shortDescription: "High-precision retrieval systems.",
        },
      ],
    });

    expect(schema?.itemListElement[0].item).toMatchObject({
      "@type": "Service",
      "@id": "https://madhudadi.com/services/rag-consultant-india/#service",
      url: "https://madhudadi.com/services/rag-consultant-india/",
    });
  });
});

describe("buildWorkExperienceSchema", () => {
  test("maps experiences to ItemList of OrganizationRole nodes", () => {
    const schema = buildWorkExperienceSchema({
      siteUrl: "https://madhudadi.com/",
      experiences: [
        {
          company: "Novartis",
          position: "Marketing Analytics Engineer",
          startDate: "2021-03",
          endDate: "2024-06",
          location: "Hyderabad",
        },
      ],
    });

    expect(schema).toMatchObject({
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "OrganizationRole",
            roleName: "Marketing Analytics Engineer",
            startDate: "2021-03",
            endDate: "2024-06",
            memberOf: {
              "@type": "Organization",
              name: "Novartis",
              location: {
                "@type": "PostalAddress",
                addressLocality: "Hyderabad",
              },
            },
          },
        },
      ],
    });
  });
});

describe("serializeJsonLd", () => {
  test("escapes script-breaking characters while preserving valid JSON", () => {
    const serialized = serializeJsonLd({
      text: "</script><script>alert(1)</script> & data",
    });

    expect(serialized).not.toContain("</script>");
    expect(serialized).toContain("\\u003c/script\\u003e");
    expect(JSON.parse(serialized)).toEqual({
      text: "</script><script>alert(1)</script> & data",
    });
  });
});
