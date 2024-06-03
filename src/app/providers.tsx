"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { CacheProvider } from "@chakra-ui/next-js";
import theme from "./theme";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <SessionProvider>
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </SessionProvider>
    </CacheProvider>
  );
}
