import type { ColorValue } from "@/types/color";

function toHexComponent(value: number): string {
  return value.toString(16).padStart(2, "0");
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${toHexComponent(r)}${toHexComponent(g)}${toHexComponent(b)}`;
}

export function extractPixelColor(imageData: ImageData, x: number, y: number): ColorValue {
  const index = (y * imageData.width + x) * 4;
  const r = imageData.data[index];
  const g = imageData.data[index + 1];
  const b = imageData.data[index + 2];
  return { r, g, b, hex: rgbToHex(r, g, b) };
}
