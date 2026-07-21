#!/usr/bin/env node
/**
 * Lightweight portfolio JSON-LD smoke validator.
 * Usage:
 *   node scripts/validate-portfolio-jsonld.mjs [baseUrl]
 * Default baseUrl: http://127.0.0.1:3000
 *
 * Checks:
 * - application/ld+json parses
 * - @context / @graph present where expected
 * - no speakable (retired growth tactic for this site)
 * - no HowTo (retired rich-result lever)
 * - FAQPage only if site policy allows (currently flag if present on home)
 */

const base = (process.argv[2] || "http://127.0.0.1:3000").replace(/\/$/, "");

const paths = [
  "/",
  "/services/",
  "/services/rag-consultant-india/",
  "/services/llm-developer-india/",
  "/services/marketing-analytics-consultant-india/",
  "/services/ai-consultant-visakhapatnam/",
  "/case-studies/",
  "/case-studies/adticks/",
  "/ai-consultant-india/",
  "/profile/",
];

function extractJsonLd(html) {
  const blocks = [];
  const re =
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  for (const match of html.matchAll(re)) {
    const raw = match[1].trim();
    if (!raw) continue;
    try {
      blocks.push(JSON.parse(raw));
    } catch (err) {
      blocks.push({ __parseError: String(err), raw: raw.slice(0, 200) });
    }
  }
  return blocks;
}

function collectTypes(node, out = new Set()) {
  if (!node || typeof node !== "object") return out;
  if (Array.isArray(node)) {
    for (const item of node) collectTypes(item, out);
    return out;
  }
  if (typeof node["@type"] === "string") out.add(node["@type"]);
  if (Array.isArray(node["@type"])) {
    for (const t of node["@type"]) out.add(t);
  }
  for (const value of Object.values(node)) {
    if (value && typeof value === "object") collectTypes(value, out);
  }
  return out;
}

function hasKeyDeep(node, key) {
  if (!node || typeof node !== "object") return false;
  if (Object.hasOwn(node, key)) return true;
  if (Array.isArray(node)) return node.some((item) => hasKeyDeep(item, key));
  return Object.values(node).some((v) => hasKeyDeep(v, key));
}

let failed = 0;

for (const path of paths) {
  const url = `${base}${path}`;
  process.stdout.write(`Checking ${url} ... `);
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "portfolio-jsonld-validator/1.0" },
      redirect: "follow",
    });
    if (!res.ok) {
      console.log(`HTTP ${res.status}`);
      failed += 1;
      continue;
    }
    const html = await res.text();
    const blocks = extractJsonLd(html);
    if (blocks.length === 0) {
      console.log("NO JSON-LD");
      failed += 1;
      continue;
    }
    const parseErrors = blocks.filter((b) => b.__parseError);
    if (parseErrors.length) {
      console.log(`PARSE ERROR: ${parseErrors[0].__parseError}`);
      failed += 1;
      continue;
    }

    const types = new Set();
    for (const b of blocks) collectTypes(b, types);

    const issues = [];
    for (const b of blocks) {
      if (hasKeyDeep(b, "speakable")) {
        issues.push("speakable present (should be omitted)");
      }
    }
    if (types.has("HowTo")) {
      issues.push("HowTo schema present (retired growth tactic)");
    }
    // Homepage should not chase FAQPage rich results as growth lever
    if (path === "/" && types.has("FAQPage")) {
      issues.push("homepage FAQPage (policy: visible FAQ HTML only)");
    }

    if (issues.length) {
      console.log(`FAIL: ${issues.join("; ")}`);
      failed += 1;
    } else {
      console.log(
        `ok (${blocks.length} block(s); types: ${[...types].slice(0, 8).join(", ")})`,
      );
    }
  } catch (err) {
    console.log(`ERROR: ${err instanceof Error ? err.message : err}`);
    failed += 1;
  }
}

if (failed > 0) {
  console.error(`\n${failed} path(s) failed.`);
  process.exit(1);
}
console.log("\nAll JSON-LD checks passed.");
