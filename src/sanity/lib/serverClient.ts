import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const serverClient = createClient({
  projectId,
  dataset,
  apiVersion,
  // Enable CDN for faster, edge-cached responses on the server.
  // This is safe for public portfolio data.
  useCdn: true,
  token: process.env.SANITY_SERVER_API_TOKEN,
});
