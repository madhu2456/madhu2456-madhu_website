const fs = require("node:fs");
const path = require("node:path");

const BUILD_DIR = path.join(__dirname, "..", ".next", "server", "app");

const PAGES = [
  { file: "index.html", route: "/" },
  { file: "profile.html", route: "/profile/" },
  { file: "contact.html", route: "/contact/" },
  { file: "credentials.html", route: "/credentials/" },
  { file: "services.html", route: "/services/" },
  { file: "case-studies.html", route: "/case-studies/" },
  { file: "case-studies/adticks.html", route: "/case-studies/adticks/" },
  {
    file: "case-studies/technical-blog.html",
    route: "/case-studies/technical-blog/",
  },
  {
    file: "case-studies/udemy-enroller-fastapi.html",
    route: "/case-studies/udemy-enroller-fastapi/",
  },
  {
    file: "services/ai-agent-development.html",
    route: "/services/ai-agent-development/",
  },
  {
    file: "services/ai-llm-application-development.html",
    route: "/services/ai-llm-application-development/",
  },
  {
    file: "services/full-stack-ai-product-development.html",
    route: "/services/full-stack-ai-product-development/",
  },
  {
    file: "services/ga4-bigquery-campaign-analytics.html",
    route: "/services/ga4-bigquery-campaign-analytics/",
  },
  {
    file: "services/marketing-analytics-consultant.html",
    route: "/services/marketing-analytics-consultant/",
  },
  {
    file: "services/rag-consultant-india.html",
    route: "/services/rag-consultant-india/",
  },
];

console.log("==================================================");
console.log("🚀 Running Technical SEO Checklist Audit...");
console.log("==================================================\n");

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;
const errorsList = [];

function check(assertionName, condition, errorMessage) {
  totalChecks++;
  if (condition) {
    passedChecks++;
  } else {
    failedChecks++;
    errorsList.push(errorMessage);
    console.log(`  ❌ [FAIL] ${assertionName}: ${errorMessage}`);
  }
}

const titles = {};
const descriptions = {};

// Helper to extract regex matches using matchAll to satisfy linter assignment checks
function extractAll(html, regex) {
  return [...html.matchAll(regex)];
}

