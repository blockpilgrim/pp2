"use client";

import { PocNavigation } from "@/components/custom/poc-navigation";
import { ThemeToggle } from "@/components/ui/theme/theme-toggle";

export default function PocLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      <PocNavigation />
      <div className="absolute top-3 right-4">
        <ThemeToggle />
      </div>
      {children}
    </div>
  );
}