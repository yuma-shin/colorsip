"use client";

import { useEffect, useState } from "react";
import { Box, HStack, IconButton, Text } from "@chakra-ui/react";
import { LuPause, LuPlay } from "react-icons/lu";
import { useMediaStore } from "@/stores/useMediaStore";

export interface VideoControlsProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

export function VideoControls({ videoRef }: VideoControlsProps) {
  const videoPlaying = useMediaStore((state) => state.videoPlaying);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    function onLoadedMetadata() {
      setDuration(video?.duration ?? 0);
    }
    function onTimeUpdate() {
      setCurrentTime(video?.currentTime ?? 0);
    }

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("timeupdate", onTimeUpdate);
    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [videoRef]);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (videoPlaying) {
      video.pause();
    } else {
      void video.play();
    }
  }

  function onSeek(event: React.ChangeEvent<HTMLInputElement>) {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Number(event.target.value);
  }

  return (
    <Box
      paddingInline={3}
      paddingBlock={2}
      paddingTop={8}
      background="linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0))"
    >
      <input
        data-testid="seek-bar"
        type="range"
        min={0}
        max={duration}
        value={currentTime}
        onChange={onSeek}
        style={{
          width: "100%",
          accentColor: "var(--chakra-colors-fg)",
          cursor: "pointer",
        }}
      />
      <HStack justify="space-between" marginTop={2}>
        <HStack gap={3}>
          <IconButton
            data-testid="play-pause-button"
            aria-label={videoPlaying ? "一時停止" : "再生"}
            onClick={togglePlay}
            size="sm"
            borderRadius="full"
            backgroundColor="fg"
            color="bg"
            borderWidth="1px"
            borderColor="whiteAlpha.500"
          >
            {videoPlaying ? <LuPause /> : <LuPlay />}
          </IconButton>
          <Text fontSize="sm" fontFamily="mono" color="white">
            {formatTime(currentTime)} / {formatTime(duration)}
          </Text>
        </HStack>
        {videoPlaying && (
          <Text data-testid="playing-hint" color="orange.300" fontSize="sm">
            再生中は色抽出できません
          </Text>
        )}
      </HStack>
    </Box>
  );
}