for (const { file, route } of PAGES) {
  const filePath = path.join(BUILD_DIR, file);
  console.log(`📄 Auditing Route: ${route} (${file})`);

  if (!fs.existsSync(filePath)) {
    console.log(`  ❌ HTML File does not exist: ${filePath}\n`);
    errorsList.push(`File missing: ${route} (${file})`);
    failedChecks++;
    continue;
  }

  const html = fs.readFileSync(filePath, "utf8");

  // 1. Heading Hierarchy - Single H1 check
  const h1Matches = extractAll(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi);
  check(
    "Single H1 tag",
    h1Matches.length === 1,
    `Route ${route} has ${h1Matches.length} H1 tags (expected exactly 1). Headers found: ${h1Matches.map((m) => `"${m[1].trim()}"`).join(", ")}`,
  );
  if (h1Matches.length === 1) {
    const cleanH1 = h1Matches[0][1].replace(/<[^>]*>/g, "").trim();
    console.log(`  ✅ H1: "${cleanH1}"`);
  }

  // 2. Title check
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  check("Title tag exists", !!titleMatch, `Route ${route} has no <title> tag.`);
  if (titleMatch) {
    const titleVal = titleMatch[1].trim();
    console.log(`  ✅ Title: "${titleVal}"`);
    check(
      "Title is unique",
      !titles[titleVal],
      `Duplicate title detected: "${titleVal}" (found on both ${titles[titleVal]} and ${route})`,
    );
    titles[titleVal] = route;
  }

  // 3. Description check
  // Matches <meta name="description" content="..."/> or <meta content="..." name="description"/>
  const descMatch =
    html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/i) ||
    html.match(/<meta[^>]+content="([^"]*)"[^>]+name="description"/i);
  check(
    "Meta description tag exists",
    !!descMatch,
    `Route ${route} has no meta description.`,
  );
  if (descMatch) {
    const descVal = descMatch[1].trim();
    console.log(
      `  ✅ Description (${descVal.length} chars): "${descVal.substring(0, 60)}..."`,
    );
    check(
      "Meta description length <= 160 characters",
      descVal.length <= 160,
      `Meta description is too long (${descVal.length} chars) on ${route}: "${descVal}"`,
    );
    check(
      "Meta description is unique",
      !descriptions[descVal],
      `Duplicate meta description detected (found on both ${descriptions[descVal]} and ${route})`,
    );
    descriptions[descVal] = route;
  }

  // 4. Canonical Tag check
  const canonicalMatch =
    html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i) ||
    html.match(/<link[^>]+href="([^"]*)"[^>]+rel="canonical"/i);
  check(
    "Canonical tag exists",
    !!canonicalMatch,
    `Route ${route} has no canonical link tag.`,
  );
  if (canonicalMatch) {
    const expectedCanonical = `https://madhudadi.in${route}`;
    const canonicalVal = canonicalMatch[1].trim();
    check(
      "Canonical URL matches expected route URL exactly",
      canonicalVal === expectedCanonical,
      `Canonical mismatch on ${route}. Expected: "${expectedCanonical}", Found: "${canonicalVal}"`,
    );
    if (canonicalVal === expectedCanonical) {
      console.log(`  ✅ Canonical: "${canonicalVal}"`);
    }
  }

  // 5. Open Graph Meta checks
  const ogTitleMatch = html.match(
    /<meta[^>]+(property|name)="og:title"[^>]+content="([^"]*)"/i,
  );
  const ogDescMatch = html.match(
    /<meta[^>]+(property|name)="og:description"[^>]+content="([^"]*)"/i,
  );
  const ogImageMatch = html.match(
    /<meta[^>]+(property|name)="og:image"[^>]+content="([^"]*)"/i,
  );
  const ogUrlMatch = html.match(
    /<meta[^>]+(property|name)="og:url"[^>]+content="([^"]*)"/i,
  );

  check(
    "og:title exists",
    !!ogTitleMatch,
    `Route ${route} is missing og:title`,
  );
  check(
    "og:description exists",
    !!ogDescMatch,
    `Route ${route} is missing og:description`,
  );
  check(
    "og:image exists",
    !!ogImageMatch,
    `Route ${route} is missing og:image`,
  );
  check("og:url exists", !!ogUrlMatch, `Route ${route} is missing og:url`);

  if (ogTitleMatch && ogDescMatch && ogImageMatch && ogUrlMatch) {
    console.log(`  ✅ All core Open Graph tags verified`);
  }

  // 6. Twitter Card Meta checks
  const twitterCardMatch = html.match(
    /<meta[^>]+(property|name)="twitter:card"[^>]+content="([^"]*)"/i,
  );
  const twitterTitleMatch = html.match(
    /<meta[^>]+(property|name)="twitter:title"[^>]+content="([^"]*)"/i,
  );
  const twitterDescMatch = html.match(
    /<meta[^>]+(property|name)="twitter:description"[^>]+content="([^"]*)"/i,
  );
  const twitterImageMatch = html.match(
    /<meta[^>]+(property|name)="twitter:image"[^>]+content="([^"]*)"/i,
  );

  check(
    "twitter:card exists",
    !!twitterCardMatch,
    `Route ${route} is missing twitter:card`,
  );
  check(
    "twitter:title exists",
    !!twitterTitleMatch,
    `Route ${route} is missing twitter:title`,
  );
  check(
    "twitter:description exists",
    !!twitterDescMatch,
    `Route ${route} is missing twitter:description`,
  );
  check(
    "twitter:image exists",
    !!twitterImageMatch,
    `Route ${route} is missing twitter:image`,
  );

  if (
    twitterCardMatch &&
    twitterTitleMatch &&
    twitterDescMatch &&
    twitterImageMatch
  ) {
    console.log(`  ✅ All core Twitter Card tags verified`);
  }

  // 7. Structured Data (JSON-LD) checks
  const jsonLdScripts = extractAll(
    html,
    /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
  );
  check(
    "JSON-LD Schema script exists",
    jsonLdScripts.length > 0,
    `Route ${route} has no JSON-LD schema blocks.`,
  );

  if (jsonLdScripts.length > 0) {
    console.log(`  ✅ Found ${jsonLdScripts.length} JSON-LD schema block(s)`);
    jsonLdScripts.forEach((scriptMatch, idx) => {
      try {
        const rawJson = scriptMatch[1].trim();
        const parsed = JSON.parse(rawJson);
        let schemas = [];
        if (parsed["@graph"]) {
          schemas = parsed["@graph"].map((item) => item["@type"]);
        } else if (Array.isArray(parsed)) {
          schemas = parsed.map((item) => item["@type"]);
        } else {
          schemas = [parsed["@type"]];
        }
        console.log(`    - Block ${idx + 1} Types: ${schemas.join(", ")}`);
        check(`Block ${idx + 1} parsed successfully`, true);
      } catch (err) {
        check(
          `Block ${idx + 1} parsed successfully`,
          false,
          `JSON-LD block ${idx + 1} on ${route} is invalid JSON: ${err.message}`,
        );
      }
    });
  }

  // 8. Semantic Link Anchors checks (Verify that standard <a href> is present and formatted)
  // Let's grab all <a href="..."> elements
  const aMatches = extractAll(html, /<a\b[^>]*href="([^"]*)"/gi);
  const internalLinks = aMatches
    .map((m) => m[1])
    .filter((link) => {
      // Internal relative paths or absolute matching madhudadi.in
      return link.startsWith("/") || link.startsWith("https://madhudadi.in");
    });

  // Verify that there are no empty/broken href targets like "#", "javascript:void(0)", etc. for major navigations
  const invalidInternalLinks = internalLinks.filter((link) => {
    // If it's internal, make sure it doesn't violate trailing slash (except for files, hashes, query params)
    if (
      link.startsWith("/") &&
      !link.includes("#") &&
      !link.includes("?") &&
      link !== "/"
    ) {
      // Must end with slash if not a static file with extension
      const lastSegment = link.split("/").pop();
      if (lastSegment?.includes(".")) {
        return false; // File is fine
      }
      return !link.endsWith("/");
    }
    return false;
  });

  check(
    "Trailing slashes on relative internal links",
    invalidInternalLinks.length === 0,
    `Route ${route} has internal links missing trailing slashes: ${invalidInternalLinks.join(", ")}`,
  );

  console.log(`  ✅ Verified ${internalLinks.length} internal relative links`);
  console.log("");
}

