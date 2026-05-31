#!/usr/bin/env node
/**
 * Build-time SEO validator for homepage case-study CTAs.
 *
 * Statically parses src/routes/index.tsx and verifies that, for each
 * case-study slug listed in `caseStudySources`, the file emits well-formed
 * JSON-LD (ItemList, Article, FAQPage) with the required fields and that the
 * CTA link uses keyword-rich, non-generic anchor text.
 *
 * Exits with code 1 on any failure so `prebuild` aborts the deploy.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const FILE = resolve(here, "..", "src/routes/index.tsx");
const src = readFileSync(FILE, "utf8");

const errors = [];
const fail = (msg) => errors.push(msg);

// --- 1. Extract slugs from caseStudySources -------------------------------
const sourcesBlock = src.match(/caseStudySources[^=]*=\s*\[([\s\S]*?)\];/);
if (!sourcesBlock) {
  fail("Could not locate `caseStudySources` array in src/routes/index.tsx.");
}
const slugs = sourcesBlock
  ? [...sourcesBlock[1].matchAll(/slug:\s*["']([^"']+)["']/g)].map((m) => m[1])
  : [];
if (slugs.length === 0) fail("No case-study slugs found in `caseStudySources`.");

// --- 2. Required JSON-LD builders exist -----------------------------------
const requiredBuilders = [
  "caseStudyItemListJsonLd",
  "caseStudyArticleJsonLd",
  "caseStudyFaqJsonLd",
];
for (const name of requiredBuilders) {
  if (!new RegExp(`const\\s+${name}\\s*=`).test(src)) {
    fail(`Missing JSON-LD builder: ${name}`);
  }
}

// --- 3. Required @type values are present ---------------------------------
for (const t of ["ItemList", "Article", "FAQPage"]) {
  if (!new RegExp(`"@type":\\s*"${t}"`).test(src)) {
    fail(`JSON-LD missing required @type: ${t}`);
  }
}

// --- 4. Required fields on each schema ------------------------------------
const articleFields = ["headline", "description", "url", "mainEntityOfPage", "author"];
for (const f of articleFields) {
  if (!new RegExp(`\\b${f}\\s*:`).test(src)) {
    fail(`Article JSON-LD missing required field: ${f}`);
  }
}
for (const f of ["mainEntity", "about"]) {
  if (!new RegExp(`\\b${f}\\s*:`).test(src)) {
    fail(`FAQPage JSON-LD missing required field: ${f}`);
  }
}
if (!/itemListElement\s*:/.test(src)) fail("ItemList missing itemListElement.");
if (!/numberOfItems\s*:/.test(src)) fail("ItemList missing numberOfItems.");

// --- 5. Each schema is rendered into <head> via head().scripts ------------
for (const name of requiredBuilders) {
  // Either spread (...x.map) or direct reference inside scripts array.
  const used = new RegExp(`\\.{0,3}${name}\\b`).test(src);
  if (!used) fail(`${name} is defined but never injected into head().scripts.`);
}

// --- 6. Per-slug CTA link + keyword-rich anchor text ----------------------
const GENERIC = /^(case study|read more|learn more|click here|details|view)\.?$/i;
for (const slug of slugs) {
  const linkRe = new RegExp(
    `label:\\s*["']([^"']+)["'],\\s*href:\\s*["']/case-studies/${slug}["']`,
  );
  const m = src.match(linkRe);
  if (!m) {
    fail(`No CTA link found for slug "${slug}" (expected /case-studies/${slug}).`);
    continue;
  }
  const label = m[1].trim();
  if (GENERIC.test(label)) {
    fail(`CTA for "${slug}" uses generic anchor text: "${label}".`);
  }
  if (label.length < 12) {
    fail(`CTA for "${slug}" anchor text too short for keyword targeting: "${label}".`);
  }
}

// --- Report ---------------------------------------------------------------
if (errors.length > 0) {
  console.error("\n✖ Case-study JSON-LD / CTA validation failed:\n");
  for (const e of errors) console.error("  - " + e);
  console.error(`\n${errors.length} issue(s). Aborting build.\n`);
  process.exit(1);
}

console.log(
  `✓ Case-study JSON-LD valid for ${slugs.length} slug(s): ${slugs.join(", ")}`,
);
