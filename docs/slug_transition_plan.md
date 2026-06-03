# Case Study Slug Transition Plan: `udemy-enroller-fastapi` ➔ `browser-task-automation-fastapi`

To completely neutralize references to Udemy from the URL structure and maximize professional safety over the long term, follow this step-by-step transition plan.

---

## 🛠️ Step 1: Rename the Case Study Page Directory

Rename the folder from:
`src/app/(portfolio)/case-studies/udemy-enroller-fastapi/`

to:
`src/app/(portfolio)/case-studies/browser-task-automation-fastapi/`

---

## 🧭 Step 2: Configure a 301 Redirect in `next.config.ts`

Add a permanent redirect to prevent broken links for search engines or past visitors. Update the `redirects()` method inside [next.config.ts](file:///f:/Codes/Projects/madhu_portfolio/next.config.ts#L71-L80):

```typescript
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.madhudadi.in" }],
        destination: "https://madhudadi.in/:path*",
        permanent: true,
      },
      {
        source: "/case-studies/udemy-enroller-fastapi/",
        destination: "/case-studies/browser-task-automation-fastapi/",
        permanent: true,
      },
    ];
  },
```

---

## 👤 Step 3: Update metadata, H1, and schemas in `page.tsx`

In the newly renamed [page.tsx](file:///f:/Codes/Projects/madhu_portfolio/src/app/(portfolio)/case-studies/browser-task-automation-fastapi/page.tsx):

1. **Metadata Title**:
   ```typescript
   export async function generateMetadata(): Promise<Metadata> {
     return {
       title: "Browser Task Automation FastAPI Case Study — Async Workflow Orchestration",
       description: "Explore a private FastAPI/Celery automation case study exploring async task queues, Playwright workflow orchestration, bounded concurrency, secure session-state handling, and telemetry logging.",
       alternates: {
         canonical: "https://madhudadi.in/case-studies/browser-task-automation-fastapi/",
       },
     };
   }
   ```

2. **H1 Heading**:
   ```tsx
   <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
     Browser Task Automation FastAPI —{" "}
     <span className="text-gradient">
       Async Workflow Orchestration Case Study
     </span>
   </h1>
   ```

3. **Schema.org Identifiers**:
   ```typescript
   const softwareSchema = {
     "@context": "https://schema.org",
     "@type": "SoftwareApplication",
     "@id": `${siteUrl}case-studies/browser-task-automation-fastapi/#software`,
     name: "Browser Task Automation System",
     // ...
     sameAs: [`${siteUrl}case-studies/browser-task-automation-fastapi/`],
   };
   ```

---

## 🏷️ Step 4: Update the case-studies dynamic fallbacks exclusions

In [src/app/(portfolio)/case-studies/[slug]/page.tsx](file:///f:/Codes/Projects/madhu_portfolio/src/app/(portfolio)/case-studies/[slug]/page.tsx):
- Update `staticParams` and exclusion parameters to replace `"udemy-enroller-fastapi"` with `"browser-task-automation-fastapi"`.

---

## 📁 Step 5: Update the data objects inside `portfolio-content.json`

In [Data/portfolio-content.json](file:///f:/Codes/Projects/madhu_portfolio/Data/portfolio-content.json):
- Rename the project item `slug` from `"udemy-enroller-fastapi"` to `"browser-task-automation-fastapi"`.
- Update link objects pointing to `/case-studies/udemy-enroller-fastapi/` to point to `/case-studies/browser-task-automation-fastapi/`.

---

## 🕸️ Step 6: Update machine-readable endpoints and sitemaps

1. **Sitemap**:
   - The sitemap generation script will automatically crawl and pick up the new page URL, but verify `sitemap-portfolio.xml` outputs.
2. **`ai-profile.json`**:
   - Verify the case studies list in [route.ts](file:///f:/Codes/Projects/madhu_portfolio/src/app/ai-profile.json/route.ts) maps to the new URL:
     `url: "${siteUrl}case-studies/browser-task-automation-fastapi/",`
3. **`llms.txt`**:
   - Verify links in [route.ts](file:///f:/Codes/Projects/madhu_portfolio/src/app/llms.txt/route.ts) are fully updated.
