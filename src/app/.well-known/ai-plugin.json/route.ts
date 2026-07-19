import { notFound } from "next/navigation";

// ChatGPT plugins deprecated March 2024, replaced by GPTs and Actions
// (https://openai.com/index/introducing-gpts/). Blog platform handles its own manifest.
// Remove this file entirely once nginx/blog route confirmed.
export const dynamic = "force-static";

export async function GET() {
  notFound();
}
