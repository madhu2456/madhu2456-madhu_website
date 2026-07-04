import { headers } from "next/headers";
import { serializeJsonLd } from "@/lib/seo/json-ld";

export async function JsonLdScript({ data }: { data: unknown }) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <script
      nonce={nonce}
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is escaped by serializeJsonLd
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
