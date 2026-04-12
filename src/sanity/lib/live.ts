// Querying with "sanityFetch" keeps Draft Mode and live preview behavior wired.
// Render <SanityLive /> only when draft mode is enabled.
import { defineLive } from "next-sanity/live";
import { client } from "./client";

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: process.env.SANITY_API_TOKEN,
  browserToken: process.env.NEXT_PUBLIC_SANITY_BROWSER_TOKEN || false,
});
