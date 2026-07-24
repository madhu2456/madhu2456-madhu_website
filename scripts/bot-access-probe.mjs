#!/usr/bin/env node

/**
 * Bot-access probe — fail if key discovery paths are not 200 for crawler UAs.
 *
 * Usage:
 *   node scripts/bot-access-probe.mjs
 *   SITE_URL=https://madhudadi.in node scripts/bot-access-probe.mjs
 */

const SITE_URL = (process.env.SITE_URL || "https://madhudadi.in").replace(
  /\/$/,
  "",
);
const TIMEOUT_MS = 15_000;

const PATHS = [
  "/robots.txt",
  "/sitemap.xml",
  "/llms.txt",
  "/ai-profile.json",
  "/",
  "/profile/",
  "/case-studies/",
  "/services/",
  "/privacy/",
  "/contact/",
];

const AGENTS = [
  {
    name: "GPTBot",
    ua: "Mozilla/5.0 (compatible; GPTBot/1.0; +https://openai.com/gptbot)",
  },
  {
    name: "OAI-SearchBot",
    ua: "Mozilla/5.0 (compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot)",
  },
  {
    name: "PerplexityBot",
    ua: "Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)",
  },
  {
    name: "Googlebot",
    ua: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  },
];

async function probe(path, ua) {
  const url = `${SITE_URL}${path}`;
  const res = await fetch(url, {
    method: "HEAD",
    headers: { "User-Agent": ua },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    redirect: "follow",
  });
  // Some edges reject HEAD; fall back to GET
  if (res.status === 405 || res.status === 501) {
    const getRes = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": ua },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      redirect: "follow",
    });
    return { url, status: getRes.status };
  }
  return { url, status: res.status };
}

async function main() {
  console.log(`\nBot access probe — ${SITE_URL}\n`);
  const failures = [];

  for (const agent of AGENTS) {
    console.log(`UA: ${agent.name}`);
    for (const path of PATHS) {
      try {
        const { url, status } = await probe(path, agent.ua);
        const ok = status >= 200 && status < 400;
        console.log(`  ${ok ? "OK" : "FAIL"} ${status} ${path}`);
        if (!ok) {
          failures.push(`${agent.name} ${url} → ${status}`);
        }
      } catch (err) {
        console.log(`  FAIL ERR ${path} (${err.message})`);
        failures.push(`${agent.name} ${SITE_URL}${path} → ${err.message}`);
      }
    }
    console.log("");
  }

  // Soft check: robots must not Disallow /cdn-cgi/ (Cloudflare guidance)
  try {
    const robots = await fetch(`${SITE_URL}/robots.txt`, {
      headers: { "User-Agent": AGENTS[0].ua },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const body = await robots.text();
    if (/Disallow:\s*\/cdn-cgi\//i.test(body)) {
      failures.push(
        "robots.txt still Disallow: /cdn-cgi/ (remove; Cloudflare excludes automatically)",
      );
      console.log("FAIL robots.txt still Disallows /cdn-cgi/\n");
    } else {
      console.log("OK robots.txt has no Disallow: /cdn-cgi/\n");
    }
  } catch (err) {
    failures.push(`robots.txt fetch failed: ${err.message}`);
  }

  if (failures.length > 0) {
    console.error(`\n${failures.length} failure(s):`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }

  console.log("All probes passed.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
