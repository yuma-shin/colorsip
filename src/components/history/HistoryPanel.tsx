"use client";

import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { AnimatePresence, motion } from "motion/react";
import { LuTrash2 } from "react-icons/lu";
import { useHistoryStore } from "@/stores/useHistoryStore";
import { HistoryItem } from "./HistoryItem";

const MotionBox = motion.create(Box);

export function HistoryPanel() {
  const entries = useHistoryStore((state) => state.entries);
  const removeEntry = useHistoryStore((state) => state.removeEntry);
  const clear = useHistoryStore((state) => state.clear);

  return (
    <VStack
      align="stretch"
      gap={3}
      height="full"
      minHeight={0}
      borderWidth="1px"
      borderRadius="xl"
      padding={4}
      backgroundColor="bg.panel"
      boxShadow="sm"
    >
      <HStack justify="space-between" flexShrink={0}>
        <Text fontWeight="bold">履歴</Text>
        {entries.length > 0 && (
          <Button size="xs" paddingInline={3} variant="ghost" colorPalette="red" onClick={clear}>
            <LuTrash2 />
            すべて削除
          </Button>
        )}
      </HStack>

      {entries.length === 0 ? (
        <Text color="fg.muted">履歴はまだありません</Text>
      ) : (
        <VStack align="stretch" gap={2} overflowY="auto" flex={1} minHeight={0} padding={1} margin={-1}>
          <AnimatePresence initial={false}>
            {entries.map((entry) => (
              <MotionBox
                key={entry.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <HistoryItem entry={entry} onRemove={() => removeEntry(entry.id)} />
              </MotionBox>
            ))}
          </AnimatePresence>
        </VStack>
      )}
    </VStack>
  );
}
