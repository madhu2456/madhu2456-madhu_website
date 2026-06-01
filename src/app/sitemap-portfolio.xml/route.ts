import { NextResponse } from "next/server";

const DEFAULT_SITE_URL = "https://madhudadi.in";

const getSiteUrl = () => {
  const url = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(
    /\/+$/,
    "",
  );
  return `${url}/`;
};

export function GET() {
  return NextResponse.redirect(new URL("/sitemap.xml", getSiteUrl()), 301);
}

export const HEAD = GET;
