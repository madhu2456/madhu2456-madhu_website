# Live Production Evidence

Date checked: 2026-06-01  
Target: `https://madhudadi.in/`

## Sources checked

- `https://madhudadi.in/`
- `https://www.madhudadi.in/`
- `https://madhudadi.in/robots.txt`
- `https://madhudadi.in/sitemap.xml`
- `https://madhudadi.in/sitemap-portfolio.xml`
- `https://madhudadi.in/llms.txt`
- `https://madhudadi.in/ai-profile.json`
- Representative pages from search/web inspection: `/case-studies/udemy-enroller-fastapi/`, `/case-studies/adticks/`, `/search/`

## Header and status evidence

| URL | Observed result | Notes |
| --- | --- | --- |
| `/` | `200 OK`, `text/html; charset=utf-8` | Homepage is live and indexable from status perspective. |
| `https://www.madhudadi.in/` | `301 Moved Permanently` to `https://madhudadi.in/` | Canonical host redirect works. |
| `/search/` | `200 OK`, `text/html; charset=utf-8` | Needs meta robots verification on production; local code sets noindex. |
| `/sitemap.xml` | `200 OK`, sitemap index | Live sitemap index points to `sitemap-portfolio.xml` and blog sitemap. |
| `/sitemap-portfolio.xml` | `200 OK`, sitemap index | Returns a sitemap index that points back to `sitemap-portfolio.xml`; this is recursive. |
| `/robots.txt` | `200 OK`, text | Consolidated blog + portfolio robots file. |
| `/llms.txt` | `200 OK`, text | Rich machine-readable profile. |

Observed homepage headers included Cloudflare, CSP, HSTS, referrer policy, COOP/COEP, permissions policy, and cache headers. Security headers are generally strong, but production headers differ from the current local `next.config.ts` values in some places, indicating deployment/proxy layering.

## Live sitemap evidence

Live `/sitemap.xml` returned:

```xml
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://madhudadi.in/sitemap-portfolio.xml</loc>
    <lastmod>2026-06-01</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://madhudadi.in/blog/sitemap.xml</loc>
    <lastmod>2026-06-01</lastmod>
  </sitemap>
</sitemapindex>
```

Live `/sitemap-portfolio.xml` returned a similar sitemap index:

```xml
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://madhudadi.in/sitemap-portfolio.xml</loc>
    <lastmod>2026-06-01T07:47:53.769Z</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://madhudadi.in/blog/sitemap.xml</loc>
    <lastmod>2026-06-01T07:47:53.769Z</lastmod>
  </sitemap>
</sitemapindex>
```

Interpretation: production currently has a recursive sitemap reference. Crawlers looking for portfolio URLs may loop through index files instead of seeing direct case-study URL entries.

## Live robots evidence

Production `robots.txt` is a consolidated blog + portfolio file. It includes:

- `Allow: /`
- `Disallow: /studio/`
- `Disallow: /api/`
- Blog admin/auth/payment/profile disallows.
- AI crawler user agents explicitly allowed for `/blog`, `/blog/posts`, `/blog/series`, `/blog/tags`, `/blog/ask`, `/blog/llms.txt`, `/blog/ai-profile.json`, `/llms.txt`, and `/llms-full.txt`.
- Sitemaps:
  - `https://madhudadi.in/sitemap.xml`
  - `https://madhudadi.in/blog/sitemap.xml`
  - `https://madhudadi.in/blog/api/v1/sitemap-index.xml`

Interpretation: production robots is intentionally broader than the local portfolio route. Deploying the local robots route without preserving blog directives would be a regression.

## Live rendered content evidence

Search/web inspection of the live homepage surfaced:

- H1: `Madhu Dadi`
- H2: `AI Developer & Marketing Analytics Leader`
- Bio/service language focused on AI consulting, LLM applications, RAG systems, marketing analytics, Python, FastAPI, Next.js, TypeScript, and cloud architecture.
- FAQ block with questions:
  - What can Madhu build?
  - Which industries has he worked in?
  - Does he have a blog?
  - How can I hire or collaborate?
- Experience and project sections are crawlable in rendered HTML.
- Visible content includes typo: `Batchelor of Technology`.
- FAQ currently says "Highlighted projects: 2", while local data has three featured projects.

## Live GEO endpoint evidence

Live `llms.txt` includes:

- Identity and availability.
- Professional summary.
- SEO/GEO/AEO keywords.
- Social profiles.
- Service offerings.
- Work experience.
- Featured projects and case studies.
- Certifications.
- Hiring process.
- Pricing indication.
- Evidence/source links.

Strength: this is unusually complete for AI retrieval.  
Risk: the keyword section includes broad company/firms terms that do not cleanly match a personal portfolio entity.

## Evidence limits

- Some live `curl` requests intermittently failed with connection errors during the audit window; successful results above were retained.
- Search Console, Bing Webmaster Tools, Cloudflare logs, GA4, and CrUX were not available.
- Live HTML meta extraction was partially limited by intermittent connection failures, so the audit relies on successful header/body captures, web inspection snippets, and local source comparison for exact metadata implementation.

