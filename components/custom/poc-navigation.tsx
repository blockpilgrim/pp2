"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function PocNavigation() {
  const pathname = usePathname();
  
  const navItems = [
    { name: "Overview", href: "/poc/ui" },
    { name: "Components", href: "/poc/ui" },
    { name: "Forms", href: "/poc/ui/forms" },
    { name: "Data Display", href: "/poc/ui/data-display" },
    { name: "Tables", href: "/poc/ui/tables" },
    { name: "Theme", href: "/poc/ui/theme-switcher" },
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
                  key={item.name} // Changed from item.href to item.name
                  href={item.href}
                  className={cn(
                    "px-3 py-1 rounded-md text-sm transition-colors",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted-foreground/10"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="text-sm text-muted-foreground">
            UI Framework POC
          </div>
        </div>
      </div>
    </div>
  );
}
