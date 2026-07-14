import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a202c",
        }}
      >
        <div
          style={{
            width: size.width * 0.55,
            height: size.height * 0.55,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #f56565, #48bb78, #4299e1)",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
