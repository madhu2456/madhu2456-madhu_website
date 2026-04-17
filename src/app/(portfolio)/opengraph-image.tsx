import { promises as fs } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getPortfolioData } from "@/lib/portfolio-data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Portfolio";

const IMAGE_MIME_BY_EXTENSION: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
};

const toDataUrlFromPublicAsset = async (assetPath: string) => {
  const normalizedPath = assetPath.replace(/^\/+/, "");
  const absolutePath = path.join(process.cwd(), "public", normalizedPath);
  const imageBytes = await fs.readFile(absolutePath);
  const extension = path.extname(normalizedPath).toLowerCase();
  const mimeType = IMAGE_MIME_BY_EXTENSION[extension] || "image/png";

  return `data:${mimeType};base64,${imageBytes.toString("base64")}`;
};

export default async function OGImage() {
  const { profile } = await getPortfolioData();
  const fullName =
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
    "Portfolio";
  const headline = profile.headline ?? "";
  const siteLabel = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://madhudadi.in"
  ).replace(/^https?:\/\//, "");
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://madhudadi.in"
  ).replace(/\/+$/, "");

  let profileImageUrl: string | null = null;
  if (profile.profileImage) {
    if (/^https?:\/\//.test(profile.profileImage)) {
      profileImageUrl = profile.profileImage;
    } else {
      try {
        profileImageUrl = await toDataUrlFromPublicAsset(profile.profileImage);
      } catch {
        profileImageUrl = `${siteUrl}${profile.profileImage}`;
      }
    }
  }

  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #4c1d95 100%)",
        fontFamily: "sans-serif",
        position: "relative",
      }}
    >
      {/* Decorative blobs — positioned absolute so they don't affect flex flow */}
      <div
        style={{
          position: "absolute",
          top: "-160px",
          right: "-120px",
          width: "520px",
          height: "520px",
          borderRadius: "50%",
          background: "rgba(124,58,237,0.18)",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-120px",
          left: "60px",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          background: "rgba(167,139,250,0.10)",
          display: "flex",
        }}
      />

      {/* Main row */}
      <div
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "space-between",
          padding: "60px 80px",
        }}
      >
        {/* Left — text */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: profileImageUrl ? "680px" : "1020px",
          }}
        >
          {/* URL pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(124,58,237,0.28)",
              border: "1px solid rgba(167,139,250,0.4)",
              borderRadius: "100px",
              padding: "6px 22px",
              marginBottom: "26px",
            }}
          >
            <span
              style={{
                color: "#c4b5fd",
                fontSize: "19px",
                fontWeight: 500,
                display: "flex",
              }}
            >
              {siteLabel}
            </span>
          </div>

          {/* Name */}
          <span
            style={{
              fontSize: "74px",
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.05,
              letterSpacing: "-2px",
              display: "flex",
              marginBottom: "14px",
            }}
          >
            {fullName}
          </span>

          {/* Headline */}
          {headline ? (
            <span
              style={{
                fontSize: "29px",
                fontWeight: 500,
                color: "#a78bfa",
                display: "flex",
                marginBottom: "28px",
              }}
            >
              {headline}
            </span>
          ) : (
            <div style={{ display: "flex", marginBottom: "28px" }} />
          )}

          {/* Accent bar */}
          <div
            style={{
              width: "80px",
              height: "5px",
              borderRadius: "3px",
              background: "linear-gradient(90deg, #7c3aed, #a78bfa)",
              display: "flex",
            }}
          />
        </div>

        {/* Right — avatar */}
        {profileImageUrl && (
          <div
            style={{
              display: "flex",
              width: "220px",
              height: "220px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "5px solid #7c3aed",
              flexShrink: 0,
            }}
          >
            {/* biome-ignore lint/performance/noImgElement: required by Satori/ImageResponse */}
            <img
              src={profileImageUrl}
              width={220}
              height={220}
              style={{ objectFit: "cover", display: "flex" }}
              alt={fullName}
            />
          </div>
        )}
      </div>

      {/* Bottom gradient bar */}
      <div
        style={{
          height: "5px",
          background: "linear-gradient(90deg, #7c3aed, #a855f7, #ec4899)",
          display: "flex",
        }}
      />
    </div>,
    { width: 1200, height: 630 },
  );
}
