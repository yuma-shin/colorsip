"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Button, HStack, IconButton, Image, Tooltip, VStack } from "@chakra-ui/react";
import { LuCheck, LuX } from "react-icons/lu";
import type { ColorValue, HistoryEntry } from "@/types/color";

const COPIED_ICON_DURATION_MS = 1500;

export interface HistoryItemProps {
  entry: HistoryEntry;
  onRemove(): void;
}

function rgbLabel(color: ColorValue): string {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

interface CopyableValueProps {
  value: string;
  fontSize: string;
  fontWeight?: string;
  color?: string;
}

function CopyableValue({ value, fontSize, fontWeight, color }: CopyableValueProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  async function handleClick() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), COPIED_ICON_DURATION_MS);
  }

  return (
    <Tooltip.Root openDelay={300}>
      <Tooltip.Trigger asChild>
        <Button
          variant="ghost"
          size="sm"
          height="auto"
          paddingInline={2}
          paddingBlock={1}
          marginInline={-2}
          marginBlock={-1}
          minWidth={0}
          borderRadius="md"
          fontFamily="mono"
          fontSize={fontSize}
          fontWeight={fontWeight}
          color={color}
          justifyContent="flex-start"
          aria-label={copied ? "コピーしました" : `${value} をコピー`}
          onClick={handleClick}
        >
          {copied ? <LuCheck /> : value}
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Positioner>
        <Tooltip.Content paddingInline={3} paddingBlock={2}>
          コピーする
        </Tooltip.Content>
      </Tooltip.Positioner>
    </Tooltip.Root>
  );
}

export function HistoryItem({ entry, onRemove }: HistoryItemProps) {
  return (
    <HStack
      data-testid="history-item"
      gap={3}
      padding={3}
      borderWidth="1px"
      borderRadius="lg"
      borderColor="border"
      backgroundColor="bg.panel"
      justify="space-between"
      transition="all 0.15s ease-out"
      _hover={{ borderColor: "colorPalette.solid", boxShadow: "sm" }}
    >
      <HStack gap={3} minWidth={0}>
        <Image
          src={entry.thumbnailDataUrl}
          alt="履歴サムネイル"
          boxSize="44px"
          borderRadius="md"
          borderWidth="1px"
          objectFit="cover"
          flexShrink={0}
        />
        <Box
          width="24px"
          height="24px"
          borderRadius="full"
          backgroundColor={entry.color.hex}
          borderWidth="1px"
          flexShrink={0}
        />
        <VStack align="start" gap={0} minWidth={0}>
          <CopyableValue value={entry.color.hex} fontSize="md" fontWeight="semibold" />
          <CopyableValue value={rgbLabel(entry.color)} fontSize="sm" color="fg.muted" />
        </VStack>
      </HStack>
      <IconButton
        aria-label="この履歴項目を削除"
        size="sm"
        variant="ghost"
        colorPalette="red"
        borderRadius="full"
        flexShrink={0}
        onClick={onRemove}
      >
        <LuX />
      </IconButton>
    </HStack>
  );
}
