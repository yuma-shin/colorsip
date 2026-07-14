"use client";

import { useEffect } from "react";
import { Box, Grid, GridItem, HStack, Heading, Text, VStack } from "@chakra-ui/react";
import { MediaStage } from "@/components/stage/MediaStage";
import { HistoryPanel } from "@/components/history/HistoryPanel";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useVideoFrameCapture } from "@/hooks/useVideoFrameCapture";
import { useMediaStore } from "@/stores/useMediaStore";

export function PickerApp() {
  const source = useMediaStore((state) => state.source);
  const { videoRef, canvasRef } = useVideoFrameCapture();

  useEffect(() => {
    const video = videoRef.current;
    if (!video || source?.kind !== "video") return;
    video.src = source.objectUrl;
  }, [source, videoRef]);

  return (
    <Box
      height={{ base: "auto", lg: "100dvh" }}
      overflow={{ base: "visible", lg: "hidden" }}
      display="flex"
      flexDirection="column"
      width="full"
      maxWidth="6xl"
      marginInline="auto"
      paddingBlock={{ base: 4, md: 6 }}
      paddingInline={{ base: 3, md: 6 }}
    >
      <HStack justify="space-between" align="start" marginBottom={{ base: 4, md: 6 }} flexShrink={0}>
        <VStack align="start" gap={0}>
          <Heading size="lg">ColorSip</Heading>
          <Text fontSize="sm" color="fg.muted">
            画像・動画からピクセル単位で色を抽出し、RGB値とカラーコードを取得できるスポイトツール
          </Text>
        </VStack>
        <ThemeToggle />
      </HStack>
      <Grid
        templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
        gap={{ base: 4, md: 6 }}
        flex="1"
        minHeight={0}
        overflow={{ base: "visible", lg: "hidden" }}
      >
        <GridItem minWidth={0} minHeight={0} display="flex" flexDirection="column">
          <video
            ref={videoRef}
            playsInline
            style={{
              position: "fixed",
              width: "1px",
              height: "1px",
              opacity: 0,
              pointerEvents: "none",
              left: "-9999px",
            }}
          />
          <MediaStage canvasRef={canvasRef} videoRef={videoRef} />
        </GridItem>
        <GridItem minWidth={0} minHeight={0} overflow="hidden">
          <HistoryPanel />
        </GridItem>
      </Grid>
    </Box>
  );
}
