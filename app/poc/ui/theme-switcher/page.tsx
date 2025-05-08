"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme/theme-toggle';
import { useTheme } from '@/components/ui/theme/theme-provider';
import { Badge } from '@/components/ui/badge';
import { MoonIcon, SunIcon, LaptopIcon } from 'lucide-react';

export default function ThemeSwitcherPage() {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Theme Switching</h1>
      <p className="text-muted-foreground mb-8">
        This page demonstrates the theme switching capability between light and dark modes.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <Card>
          <CardHeader>
            <CardTitle>Theme Toggle Component</CardTitle>
            <CardDescription>Use the dropdown to switch between themes</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <ThemeToggle />
            <p className="text-sm text-muted-foreground mt-4">
              Current theme: <Badge variant="outline">{theme}</Badge>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Direct Theme Selection</CardTitle>
            <CardDescription>Click buttons to change theme directly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Button 
                  variant={theme === "light" ? "default" : "outline"} 
                  onClick={() => setTheme("light")}
                  className="flex items-center justify-center gap-2"
                >
                  <SunIcon className="h-4 w-4" />
                  Light
                </Button>
                <Button 
                  variant={theme === "dark" ? "default" : "outline"} 
                  onClick={() => setTheme("dark")}
                  className="flex items-center justify-center gap-2"
                >
                  <MoonIcon className="h-4 w-4" />
                  Dark
                </Button>
                <Button 
                  variant={theme === "system" ? "default" : "outline"} 
                  onClick={() => setTheme("system")}
                  className="flex items-center justify-center gap-2"
                >
                  <LaptopIcon className="h-4 w-4" />
                  System
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <Card>
          <CardHeader>
            <CardTitle>Light Theme Preview</CardTitle>
            <CardDescription>Components in light mode</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-md bg-white border">
              <h3 className="font-medium mb-2">Light Mode Colors</h3>
              <div className="grid grid-cols-4 gap-2">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-[#0f172a]"></div>
                  <span className="text-xs mt-1">Text</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-[#f8fafc]"></div>
                  <span className="text-xs mt-1">Background</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-[#0f172a]"></div>
                  <span className="text-xs mt-1">Primary</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-[#e2e8f0]"></div>
                  <span className="text-xs mt-1">Muted</span>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-md bg-white border">
              <Button className="mr-2">Primary</Button>
              <Button variant="outline" className="mr-2">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Dark Theme Preview</CardTitle>
            <CardDescription>Components in dark mode</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-md bg-[#0f172a] border border-gray-700 text-white">
              <h3 className="font-medium mb-2">Dark Mode Colors</h3>
              <div className="grid grid-cols-4 gap-2">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-[#f8fafc]"></div>
                  <span className="text-xs mt-1">Text</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-[#0f172a]"></div>
                  <span className="text-xs mt-1">Background</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-[#f1f5f9]"></div>
                  <span className="text-xs mt-1">Primary</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-[#334155]"></div>
                  <span className="text-xs mt-1">Muted</span>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-md bg-[#0f172a] border border-gray-700">
              <Button className="mr-2 bg-white text-black hover:bg-gray-200">Primary</Button>
              <Button className="mr-2 border-white text-white hover:bg-gray-800">Outline</Button>
              <Button className="text-white hover:bg-gray-800">Ghost</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Implementation Details</CardTitle>
          <CardDescription>How the theme switching is implemented</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>The theme system uses a combination of the following:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>React context to provide theme state throughout the application</li>
              <li>localStorage to persist theme preferences</li>
              <li>CSS variables and Tailwind's dark mode support</li>
              <li>Media queries to detect system preferences</li>
            </ul>
            
            <p className="mt-4">The implementation includes:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><code className="px-1 py-0.5 bg-muted rounded">ThemeProvider</code> - Context provider for theme state</li>
              <li><code className="px-1 py-0.5 bg-muted rounded">useTheme</code> - Custom hook for accessing theme state</li>
              <li><code className="px-1 py-0.5 bg-muted rounded">ThemeToggle</code> - UI component for changing themes</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            Tailwind CSS provides excellent support for dark mode via the <code className="px-1 py-0.5 bg-muted rounded">dark:</code> variant.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}