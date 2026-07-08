#!/usr/bin/env node

/**
 * Live SEO Smoke Test
 *
 * Validates key SEO/AEO signals across all sitemap URLs on the deployed site.
 * Production robots.txt is nginx-managed; checks below target the live edge file.
 * Sitemap audit is full-site: portfolio + blog child sitemaps (owner decision).
 * Run after deploy to catch metadata regressions before Googlebot does.
 *
 * Usage:
 *   node scripts/seo-smoke-test.mjs
 *   SITE_URL=https://staging.example.com node scripts/seo-smoke-test.mjs
 */

const SITE_URL = (process.env.SITE_URL || "https://madhudadi.in").replace(
  /\/$/,
  "",
);
const UA = "Mozilla/5.0 SEO-Smoke-Test/1.0";
const TIMEOUT_MS = 15_000;

// ─── Helpers ────────────────────────────────────────────────────────────────

async function fetchText(url, { redirect = "follow" } = {}) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    redirect,
  });
  return { status: res.status, text: await res.text(), headers: res.headers };
}

function decodeHtmlEntities(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'");
}

function hasDuplicateBrandSuffix(ogTitle) {
  const decoded = decodeHtmlEntities(ogTitle);
  const pipeSuffixMatches =
    decoded.match(/\|\s*Madhu Dadi(?:\s*[—–-]\s*[^|]+)?/g) || [];
  if (pipeSuffixMatches.length > 1) return true;

  const fullBrandMatches =
    decoded.match(/Madhu Dadi — AI, Python & Analytics Hub/g) || [];
  return fullBrandMatches.length > 1;
}

function extractTag(html, tag) {
  const re = new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`, "i");
  const m = html.match(re);
  return m ? m[1].trim() : "";
}

function extractMetaContent(html, attrName, attrValue) {
  // Match <meta attrName="attrValue" content="...">
  const pattern = new RegExp(
    `<meta[^>]*\\b${attrName}=["']${attrValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'][^>]*content=["']([^"']*)["']`,
    "i",
  );
  const altPattern = new RegExp(
    `<meta[^>]*content=["']([^"']*)["'][^>]*\\b${attrName}=["']${attrValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`,
    "i",
  );
  const m = html.match(pattern) || html.match(altPattern);
  return m ? m[1].trim() : "";
}

function countElements(html, tag) {
  const re = new RegExp(`<${tag}[\\s>]`, "gi");
  return (html.match(re) || []).length;
}

function extractLocs(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].trim());
}

function isSitemapIndex(xml) {
  return xml.includes("<sitemapindex");
}

function isUrlSet(xml) {
  return xml.includes("<urlset");
}

/**
 * Resolve page URLs from a sitemap or sitemap index (recurses into child sitemaps).
 */
async function collectPageUrlsFromSitemap(sitemapUrl, visited = new Set()) {
  const normalized = sitemapUrl.replace(/\/$/, "");
  if (visited.has(normalized)) return [];
  visited.add(normalized);

  const { status, text } = await fetchText(sitemapUrl);
  if (status !== 200 || (!isSitemapIndex(text) && !isUrlSet(text))) {
    throw new Error(
      `${sitemapUrl} returned status ${status} or invalid sitemap XML`,
    );
  }

  if (isSitemapIndex(text)) {
    const childSitemaps = extractLocs(text);
    const pageUrls = [];
    for (const childUrl of childSitemaps) {
      pageUrls.push(...(await collectPageUrlsFromSitemap(childUrl, visited)));
    }
    return pageUrls;
  }

  return extractLocs(text);
}

function isBlogIssue(issue) {
  return /\/blog[:/]/.test(issue);
}

