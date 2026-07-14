"use client";

import { useState } from "react";
import { detectMediaKind } from "@/lib/file-validation";
import { useMediaStore } from "@/stores/useMediaStore";
import type { MediaKind } from "@/types/media";

export type MediaImportErrorCode = "unsupported-type" | "decode-error" | "empty-clipboard";

export interface MediaImportError {
  code: MediaImportErrorCode;
  message: string;
}

export interface UseMediaImportResult {
  error: MediaImportError | null;
  handleFileSelect(file: File): Promise<void>;
  handleDrop(event: React.DragEvent<HTMLElement>): Promise<void>;
  handlePaste(event: ClipboardEvent): Promise<void>;
}

function loadImageDimensions(objectUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.width, height: image.height });
    image.onerror = () => reject(new Error("decode-error"));
    image.src = objectUrl;
  });
}

function loadVideoDimensions(objectUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => resolve({ width: video.videoWidth, height: video.videoHeight });
    video.onerror = () => reject(new Error("decode-error"));
    video.src = objectUrl;
  });
}

async function loadDimensions(
  kind: MediaKind,
  objectUrl: string,
): Promise<{ width: number; height: number }> {
  return kind === "image" ? loadImageDimensions(objectUrl) : loadVideoDimensions(objectUrl);
}

export function useMediaImport(): UseMediaImportResult {
  const [error, setError] = useState<MediaImportError | null>(null);
  const setSource = useMediaStore((state) => state.setSource);

  async function importFile(file: File): Promise<void> {
    const kind = detectMediaKind(file);
    if (!kind) {
      setError({ code: "unsupported-type", message: `対応していないファイル形式です: ${file.type || file.name}` });
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    try {
      const { width, height } = await loadDimensions(kind, objectUrl);
      setSource({ kind, objectUrl, width, height });
      setError(null);
    } catch {
      URL.revokeObjectURL(objectUrl);
      setError({ code: "decode-error", message: "ファイルの読み込みに失敗しました" });
    }
  }

  async function handleFileSelect(file: File): Promise<void> {
    await importFile(file);
  }

  async function handleDrop(event: React.DragEvent<HTMLElement>): Promise<void> {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (!file) {
      return;
    }
    await importFile(file);
  }

  async function handlePaste(event: ClipboardEvent): Promise<void> {
    const items = event.clipboardData?.items;
    const imageItem = items ? Array.from(items).find((item) => item.type.startsWith("image/")) : undefined;
    const file = imageItem?.getAsFile();
    if (!file) {
      setError({ code: "empty-clipboard", message: "画像がクリップボードにありません" });
      return;
    }
    await importFile(file);
  }

  return { error, handleFileSelect, handleDrop, handlePaste };
}
