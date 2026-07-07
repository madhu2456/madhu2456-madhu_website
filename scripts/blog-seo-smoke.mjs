#!/usr/bin/env node

/**
 * Blog SEO smoke test (separate codebase).
 *
 * Blog app repo (sibling): ../madhudadi.in/blog_platform/blog_frontend
 * Live URLs are served under https://madhudadi.in/blog/
 *
 * Usage:
 *   node scripts/blog-seo-smoke.mjs
 *   SITE_URL=https://madhudadi.in node scripts/blog-seo-smoke.mjs
 */

const SITE_URL = (process.env.SITE_URL || "https://madhudadi.in").replace(
  /\/$/,
  "",
);
const BLOG_SITEMAP = `${SITE_URL}/blog/sitemap.xml`;
const UA = "Mozilla/5.0 Blog-SEO-Smoke/1.0";
const TIMEOUT_MS = 15_000;
const SAMPLE_LIMIT = Number(process.env.BLOG_SAMPLE_LIMIT || 12);

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    redirect: "follow",
  });
  return { status: res.status, text: await res.text() };
}

function extractLocs(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) =>
    match[1].trim(),
  );
}

function countMainElements(html) {
  return (html.match(/<main[\s>]/gi) || []).length;
}

function extractMetaContent(html, attrName, attrValue) {
  const pattern = new RegExp(
    `<meta[^>]*\\b${attrName}=["']${attrValue}["'][^>]*content=["']([^"']*)["']`,
    "i",
  );
  const altPattern = new RegExp(
    `<meta[^>]*content=["']([^"']*)["'][^>]*\\b${attrName}=["']${attrValue}["']`,
    "i",
  );
  const match = html.match(pattern) || html.match(altPattern);
  return match ? match[1].trim() : "";
}

function hasDuplicateBrand(ogTitle) {
  return (
    ogTitle.includes("Madhu Dadi") && ogTitle.split("Madhu Dadi").length > 2
  );
}

async function main() {
  console.log(`\n🔍 Blog SEO Smoke Test — ${SITE_URL}/blog/\n`);
  console.log(
    "  Repo: ../madhudadi.in/blog_platform/blog_frontend (separate from portfolio)\n",
  );

  const { status, text } = await fetchText(BLOG_SITEMAP);
  if (status !== 200 || !text.includes("<urlset")) {
    console.error(`❌ FAIL: ${BLOG_SITEMAP} returned ${status}`);
    process.exit(1);
  }

  const urls = extractLocs(text).filter((url) => url.includes("/blog/"));
  console.log(`  Found ${urls.length} blog URLs in sitemap\n`);

  const sample =
    urls.length <= SAMPLE_LIMIT
      ? urls
      : [
          urls[0],
          urls[Math.floor(urls.length / 2)],
          urls[urls.length - 1],
          ...urls.slice(1, SAMPLE_LIMIT - 3),
        ];

  const issues = { critical: [], warning: [] };

  for (const url of sample) {
    const path = url.replace(SITE_URL, "") || "/";
    const { status: pageStatus, text: html } = await fetchText(url);
    if (pageStatus !== 200) {
      issues.critical.push(`${path}: HTTP ${pageStatus}`);
      continue;
    }

    const mainCount = countMainElements(html);
    if (mainCount !== 1) {
      issues.critical.push(
        `${path}: ${mainCount} <main> elements (expected 1)`,
      );
    }

    const ogTitle = extractMetaContent(html, "property", "og:title");
    if (ogTitle && hasDuplicateBrand(ogTitle)) {
      issues.critical.push(`${path}: duplicate og:title → "${ogTitle}"`);
    }
  }

  console.log(`  Sampled ${sample.length} URL(s)\n`);
  console.log("═".repeat(50));
  if (issues.critical.length === 0 && issues.warning.length === 0) {
    console.log("✅ Blog sample checks passed");
  } else {
    if (issues.critical.length > 0) {
      console.log(`🚨 CRITICAL (${issues.critical.length}):`);
      for (const issue of issues.critical) console.log(`  • ${issue}`);
    }
    if (issues.warning.length > 0) {
      console.log(`⚠️  Warnings (${issues.warning.length}):`);
      for (const issue of issues.warning) console.log(`  • ${issue}`);
    }
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Blog smoke test crashed:", error);
  process.exit(1);
});
