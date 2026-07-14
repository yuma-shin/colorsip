import { ImageResponse } from "next/og";

export const alt = "ColorSip";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a202c 0%, #2d3748 100%)",
          color: "white",
          fontSize: 64,
          fontWeight: 700,
        }}
      >
        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "#f56565" }} />
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "#48bb78" }} />
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "#4299e1" }} />
        </div>
        <div style={{ display: "flex" }}>ColorSip</div>
        <div style={{ display: "flex", fontSize: 28, fontWeight: 400, marginTop: 16, color: "#a0aec0" }}>
          画像・動画から色を抽出するスポイトツール
        </div>
      </div>
    ),
    { ...size },
  );
}
