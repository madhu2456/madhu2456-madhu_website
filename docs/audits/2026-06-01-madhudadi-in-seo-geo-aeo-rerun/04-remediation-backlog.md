# Remediation Backlog - Rerun

## P0 - Fix production sitemap route ownership

Findings: `SEO-001`, `SEO-003`

Actions:

- Confirm the deployment commit currently serving `https://madhudadi.in/`.
- Confirm whether `/sitemap.xml` is served by the Next app, an older app, Cloudflare Worker, reverse proxy, or static file.
- Deploy the local direct URL-set sitemap route.
- Purge CDN/host cache for `/sitemap.xml`.

Validation:

```powershell
curl.exe -L https://madhudadi.in/sitemap.xml
curl.exe -L "https://madhudadi.in/sitemap.xml?verify=20260601"
curl.exe -L https://madhudadi.in/sitemap.xml | Select-String -Pattern "sitemap-portfolio"
```

Acceptance:

- Live `/sitemap.xml` has no `sitemap-portfolio` reference.
- Live `/sitemap.xml` lists canonical portfolio URLs directly or through a valid non-recursive sitemap index.

## P0 - Resolve legacy `/sitemap-portfolio.xml`

Findings: `SEO-002`

Actions:

- Locate the rule or route still serving `/sitemap-portfolio.xml`.
- Choose one behavior:
  - `301` to `/sitemap.xml`, recommended if no external tooling requires the old URL.
  - Valid direct URL-set response, acceptable for legacy support.
  - `410 Gone`, only if Search Console and external references are cleaned up.

Validation:

```powershell
curl.exe -I https://madhudadi.in/sitemap-portfolio.xml
curl.exe -L https://madhudadi.in/sitemap-portfolio.xml
```

Acceptance:

- The route no longer returns a recursive sitemap index.

## P1 - Verify GEO endpoints from stable networks

Findings: `GEO-001`, `GEO-002`, `CONTENT-001`

Actions:

- Recheck `/llms.txt` and `/ai-profile.json` from:
  - local machine,
  - deployment environment,
  - Cloudflare dashboard/logs,
  - Google Search Console URL Inspection,
  - one external network.
- Confirm removed terms do not appear live:
  - `AI consulting company`
  - `top AI consulting firms`
  - `AI consulting company in India`
  - `Batchelor`
  - `DataIku`

Validation:

```powershell
curl.exe -L https://madhudadi.in/llms.txt | Select-String -Pattern "AI consulting company", "top AI consulting firms", "Batchelor"
curl.exe -L https://madhudadi.in/ai-profile.json | Select-String -Pattern "AI consulting company", "top AI consulting firms", "Batchelor"
```

Acceptance:

- Both endpoints return `200 OK`.
- Both endpoints reflect local cleaned entity/content language.

## P1 - Verify search noindex live

Findings: `AEO-001`

Actions:

- Fetch `/search/` after deployment/cache purge.
- Confirm noindex metadata is present.
- Keep `/search/` absent from sitemap.

Validation:

```powershell
curl.exe -L https://madhudadi.in/search/ | Select-String -Pattern "noindex", "robots"
curl.exe -L https://madhudadi.in/sitemap.xml | Select-String -Pattern "/search"
```

Acceptance:

- `/search/` is `noindex, follow`.
- Sitemap does not list `/search/`.

## P2 - Structured-data scope review

Findings: `SCHEMA-001`

Actions:

- Validate rendered homepage JSON-LD in Rich Results Test and Schema.org validator.
- Confirm Person is the primary entity.
- Re-scope or remove SoftwareApplication if it is not representing a specific application/assistant.

Validation:

```powershell
curl.exe -L https://madhudadi.in/ | Select-String -Pattern "application/ld+json"
```

External tools:

- Google Rich Results Test.
- Schema.org validator.
- Search Console URL Inspection.

Acceptance:

- JSON-LD validates.
- Entity graph does not imply unsupported company/product structure.

## P2 - Add deployment regression checks

Findings: `SEO-001`, `SEO-002`, `SEO-003`, `AEO-001`, `GEO-001`

Actions:

- Add a post-deploy smoke script or checklist for:
  - `/sitemap.xml`
  - `/sitemap-portfolio.xml`
  - `/robots.txt`
  - `/search/`
  - `/llms.txt`
  - `/ai-profile.json`
- Fail deployment verification if `/sitemap.xml` contains `sitemap-portfolio`.

Acceptance:

- Future releases cannot silently ship stale sitemap or GEO endpoint regressions.

