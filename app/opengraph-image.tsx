import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const alt = `${SITE_NAME} — revenue leak diagnostic`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          padding: "72px",
          background: "linear-gradient(135deg, #006FC7 0%, #004a8a 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            maxWidth: 900,
          }}
        >
          Find where your business is losing revenue
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 28,
            lineHeight: 1.4,
            opacity: 0.92,
            maxWidth: 820,
          }}
        >
          {SITE_DESCRIPTION}
        </div>
      </div>
    ),
    { ...size }
  );
}
