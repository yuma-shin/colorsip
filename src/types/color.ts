import type { MediaKind } from "./media";

export interface ColorValue {
  r: number;
  g: number;
  b: number;
  hex: string;
}

export interface HistoryEntry {
  id: string;
  color: ColorValue;
  thumbnailDataUrl: string;
  sourceKind: MediaKind;
  capturedAt: string;
}
