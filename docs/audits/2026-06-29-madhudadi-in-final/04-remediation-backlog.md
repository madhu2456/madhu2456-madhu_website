# Remediation Backlog - Final Release Verification

All previous remediation items are **Completed and Closed**. 

To prevent future drift or regressions, the following CI/CD practices and check steps have been successfully institutionalized in the codebase.

---

## 1. Post-Deployment Regression Checklist (CI/CD)

Whenever a new build is deployed, run the following automated or manual validation checks:

### Sitemap Check:
```bash
# Verify sitemap has no legacy sitemap-portfolio XML references
curl -s -L https://madhudadi.in/sitemap.xml | grep -i "sitemap-portfolio"
# Expected result: empty output

# Verify legacy sitemap redirects
curl -I https://madhudadi.in/sitemap-portfolio.xml
# Expected result: HTTP/2 308 redirecting to /sitemap.xml
```

### Search Route Protection Check:
```bash
# Verify search results are not indexable
curl -s -A "Mozilla/5.0" https://madhudadi.in/search/ | grep -o -i '<meta name="robots"[^>]+>'
# Expected result: <meta name="robots" content="noindex, follow"/>
```

### GEO Profile Checks:
```bash
# Verify LLM profile fetches cleanly
curl -s https://madhudadi.in/llms.txt | grep -i "Certified LLM Security Professional"
# Expected result: contains LLM Security certification reference

# Verify JSON-LD validates correctly
# Paste homepage HTML into Schema.org Validator or Google Rich Results Test.
```

---

## 2. Maintenance Schedule for Machine-Readable Content

To maintain authority and accuracy with AI/ML crawlers (AEO/GEO):
- **Quarterly Profile Sync**: Review `/llms.txt` and `/ai-profile.json` whenever certifications are added or service pages are updated.
- **Crawler Updates**: Check robots.txt directives yearly against the official list of emerging AI user-agents (e.g. keep monitoring Applebot-Extended, ChatGPT-User, Claude-SearchBot, etc.).
- **Dynamic Projects/Services**: Ensure all new projects in `Data/portfolio-content.json` have correct slugs and updatedAt properties so the sitemap dynamically updates lastModified stamps.
