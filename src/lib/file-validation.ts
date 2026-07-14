import type { MediaKind } from "@/types/media";

const IMAGE_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
const VIDEO_MIME_TYPES = new Set(["video/mp4", "video/webm", "video/ogg"]);

export function detectMediaKind(file: File): MediaKind | null {
  if (IMAGE_MIME_TYPES.has(file.type)) {
    return "image";
  }
  if (VIDEO_MIME_TYPES.has(file.type)) {
    return "video";
  }
  return null;
}
