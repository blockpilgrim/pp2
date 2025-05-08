"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface SidebarLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  sidebarClassName?: string;
  contentClassName?: string;
  collapsible?: boolean;
}

export function SidebarLayout({
  sidebar,
  children,
  className,
  sidebarClassName,
  contentClassName,
  collapsible = true,
}: SidebarLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn("flex min-h-screen", className)}>
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-sidebar text-sidebar-foreground border-r transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          sidebarClassName
        )}
      >
        {collapsible && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 m-2 rounded-md hover:bg-sidebar-accent/50 flex items-center justify-center"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              className={cn(
                "h-5 w-5 transition-transform",
                collapsed ? "rotate-0" : "rotate-180"
              )}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 6-6 6 6 6" />
            </svg>
          </button>
        )}
        <div className={collapsed ? "hidden" : "block"}>
          {sidebar}
        </div>
        {collapsed && (
          <div className="flex flex-col items-center pt-4 space-y-4">
            {/* Collapsed version of the menu - can contain icons only */}
            {React.Children.toArray(sidebar)
              .filter(child => React.isValidElement(child) && child.props.icon)
              .map((child, i) => {
                if (React.isValidElement(child) && child.props.icon) {
                  return (
                    <div key={i} className="p-2">
                      {child.props.icon}
                    </div>
                  );
                }
                return null;
              })}
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className={cn("flex-1 overflow-auto", contentClassName)}>
        {children}
      </main>
    </div>
  );
}