function scopeBreakdown(items) {
  const blog = items.filter(isBlogIssue).length;
  return { portfolio: items.length - blog, blog, total: items.length };
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🔍 SEO Smoke Test — ${SITE_URL}\n`);

  // 1. Fetch sitemap
  const sitemapUrl = `${SITE_URL}/sitemap.xml`;
  const { status: smStatus, text: smText } = await fetchText(sitemapUrl);

  if (
    smStatus !== 200 ||
    (!smText.includes("<urlset") && !smText.includes("<sitemapindex"))
  ) {
    console.error(`❌ FAIL: ${sitemapUrl} returned status ${smStatus}`);
    process.exit(1);
  }

  let urls;
  try {
    urls = await collectPageUrlsFromSitemap(sitemapUrl);
  } catch (err) {
    console.error(`❌ FAIL: ${err.message}`);
    process.exit(1);
  }
  urls = [...new Set(urls)];
  const sitemapKind = isSitemapIndex(smText) ? "sitemap index" : "urlset";
  console.log(
    `  Root sitemap is a ${sitemapKind}; found ${urls.length} page URL(s)\n`,
  );

  const issues = { critical: [], warning: [], info: [] };

  // 2. Check robots.txt (nginx-served on production)
  const { text: robotsText } = await fetchText(`${SITE_URL}/robots.txt`);
  const robotsChecks = [
    {
      label: "Has sitemap reference",
      ok: robotsText.includes("Sitemap:"),
      severity: "critical",
    },
    {
      label: "Allows /llms.txt",
      ok: robotsText.includes("Allow: /llms.txt"),
      severity: "critical",
    },
    {
      label: "References root portfolio sitemap",
      ok: robotsText.includes(`${SITE_URL}/sitemap.xml`),
      severity: "warning",
    },
    {
      label: "No stale blog API sitemap (nginx hygiene)",
      ok: !robotsText.includes("blog/api/v1/sitemap-index.xml"),
      severity: "warning",
    },
    {
      label: "Blog sitemap referenced (nginx consolidated)",
      ok: robotsText.includes("blog/sitemap.xml"),
      severity: "info",
    },
    {
      label: "OAI-SearchBot welcomed (GEO)",
      ok: robotsText.includes("OAI-SearchBot"),
      severity: "info",
    },
  ];
  console.log("📋 robots.txt (nginx on production)");
  for (const check of robotsChecks) {
    const icon = check.ok
      ? "✅"
      : check.severity === "critical"
        ? "❌"
        : check.severity === "warning"
          ? "⚠️"
          : "ℹ️";
    console.log(`  ${icon} ${check.label}`);
    if (!check.ok) {
      issues[check.severity].push(`robots.txt: ${check.label}`);
    }
  }

  // 3. Check discovery endpoints
  const discoveryEndpoints = [
    ["/llms.txt", "text/plain"],
    ["/llms-full.txt", "text/plain"],
    ["/ai-profile.json", "application/json"],
    ["/.well-known/ai-plugin.json", "application/json"],
  ];
  console.log("\n📡 Discovery endpoints");
  for (const [path, expectedType] of discoveryEndpoints) {
    const { status, headers } = await fetchText(`${SITE_URL}${path}`);
    const contentType = headers.get("content-type") || "";
    const ok = status === 200 && contentType.includes(expectedType);
    console.log(
      `  ${ok ? "✅" : "❌"} ${path} → ${status} (${contentType.split(";")[0]})`,
    );
  }

  // 4. Check each sitemap URL
  const MAX_DESC_LEN = 160;
  let maxDescLen = 0;

  console.log("\n📄 Page metadata");
  for (const url of urls) {
    const path = url.replace(SITE_URL, "") || "/";
    const { status, text: html } = await fetchText(url);

    if (status !== 200) {
      issues.critical.push(`${path}: HTTP ${status}`);
      continue;
    }

    const title = extractTag(html, "title");
    const desc = decodeHtmlEntities(
      extractMetaContent(html, "name", "description"),
    );
    const ogTitle = decodeHtmlEntities(
      extractMetaContent(html, "property", "og:title"),
    );
    const robots = extractMetaContent(html, "name", "robots");

    const canonicalMatch = html.match(
      /rel=["']canonical["']\s+href=["']([^"']*)["']/i,
    );
    const canonical = canonicalMatch ? canonicalMatch[1] : "";
    const mainCount = countElements(html, "main");
    const h1Count = countElements(html, "h1");

    // Track max description length
    if (desc.length > maxDescLen) maxDescLen = desc.length;

    // Checks
    if (hasDuplicateBrandSuffix(ogTitle)) {
      issues.critical.push(
        `${path}: og:title has duplicate brand suffix → "${ogTitle}"`,
      );
    }
    if (!title.includes("Madhu Dadi")) {
      issues.warning.push(
        `${path}: title missing brand → "${title.slice(0, 60)}"`,
      );
    }
    if (desc.length > MAX_DESC_LEN) {
      issues.warning.push(
        `${path}: description ${desc.length} chars (max ${MAX_DESC_LEN})`,
      );
    }
    if (
      canonical &&
      canonical !== url &&
      canonical !== `${url}/` &&
      url !== `${canonical}/`
    ) {
      issues.warning.push(
        `${path}: canonical mismatch → sitemap="${url}" canonical="${canonical}"`,
      );
    }
    if (mainCount !== 1) {
      issues.critical.push(
        `${path}: ${mainCount} <main> elements (expected 1)`,
      );
    }
    if (h1Count !== 1) {
      issues.warning.push(`${path}: ${h1Count} <h1> elements (expected 1)`);
    }
    if (robots && (!robots.includes("index") || !robots.includes("follow"))) {
      issues.warning.push(`${path}: robots="${robots}"`);
    }
    if (!ogTitle) {
      issues.warning.push(`${path}: missing og:title`);
    }
  }

  console.log(`  Max description length: ${maxDescLen} chars`);

  // 5. Check old sitemap URL redirect
  const { status: oldStatus } = await fetchText(
    `${SITE_URL}/sitemap-portfolio.xml`,
    { redirect: "manual" },
  );
  if (oldStatus === 301 || oldStatus === 308) {
    console.log("\n✅ /sitemap-portfolio.xml → redirect");
  } else if (oldStatus === 404) {
    issues.warning.push(
      "/sitemap-portfolio.xml returns 404 (should be 301 redirect)",
    );
  } else {
    issues.info.push(`/sitemap-portfolio.xml returns ${oldStatus}`);
  }

  // 6. Summary
  console.log(`\n${"═".repeat(50)}`);
  console.log("📊 Summary (full-site: portfolio + blog)");
  console.log(`${"═".repeat(50)}`);

  for (const [label, items] of [
    ["CRITICAL", issues.critical],
    ["Warnings", issues.warning],
    ["Info", issues.info],
  ]) {
    if (items.length === 0) continue;
    const { portfolio, blog } = scopeBreakdown(items);
    console.log(
      `\n${label} scope: ${portfolio} portfolio, ${blog} blog (${items.length} total)`,
    );
  }

  if (issues.critical.length > 0) {
    console.log(`\n🚨 CRITICAL (${issues.critical.length}):`);
    for (const i of issues.critical) console.log(`  • ${i}`);
  }
  if (issues.warning.length > 0) {
    console.log(`\n⚠️  Warnings (${issues.warning.length}):`);
    for (const i of issues.warning) console.log(`  • ${i}`);
  }
  if (issues.info.length > 0) {
    console.log(`\nℹ️  Info (${issues.info.length}):`);
    for (const i of issues.info) console.log(`  • ${i}`);
  }

  if (issues.critical.length === 0 && issues.warning.length === 0) {
    console.log("\n✅ All checks passed!");
  }

  if (issues.critical.length > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Smoke test crashed:", err);
  process.exit(1);
});
