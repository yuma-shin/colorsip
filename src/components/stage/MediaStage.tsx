"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Button, IconButton, Text, Tooltip, VStack } from "@chakra-ui/react";
import { AnimatePresence, motion } from "motion/react";
import { LuCircleAlert, LuFolderOpen, LuUpload } from "react-icons/lu";
import { useColorPicker } from "@/hooks/useColorPicker";
import { useMediaImport } from "@/hooks/useMediaImport";
import { useMediaStore } from "@/stores/useMediaStore";
import { ColorResultCard } from "@/components/color/ColorResultCard";
import { mergeRefs } from "@/lib/mergeRefs";
import { MagnifierOverlay } from "./MagnifierOverlay";
import { VideoControls } from "./VideoControls";

const MotionBox = motion.create(Box);
const MotionButton = motion.create(Button);

export interface MediaStageProps {
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
}

const ACCEPTED_FILE_TYPES =
  "image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm,video/ogg";

export function MediaStage({ canvasRef: externalCanvasRef, videoRef }: MediaStageProps = {}) {
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = externalCanvasRef ?? internalCanvasRef;
  const source = useMediaStore((state) => state.source);
  const { magnifier, pickedColor, handlePointerMove, handlePointerLeave, handleClick } =
    useColorPicker(canvasRef);
  const { error, handleFileSelect, handleDrop, handlePaste } = useMediaImport();

  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 });
  const [isDecoding, setIsDecoding] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(null);
  const setCanvasNode = useCallback((node: HTMLCanvasElement | null) => setCanvasElement(node), []);
  const combinedCanvasRef = mergeRefs(canvasRef, setCanvasNode);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onPaste(event: ClipboardEvent) {
      setIsImporting(true);
      void handlePaste(event).finally(() => setIsImporting(false));
    }
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [handlePaste]);

  useEffect(() => {
    if (!source || source.kind !== "image") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsDecoding(true);
    const image = new Image();
    image.onload = () => {
      canvas.width = source.width;
      canvas.height = source.height;
      const context = canvas.getContext("2d");
      context?.drawImage(image, 0, 0, source.width, source.height);
      setIsDecoding(false);
    };
    image.onerror = () => setIsDecoding(false);
    image.src = source.objectUrl;
  }, [source, canvasRef]);

  async function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setIsImporting(true);
    await handleFileSelect(file);
    setIsImporting(false);
  }

  async function onDrop(event: React.DragEvent<HTMLElement>) {
    setIsDragOver(false);
    setIsImporting(true);
    await handleDrop(event);
    setIsImporting(false);
  }

  const isLoading = isImporting || isDecoding;

  return (
    <VStack align="stretch" gap={4} height="full" width="full" minWidth={0} minHeight={0}>
      <Box
        data-testid="drop-zone"
        position="relative"
        borderWidth="2px"
        borderStyle={source ? "solid" : "dashed"}
        borderColor={isDragOver ? "colorPalette.solid" : "border"}
        colorPalette={isDragOver ? "blue" : undefined}
        backgroundColor={isDragOver ? "colorPalette.subtle" : "bg.panel"}
        borderRadius="lg"
        overflow="hidden"
        boxShadow="sm"
        flex="1"
        width="full"
        minWidth={0}
        minHeight={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
        transition="all 0.15s ease-out"
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={onDrop}
      >
        <canvas
          data-testid="media-canvas"
          ref={combinedCanvasRef}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            width: "auto",
            height: "auto",
            minWidth: 0,
            minHeight: 0,
            cursor: "crosshair",
            display: source ? "block" : "none",
          }}
          onPointerMove={(event) => {
            setPointerPosition({ x: event.clientX, y: event.clientY });
            handlePointerMove(event);
          }}
          onPointerLeave={handlePointerLeave}
          onClick={handleClick}
        />

        {!source && (
          <VStack gap={2} padding={6} textAlign="center">
            <Box fontSize="2xl" color="fg.muted">
              <LuUpload />
            </Box>
            <Text color="fg.muted" fontSize="sm">
              ここに画像・動画をドラッグ&ドロップ、またはクリップボードから貼り付け
            </Text>
            <MotionButton
              size="sm"
              paddingInline={5}
              backgroundColor="fg"
              color="bg"
              onClick={() => inputRef.current?.click()}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              ファイルを選択
            </MotionButton>
            <Text color="fg.subtle" fontSize="xs">
              対応形式: PNG / JPEG / WebP / GIF / MP4 / WebM
            </Text>
          </VStack>
        )}

        {source && (
          <Tooltip.Root openDelay={300}>
            <Tooltip.Trigger asChild>
              <IconButton
                aria-label="別のファイルを選択"
                position="absolute"
                top={2}
                right={2}
                size="sm"
                borderRadius="full"
                backgroundColor="fg"
                color="bg"
                onClick={() => inputRef.current?.click()}
              >
                <LuFolderOpen />
              </IconButton>
            </Tooltip.Trigger>
            <Tooltip.Positioner>
              <Tooltip.Content paddingInline={3} paddingBlock={2}>
                別のファイルを選択
              </Tooltip.Content>
            </Tooltip.Positioner>
          </Tooltip.Root>
        )}

        <input
          ref={inputRef}
          data-testid="file-input"
          type="file"
          accept={ACCEPTED_FILE_TYPES}
          style={{ display: "none" }}
          onChange={onInputChange}
        />

        <MagnifierOverlay
          magnifier={magnifier}
          sourceCanvas={canvasElement}
          clientX={pointerPosition.x}
          clientY={pointerPosition.y}
        />

        {source?.kind === "video" && videoRef && (
          <Box position="absolute" bottom={0} left={0} right={0}>
            <VideoControls videoRef={videoRef} />
          </Box>
        )}

        <AnimatePresence>
          {isLoading && (
            <MotionBox
              position="absolute"
              inset={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
              backgroundColor="blackAlpha.500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Text color="white">読み込み中...</Text>
            </MotionBox>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <MotionBox
              position="absolute"
              top={2}
              left={2}
              right={2}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              borderWidth="1px"
              borderRadius="md"
              padding={2}
              colorPalette="red"
              borderColor="colorPalette.muted"
              backgroundColor="colorPalette.subtle"
            >
              <Box display="flex" alignItems="center" gap={2} color="colorPalette.fg">
                <LuCircleAlert />
                <Text fontSize="sm">{error.message}</Text>
              </Box>
            </MotionBox>
          )}
        </AnimatePresence>
      </Box>
      <Box flexShrink={0}>
        <ColorResultCard color={pickedColor} />
      </Box>
    </VStack>
  );
}
