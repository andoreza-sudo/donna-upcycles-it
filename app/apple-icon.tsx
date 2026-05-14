import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#ee7c5a",
          borderRadius: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "8px solid #1a1a1a",
        }}
      >
        <div
          style={{
            fontFamily: "serif",
            fontSize: 112,
            fontWeight: 700,
            color: "#fffaf0",
            lineHeight: 1,
            letterSpacing: -6,
            paddingBottom: 8,
          }}
        >
          D
        </div>
      </div>
    ),
    { ...size }
  );
}