// Check robots.txt and sitemap.xml files
console.log("==================================================");
console.log("🤖 Auditing robots.txt & sitemap.xml...");
console.log("==================================================");

const robotsPath = path.join(BUILD_DIR, "robots.txt.body");
if (fs.existsSync(robotsPath)) {
  const robotsText = fs.readFileSync(robotsPath, "utf8");
  console.log("✅ robots.txt file exists");
  check(
    "robots.txt references sitemap.xml",
    robotsText.includes("Sitemap: https://madhudadi.in/sitemap.xml"),
    "robots.txt missing sitemap.xml link",
  );
  check(
    "robots.txt references blog sitemap",
    robotsText.includes("Sitemap: https://madhudadi.in/blog/sitemap.xml"),
    "robots.txt missing blog sitemap.xml link",
  );
  check(
    "robots.txt allows OAI-SearchBot",
    robotsText.includes("User-Agent: OAI-SearchBot"),
    "robots.txt missing OAI-SearchBot directive",
  );
  check(
    "robots.txt allows PerplexityBot",
    robotsText.includes("User-Agent: PerplexityBot"),
    "robots.txt missing PerplexityBot directive",
  );
  check(
    "robots.txt allows ClaudeBot",
    robotsText.includes("User-Agent: ClaudeBot"),
    "robots.txt missing ClaudeBot directive",
  );
  check(
    "robots.txt allows Googlebot",
    robotsText.includes("User-Agent: Googlebot"),
    "robots.txt missing Googlebot directive",
  );
} else {
  check(
    "robots.txt exists",
    false,
    "robots.txt.body is missing from build output directory",
  );
}

const sitemapPath = path.join(BUILD_DIR, "sitemap.xml.body");
if (fs.existsSync(sitemapPath)) {
  const sitemapText = fs.readFileSync(sitemapPath, "utf8");
  console.log("✅ sitemap.xml file exists");

  // Parse all <loc> nodes in the sitemap
  const locs = extractAll(sitemapText, /<loc>([^<]+)<\/loc>/gi).map(
    (m) => m[1],
  );
  console.log(`  ✅ Found ${locs.length} URLs in sitemap`);

  // Assert exactly 16 URLs
  check(
    "Sitemap lists exactly 16 URLs",
    locs.length === 16,
    `Sitemap has ${locs.length} entries (expected exactly 16).`,
  );

  // Verify all URLs are secure, canonical, and have trailing slashes
  for (const url of locs) {
    check(
      "Sitemap URL starts with https://madhudadi.in",
      url.startsWith("https://madhudadi.in"),
      `Sitemap URL does not use canonical origin: "${url}"`,
    );

    // Except for llms.txt and ai-profile.json, check trailing slashes
    if (!url.endsWith("llms.txt") && !url.endsWith("ai-profile.json")) {
      check(
        `Sitemap URL has trailing slash: ${url}`,
        url.endsWith("/"),
        `Sitemap URL missing trailing slash: "${url}"`,
      );
    }
  }
} else {
  check(
    "sitemap.xml exists",
    false,
    "sitemap.xml.body is missing from build output directory",
  );
}

console.log("\n==================================================");
console.log("📊 Audit Summary:");
console.log(`Total Checks: ${totalChecks}`);
console.log(`Passed: ${passedChecks}`);
console.log(`Failed: ${failedChecks}`);
console.log("==================================================");

if (failedChecks > 0) {
  console.log("\n❌ Audit Failed with the following errors:");
  for (const [idx, err] of errorsList.entries()) {
    console.log(`${idx + 1}. ${err}`);
  }
  process.exit(1);
} else {
  console.log(
    "\n🎉 Technical SEO Audit Passed Successfully with 100% Compliance!",
  );
  process.exit(0);
}
