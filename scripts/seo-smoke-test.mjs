#!/usr/bin/env node

/**
 * Live SEO Smoke Test
 *
 * Validates key SEO/AEO signals across all sitemap URLs on the deployed site.
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

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    redirect: "follow",
  });
  return { status: res.status, text: await res.text(), headers: res.headers };
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

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🔍 SEO Smoke Test — ${SITE_URL}\n`);

  // 1. Fetch sitemap
  const sitemapUrl = `${SITE_URL}/sitemap.xml`;
  const { status: smStatus, text: smText } = await fetchText(sitemapUrl);

  if (smStatus !== 200 || !smText.includes("<urlset")) {
    console.error(`❌ FAIL: ${sitemapUrl} returned status ${smStatus}`);
    process.exit(1);
  }

  const urls = [...smText.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  console.log(`  Found ${urls.length} URLs in sitemap\n`);

  // 2. Check robots.txt
  const { text: robotsText } = await fetchText(`${SITE_URL}/robots.txt`);
  const robotsChecks = [
    ["Has sitemap reference", robotsText.includes("Sitemap:")],
    ["Allows /llms.txt", robotsText.includes("Allow: /llms.txt")],
    [
      "No old blog API sitemap",
      !robotsText.includes("blog/api/v1/sitemap-index.xml"),
    ],
  ];
  console.log("📋 robots.txt");
  for (const [label, ok] of robotsChecks) {
    console.log(`  ${ok ? "✅" : "❌"} ${label}`);
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
  const issues = { critical: [], warning: [], info: [] };
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
    const desc = extractMetaContent(html, "name", "description");
    const ogTitle = extractMetaContent(html, "property", "og:title");
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
    if (
      ogTitle.includes("Madhu Dadi") &&
      ogTitle.split("Madhu Dadi").length > 2
    ) {
      issues.critical.push(
        `${path}: og:title has duplicate "Madhu Dadi" → "${ogTitle}"`,
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
  );
  if (oldStatus === 301 || oldStatus === 308) {
    console.log("\n✅ /sitemap-portfolio.xml → 301 redirect");
  } else if (oldStatus === 404) {
    issues.warning.push(
      "/sitemap-portfolio.xml returns 404 (should be 301 redirect)",
    );
  } else {
    issues.info.push(`/sitemap-portfolio.xml returns ${oldStatus}`);
  }

  // 6. Summary
  console.log(`\n${"═".repeat(50)}`);
  console.log("📊 Summary");
  console.log(`${"═".repeat(50)}`);

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
