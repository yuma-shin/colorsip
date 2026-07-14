"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { LuCheck } from "react-icons/lu";
import type { ColorValue } from "@/types/color";

export interface ColorResultCardProps {
  color: ColorValue | null;
}

const COPIED_MESSAGE_DURATION_MS = 1500;

type CopyTarget = "HEX" | "RGB";

function rgbLabel(color: ColorValue): string {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

export function ColorResultCard({ color }: ColorResultCardProps) {
  const [copiedTarget, setCopiedTarget] = useState<CopyTarget | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  async function copyToClipboard(value: string, target: CopyTarget) {
    await navigator.clipboard.writeText(value);
    setCopiedTarget(target);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopiedTarget(null), COPIED_MESSAGE_DURATION_MS);
  }

  if (!color) {
    return (
      <Box borderWidth="1px" borderRadius="lg" padding={4} backgroundColor="bg.panel">
        <Text color="fg.muted">まだ色が選択されていません</Text>
      </Box>
    );
  }

  return (
    <Box borderWidth="1px" borderRadius="lg" padding={4} backgroundColor="bg.panel" boxShadow="sm">
      <VStack align="stretch" gap={3}>
        <HStack gap={3}>
          <Box
            width="48px"
            height="48px"
            borderRadius="md"
            backgroundColor={color.hex}
            borderWidth="1px"
            boxShadow="inner"
            flexShrink={0}
          />
          <VStack align="start" gap={0}>
            <Text fontFamily="mono" fontWeight="semibold">
              {color.hex}
            </Text>
            <Text fontFamily="mono" color="fg.muted">
              {rgbLabel(color)}
            </Text>
          </VStack>
        </HStack>
        <HStack gap={3} wrap="wrap">
          <Button
            size="sm"
            paddingInline={5}
            backgroundColor="fg"
            color="bg"
            onClick={() => copyToClipboard(color.hex, "HEX")}
          >
            {copiedTarget === "HEX" ? (
              <>
                <LuCheck /> コピーしました
              </>
            ) : (
              "HEXをコピー"
            )}
          </Button>
          <Button
            size="sm"
            paddingInline={5}
            backgroundColor="fg"
            color="bg"
            onClick={() => copyToClipboard(rgbLabel(color), "RGB")}
          >
            {copiedTarget === "RGB" ? (
              <>
                <LuCheck /> コピーしました
              </>
            ) : (
              "RGBをコピー"
            )}
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
