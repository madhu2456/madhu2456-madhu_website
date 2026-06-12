# Design Spec: SEO, AEO, and GEO Optimization (Balanced Strategy)

- **Date:** 2026-05-06
- **Status:** Approved
- **Topic:** Strengthening Portfolio authority through Citation Mapping and Semantic Connectivity.

## 1. Objective
To maximize discoverability and authority across both traditional search engines (Google/Bing) and generative answer engines (Perplexity/ChatGPT/Claude) by explicitly mapping evidence and bridging the portfolio-blog authority gap.

## 2. Architecture & Changes

### 2.1 Citation Mapping (GEO/AEO Focus)
**Goal:** Enable AI engines to cite project evidence with high confidence.

- **`src/lib/jsonld.ts`:**
    - Update `Project` type to include `citations` (already in `portfolio-content.json` but not in schema).
    - Update `buildProjectsListSchema` to map `project.citations` to the `citation` property of `SoftwareApplication` nodes.
    - Each citation will be a `CreativeWork` node with `name` and `url`.
- **`src/app/llms.txt/route.ts`:**
    - Add a new `### Verified Evidence` sub-section to the project loop.
    - List all project citations with their labels and URLs.
- **`src/lib/discovery-keywords.ts`:**
    - Update `buildDiscoveryKeywords` to include labels from project citations to improve keyword relevance for specific proof points.

### 2.2 Semantic Connectivity (SEO Focus)
**Goal:** Strengthen Domain Authority and EEAT by explicitly linking the Portfolio to the Blog's technical authority.

- **`src/lib/jsonld.ts`:**
    - **Person Node (`buildPersonSchema`):** Add `subjectOf` pointing to the Blog RSS (`/blog/feed.xml`) and Articles index (`/blog/posts/`).
    - **WebSite Node (`buildWebSiteSchema`):** 
        - Add `significantLink` array pointing to high-value blog tools: `/blog/ask/` (AI Assistant) and `/blog/posts/` (Knowledge Base).
        - Use `relatedLink` to point to major technical series or category pages.
- **Metadata Consistency:** 
    - Ensure `llms.txt` header metadata explicitly references the Blog as the primary "Knowledge Source".
    - Update `ai-profile.json` to include these high-value links in its machine-readable profile.

## 3. Data Flow
1. `getPortfolioData` retrieves the raw content (including citations).
2. `SeoStructuredData` component calls the updated `jsonld` builders.
3. Builders inject the new citation and connectivity nodes.
4. Search/AI crawlers consume the unified graph.

## 4. Testing & Validation
- **Structured Data:** Use `vitest` to verify that the generated JSON-LD contains the new `citation`, `subjectOf`, and `significantLink` properties.
- **Feed Validation:** Verify `llms.txt` and `ai-profile.json` output via local dev server to ensure the new "Verified Evidence" sections and links are present.
- **No Regressions:** Ensure existing SEO metadata (titles, descriptions, canonicals) remains unchanged.

## 5. Implementation Plan
- [ ] Task 1: Update `jsonld.ts` with Citation and Connectivity nodes.
- [ ] Task 2: Update `llms.txt` route with "Verified Evidence" sections.
- [ ] Task 3: Update `ai-profile.json` and `discovery-keywords.ts`.
- [ ] Task 4: Verify outputs and run existing tests.
