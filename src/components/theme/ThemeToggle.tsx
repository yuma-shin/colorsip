"use client";

import { useSyncExternalStore } from "react";
import { IconButton } from "@chakra-ui/react";
import { useTheme } from "next-themes";
import { LuMoon, LuSun } from "react-icons/lu";

function subscribeNever() {
  return () => {};
}

function useMounted(): boolean {
  return useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <IconButton
      aria-label="テーマ切り替え"
      variant="ghost"
      size="lg"
      borderRadius="full"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <LuMoon /> : <LuSun />}
    </IconButton>
  );
}
