const fs = require("fs");
const path = require("path");

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const filesToUpdate = [];
walkDir("f:/Codes/Projects/madhu_portfolio/src/app/(portfolio)", (filePath) => {
  if (filePath.endsWith(".tsx")) {
    filesToUpdate.push(filePath);
  }
});
filesToUpdate.push(
  "f:/Codes/Projects/madhu_portfolio/src/components/PortfolioContent.tsx",
);
filesToUpdate.push(
  "f:/Codes/Projects/madhu_portfolio/src/components/NewPortfolioExperience.tsx",
);

let updatedFiles = 0;

for (const file of filesToUpdate) {
  let content = fs.readFileSync(file, "utf8");
  let changed = false;

  // 1. Destructure sortedNavigationItems
  if (content.includes("await getPortfolioData()")) {
    if (!content.includes("sortedNavigationItems")) {
      // Find the getPortfolioData destruct block
      const regex =
        /const\s*{\s*([^}]+)\s*}\s*=\s*await\s+getPortfolioData\(\)/;
      const match = content.match(regex);
      if (match) {
        const inner = match[1];
        const newInner = inner + ", sortedNavigationItems";
        content = content.replace(match[0], match[0].replace(inner, newInner));
        changed = true;
      } else {
        // Single line destructure?
        const regex2 = /const\s+({[^}]+})\s*=\s*await\s+getPortfolioData\(\)/;
        const match2 = content.match(regex2);
        if (match2) {
          const inner = match2[1];
          const newInner = inner.replace("}", ", sortedNavigationItems }");
          content = content.replace(
            match2[0],
            match2[0].replace(inner, newInner),
          );
          changed = true;
        }
      }
    }
  }

  // 2. Add navigationItems to Header
  if (content.includes("<Header profile={profile} />")) {
    content = content.replace(
      /<Header profile={profile} \/>/g,
      "<Header profile={profile} navigationItems={sortedNavigationItems} />",
    );
    changed = true;
  }

  // 3. Add navigationItems to Footer
  if (content.includes("<Footer ")) {
    if (!content.includes("navigationItems={sortedNavigationItems}")) {
      content = content.replace(
        /<Footer /g,
        "<Footer navigationItems={sortedNavigationItems} ",
      );
      changed = true;
    }
  }

  // Handle NewPortfolioExperience passing to props
  if (
    file.endsWith("PortfolioContent.tsx") &&
    content.includes("<NewPortfolioExperience")
  ) {
    if (!content.includes("navigationItems={sortedNavigationItems}")) {
      content = content.replace(
        /<NewPortfolioExperience/,
        "<NewPortfolioExperience navigationItems={sortedNavigationItems}",
      );
      changed = true;
    }
  }

  // Handle NewPortfolioExperience receiving props
  if (
    file.endsWith("NewPortfolioExperience.tsx") &&
    content.includes("type NewPortfolioExperienceProps = {")
  ) {
    if (!content.includes("navigationItems: NavigationItem[]")) {
      content = content.replace(
        /type NewPortfolioExperienceProps = {/,
        'import type { NavigationItem } from "@/lib/portfolio-data";\ntype NewPortfolioExperienceProps = {\n  navigationItems: NavigationItem[];',
      );
      changed = true;
    }
    if (content.includes("export function NewPortfolioExperience({")) {
      content = content.replace(/profile,/, "profile,\n  navigationItems,");
      content = content.replace(
        /<Header profile={profile} \/>/,
        "<Header profile={profile} navigationItems={navigationItems} />",
      );
      content = content.replace(
        /<Footer /,
        "<Footer navigationItems={navigationItems} ",
      );
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, content, "utf8");
    updatedFiles++;
    console.log(`Updated ${file}`);
  }
}

console.log(`Finished updating ${updatedFiles} files.`);
