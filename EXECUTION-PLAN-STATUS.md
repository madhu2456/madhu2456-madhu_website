# SEO + AEO + GEO execution plan — status

Grounded in the July 21, 2026 Semrush India plan. **Do not re-enable** Google-retired rich-result tactics (FAQPage/HowTo as CTR levers, speakable for AI Overviews) — see audit #3 / Search Central 2026.

## Phase 1 — Technical foundation

| ID | Task | Status |
|----|------|--------|
| 1.1 | HTTPS + www→apex 301 | **Live** |
| 1.2 | Self-referential canonicals | **Live** (per-page `alternates.canonical`) |
| 1.3 | hreflang en-IN, en, x-default | **Shipped** (meta + sitemap xhtml:link) |
| 1.4 | Sitemap portfolio + blog index | **Live** (`/sitemap.xml` index) |
| 1.5 | robots + Sitemap lines + AI allow-list | **Live** (nginx robots) |
| 1.6 | Trailing-slash policy | **Live** (portfolio `trailingSlash: true`) |
| 1.7 | CWV hero preload | **Shipped** (`link rel=preload` + Image priority) |
| 1.8–1.9 | GSC / Bing verify + submit | **Ops** (owner) |
| 1.10 | a11y pass | **Partial** (skip link, FAQ details, author labels) |

## Phase 2 — Metadata

| Route | Title approach | Status |
|-------|----------------|--------|
| `/` | Madhu Dadi – AI Consultant & Analytics Leader | **Shipped** |
| `/case-studies/` | AI, RAG & Analytics Case Studies | **Shipped** |
| Case study leaves | Adticks / RAG blog / Udemy Enroller titles | **Shipped** |
| India service leaves | RAG / LLM / Marketing Analytics Consultant in India | **Shipped** (seoTitle + landers) |

## Phase 3 — Structured data

| Item | Status |
|------|--------|
| Person / WebSite / ProfilePage / Breadcrumb / TechArticle path | **Live** |
| FAQPage / HowTo / speakable as growth strategy | **Removed** (service + case-study leaves cleaned) |
| Visible FAQ HTML | **Kept** (question-style H2s) |
| LocalBusiness fake storefront | **Not** (personal brand; GBP service-area DR-06) |
| Author bio (visible E-E-A-T) | **Shipped** (`AuthorBio` on services + case studies) |
| `validate:jsonld` smoke script | **Shipped** |

## Phase 4 — AEO

| Item | Status |
|------|--------|
| `/llms.txt`, `/llms-full.txt`, `/ai-profile.json` | **Live** (honest labels) |
| Direct-answer blocks, question FAQs | **Live** on home + services + India landers |
| FAQPage on every service | **Won't do** (retired rich results; use visible Q&A) |
| speakable for AI Overviews | **Won't do** |
| Optional `/md/*` markdown twins | **Shipped** (noindex; HTML canonical) |

## Phase 5 — India GEO

| Item | Status |
|------|--------|
| `/services/rag-consultant-india/` | **Live** |
| `/services/llm-developer-india/` | **Live lander** (unique India copy; links full LLM service) |
| `/services/marketing-analytics-consultant-india/` | **Live lander** |
| `/services/ai-consultant-visakhapatnam/` | **Live lander** |
| `/ai-consultant-india/` location hub | **Live** |
| GBP / Justdial / Sulekha | **Ops** |

## Phase 6–8 — Content & off-page

| Item | Status |
|------|--------|
| Blog “What is RAG?” scaffold | **Editorial** `content/editorial/wave-j/` (publish via CMS) |
| Abstraction-in-Python refresh | **Editorial** last-verified bump |
| Semrush tracking / outreach | **Ops** (owner process) |

## Code shipped this cycle

1. India landers as real routes (`service-aliases.ts` + pages; 301s removed)
2. Speakable + service FAQPage schema removed; case studies → TechArticle
3. AuthorBio, markdown twins, sitemap en-IN hreflang, hero preload, `lang=en-IN`
4. `scripts/validate-portfolio-jsonld.mjs` + `pnpm validate:jsonld`

## Still ops / off-repo

1. GSC + Bing sitemap submit / URL inspection for new landers  
2. GBP, LinkedIn NAP, directories  
3. Publish wave-j “What is RAG?” via blog admin/DB  
4. Lighthouse mobile CWV on 5 URLs (manual)  
