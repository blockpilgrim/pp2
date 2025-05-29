"use client";

import { ThemeProvider } from "@/components/ui/theme/theme-provider";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={true}>
        {children}
      </SessionProvider>
    </ThemeProvider>
  );
}