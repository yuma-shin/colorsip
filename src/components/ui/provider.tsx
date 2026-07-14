"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ThemeProvider, type ThemeProviderProps } from "next-themes";

export function Provider(props: React.PropsWithChildren<ThemeProviderProps>) {
  const { children, ...themeProps } = props;
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange {...themeProps}>
      <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
    </ThemeProvider>
  );
}
