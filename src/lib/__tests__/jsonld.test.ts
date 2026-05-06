import { expect, test, describe } from "vitest";
import { 
  buildProjectsListSchema, 
  buildPersonSchema, 
  buildWebSiteSchema 
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

    expect(schema).toEqual({
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
            codeRepository: "https://github.com/madhu/project-one",
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
        url: "https://madhudadi.com/blog/posts/",
      },
    ]);
  });
});

describe("buildWebSiteSchema", () => {
  const url = "https://madhudadi.com/";
  const name = "Madhu Dadi";

  test("includes significantLink and relatedLink properties", () => {
    const schema = buildWebSiteSchema({ name, url });

    expect(schema.significantLink).toEqual([
      "https://madhudadi.com/blog/ask/",
      "https://madhudadi.com/blog/posts/",
    ]);
    expect(schema.relatedLink).toEqual(["https://madhudadi.com/blog/"]);
  });
});
