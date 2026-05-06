import { expect, test, describe } from "vitest";
import { buildProjectsListSchema } from "../jsonld";

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
