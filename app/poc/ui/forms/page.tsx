"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FormExample } from '@/components/custom/form/form-example';

export default function FormsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Form Components</h1>
      <p className="text-muted-foreground mb-8">
        This page demonstrates our reusable form components built with React Hook Form and Zod validation.
      </p>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Lead Form Example</CardTitle>
          <CardDescription>A complete form example with validation</CardDescription>
        </CardHeader>
        <CardContent>
          <FormExample />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Built with React Hook Form for efficient form state management</li>
              <li>Schema-based validation with Zod</li>
              <li>Accessible form controls with proper labeling</li>
              <li>Responsive design that works on all screen sizes</li>
              <li>Consistent styling with our design system</li>
              <li>Support for all standard form input types</li>
              <li>Comprehensive error messaging</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Implementation Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              The form components are designed to work together as a cohesive system:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <code className="px-1 py-0.5 bg-muted rounded">Form</code> - The main container that provides FormContext
              </li>
              <li>
                <code className="px-1 py-0.5 bg-muted rounded">FormField</code> - Connects form controls to React Hook Form
              </li>
              <li>
                <code className="px-1 py-0.5 bg-muted rounded">FormItem</code> - Groups label, control, description, and error message
              </li>
              <li>
                <code className="px-1 py-0.5 bg-muted rounded">FormLabel</code> - Accessible label component
              </li>
              <li>
                <code className="px-1 py-0.5 bg-muted rounded">FormControl</code> - Wrapper for form inputs with proper ARIA attributes
              </li>
              <li>
                <code className="px-1 py-0.5 bg-muted rounded">FormDescription</code> - Helpful text for form fields
              </li>
              <li>
                <code className="px-1 py-0.5 bg-muted rounded">FormMessage</code> - Displays validation errors
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}