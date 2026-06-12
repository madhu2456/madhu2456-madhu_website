# Fix GSC "Alternate page with proper canonical tag" for /blog/

## Changes
- **`src/app/sitemap.ts`**:
  - Modify `const blogUrl = \`\${siteUrl}blog/\`;` to `const blogUrl = \`\${siteUrl}blog\`;`.
  - Update the sub-routes to construct URLs without trailing slashes. For example, change `url: \`\${blogUrl}series/\`` to `url: \`\${blogUrl}/series\``.
  - Ensure all blog-related entries (`/series`, `/tags`, `/posts`, `/ask`) do not have trailing slashes.

## Verification
- Run the build/dev process and inspect the generated `sitemap.xml` to confirm the blog URLs are formatted correctly without trailing slashes (e.g., `https://madhudadi.in/blog`).
