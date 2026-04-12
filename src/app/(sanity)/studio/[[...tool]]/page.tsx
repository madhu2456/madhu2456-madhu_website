/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Content Studio",
  description: "Sanity Studio content authoring interface.",
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const isStudioEnabled = () => process.env.ENABLE_SANITY_STUDIO !== "false";

// Generate the base studio route for static generation
export function generateStaticParams() {
  return [{ tool: [] }];
}

export default async function StudioPage() {
  if (!isStudioEnabled()) {
    notFound();
  }

  const [{ NextStudio }, { default: config }] = await Promise.all([
    import("next-sanity/studio"),
    import("@/../sanity.config"),
  ]);

  return <NextStudio config={config} />;
}
