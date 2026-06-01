# Live Production Evidence - Rerun

Date checked: 2026-06-01  
Host: `https://madhudadi.in/`

## Fetch reliability

Live fetches were inconsistent from this environment. `curl.exe` successfully reached the homepage headers, `www` redirect, `robots.txt`, and `sitemap.xml`. Repeated fetches for `llms.txt`, `ai-profile.json`, and `/search/` failed with connection errors during this rerun. Node `fetch` failed for all tested production routes, so curl output is the trusted transport for this report.

This is recorded as an evidence limit, not as proof that those endpoints are down globally.

## Homepage headers

Command:

```powershell
curl.exe --retry 2 --retry-connrefused --retry-delay 2 -I https://madhudadi.in/
```

Observed:

- `HTTP/1.1 200 OK`
- `Content-Type: text/html; charset=utf-8`
- `Server: cloudflare`
- `x-nextjs-cache: HIT`
- `x-nextjs-prerender: 1`
- `Cache-Control: s-maxage=31536000`
- CSP, HSTS, referrer policy, COOP/COEP, permissions policy, and content-type options present.

Interpretation:

- Homepage is reachable and cache-backed.
- Cloudflare/hosting cache can hide stale route output until purged or redeployed correctly.

## Canonical host redirect

Command:

```powershell
curl.exe --retry 2 --retry-connrefused --retry-delay 2 -I https://www.madhudadi.in/
```

Observed:

- `HTTP/1.1 301 Moved Permanently`
- `location: https://madhudadi.in/`

Interpretation:

- Canonical non-www host redirect is working.

## Sitemap evidence

Command:

```powershell
curl.exe --retry 2 --retry-connrefused --retry-delay 2 -L https://madhudadi.in/sitemap.xml
```

Observed body:

```xml
<?xml version="1.0" encoding="UTF-8"?>
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

Command:

```powershell
curl.exe --retry 3 --retry-connrefused --retry-delay 2 -I https://madhudadi.in/sitemap-portfolio.xml
```

Observed:

- `HTTP/1.1 200 OK`
- `Content-Type: application/xml; charset=utf-8`
- `x-nextjs-cache: HIT`
- `Cache-Control: public, max-age=3600, stale-while-revalidate=86400`

Interpretation:

- Production still exposes the legacy portfolio sitemap path.
- Root `/sitemap.xml` is not serving the local direct URL-set implementation.
- The `x-nextjs-cache: HIT` and Cloudflare layer suggest the stale route may be from an old deployment, a route conflict, or cache not being purged.

## Robots evidence

Command:

```powershell
curl.exe --retry 2 --retry-connrefused --retry-delay 2 -L https://madhudadi.in/robots.txt
```

Observed:

- Consolidated title: `MadhuDadi Master Robots.txt - Consolidated (Blog & Portfolio)`
- Standard disallows:
  - `/studio/`
  - `/api/`
  - `/blog/admin/`
  - `/blog/api/v1/admin/`
  - `/blog/api/v1/auth/`
  - `/blog/api/v1/payments/`
  - `/blog/login`
  - `/blog/register`
  - `/blog/profile/`
  - `/blog/bookmarks`
  - `/blog/auth`
  - `/cdn-cgi/`
- AI crawler allow section includes `GPTBot`, `ChatGPT-User`, `OAI-SearchBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `Applebot`, `Meta-ExternalAgent`, `cohere-ai`, `Diffbot`, `YouBot`, and `BraveBot`.
- Sitemap lines:
  - `https://madhudadi.in/sitemap.xml`
  - `https://madhudadi.in/blog/sitemap.xml`
  - `https://madhudadi.in/blog/api/v1/sitemap-index.xml`

Interpretation:

- Production robots is generally healthy and preserves blog protections.
- The sitemap listed in robots is still affected because `/sitemap.xml` itself is stale.

## GEO/search endpoint evidence gaps

Commands attempted:

```powershell
curl.exe --http1.1 --retry 5 --retry-all-errors --retry-delay 3 -L https://madhudadi.in/llms.txt
curl.exe --http1.1 --retry 5 --retry-all-errors --retry-delay 3 -L https://madhudadi.in/ai-profile.json
curl.exe --http1.1 --retry 5 --retry-all-errors --retry-delay 3 -L https://madhudadi.in/search/
```

Observed:

- All three failed from this environment with `curl: (7) Failed to connect to madhudadi.in port 443`.

Interpretation:

- Current rerun cannot verify live `llms.txt`, `ai-profile.json`, or `/search/` content.
- These should be rechecked from deployment logs, Cloudflare, Search Console URL Inspection, or another network.

