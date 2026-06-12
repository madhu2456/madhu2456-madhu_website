# GSC /blog/ Canonical Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove trailing slashes from blog URLs in the sitemap to match the external blog's canonical tags and resolve GSC "Alternate page with proper canonical tag" warnings.

**Architecture:** Modify the sitemap generation logic to omit the trailing slash for the `blogUrl` base and its sub-paths.

**Tech Stack:** Next.js (Metadata Sitemap API)

---

### Task 1: Update Sitemap URL Construction

**Files:**
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Modify blogUrl base**

```typescript
// src/app/sitemap.ts

// Find this line:
const blogUrl = `${siteUrl}blog/`;

// Change to:
const blogUrl = `${siteUrl}blog`;
```

- [ ] **Step 2: Update sub-route entries**

```typescript
// src/app/sitemap.ts

// Update the following entries in baseEntries:
    {
      url: blogUrl,
      lastModified: latestDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${blogUrl}/series/`, // Change to `${blogUrl}/series`
      lastModified: latestDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${blogUrl}/tags/`, // Change to `${blogUrl}/tags`
      lastModified: latestDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${blogUrl}/posts/`, // Change to `${blogUrl}/posts`
      lastModified: latestDate,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${blogUrl}/ask/`, // Change to `${blogUrl}/ask`
      lastModified: latestDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
```

- [ ] **Step 3: Verify the changes match the canonical tags**

Ensure that no other logic in the file adds back trailing slashes for these specific URLs.

- [ ] **Step 4: Commit the changes**

```bash
git add src/app/sitemap.ts
git commit -m "seo: remove trailing slashes from blog sitemap entries to match canonical tags"
```

---

### Task 2: Verification

**Files:**
- Run: `pnpm build` (or `npm run build`)

- [ ] **Step 1: Check generated sitemap**

Run the build and inspect the output `sitemap.xml` (or run in dev mode and visit `/sitemap.xml`).
Verify that `https://madhudadi.in/blog` is present without a trailing slash.
Verify that sub-pages like `https://madhudadi.in/blog/series` are also without trailing slashes.

- [ ] **Step 2: Final Verification**

Ensure that portfolio-specific routes (like `case-studies/`) still have their trailing slashes as expected by `next.config.ts`.
