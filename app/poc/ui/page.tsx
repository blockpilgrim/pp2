"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function UiShowcasePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">UI Framework & Design System POC</h1>
      <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>What is shadcn/ui?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    shadcn/ui is not a traditional component library that you install as a dependency. Instead, it's a collection of 
                    copy-and-paste components built using Radix UI primitives and styled with Tailwind CSS. This revolutionary approach 
                    gives you complete ownership and control over your component code.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    Components are copied directly into your codebase, becoming part of your project rather than an external dependency. 
                    This means you can modify, extend, or remove any part of a component to fit your exact needs. In other words, shadcn/ui is not a component library—it is how you build <i>your own</i> component library.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Why shadcn/ui is Different</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">🎯 No Black Box Dependencies</h4>
                      <p className="text-sm text-muted-foreground">
                        Unlike traditional libraries where components are hidden in node_modules, shadcn/ui components live in your 
                        codebase. You can see exactly how they work and modify them without workarounds or overrides.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">🔧 True Customization</h4>
                      <p className="text-sm text-muted-foreground">
                        Need to change behavior, add features, or adjust styling? Just edit the component file directly. No fighting 
                        with library limitations or waiting for maintainers to accept your feature requests.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">🚀 Zero Runtime Overhead</h4>
                      <p className="text-sm text-muted-foreground">
                        Components compile to standard React and Tailwind CSS. No additional runtime library code, no CSS-in-JS 
                        overhead, just clean, performant components.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">♿ Accessibility First</h4>
                      <p className="text-sm text-muted-foreground">
                        Built on Radix UI primitives, every component includes proper ARIA attributes, keyboard navigation, and 
                        screen reader support out of the box.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Alignment with Our Guiding Principles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-primary pl-4">
                      <h4 className="font-semibold">Maintainability</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Components are part of your codebase, making them easy to understand, debug, and modify. No need to dig 
                        through node_modules or decipher complex inheritance chains.
                      </p>
                    </div>
                    <div className="border-l-4 border-primary pl-4">
                      <h4 className="font-semibold">Knowledge Sharing</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Developers at all levels can learn from the component implementations. The code is transparent and uses 
                        standard React patterns that are educational and approachable.
                      </p>
                    </div>
                    <div className="border-l-4 border-primary pl-4">
                      <h4 className="font-semibold">Simplicity</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        No complex configuration, no theme providers, no CSS-in-JS runtime. Just React components styled with 
                        Tailwind utility classes that are straightforward to understand and modify.
                      </p>
                    </div>
                    <div className="border-l-4 border-primary pl-4">
                      <h4 className="font-semibold">Stability</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        No dependency version conflicts or breaking changes from library updates. Once a component is in your 
                        codebase, it remains stable unless you choose to update it.
                      </p>
                    </div>
                    <div className="border-l-4 border-primary pl-4">
                      <h4 className="font-semibold">Scalability</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Add only the components you need. Modify them for specific use cases. Build new variants without affecting 
                        other parts of your application. Perfect for multi-state expansion with varying requirements.
                      </p>
                    </div>
                    <div className="border-l-4 border-primary pl-4">
                      <h4 className="font-semibold">Modern Best Practices</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Uses latest React patterns, TypeScript for type safety, Radix UI for accessibility, and Tailwind CSS for 
                        styling. Represents current industry standards without being locked into them.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>The Power of Ownership</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    For a project that requires long-term stability, multi-state customization, and the ability to evolve with 
                    changing requirements, shadcn/ui provides the perfect foundation. It gives us:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li>Complete control over component behavior and styling</li>
                    <li>Freedom from external dependency management</li>
                    <li>Ability to optimize for our specific use cases</li>
                    <li>Clear, readable code that any developer can understand</li>
                    <li>Foundation for building domain-specific components</li>
                  </ul>
                  <p className="mt-4 text-sm text-muted-foreground">
                    This approach ensures that as the Partner Lead Management Portal scales across states, we maintain full 
                    control over our UI layer, can adapt to specific state requirements, and aren't constrained by the 
                    limitations or opinions of external libraries.
                  </p>
                </CardContent>
              </Card>
      </div>
    </div>
  );
}