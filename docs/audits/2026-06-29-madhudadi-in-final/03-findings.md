# Findings Ledger - Final Release Verification

Finding status classifications: Confirmed issue, Confirmed strength, Risk / likely issue, Needs verification, Opportunity, Not applicable.  
Confidence scale: High, Medium, Low.  
Severity scale: Critical, High, Medium, Low, Enhancement.

---

## SEO-001 - Production sitemap served legacy index referencing sitemap-portfolio.xml
- **Status**: **Resolved** (Confirmed strength)
- **Severity**: Critical  
- **Confidence**: High  
- **Description**: Stale/legacy nested XML sitemap structures were present in production.
- **Evidence**: Live `/sitemap.xml` now serves the direct flat URL-set dynamically, aligning production and local builds.
- **Remediation verified**: Crawled live `/sitemap.xml` using curl; sitemap is a flat `<urlset>` containing exactly 16 URLs with alternates.

---

## SEO-002 - Legacy `/sitemap-portfolio.xml` returning 200 OK
- **Status**: **Resolved** (Confirmed strength)
- **Severity**: High  
- **Confidence**: High  
- **Description**: Stale portfolio sitemap was still reachable by crawlers.
- **Evidence**: Live `/sitemap-portfolio.xml` returns `308 Permanent Redirect` to `/sitemap.xml`.
- **Remediation verified**: Response code and location header checked.

---

## SEO-003 - Deployment/cache drift between local and production
- **Status**: **Resolved** (Confirmed strength)
- **Severity**: High  
- **Confidence**: High  
- **Description**: Local improvements were not yet reflected in production.
- **Evidence**: Production has been updated, Cloudflare cache is purged, and the live responses match local build definitions.
- **Remediation verified**: Verified sitemap, robots, search, and GEO endpoints all output live matching local structures.

---

## ROBOTS-001 - Root robots.txt rules consolidation
- **Status**: **Resolved / Passing** (Confirmed strength)
- **Severity**: Low  
- **Confidence**: High  
- **Description**: The master `robots.txt` needs to consolidate blog and portfolio rules and secure search agent configurations.
- **Evidence**: Live `robots.txt` has clean sections for general crawlers, search and citation agents (allowed), and model training crawlers (disallowed `/`).
- **Remediation verified**: Live `robots.txt` checked and validated.

---

## GEO-001 - Live GEO endpoint verification blocked by fetch instability
- **Status**: **Resolved** (Confirmed strength)
- **Severity**: Medium  
- **Confidence**: High  
- **Description**: Network issues prevented validating GEO endpoints in the previous rerun.
- **Evidence**: `/llms.txt` and `/ai-profile.json` successfully fetched from the current environment, returning `200 OK`.
- **Remediation verified**: Contents parsed and verified.

---

## GEO-002 - Local entity keyword strategy alignment
- **Status**: **Resolved** (Confirmed strength)
- **Severity**: Low  
- **Confidence**: High  
- **Description**: Broad company/agency-level keywords diluted the personal brand entity.
- **Evidence**: Active content is refactored around "AI and analytics engineer" rather than "AI consulting company".
- **Remediation verified**: Verified on homepage meta tags, `/llms.txt`, and `/ai-profile.json`.

---

## AEO-001 - Search page indexing risk
- **Status**: **Resolved** (Confirmed strength)
- **Severity**: Medium  
- **Confidence**: High  
- **Description**: Internal search paths could leak into search engine indexes.
- **Evidence**: `/search/` is omitted from the sitemap, and its HTML includes `<meta name="robots" content="noindex, follow"/>`.
- **Remediation verified**: Crawled page HTML using curl and matched robots meta content.

---

## CONTENT-001 - Content trust and typos
- **Status**: **Resolved** (Confirmed strength)
- **Severity**: Low  
- **Confidence**: High  
- **Description**: Obsolete terms, spelling issues (`Batchelor`), and incorrect case-study project lists.
- **Evidence**: Degrees fixed to `Bachelor of Technology`. Featured projects correctly configured in portfolio data.
- **Remediation verified**: Validated in JSON-LD structure and dynamic text on homepage.

---

## SCHEMA-001 - Structured data graph consolidation
- **Status**: **Resolved** (Confirmed strength)
- **Severity**: Low  
- **Confidence**: High  
- **Description**: Multiple schemas should be unified under Person as the root node.
- **Evidence**: Local and production JSON-LD output a single `@graph` with Person as the primary entity and all other components linked.
- **Remediation verified**: Homepage schema parsed and validated.
