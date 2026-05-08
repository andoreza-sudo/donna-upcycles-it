import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Donna Upcycles It — one-of-one upcycled denim from Portland, OR";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#fffaf0",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: 80,
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        {/* Top-right pill */}
        <div
          style={{
            position: "absolute",
            top: 56,
            right: 72,
            background: "#ee7c5a",
            color: "#fffaf0",
            padding: "14px 28px",
            borderRadius: 9999,
            fontSize: 20,
            border: "2px solid #1a1a1a",
          }}
        >
          donnaupcyclesit.com
        </div>

        {/* Denim-coloured accent stripe */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 12,
            height: "100%",
            background: "#3b5b85",
          }}
        />

        <div style={{ fontSize: 28, color: "#ee7c5a", marginBottom: 20 }}>
          ✿ handmade in portland, oregon
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 400,
            color: "#1a1a1a",
            lineHeight: 0.95,
            letterSpacing: -3,
            marginBottom: 32,
          }}
        >
          Donna
          <br />
          <em style={{ color: "#3b5b85" }}>Upcycles It.</em>
        </div>
        <div style={{ fontSize: 26, color: "#5a5236", maxWidth: 620, lineHeight: 1.4 }}>
          One-of-one upcycled denim jackets, jeans & totes. Each piece
          rescued, reworked, and signed by hand.
        </div>
      </div>
    ),
    { ...size }
  );
}
