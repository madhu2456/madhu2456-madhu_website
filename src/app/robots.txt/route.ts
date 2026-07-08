import { readFile } from "node:fs/promises";
import path from "node:path";

const ROBOTS_FILE_PATH = path.join(
  process.cwd(),
  "config",
  "robots.production.txt",
);

export async function GET() {
  const body = await readFile(ROBOTS_FILE_PATH, "utf8");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
