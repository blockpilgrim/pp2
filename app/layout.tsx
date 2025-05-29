import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PocNavigation } from "@/components/custom/poc-navigation";
import { Providers } from "./providers";
import { getThemeFromCookies } from "@/lib/utils/theme-cookies";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get theme from cookies on the server
  const theme = await getThemeFromCookies();
  
  // Apply theme class to html element based on cookie
  const themeClass = theme === 'light-green' ? 'theme-light-green' : '';
  
  return (
    <html lang="en" className={themeClass} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers initialTheme={theme}>
          <PocNavigation />
          <main className="flex-grow">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}