import { ImageResponse } from "next/og";

export const sizes = [16, 32];

export function generateImageMetadata() {
  return sizes.map((size) => ({
    id: String(size),
    size: { width: size, height: size },
    contentType: "image/png",
  }));
}

export default async function Icon({ id }: { id: string | Promise<string> }) {
  const resolvedId = typeof id === "string" ? id : await id;
  const size = Number(resolvedId);
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
          borderRadius: size >= 32 ? 6 : 3,
        }}
      >
        <div
          style={{
            width: size * 0.55,
            height: size * 0.55,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #f56565, #48bb78, #4299e1)",
          }}
        />
      </div>
    ),
    { width: size, height: size },
  );
}
