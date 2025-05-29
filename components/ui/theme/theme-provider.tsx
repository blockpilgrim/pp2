"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light-orange" | "light-green";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  initialTheme?: Theme; // Theme from server-side cookie
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "light-green", // Aligned with primary brand default
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light-green", // Aligned with primary brand default
  storageKey = "partner-portal-theme",
  initialTheme,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    // If we have an initial theme from the server, use it
    if (initialTheme) {
      return initialTheme;
    }
    
    // Otherwise, check localStorage (client-side only)
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(storageKey) as Theme | null;
      if (savedTheme) {
        return savedTheme;
      }
    }
    return defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("theme-light-green"); // Remove any existing theme class

    if (theme === "light-green") {
      root.classList.add("theme-light-green");
    }
    // For "light-orange", no class is needed as it's the default via :root in globals.css

  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      // Update localStorage for client-side persistence
      // This provides faster access on subsequent client navigations
      localStorage.setItem(storageKey, newTheme);
      
      // Update cookie for server-side rendering
      // This prevents theme flash on page refresh/initial load
      // Note: httpOnly is false to allow client-side theme switching
      document.cookie = `partner-portal-theme=${newTheme}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      
      // Update React state to trigger re-render
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};