import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/ui/theme/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Partner Portal V2",
  description: "Lead Management Portal",
};

function AuthProvider({ children }: { children: React.ReactNode }) {
  'use client'
  return (
    <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={true}>
      {children}
    </SessionProvider>
  )
}

function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  'use client'
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProviderWrapper>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}