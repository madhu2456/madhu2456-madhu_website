import { PageContentSchema } from "./cms-schema";
import { buildV2PageContentDefaults } from "./cms-v2-defaults";

export const buildV3PageContentDefaults = (): PageContentSchema => {
  const v2 = buildV2PageContentDefaults();
  return {
    ...v2,
    guidesIndex: {
      seo: {
        title: "Technical Guides & Benchmarks - Madhu Dadi",
        description:
          "Evergreen frameworks, technical analysis, and benchmarks covering AI agents, vector databases, and analytics infrastructure.",
        canonicalPath: "/guides/",
      },
      heroTitle: "Technical Guides & Architecture Frameworks",
      introParagraphs: [
        "In-depth analysis, reproducible benchmarks, and system design frameworks for production AI and analytics systems.",
      ],
    },
  };
};
