import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

const SITE_URL = "https://madhudadi.in/";
const THEME_PURPLE = "#7c3aed";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Extraction
    const title = searchParams.get("title") || "AI & Analytics Portfolio";
    const subtitle = searchParams.get("subtitle") || "Madhu Dadi | AI & Analytics Leader";
    const type = searchParams.get("type") || "page"; // 'case-study' or 'page'
    const tech = searchParams.getAll("tech");

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            backgroundColor: "#09090b", // zinc-950
            backgroundImage: "radial-gradient(circle at 25% 25%, #1e1b4b 0%, transparent 50%), radial-gradient(circle at 75% 75%, #2e1065 0%, transparent 50%)",
            padding: "80px",
            color: "white",
            fontFamily: "sans-serif",
          }}
        >
          {/* Logo / Brand Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: THEME_PURPLE,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "16px",
              }}
            >
              <div style={{ color: "white", fontSize: "24px", fontWeight: "bold" }}>M</div>
            </div>
            <div style={{ fontSize: "24px", fontWeight: "600", letterSpacing: "-0.02em" }}>
              Madhu Dadi <span style={{ color: "#a1a1aa", marginLeft: "8px" }}>/</span>
              <span style={{ color: THEME_PURPLE, marginLeft: "8px" }}>{type === "case-study" ? "Case Study" : "Portfolio"}</span>
            </div>
          </div>

          {/* Main Title */}
          <div
            style={{
              fontSize: "72px",
              fontWeight: "800",
              lineHeight: "1.1",
              letterSpacing: "-0.04em",
              marginBottom: "24px",
              maxWidth: "900px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {title}
          </div>

          {/* Description / Subtitle */}
          <div
            style={{
              fontSize: "32px",
              color: "#a1a1aa", // zinc-400
              marginBottom: "60px",
              maxWidth: "800px",
            }}
          >
            {subtitle}
          </div>

          {/* Tech Stack Pills (if provided) */}
          {tech.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {tech.slice(0, 5).map((item) => (
                <div
                  key={item}
                  style={{
                    backgroundColor: "rgba(124, 58, 237, 0.1)",
                    border: "1px solid rgba(124, 58, 237, 0.3)",
                    color: THEME_PURPLE,
                    padding: "8px 20px",
                    borderRadius: "100px",
                    fontSize: "20px",
                    fontWeight: "600",
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          )}

          {/* Bottom Accent Line */}
          <div
            style={{
              position: "absolute",
              bottom: "0",
              left: "0",
              right: "0",
              height: "8px",
              backgroundColor: THEME_PURPLE,
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
