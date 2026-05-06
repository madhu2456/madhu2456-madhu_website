# SEO, AEO, and GEO Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Maximize discoverability and authority across traditional and generative search engines.

**Architecture:** Enhancing JSON-LD with citation mapping and subjectOf/significantLink nodes, and updating llms.txt with verified evidence.

**Tech Stack:** Next.js, TypeScript, Vitest.

---

### Task 1: Update JSON-LD Citation Mapping

**Files:**
- Modify: `src/lib/jsonld.ts`
- Test: `src/lib/__tests__/jsonld.test.ts`

- [ ] **Step 1: Update Project type and buildProjectsListSchema**
Add `citations` to the `Project` type and update the project list schema to include them.

```typescript
// src/lib/jsonld.ts

type Citation = {
  label?: string | null;
  url?: string | null;
};

// ... update Project type
type Project = {
  // ... existing fields
  citations?: Citation[] | null;
};

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
        // New citation field
        ...(p.citations && p.citations.length > 0 && {
          citation: p.citations.map(c => ({
            "@type": "CreativeWork",
            name: c.label || "Evidence",
            url: c.url
          }))
        })
      },
    })),
  };
}
```

- [ ] **Step 2: Add a test case for project citations**
Update existing tests to verify citations are present in the output.

```typescript
// src/lib/__tests__/jsonld.test.ts

it("includes citations in projects list", () => {
  const projects = [{
    title: "Test Project",
    citations: [{ label: "Source", url: "https://github.com" }]
  }];
  const schema = buildProjectsListSchema({ siteUrl: "https://test.com/", projects });
  // @ts-ignore - access schema directly for test
  expect(schema.itemListElement[0].item.citation[0].name).toBe("Source");
});
```

- [ ] **Step 3: Run tests**
Run: `pnpm test src/lib/__tests__/jsonld.test.ts`

- [ ] **Step 4: Commit**
`git add src/lib/jsonld.ts src/lib/__tests__/jsonld.test.ts && git commit -m "seo: add citation mapping to JSON-LD"`

---

### Task 2: Enhance Semantic Connectivity

**Files:**
- Modify: `src/lib/jsonld.ts`

- [ ] **Step 1: Add subjectOf to Person Schema**
Update `buildPersonSchema` to include references to the blog.

```typescript
// src/lib/jsonld.ts

export function buildPersonSchema(/*...*/) {
  // ... existing logic
  return {
    "@type": "Person",
    // ...
    subjectOf: [
      {
        "@type": "CreativeWork",
        name: `${fullName}'s Technical Blog RSS Feed`,
        url: `${siteUrl}blog/feed.xml`,
        encodingFormat: "application/rss+xml"
      },
      {
        "@type": "CreativeWork",
        name: "Technical Articles Index",
        url: `${siteUrl}blog/posts/`
      }
    ],
    // ...
  }
}
```

- [ ] **Step 2: Add significant links to WebSite Schema**
Update `buildWebSiteSchema` to bridge the authority gap.

```typescript
// src/lib/jsonld.ts

export function buildWebSiteSchema({ name, url, description }) {
  const blogUrl = `${url}blog/`;
  return {
    "@type": "WebSite",
    // ...
    significantLink: [
      `${blogUrl}ask/`,
      `${blogUrl}posts/`
    ],
    relatedLink: [
      blogUrl
    ],
    // ...
  };
}
```

- [ ] **Step 3: Commit**
`git add src/lib/jsonld.ts && git commit -m "seo: enhance semantic connectivity between portfolio and blog"`

---

### Task 3: Update LLMs.txt for GEO

**Files:**
- Modify: `src/app/llms.txt/route.ts`

- [ ] **Step 1: Add Verified Evidence section**
Update the project rendering loop in the `llms.txt` route.

```typescript
// src/app/llms.txt/route.ts

// Inside GET()
const projectLines = sortedProjects
    .map((project) => {
      // ... existing links logic
      const evidenceLines = (project.citations ?? [])
        .map(c => `- **${c.label || "Evidence"}:** ${c.url}`)
        .join("\n");

      const uniqueLinks = Array.from(new Set(links.filter(Boolean)));
      const parts = [`- **${project.title}**`];
      if (project.tagline) parts.push(`: ${project.tagline}`);
      if (project.impactSummary) parts.push(` — ${project.impactSummary}`);
      if (uniqueLinks.length > 0) parts.push(` — ${uniqueLinks.join(", ")}`);
      if (project.featured) parts.push(" ⭐");
      
      const mainLine = parts.join("");
      
      return `${mainLine}
  
  ### Verified Evidence
  ${evidenceLines || "- See case study for evidence links"}`;
    })
    .join("\n\n");
```

- [ ] **Step 2: Commit**
`git add src/app/llms.txt/route.ts && git commit -m "geo: add verified evidence section to llms.txt"`

---

### Task 4: Final Validation

- [ ] **Step 1: Verify Discovery Keywords**
Check `src/lib/discovery-keywords.ts` to ensure it captures project citation labels.

- [ ] **Step 2: Verify AI Profile**
Check `src/app/ai-profile.json/route.ts` to ensure it reflects the new connectivity links.

- [ ] **Step 3: Manual check**
Run the site locally and visit `/llms.txt` and check the HTML source for the updated JSON-LD.
