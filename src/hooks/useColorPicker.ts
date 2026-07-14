"use client";

import { useRef, useState } from "react";
import { extractPixelColor } from "@/lib/color";
import { createThumbnailDataUrl } from "@/lib/thumbnail";
import { useMediaStore } from "@/stores/useMediaStore";
import { useHistoryStore } from "@/stores/useHistoryStore";
import type { ColorValue } from "@/types/color";

export interface MagnifierState {
  x: number;
  y: number;
  color: ColorValue;
}

export interface UseColorPickerResult {
  magnifier: MagnifierState | null;
  pickedColor: ColorValue | null;
  handlePointerMove(event: React.PointerEvent<HTMLCanvasElement>): void;
  handlePointerLeave(): void;
  handleClick(event: React.PointerEvent<HTMLCanvasElement>): void;
}

function canvasCoordinates(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number,
): { x: number; y: number } | null {
  const rect = canvas.getBoundingClientRect();
  const relativeX = clientX - rect.left;
  const relativeY = clientY - rect.top;
  if (relativeX < 0 || relativeY < 0 || relativeX >= rect.width || relativeY >= rect.height) {
    return null;
  }
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return { x: Math.floor(relativeX * scaleX), y: Math.floor(relativeY * scaleY) };
}

function readPixelColor(canvas: HTMLCanvasElement, x: number, y: number): ColorValue | null {
  const context = canvas.getContext("2d");
  if (!context) return null;
  const imageData = context.getImageData(x, y, 1, 1);
  return extractPixelColor(imageData, 0, 0);
}

export function useColorPicker(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
): UseColorPickerResult {
  const [magnifier, setMagnifier] = useState<MagnifierState | null>(null);
  const [pickedColor, setPickedColor] = useState<ColorValue | null>(null);
  const rafRef = useRef<number | null>(null);
  const videoPlaying = useMediaStore((state) => state.videoPlaying);
  const source = useMediaStore((state) => state.source);
  const addEntry = useHistoryStore((state) => state.addEntry);

  function handlePointerMove(event: React.PointerEvent<HTMLCanvasElement>): void {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { clientX, clientY } = event;

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(() => {
      const coords = canvasCoordinates(canvas, clientX, clientY);
      if (!coords) {
        setMagnifier(null);
        return;
      }
      const color = readPixelColor(canvas, coords.x, coords.y);
      if (!color) {
        setMagnifier(null);
        return;
      }
      setMagnifier({ x: coords.x, y: coords.y, color });
    });
  }

  function handlePointerLeave(): void {
    setMagnifier(null);
  }

  function handleClick(event: React.PointerEvent<HTMLCanvasElement>): void {
    if (videoPlaying) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const coords = canvasCoordinates(canvas, event.clientX, event.clientY);
    if (!coords) return;
    const color = readPixelColor(canvas, coords.x, coords.y);
    if (!color) return;

    setPickedColor(color);
    addEntry({
      id: crypto.randomUUID(),
      color,
      thumbnailDataUrl: createThumbnailDataUrl(canvas, canvas.width, canvas.height),
      sourceKind: source?.kind ?? "image",
      capturedAt: new Date().toISOString(),
    });
  }

  return { magnifier, pickedColor, handlePointerMove, handlePointerLeave, handleClick };
}
