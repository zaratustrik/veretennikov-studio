import { ImageResponse } from "next/og"

export const alt = "Veretennikov Studio — Systems and stories in one brief"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#F9F7F2",
          color: "#0F1A2E",
          padding: "80px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top — masthead */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: "0.18em",
            color: "#79808F",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          <span>Issue №01 · 2026</span>
          <span>Studio Quarterly</span>
          <span>Yekaterinburg · 56°50′N</span>
        </div>

        {/* Middle — wordmark */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 28,
              letterSpacing: "0.04em",
              color: "#79808F",
              fontFamily: "monospace",
            }}
          >
            veretennikov / studio
          </div>
          <div
            style={{
              fontSize: 132,
              fontWeight: 500,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              color: "#0F1A2E",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <span>Systems and stories</span>
            <span style={{ color: "#79808F", fontStyle: "italic" }}>
              in one brief.
            </span>
          </div>
        </div>

        {/* Bottom — accent + URL */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 24,
            borderTop: "1px solid #D6D4CE",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 20,
              color: "#4A5365",
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                background: "#1F4DDE",
                borderRadius: 99,
              }}
            />
            <span style={{ fontFamily: "monospace", letterSpacing: "0.06em" }}>
              AI · Video · Synthesis
            </span>
          </div>
          <div style={{ fontSize: 24, fontFamily: "monospace", color: "#4A5365" }}>
            veretennikov.info
          </div>
        </div>
      </div>
    ),
    size,
  )
}
