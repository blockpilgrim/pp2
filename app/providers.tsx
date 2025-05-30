"use client";

import { ThemeProvider } from "@/components/ui/theme/theme-provider";
import { QueryProvider } from "@/lib/queryClient";
import { SessionProvider } from "next-auth/react";
import { StateThemeChecker } from "@/components/custom/theme/state-theme-checker";
import type { Theme } from "@/components/ui/theme/theme-provider";

export function Providers({ 
  children,
  initialTheme 
}: { 
  children: React.ReactNode;
  initialTheme?: Theme;
}) {
  return (
    <ThemeProvider initialTheme={initialTheme}>
      <QueryProvider>
        <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={true}>
          <StateThemeChecker />
          {children}
        </SessionProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}