import React from "react";
import { cn } from "@/lib/utils";

interface GridLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
}

export function GridLayout({
  children,
  className,
  columns = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 4,
  },
  gap = "md",
  ...props
}: GridLayoutProps) {
  // Convert column counts to Tailwind grid classes
  const columnClasses = {
    xs: `grid-cols-${columns.xs}`,
    sm: columns.sm ? `sm:grid-cols-${columns.sm}` : "",
    md: columns.md ? `md:grid-cols-${columns.md}` : "",
    lg: columns.lg ? `lg:grid-cols-${columns.lg}` : "",
    xl: columns.xl ? `xl:grid-cols-${columns.xl}` : "",
  };

  // Gap classes based on size
  const gapClasses = {
    none: "gap-0",
    xs: "gap-2",
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
    xl: "gap-10",
  };

  return (
    <div
      className={cn(
        "grid",
        columnClasses.xs,
        columnClasses.sm,
        columnClasses.md,
        columnClasses.lg,
        columnClasses.xl,
        gapClasses[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}