import { unified } from "unified";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import GithubSlugger from "github-slugger";
import { toString } from "mdast-util-to-string";

export interface TocEntry {
  id: string;
  title: string;
  level: number;
}

export async function extractTableOfContents(
  markdown: string,
): Promise<TocEntry[]> {
  const slugger = new GithubSlugger();
  const toc: TocEntry[] = [];

  const processor = unified().use(remarkParse);
  const ast = processor.parse(markdown);

  visit(ast, "heading", (node: any) => {
    // Only extract H2 and H3
    if (node.depth === 2 || node.depth === 3) {
      const text = toString(node);

      if (text) {
        const id = slugger.slug(text);
        toc.push({
          id,
          title: text,
          level: node.depth,
        });
      }
    }
  });

  return toc;
}
