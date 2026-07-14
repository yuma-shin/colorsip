"use client";

import { useEffect, useRef } from "react";
import { Box, Text } from "@chakra-ui/react";
import type { MagnifierState } from "@/hooks/useColorPicker";

export interface MagnifierOverlayProps {
  magnifier: MagnifierState | null;
  sourceCanvas: HTMLCanvasElement | null;
  clientX: number;
  clientY: number;
}

const OVERLAY_SIZE = 96;
const SAMPLE_SIZE = 12;

export function MagnifierOverlay({ magnifier, sourceCanvas, clientX, clientY }: MagnifierOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!magnifier || !sourceCanvas) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!context) return;

    context.imageSmoothingEnabled = false;
    context.clearRect(0, 0, OVERLAY_SIZE, OVERLAY_SIZE);
    const half = SAMPLE_SIZE / 2;
    context.drawImage(
      sourceCanvas,
      magnifier.x - half,
      magnifier.y - half,
      SAMPLE_SIZE,
      SAMPLE_SIZE,
      0,
      0,
      OVERLAY_SIZE,
      OVERLAY_SIZE,
    );
  }, [magnifier, sourceCanvas]);

  if (!magnifier) {
    return null;
  }

  return (
    <Box
      data-testid="magnifier-overlay"
      position="fixed"
      left={`${clientX + 16}px`}
      top={`${clientY + 16}px`}
      pointerEvents="none"
      borderWidth="2px"
      borderRadius="full"
      overflow="hidden"
      width={`${OVERLAY_SIZE}px`}
      height={`${OVERLAY_SIZE}px`}
      zIndex={10}
      boxShadow="md"
      backgroundColor="black"
    >
      <canvas ref={canvasRef} width={OVERLAY_SIZE} height={OVERLAY_SIZE} />
      <Text
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        fontSize="2xs"
        textAlign="center"
        backgroundColor="blackAlpha.700"
        color="white"
      >
        {magnifier.color.hex}
      </Text>
    </Box>
  );
}
