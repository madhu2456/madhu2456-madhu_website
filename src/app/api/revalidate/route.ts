/**
 * Sanity on-demand ISR revalidation webhook
 *
 * Sanity calls this endpoint whenever a document is published, unpublished,
 * or deleted in your Studio.  The route verifies the HMAC signature, then
 * calls revalidatePath() for every page that might display that document.
 *
 * Setup (one-time, in Sanity Manage → API → Webhooks):
 *   URL:     https://madhudadi.in/api/revalidate
 *   Method:  POST
 *   Dataset: production
 *   Trigger: Create, Update, Delete
 *   Secret:  <same value as SANITY_REVALIDATE_SECRET in .env.local / Vercel>
 *   Filter:  (leave empty to revalidate on any document change)
 */
import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

// Sanity webhook signature header
const SIGNATURE_HEADER = "sanity-webhook-signature";

type SanityWebhookBody = {
  _type: string;
  slug?: { current?: string } | null;
};

/**
 * Verify the HMAC-SHA256 signature that Sanity attaches to every webhook.
 * Signature header format: "t=<unix_ms>,v1=<hex_hmac>"
 * Signed payload: "<timestamp>.<raw_body>"
 */
async function verifySignature(
  req: NextRequest,
  secret: string,
): Promise<{ body: SanityWebhookBody | null; isValid: boolean }> {
  try {
    const rawBody = await req.text();
    const sigHeader = req.headers.get(SIGNATURE_HEADER) ?? "";

    // Parse "t=1234567890,v1=abc123..."
    const parts: Record<string, string> = {};
    for (const segment of sigHeader.split(",")) {
      const [key, value] = segment.split("=");
      if (key && value) parts[key] = value;
    }

    const { t: timestamp, v1: receivedHmac } = parts;
    if (!timestamp || !receivedHmac) {
      return { body: null, isValid: false };
    }

    // Reject payloads older than 5 minutes to prevent replay attacks
    const ageMs = Date.now() - Number(timestamp) * 1000;
    if (ageMs > 5 * 60 * 1000) {
      return { body: null, isValid: false };
    }

    const expectedHmac = createHmac("sha256", secret)
      .update(`${timestamp}.${rawBody}`)
      .digest("hex");

    // Constant-time comparison to prevent timing attacks
    const isValid = timingSafeEqual(
      Buffer.from(receivedHmac, "hex"),
      Buffer.from(expectedHmac, "hex"),
    );

    const body: SanityWebhookBody | null = isValid
      ? (JSON.parse(rawBody) as SanityWebhookBody)
      : null;

    return { body, isValid };
  } catch {
    return { body: null, isValid: false };
  }
}

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    console.error("[revalidate] SANITY_REVALIDATE_SECRET is not configured");
    return NextResponse.json(
      { message: "Server misconfiguration" },
      { status: 500 },
    );
  }

  const { body, isValid } = await verifySignature(req, secret);

  if (!isValid || !body) {
    return NextResponse.json(
      { message: "Invalid webhook signature" },
      { status: 401 },
    );
  }

  const { _type: docType, slug } = body;
  const slugValue = slug?.current ?? null;

  console.log(`[revalidate] ${docType}${slugValue ? ` (${slugValue})` : ""}`);

  // Always revalidate the main portfolio page — profile, experience,
  // services, certifications, education, navigation and site settings
  // all render on the homepage.
  revalidatePath("/", "layout");

  // Revalidate machine-readable GEO/AI endpoints (served as route handlers,
  // not RSC pages, but revalidating the layout still clears their ISR cache)
  revalidatePath("/llms.txt");
  revalidatePath("/ai-profile.json");
  revalidatePath("/sitemap.xml");

  // Document-type specific revalidation
  switch (docType) {
    case "project": {
      revalidatePath("/case-studies", "layout");
      if (slugValue) {
        revalidatePath(`/case-studies/${slugValue}`, "page");
      }
      break;
    }

    case "navigation":
    case "siteSettings":
    case "profile": {
      // Already covered by "/" layout revalidation above
      break;
    }

    default:
      // Any other document type (experience, service, certification, education,
      // skill, contact, etc.) — the "/" layout revalidation above is sufficient
      break;
  }

  return NextResponse.json({
    revalidated: true,
    type: docType,
    slug: slugValue,
    now: new Date().toISOString(),
  });
}
