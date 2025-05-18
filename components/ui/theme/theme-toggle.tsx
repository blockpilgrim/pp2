"use client";

import * as React from "react";
import { Sun, Palette } from "lucide-react"; // Using Palette as a general theme icon

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {/* Using Sun icon as a generic indicator, or Palette could be used too */}
          <Sun className="h-[1.2rem] w-[1.2rem]" /> 
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light-orange")}>
          Light Orange
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("light-green")}>
          Light Green
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}