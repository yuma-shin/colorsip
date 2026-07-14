"use client";

import { useEffect, useRef } from "react";
import { useMediaStore } from "@/stores/useMediaStore";

export interface UseVideoFrameCaptureResult {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export function useVideoFrameCapture(): UseVideoFrameCaptureResult {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const setVideoPlaying = useMediaStore((state) => state.setVideoPlaying);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    function drawCurrentFrame() {
      if (!video || !canvas) return;
      const context = canvas.getContext("2d");
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    function onLoadedMetadata() {
      if (!video || !canvas) return;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      drawCurrentFrame();
      // Some browsers have not yet decoded a paintable frame at this point even
      // though dimensions are known. Forcing a tiny seek reliably produces a
      // "seeked" event once the frame is actually decoded and paintable.
      if (video.currentTime === 0) {
        video.currentTime = Math.min(0.001, video.duration || 0.001);
      }
    }

    function onLoadedData() {
      drawCurrentFrame();
    }

    function onPauseOrSeeked() {
      setVideoPlaying(false);
      drawCurrentFrame();
    }

    const supportsRvfc = typeof video.requestVideoFrameCallback === "function";
    let rvfcHandle: number | null = null;

    function rvfcLoop() {
      drawCurrentFrame();
      if (video && !video.paused && !video.ended) {
        rvfcHandle = video.requestVideoFrameCallback(rvfcLoop);
      }
    }

    function onPlay() {
      setVideoPlaying(true);
      if (supportsRvfc && video) {
        rvfcHandle = video.requestVideoFrameCallback(rvfcLoop);
      }
    }

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPauseOrSeeked);
    video.addEventListener("seeked", onPauseOrSeeked);

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPauseOrSeeked);
      video.removeEventListener("seeked", onPauseOrSeeked);
      if (rvfcHandle !== null && typeof video.cancelVideoFrameCallback === "function") {
        video.cancelVideoFrameCallback(rvfcHandle);
      }
    };
  }, [setVideoPlaying]);

  return { videoRef, canvasRef };
}
