"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function UiShowcasePage() {
  const [activeSection, setActiveSection] = useState('overview');

  const Section = ({ id, title, children }: { id: string, title: string, children: React.ReactNode }) => (
    <section id={id} className="mb-16 scroll-mt-24"> {/* Added scroll-mt for better scroll positioning with sticky nav */}
      <h2 className="text-2xl font-bold mb-6 pb-2 border-b">{title}</h2>
      {children}
    </section>
  );

  const ComponentCard = ({ 
    title, 
    description, 
    children 
  }: { 
    title: string, 
    description: string, 
    children: React.ReactNode 
  }) => (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );

  // Function to handle navigation
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r bg-sidebar text-sidebar-foreground p-6 hidden md:block">
        <h1 className="text-xl font-bold mb-6">UI Components</h1>
        <nav className="space-y-1">
          {[
            { id: 'overview', label: 'Overview', type: 'scroll' },
            { id: 'buttons', label: 'Buttons', type: 'scroll' },
            { id: 'inputs', label: 'Inputs', type: 'scroll' },
            { id: 'cards', label: 'Cards', type: 'scroll' },
            { id: 'dropdowns', label: 'Dropdowns', type: 'scroll' },
          ].map((item) => {
            const commonClasses = `block w-full text-left px-4 py-2 rounded-md`;
            const activeClasses = activeSection === item.id && item.type === 'scroll' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/50';
            
            if (item.type === 'link' && item.href) {
              return (
                <Link 
                  key={item.id} 
                  href={item.href} 
                  className={`${commonClasses} ${activeClasses}`}
                >
                  {item.label}
                </Link>
              );
            }
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`${commonClasses} ${activeClasses}`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <Section id="overview" title="UI Framework & Design System POC">
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
                  <p className="text-muted-foreground">
                    Components are copied directly into your codebase, becoming part of your project rather than an external dependency. 
                    This means you can modify, extend, or remove any part of a component to fit your exact needs.
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
          </Section>

          <Section id="buttons" title="Buttons">
            <ComponentCard 
              title="Button Variants" 
              description="Different button styles for various contexts as shipped by shadcn/ui"
            >
              <div className="flex flex-wrap gap-4">
                <Button className="bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200">Default</Button>
                <Button className="bg-red-500 text-zinc-50 hover:bg-red-600 dark:bg-red-900 dark:text-zinc-50 dark:hover:bg-red-800">Destructive</Button>
                <Button className="border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50">Outline</Button>
                <Button className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700">Secondary</Button>
                <Button className="hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50">Ghost</Button>
                <Button className="text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50">Link</Button>
              </div>
            </ComponentCard>

            <ComponentCard 
              title="Button Sizes" 
              description="Different button sizes for various contexts"
            >
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm" className="bg-zinc-900 text-zinc-50 hover:bg-zinc-800">Small</Button>
                <Button className="bg-zinc-900 text-zinc-50 hover:bg-zinc-800">Default</Button>
                <Button size="lg" className="bg-zinc-900 text-zinc-50 hover:bg-zinc-800">Large</Button>
                <Button size="icon" className="bg-zinc-900 text-zinc-50 hover:bg-zinc-800">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </Button>
              </div>
            </ComponentCard>

            <ComponentCard 
              title="Button States" 
              description="Different button states"
            >
              <div className="flex flex-wrap gap-4">
                <Button className="bg-zinc-900 text-zinc-50 hover:bg-zinc-800">Normal</Button>
                <Button disabled className="bg-zinc-900 text-zinc-50 opacity-50">Disabled</Button>
                <Button className="bg-zinc-900 text-zinc-50 hover:bg-zinc-800">Hovered (Hover me)</Button>
                <Button className="bg-zinc-900 text-zinc-50 hover:bg-zinc-800 focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2">Focused (Click me)</Button>
              </div>
            </ComponentCard>
          </Section>

          <Section id="inputs" title="Inputs">
            <ComponentCard 
              title="Input Types" 
              description="Various input fields for different data types as provided by shadcn/ui"
            >
              <div className="space-y-4">
                <Input type="text" placeholder="Text input" className="border-zinc-200 dark:border-zinc-800" />
                <Input type="email" placeholder="Email input" className="border-zinc-200 dark:border-zinc-800" />
                <Input type="password" placeholder="Password input" className="border-zinc-200 dark:border-zinc-800" />
                <Input type="number" placeholder="Number input" className="border-zinc-200 dark:border-zinc-800" />
                <Input type="date" className="border-zinc-200 dark:border-zinc-800" />
              </div>
            </ComponentCard>

            <ComponentCard 
              title="Input States" 
              description="Different input states for form validation"
            >
              <div className="space-y-4">
                <Input placeholder="Default input" className="border-zinc-200 dark:border-zinc-800" />
                <Input placeholder="Disabled input" disabled className="border-zinc-200 dark:border-zinc-800 opacity-50" />
                <Input placeholder="Input with error" aria-invalid={true} className="border-red-500 dark:border-red-500" />
                <div className="flex items-center space-x-2">
                  <Input placeholder="With button" className="border-zinc-200 dark:border-zinc-800" />
                  <Button className="bg-zinc-900 text-zinc-50 hover:bg-zinc-800">Submit</Button>
                </div>
              </div>
            </ComponentCard>
          </Section>

          <Section id="cards" title="Cards">
            <ComponentCard 
              title="Card Layouts" 
              description="Different card layouts for content organization as provided by shadcn/ui"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-zinc-200 dark:border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-zinc-900 dark:text-zinc-50">Simple Card</CardTitle>
                    <CardDescription className="text-zinc-500 dark:text-zinc-400">With header only</CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-zinc-200 dark:border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-zinc-900 dark:text-zinc-50">Card with Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-600 dark:text-zinc-300">This is the card content area</p>
                  </CardContent>
                </Card>

                <Card className="border-zinc-200 dark:border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-zinc-900 dark:text-zinc-50">Full Card</CardTitle>
                    <CardDescription className="text-zinc-500 dark:text-zinc-400">With all sections</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-600 dark:text-zinc-300">Card content goes here</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button className="hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50">Cancel</Button>
                    <Button className="bg-zinc-900 text-zinc-50 hover:bg-zinc-800">Submit</Button>
                  </CardFooter>
                </Card>

                <Card className="border-zinc-200 dark:border-zinc-800">
                  <CardContent className="pt-6">
                    <p className="text-zinc-600 dark:text-zinc-300">Card without header or footer</p>
                  </CardContent>
                </Card>
              </div>
            </ComponentCard>
          </Section>

          <Section id="dropdowns" title="Dropdown Menus">
            <ComponentCard 
              title="Dropdown Examples" 
              description="Dropdown menus for navigation and actions as provided by shadcn/ui"
            >
              <div className="flex flex-wrap gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50">Basic Dropdown</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="border-zinc-200 dark:border-zinc-800">
                    <DropdownMenuItem className="focus:bg-zinc-100 dark:focus:bg-zinc-800">Item 1</DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-zinc-100 dark:focus:bg-zinc-800">Item 2</DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-zinc-100 dark:focus:bg-zinc-800">Item 3</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50">With Label & Separator</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="border-zinc-200 dark:border-zinc-800">
                    <DropdownMenuLabel className="text-zinc-700 dark:text-zinc-300">Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-zinc-200 dark:bg-zinc-800" />
                    <DropdownMenuItem className="focus:bg-zinc-100 dark:focus:bg-zinc-800">Profile</DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-zinc-100 dark:focus:bg-zinc-800">Settings</DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-zinc-200 dark:bg-zinc-800" />
                    <DropdownMenuItem className="focus:bg-zinc-100 dark:focus:bg-zinc-800">Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-zinc-900 text-zinc-50 hover:bg-zinc-800">Actions</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="border-zinc-200 dark:border-zinc-800">
                    <DropdownMenuItem className="focus:bg-zinc-100 dark:focus:bg-zinc-800">Edit</DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-zinc-100 dark:focus:bg-zinc-800">Duplicate</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600 focus:bg-red-100 dark:text-red-400 dark:focus:bg-red-900">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </ComponentCard>
          </Section>
        </div>
      </main>
    </div>
  );
}