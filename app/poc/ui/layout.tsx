"use client";

// Removed import { PocNavigation } from "@/components/custom/poc-navigation";
import { UiPocSubNavigation } from "@/components/custom/ui-poc-sub-navigation"; // Import the new sub-navigation
import { ThemeToggle } from "@/components/ui/theme/theme-toggle";
import { PageContainer } from "@/components/layouts/page-container"; // Import PageContainer

export default function PocLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      {/* <PocNavigation />  Removed this line */}
      <div className="absolute top-3 right-4 z-20"> {/* Ensure ThemeToggle is above other content */}
        <ThemeToggle />
      </div>
      {/* Wrap content including sub-navigation with PageContainer for consistent padding */}
      <PageContainer> 
        <UiPocSubNavigation /> 
        {children}
      </PageContainer>
    </div>
  );
}
