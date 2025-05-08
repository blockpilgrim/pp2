"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function UiPocIndex() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">UI Framework & Design System POC</h1>
      <p className="text-muted-foreground mb-8">
        Explore the various components and features of our UI framework built with shadcn/ui and Tailwind CSS.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Components</CardTitle>
            <CardDescription>Basic UI components showcase</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              View our core UI components including buttons, inputs, cards, and dropdown menus.
            </p>
            <Link href="/poc/ui">
              <Button>View Components</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Forms</CardTitle>
            <CardDescription>Form components and validation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Explore form components with React Hook Form and Zod validation.
            </p>
            <Link href="/poc/ui/forms">
              <Button>View Forms</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Data Display</CardTitle>
            <CardDescription>Cards, badges, avatars, and progress indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              See components for displaying and visualizing structured data.
            </p>
            <Link href="/poc/ui/data-display">
              <Button>View Data Display</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Advanced Tables</CardTitle>
            <CardDescription>Interactive data tables with TanStack Table</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Explore advanced data tables with sorting, filtering, and bulk actions.
            </p>
            <Link href="/poc/ui/tables">
              <Button>View Tables</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Theme Switching</CardTitle>
            <CardDescription>Light and dark mode implementation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              See how theme switching is implemented with context and CSS variables.
            </p>
            <Link href="/poc/ui/theme-switcher">
              <Button>View Theme Switcher</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Documentation</CardTitle>
            <CardDescription>Usage guides and best practices</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Learn about our component patterns, styling conventions, and best practices.
            </p>
            <div className="flex flex-col space-y-2">
              <Link href="/lib/docs/component-inventory.md" target="_blank">
                <Button variant="outline" className="w-full justify-start">Component Inventory</Button>
              </Link>
              <Link href="/lib/docs/component-patterns.md" target="_blank">
                <Button variant="outline" className="w-full justify-start">Usage Patterns</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}