"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  centered?: boolean;
  paddingX?: boolean;
  paddingY?: boolean;
}

export function PageContainer({
  children,
  className,
  maxWidth = "xl",
  centered = true,
  paddingX = true,
  paddingY = true,
  ...props
}: PageContainerProps) {
  const maxWidthClasses = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    "2xl": "max-w-screen-2xl",
    "full": "max-w-full",
  };

  return (
    <div
      className={cn(
        "w-full",
        maxWidthClasses[maxWidth],
        centered && "mx-auto",
        paddingX && "px-4 sm:px-6 lg:px-8",
        paddingY && "py-6 sm:py-8 lg:py-12",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}