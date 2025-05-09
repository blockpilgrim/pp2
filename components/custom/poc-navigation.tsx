"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react'; // Import useSession and signOut
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button'; // For Sign In/Out buttons

export function PocNavigation() {
  const pathname = usePathname();
  const { data: session, status } = useSession(); // Get session data and status
  
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
          
          {/* User session information and Sign In/Out */}
          <div className="flex items-center space-x-4">
            {status === "loading" && (
              <span className="text-sm text-muted-foreground">Loading session...</span>
            )}
            {status === "authenticated" && session?.user && (
              <>
                <span className="text-sm">
                  Welcome, {session.user.name || 'User'}
                  {session.user.isD365User === false && ( // Explicitly check for false
                     <span 
                       title="Your Dynamics 365 profile could not be linked. Some features might be limited." 
                       className="ml-1 text-orange-500 cursor-help"
                     >
                       (D365?)
                     </span>
                  )}
                  {session.error && ( // Display if there's a session-level error
                     <span 
                       title={`Session error: ${session.error}`}
                       className="ml-1 text-red-500 cursor-help"
                     >
                       (!)
                     </span>
                  )}
                </span>
                <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: '/' })}>
                  Sign Out
                </Button>
              </>
            )}
            {status === "unauthenticated" && (
               <Button variant="outline" size="sm" asChild>
                 <Link href="/login">Sign In</Link>
               </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
