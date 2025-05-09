"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
}

const uiPocNavItems: NavItem[] = [
  { name: "Overview", href: "/poc/ui" },
  { name: "Forms", href: "/poc/ui/forms" },
  { name: "Tables", href: "/poc/ui/tables" },
  // Add other UI POC sub-pages here as they are created
];

export function UiPocSubNavigation() {
  const pathname = usePathname();

  return (
    <nav className="mb-6 flex items-center space-x-2 border-b pb-2">
      {uiPocNavItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
            pathname === item.href
              ? "bg-secondary text-secondary-foreground"
              : "text-muted-foreground hover:bg-secondary/80 hover:text-secondary-foreground"
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
