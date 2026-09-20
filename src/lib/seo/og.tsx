import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/**
 * Shared branded Open Graph image (plan AD-04). Brand hex values are inlined
 * because ImageResponse cannot read CSS custom properties.
 */
export function renderOgImage({ eyebrow, title }: { eyebrow: string; title: string }) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px",
        background: "#003D1A",
        color: "#FFFFFF",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "14px",
            background: "#00D84A",
            color: "#0B0B0B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "32px",
            fontWeight: 700,
          }}
        >
          U
        </div>
        <div style={{ fontSize: "32px", fontWeight: 700, letterSpacing: "-0.5px" }}>DESIGN</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div
          style={{
            fontSize: "26px",
            color: "#00D84A",
            textTransform: "uppercase",
            letterSpacing: "3px",
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            fontSize: title.length > 48 ? "58px" : "68px",
            fontWeight: 700,
            lineHeight: 1.1,
            maxWidth: "1000px",
          }}
        >
          {title}
        </div>
      </div>
      <div style={{ fontSize: "26px", color: "#C7D4CD" }}>Build. Market. Grow.</div>
    </div>,
    ogSize,
  );
}
