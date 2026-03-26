import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "../env";

const client = createClient({
  projectId,
  dataset,
  useCdn: true,
});

const builder = createImageUrlBuilder(client);

export const urlFor = (source: any) => builder.image(source);
