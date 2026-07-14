export type MediaKind = "image" | "video";

export interface MediaSource {
  kind: MediaKind;
  objectUrl: string;
  width: number;
  height: number;
}
