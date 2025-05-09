"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function PocNavigation() {
  const pathname = usePathname();
  
  // Updated navItems to reflect major POC modules
  const navItems = [
    { name: "Core POC", href: "/poc/core" },
    { name: "Auth POC", href: "/poc/auth" },
    { name: "UI POC", href: "/poc/ui" },
    { name: "BFF POC", href: "/poc/bff" },
    // Future POCs like State Management and Leads Mini-App can be added here
  ];

  return (
    <div className="bg-muted py-2 mb-6 border-b sticky top-0 z-10">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="font-medium text-lg mr-6">
              Partner Portal
            </Link>
            <nav className="flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name} 
                  href={item.href}
                  className={cn(
                    "px-3 py-1 rounded-md text-sm transition-colors",
                    // Check if the current pathname starts with the item's href
                    // This handles active state for parent POC routes (e.g., /poc/ui should be active for /poc/ui/forms)
                    // For exact matches like /poc/bff, it will also work.
                    pathname.startsWith(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted-foreground/10"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          {/* Removed the hardcoded "UI Framework POC" text to make the navigation more generic */}
        </div>
      </div>
    </div>
  );
}
