import { describe, expect, test } from "vitest";
import {
  buildPersonSchema,
  buildProfilePageSchema,
  buildProjectsListSchema,
  buildWebSiteSchema,
} from "../jsonld";

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
      hasPart: {
        "@type": "Blog",
        "@id": "https://madhudadi.com/blog#blog",
        url: "https://madhudadi.com/blog",
        author: { "@id": "https://madhudadi.com/#person" },
      },
    });
  });
});
