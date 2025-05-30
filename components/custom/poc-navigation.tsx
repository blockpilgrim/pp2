"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react'; // Import useSession and signOut
import Image from 'next/image'; // Import Next Image
import { useTheme } from '@/components/ui/theme/theme-provider'; // Import useTheme
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button'; // For Sign In/Out buttons
import { getStateDisplayName } from '@/lib/utils/state-theme-mapping';
import { StateThemeChecker } from '@/components/custom/theme/state-theme-checker'; // Added import

export function PocNavigation() {
  const pathname = usePathname();
  const { data: session, status } = useSession(); // Get session data and status
  const { theme } = useTheme(); // Get current theme
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  const navItems = [
    { name: "Auth POC", href: "/poc/auth" },
    { name: "UI POC", href: "/poc/ui" },
    { name: "BFF POC", href: "/poc/bff" },
    { name: "State POC", href: "/poc/state" },
    // Future POCs like State Management and Leads Mini-App can be added here
  ];

  return (
    <div className="bg-nav text-nav-foreground py-2 mb-6 border-b border-gray-700 sticky top-0 z-10">
      <StateThemeChecker /> {/* Added component */}
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center mr-8 py-2 px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
              aria-label="Partner Portal Home"
            >
              {!hasMounted ? (
                // Fallback for server-side rendering and initial client render before hydration
                // This ensures the server and client render the same initial output.
                <Image 
                  src="/ec-logo.svg" 
                  alt="Partner Portal Logo" 
                  width={70} 
                  height={30} 
                  priority 
                />
              ) : theme === 'light-orange' ? (
                <Image 
                  src="/ectn-logo.svg" 
                  alt="Partner Portal Logo - Orange Theme" 
                  width={70} 
                  height={30} 
                  priority 
                />
              ) : (
                // Default to EC logo for light-green or any other theme once mounted
                <Image 
                  src="/ec-logo.svg" 
                  alt="Partner Portal Logo - Default/Green Theme" 
                  width={70} 
                  height={30} 
                  priority 
                />
              )}
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
                      : "hover:bg-nav-foreground/10"
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
              <span className="text-sm">Loading session...</span>
            )}

            {status === "authenticated" && session?.user && (
              <>
                <Link 
                  href="/profile"
                  className="flex flex-col items-end mr-4 hover:opacity-80 transition-opacity"
                >
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
                  {session.user?.states && session.user.states.length > 0 && (
                    <span className="text-xs text-nav-foreground/70">
                      {session.user.states.map(state => getStateDisplayName(state)).join(', ')}
                    </span>
                  )}
                </Link>
                <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: '/' })} className="text-nav-foreground border-nav-foreground hover:bg-nav-foreground hover:text-nav">
                  Sign Out
                </Button>
              </>
            )}
            {status === "unauthenticated" && (

               <Button variant="outline" size="sm" asChild className="text-nav-foreground border-nav-foreground hover:bg-nav-foreground hover:text-nav">
                 <Link href="/login">Sign In</Link>

               </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
