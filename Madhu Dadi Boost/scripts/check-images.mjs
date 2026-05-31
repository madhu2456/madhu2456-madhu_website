#!/usr/bin/env node
/**
 * Build-time guard: fail if any forbidden image source is introduced.
 *
 * Blocks:
 *  - External stock/placeholder image hosts (Unsplash, Pexels, Picsum, Pixabay,
 *    Lorem Ipsum, placeholder.com, placekitten, dummyimage, etc.).
 *  - Local filenames hinting at placeholder/stock/sample/mock/demo images.
 *  - Any <img src> or background-image: url(...) pointing to an http(s) host
 *    other than the project's own domain (madhudadi.in) — all photos must be
 *    self-hosted derivatives of the uploaded portrait.
 *
 * On failure, reports: file path, line:column, rule id, matched pattern,
 * the offending excerpt, and a caret pointer at the column.
 *
 * Scope: src/ and public/ (excludes generated files, node_modules, this script).
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname, relative } from "node:path";

const ROOT = process.cwd();
const SCAN_DIRS = ["src", "public"];
const TEXT_EXT = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
  ".css", ".html", ".md", ".mdx", ".json", ".svg", ".txt",
]);
const SKIP_FILES = new Set(["routeTree.gen.ts"]);

const FORBIDDEN_HOSTS = [
  "images.unsplash.com", "unsplash.com",
  "images.pexels.com", "pexels.com",
  "picsum.photos",
  "pixabay.com",
  "loremflickr.com", "loremipsum.io",
  "placeholder.com", "via.placeholder.com",
  "placekitten.com", "placebear.com",
  "dummyimage.com", "fakeimg.pl",
  "placehold.co", "placehold.it",
];

const FORBIDDEN_FILENAME_TOKENS = [
  "placeholder", "stock", "sample-photo", "mock-photo",
  "demo-photo", "lorem-", "dummy-image", "fake-image",
];

const ALLOWED_OWN_HOSTS = ["madhudadi.in"];

/** @type {Array<{file:string,line:number,column:number,rule:string,pattern:string,message:string,excerpt?:string}>} */
const violations = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (entry === "node_modules" || entry.startsWith(".")) continue;
      walk(full);
    } else {
      scanFile(full);
    }
  }
}

function scanFile(file) {
  const rel = relative(ROOT, file);
  const base = file.split("/").pop();
  if (SKIP_FILES.has(base)) return;

  // Filename check (also applies to binary assets)
  const lowerBase = base.toLowerCase();
  for (const tok of FORBIDDEN_FILENAME_TOKENS) {
    const col = lowerBase.indexOf(tok);
    if (col !== -1) {
      violations.push({
        file: rel,
        line: 0,
        column: 0,
        rule: "forbidden-filename-token",
        pattern: tok,
        message: `Filename contains forbidden token "${tok}"`,
        excerpt: base,
      });
    }
  }

  const ext = extname(file).toLowerCase();
  if (!TEXT_EXT.has(ext)) return;

  const text = readFileSync(file, "utf8");
  const lines = text.split("\n");

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const lc = line.toLowerCase();

    // Rule 1: forbidden hosts (substring, case-insensitive)
    for (const host of FORBIDDEN_HOSTS) {
      const col = lc.indexOf(host);
      if (col !== -1) {
        violations.push({
          file: rel,
          line: lineNum,
          column: col + 1,
          rule: "forbidden-host",
          pattern: host,
          message: `Forbidden image host "${host}"`,
          excerpt: line,
        });
      }
    }

    // Rule 2: external image URLs not on the own-host allowlist
    const urlRe = /https?:\/\/([^\s"'`)<>]+?\.(?:jpg|jpeg|png|webp|gif|avif))/gi;
    let m;
    while ((m = urlRe.exec(line)) !== null) {
      const url = m[0];
      const host = m[1].split("/")[0].toLowerCase();
      const allowed = ALLOWED_OWN_HOSTS.some(
        (h) => host === h || host.endsWith("." + h),
      );
      if (!allowed) {
        violations.push({
          file: rel,
          line: lineNum,
          column: m.index + 1,
          rule: "external-image-url",
          pattern: url,
          message: `External image URL not on allowlist (host: ${host})`,
          excerpt: line,
        });
      }
    }
  });
}

for (const d of SCAN_DIRS) {
  try { walk(join(ROOT, d)); } catch { /* dir missing — skip */ }
}

function caret(col) {
  return col > 0 ? " ".repeat(col - 1) + "^" : "^";
}

function formatViolation(v, i) {
  const loc = v.line > 0 ? `${v.file}:${v.line}:${v.column}` : v.file;
  const lines = [
    `\n  ${i + 1}. ${loc}`,
    `     rule:    ${v.rule}`,
    `     pattern: ${v.pattern}`,
    `     ${v.message}`,
  ];
  if (v.excerpt && v.line > 0) {
    const trimmed = v.excerpt.replace(/\t/g, " ");
    lines.push(`     > ${trimmed}`);
    lines.push(`       ${caret(v.column)}`);
  } else if (v.excerpt) {
    lines.push(`     > ${v.excerpt}`);
  }
  return lines.join("\n");
}

if (violations.length) {
  console.error(
    `\n❌ Image guard failed — ${violations.length} forbidden image source(s) detected:`,
  );
  violations.forEach((v, i) => console.error(formatViolation(v, i)));

  // Grouped summary
  const byRule = violations.reduce((acc, v) => {
    acc[v.rule] = (acc[v.rule] || 0) + 1;
    return acc;
  }, {});
  console.error("\nSummary by rule:");
  for (const [rule, count] of Object.entries(byRule)) {
    console.error(`  • ${rule}: ${count}`);
  }

  console.error(
    "\nOnly the uploaded portrait (or derived crops self-hosted on madhudadi.in) is allowed.\n" +
    "Update scripts/check-images.mjs if a new allowlist entry is genuinely needed.\n",
  );
  process.exit(1);
}

console.log("✅ Image guard passed — no placeholder, stock, or disallowed external images found.");
