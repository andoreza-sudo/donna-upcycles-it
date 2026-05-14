import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          background: "#ee7c5a",
          borderRadius: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "24px solid #1a1a1a",
        }}
      >
        {/* outer ring */}
        <div
          style={{
            position: "absolute",
            width: 512,
            height: 512,
            borderRadius: 120,
            border: "8px solid #fffaf0",
            inset: 0,
          }}
        />
        <div
          style={{
            fontFamily: "serif",
            fontSize: 320,
            fontWeight: 700,
            color: "#fffaf0",
            lineHeight: 1,
            letterSpacing: -16,
            paddingBottom: 20,
          }}
        >
          D
        </div>
      </div>
    ),
    { ...size }
  );
}
