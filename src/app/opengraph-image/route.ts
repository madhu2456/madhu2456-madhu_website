import OGImage from "../(portfolio)/opengraph-image";

export const runtime = "nodejs";

export function GET() {
  return OGImage();
}
