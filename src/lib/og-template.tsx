import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

type OgTemplateOptions = {
  title: string;
  subtitle?: string;
  siteLabel?: string;
};

export function createOgImage({
  title,
  subtitle,
  siteLabel,
}: OgTemplateOptions) {
  const label = siteLabel ?? "madhudadi.in";

  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(135deg, #080605 0%, #1a1410 52%, #3a2214 100%)",
        fontFamily: "sans-serif",
        position: "relative",
      }}
    >
      {/* Decorative blobs */}
      <div
        style={{
          position: "absolute",
          top: "-160px",
          right: "-120px",
          width: "520px",
          height: "520px",
          borderRadius: "50%",
          background: "rgba(214,145,55,0.18)",
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
          background: "rgba(255,184,77,0.10)",
          display: "flex",
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: "60px 80px",
          justifyContent: "center",
        }}
      >
        {/* URL pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "rgba(214,145,55,0.22)",
            border: "1px solid rgba(255,184,77,0.38)",
            borderRadius: "100px",
            padding: "6px 22px",
            marginBottom: "26px",
            width: "fit-content",
          }}
        >
          <span
            style={{
              color: "#f5c06a",
              fontSize: "19px",
              fontWeight: 500,
              display: "flex",
            }}
          >
            {label}
          </span>
        </div>

        {/* Title */}
        <span
          style={{
            fontSize: title.length > 50 ? "48px" : "62px",
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.1,
            letterSpacing: "-1.5px",
            display: "flex",
            marginBottom: subtitle ? "18px" : "0",
            maxWidth: "900px",
          }}
        >
          {title}
        </span>

        {/* Subtitle */}
        {subtitle ? (
          <span
            style={{
              fontSize: "26px",
              fontWeight: 500,
              color: "#f5b75a",
              display: "flex",
              marginBottom: "28px",
              maxWidth: "800px",
            }}
          >
            {subtitle}
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
            background: "linear-gradient(90deg, #d69137, #f5c06a)",
            display: "flex",
          }}
        />
      </div>

      {/* Bottom gradient bar */}
      <div
        style={{
          height: "5px",
          background: "linear-gradient(90deg, #d69137, #f5c06a, #a95524)",
          display: "flex",
        }}
      />
    </div>,
    { width: OG_SIZE.width, height: OG_SIZE.height },
  );
}
