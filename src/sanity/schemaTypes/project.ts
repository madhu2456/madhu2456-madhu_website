import { defineField, defineType } from "sanity";

export default defineType({
  name: "project",
  title: "Projects",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Project Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: "Short one-liner about the project",
      validation: (Rule) => Rule.max(150),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
          description: "Describe the image for accessibility",
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "technologies",
      title: "Technologies Used",
      type: "array",
      of: [{ type: "reference", to: [{ type: "skill" }] }],
      description: "Select from your skills list (max 6 recommended)",
      validation: (Rule) => Rule.max(8),
    }),
    defineField({
      name: "category",
      title: "Project Category",
      type: "string",
      options: {
        list: [
          { title: "Web Application", value: "web-app" },
          { title: "Mobile App", value: "mobile-app" },
          { title: "AI/ML Project", value: "ai-ml" },
          { title: "API/Backend", value: "api-backend" },
          { title: "DevOps/Infrastructure", value: "devops" },
          { title: "Open Source", value: "open-source" },
          { title: "CLI Tool", value: "cli-tool" },
          { title: "Desktop App", value: "desktop-app" },
          { title: "Browser Extension", value: "browser-extension" },
          { title: "Game", value: "game" },
          { title: "Other", value: "other" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "liveUrl",
      title: "Live URL",
      type: "url",
      description: "Link to the live project",
    }),
    defineField({
      name: "githubUrl",
      title: "GitHub URL",
      type: "url",
      description: "Link to the GitHub repository",
    }),
    defineField({
      name: "featured",
      title: "Featured Project",
      type: "boolean",
      description: "Show this project prominently on the homepage",
      initialValue: false,
    }),
    defineField({
      name: "problemStatement",
      title: "Case Study: Problem",
      type: "text",
      rows: 3,
      description: "What business or user problem did this project solve?",
      validation: (Rule) => Rule.max(400),
    }),
    defineField({
      name: "solutionApproach",
      title: "Case Study: Solution",
      type: "text",
      rows: 4,
      description: "How the architecture, stack, and workflow solved the problem.",
      validation: (Rule) => Rule.max(800),
    }),
    defineField({
      name: "impactSummary",
      title: "Case Study: Impact",
      type: "text",
      rows: 3,
      description: "Outcome in measurable terms where possible.",
      validation: (Rule) => Rule.max(400),
    }),
    defineField({
      name: "impactMetrics",
      title: "Impact Metrics",
      type: "array",
      description: "Optional measurable outcomes for this case study.",
      of: [
        defineField({
          name: "metric",
          title: "Metric",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (Rule) => Rule.required().max(60),
            }),
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              validation: (Rule) => Rule.required().max(60),
            }),
          ],
        }),
      ],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: "citations",
      title: "Citations / Evidence Links",
      type: "array",
      description:
        "Links that support claims in this case study (repo, live app, docs, write-up).",
      of: [
        defineField({
          name: "citation",
          title: "Citation",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (Rule) => Rule.required().max(80),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
      validation: (Rule) => Rule.max(8),
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first (0-99)",
      initialValue: 0,
      validation: (Rule) => Rule.min(0).max(99),
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "coverImage",
      category: "category",
      featured: "featured",
    },
    prepare(selection) {
      const { title, media, category, featured } = selection;
      return {
        title: featured ? `⭐ ${title}` : title,
        subtitle: category || "Uncategorized",
        media: media,
      };
    },
  },
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Featured First",
      name: "featuredFirst",
      by: [
        { field: "featured", direction: "desc" },
        { field: "order", direction: "asc" },
      ],
    },
  ],
});
