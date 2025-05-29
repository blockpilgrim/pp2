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
            { id: 'theme', label: 'Theming', type: 'scroll' },
            { id: 'theme-switcher', label: 'Theme Switcher Demo', type: 'link', href: '/poc/ui/theme-switcher' },
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
            <p className="text-muted-foreground mb-4">
              This showcase demonstrates the UI component library built with shadcn/ui and Tailwind CSS. 
              The components follow consistent design patterns and are customized to match the brand styling.
            </p>
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4">Key features of our UI system:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Consistent design language across all components</li>
                  <li>Dark/light theme support with consistent color variables</li>
                  <li>Accessible components following WCAG guidelines</li>
                  <li>Responsive design for all screen sizes</li>
                  <li>Composition-based component architecture</li>
                </ul>
              </CardContent>
            </Card>
          </Section>

          <Section id="buttons" title="Buttons">
            <ComponentCard 
              title="Button Variants" 
              description="Different button styles for various contexts"
            >
              <div className="flex flex-wrap gap-4">
                <Button>Default</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </ComponentCard>

            <ComponentCard 
              title="Button Sizes" 
              description="Different button sizes for various contexts"
            >
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button>Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">
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
                <Button>Normal</Button>
                <Button disabled>Disabled</Button>
                <Button className="hover:bg-primary">Hovered (Hover me)</Button>
                <Button className="focus:ring-2">Focused (Click me)</Button>
              </div>
            </ComponentCard>
          </Section>

          <Section id="inputs" title="Inputs">
            <ComponentCard 
              title="Input Types" 
              description="Various input fields for different data types"
            >
              <div className="space-y-4">
                <Input type="text" placeholder="Text input" />
                <Input type="email" placeholder="Email input" />
                <Input type="password" placeholder="Password input" />
                <Input type="number" placeholder="Number input" />
                <Input type="date" />
              </div>
            </ComponentCard>

            <ComponentCard 
              title="Input States" 
              description="Different input states for form validation"
            >
              <div className="space-y-4">
                <Input placeholder="Default input" />
                <Input placeholder="Disabled input" disabled />
                <Input placeholder="Input with error" aria-invalid={true} />
                <div className="flex items-center space-x-2">
                  <Input placeholder="With button" />
                  <Button>Submit</Button>
                </div>
              </div>
            </ComponentCard>
          </Section>

          <Section id="cards" title="Cards">
            <ComponentCard 
              title="Card Layouts" 
              description="Different card layouts for content organization"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Simple Card</CardTitle>
                    <CardDescription>With header only</CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Card with Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>This is the card content area</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Full Card</CardTitle>
                    <CardDescription>With all sections</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Card content goes here</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="ghost">Cancel</Button>
                    <Button>Submit</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <p>Card without header or footer</p>
                  </CardContent>
                </Card>
              </div>
            </ComponentCard>
          </Section>

          <Section id="dropdowns" title="Dropdown Menus">
            <ComponentCard 
              title="Dropdown Examples" 
              description="Dropdown menus for navigation and actions"
            >
              <div className="flex flex-wrap gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Basic Dropdown</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Item 1</DropdownMenuItem>
                    <DropdownMenuItem>Item 2</DropdownMenuItem>
                    <DropdownMenuItem>Item 3</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">With Label & Separator</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button>Actions</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </ComponentCard>
          </Section>

          <Section id="theme" title="Theming">
            <ComponentCard
              title="Color Palette"
              description="Brand colors used throughout the application"
            >
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Primary Colors</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    <div className="flex flex-col">
                      <div className="h-14 bg-primary rounded-md"></div>
                      <span className="text-xs mt-1">Primary</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="h-14 bg-secondary rounded-md"></div>
                      <span className="text-xs mt-1">Secondary</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="h-14 bg-accent rounded-md"></div>
                      <span className="text-xs mt-1">Accent</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="h-14 bg-muted rounded-md"></div>
                      <span className="text-xs mt-1">Muted</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="h-14 bg-destructive rounded-md"></div>
                      <span className="text-xs mt-1">Destructive</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">UI Colors</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="flex flex-col">
                      <div className="h-14 bg-background border rounded-md"></div>
                      <span className="text-xs mt-1">Background</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="h-14 bg-foreground rounded-md"></div>
                      <span className="text-xs mt-1">Foreground</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="h-14 bg-card rounded-md border"></div>
                      <span className="text-xs mt-1">Card</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="h-14 border border-border rounded-md"></div>
                      <span className="text-xs mt-1">Border</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Chart Colors</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    <div className="flex flex-col">
                      <div className="h-14 bg-chart-1 rounded-md"></div>
                      <span className="text-xs mt-1">Chart 1</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="h-14 bg-chart-2 rounded-md"></div>
                      <span className="text-xs mt-1">Chart 2</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="h-14 bg-chart-3 rounded-md"></div>
                      <span className="text-xs mt-1">Chart 3</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="h-14 bg-chart-4 rounded-md"></div>
                      <span className="text-xs mt-1">Chart 4</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="h-14 bg-chart-5 rounded-md"></div>
                      <span className="text-xs mt-1">Chart 5</span>
                    </div>
                  </div>
                </div>
              </div>
            </ComponentCard>

            <ComponentCard
              title="Typography"
              description="Text styles and fonts"
            >
              <div className="space-y-4">
                <div>
                  <h1 className="text-4xl font-bold">Heading 1</h1>
                  <p className="text-sm text-muted-foreground">text-4xl font-bold</p>
                </div>
                <div>
                  <h2 className="text-3xl font-semibold">Heading 2</h2>
                  <p className="text-sm text-muted-foreground">text-3xl font-semibold</p>
                </div>
                <div>
                  <h3 className="text-2xl font-medium">Heading 3</h3>
                  <p className="text-sm text-muted-foreground">text-2xl font-medium</p>
                </div>
                <div>
                  <h4 className="text-xl font-medium">Heading 4</h4>
                  <p className="text-sm text-muted-foreground">text-xl font-medium</p>
                </div>
                <div>
                  <p className="text-base">Base paragraph text</p>
                  <p className="text-sm text-muted-foreground">text-base</p>
                </div>
                <div>
                  <p className="text-sm">Small text</p>
                  <p className="text-sm text-muted-foreground">text-sm</p>
                </div>
                <div>
                  <p className="text-xs">Extra small text</p>
                  <p className="text-sm text-muted-foreground">text-xs</p>
                </div>
              </div>
            </ComponentCard>
          </Section>
        </div>
      </main>
    </div>
  );
}