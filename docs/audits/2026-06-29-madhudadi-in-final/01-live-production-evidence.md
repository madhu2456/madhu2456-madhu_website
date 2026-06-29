# Live Production Evidence - Final Release Verification

Date checked: 2026-06-29  
Host: `https://madhudadi.in/`

## Fetch Reliability

Live fetches are fully consistent. Cloudflare and Next.js CDN caching layers respond successfully. All key routes return `200 OK` or expected HTTP redirect statuses.

---

## 1. Homepage Headers & HTTPS Redirects

### Command:
```bash
curl -I https://madhudadi.in/
```
### Observed Headers:
- `HTTP/2 200`
- `content-type: text/html; charset=utf-8`
- `server: cloudflare`
- `x-nextjs-cache: HIT`
- `x-nextjs-prerender: 1`
- `cache-control: s-maxage=31536000`

### Canonical Host Redirect Check:
```bash
curl -I https://www.madhudadi.in/
```
- `HTTP/1.1 301 Moved Permanently`
- `location: https://madhudadi.in/`

*Conclusion: HTTPS redirect and canonical root host are functioning correctly.*

---

## 2. Sitemap and Redirects

### Root Sitemap fetch:
```bash
curl -L https://madhudadi.in/sitemap.xml
```
### Observed body:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
<url>
<loc>https://madhudadi.in/</loc>
<xhtml:link rel="alternate" hreflang="x-default" href="https://madhudadi.in/" />
<lastmod>2026-06-10</lastmod>
<changefreq>weekly</changefreq>
<priority>1</priority>
</url>
...
</urlset>
```
*Conclusion: `/sitemap.xml` serves the direct URL-set sitemap cleanly. It has no stale index structures.*

### Legacy Sitemap Redirect Check:
```bash
curl -I https://madhudadi.in/sitemap-portfolio.xml
```
### Observed:
- `HTTP/2 308`
- `location: /sitemap.xml`

*Conclusion: The legacy sitemap redirects cleanly to the root sitemap, resolving crawler drift.*

---

## 3. Robots.txt

### Command:
```bash
curl -s https://madhudadi.in/robots.txt
```
### Observed Rules:
- **Disallows**: `/cms/`, `/api/`, `/studio/`, and various private blog routes (`/blog/admin/`, `/blog/login`, `/blog/bookmarks`, etc.).
- **User-Agent: bingbot/adidxbot/slurp**: Configured with `Crawl-delay: 1`.
- **Search & Citation Agents** (`OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`, `Applebot`, `BraveBot`): Allowed to index `/`, `/llms.txt`, `/ai-profile.json`, and `/blog/` pages.
- **Model Training Agents** (`GPTBot`, `Google-Extended`, `ClaudeBot`, `Meta-ExternalAgent`): Disallowed entirely (`Disallow: /`) to protect proprietary content and personal data.
- **Sitemaps Listed**:
  - `https://madhudadi.in/sitemap.xml`
  - `https://madhudadi.in/blog/sitemap.xml`

---

## 4. GEO Endpoints (llms.txt & ai-profile.json)

### `llms.txt` check:
```bash
curl -s https://madhudadi.in/llms.txt
```
- Returns valid markdown describing Madhu Dadi as an AI and analytics engineer.
- Contains no references to broad agency/company keywords.
- Correctly lists certifications including the `Certified LLM Security Professional (CLLMSP)`.
- Links to `ai-profile.json`, sitemap, and blog feed.

### `ai-profile.json` check:
```bash
curl -s https://madhudadi.in/ai-profile.json
```
- Returns valid JSON with structured metadata.
- Primary entity: `Person` (Madhu Dadi).
- Contains education array with degree set to `"Bachelor of Technology"` (MVGR College of Engineering).
- Contains services, case studies, and certifications.

---

## 5. Search Index Protection

### Command:
```bash
curl -s -A "Mozilla/5.0" https://madhudadi.in/search/ | grep -o -i '<meta name="robots"[^>]+>'
```
### Observed:
- `<meta name="robots" content="noindex, follow"/>`

*Conclusion: Internal search queries are protected from index pollution while allowing link equity distribution.*
