import { discoveryBodyResponse } from "@/lib/http-conditional";
import {
  buildGuidesRssXml,
  guidesFeedLastBuildDate,
} from "@/lib/seo/guides-catalog";
import { resolveSiteUrl } from "@/lib/site-url";

export const revalidate = 3600;

export async function GET(request: Request) {
  const siteUrl = `${resolveSiteUrl()}/`;
  const body = buildGuidesRssXml(siteUrl);

  return discoveryBodyResponse(request, body, {
    contentType: "application/rss+xml; charset=utf-8",
    lastModifiedAt: guidesFeedLastBuildDate(),
  });
}
