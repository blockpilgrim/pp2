# Tailwind CSS & shadcn/ui Component Usage Patterns

This document outlines the recommended patterns and best practices for using Tailwind CSS and shadcn/ui components in the Partner Lead Management Portal.

## Table of Contents

1. [Core Principles](#core-principles)
2. [Component Architecture](#component-architecture)
3. [Styling Patterns](#styling-patterns)
4. [Theme Customization](#theme-customization)
5. [Forms & Validation](#forms--validation)
6. [Responsive Design](#responsive-design)
7. [Accessibility Considerations](#accessibility-considerations)
8. [Performance Optimization](#performance-optimization)

## Core Principles

### Composition Over Inheritance

- **Use small, focused components** that can be composed together
- **Leverage shadcn/ui primitives** as building blocks
- **Create custom components** by composing existing ones

```tsx
// Good: Composing primitive components
function LeadCard({ lead }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{lead.name}</CardTitle>
        <CardDescription>{lead.company}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{lead.description}</p>
      </CardContent>
      <CardFooter>
        <Button>View Details</Button>
      </CardFooter>
    </Card>
  );
}
```

### Consistent Naming Conventions

- **Component names**: PascalCase (e.g., `DataTable`, `FormField`)
- **Utility functions**: camelCase (e.g., `formatDate`, `validateEmail`)
- **CSS class utility functions**: lowercase with hyphens (e.g., `text-primary`, `bg-muted`)
- **Consistent file naming**: kebab-case for files (e.g., `lead-table.tsx`, `auth-provider.tsx`)

## Component Architecture

### Directory Structure

```
components/
├── ui/                 # Primitive shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
├── custom/             # Domain-specific components
│   ├── leads/
│   │   ├── lead-card.tsx
│   │   └── lead-filter.tsx
│   └── auth/
│       └── ...
└── layouts/            # Layout components
    ├── sidebar-layout.tsx
    ├── page-container.tsx
    └── ...
```

### Component Types

1. **UI Primitives** (from shadcn/ui)
   - Basic building blocks like Button, Card, Input
   - Minimal business logic
   - Highly reusable

2. **Composite Components**
   - Combinations of UI primitives
   - May have specific business logic
   - Example: `LeadForm`, `StatusBadge`

3. **Page Sections**
   - Larger components representing page sections
   - May fetch and display data
   - Example: `LeadListSection`, `DashboardStats`

4. **Layout Components**
   - Define page structure
   - Handle responsive layouts
   - Example: `SidebarLayout`, `PageContainer`

## Styling Patterns

### Using Tailwind Utility Classes

- **Prefer inline utility classes** for component-specific styling
- Use `className` prop with `cn()` utility for conditional classes
- Keep styles close to the components they affect

```tsx
// Good: Using utility classes with cn() for conditional styling
<Button 
  className={cn(
    "w-full mb-4",
    isActive && "bg-primary-dark",
    isDisabled && "opacity-50 cursor-not-allowed"
  )}
>
  Submit
</Button>
```

### Custom Components with Variants

- Use Tailwind CSS with `cva` for component variants
- Extract repeated patterns into reusable components

```tsx
// Example of component with variants using cva
const statusBadgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary",
        success: "bg-green-50 text-green-700",
        warning: "bg-yellow-50 text-yellow-700",
        danger: "bg-red-50 text-red-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof statusBadgeVariants> {
  status: string;
}

export function StatusBadge({ status, variant, className, ...props }: StatusBadgeProps) {
  return (
    <div 
      className={cn(statusBadgeVariants({ variant }), className)} 
      {...props}
    >
      {status}
    </div>
  );
}
```

### Avoiding CSS Overrides

- **Avoid using `!important`** or excessive CSS overrides
- Instead, use Tailwind's utility classes and variants
- Extend Tailwind's theme in the configuration file when needed

## Theme Customization

### Managing Color Schemes

- **Use CSS variables** for theme colors defined in globals.css
- Access theme colors using Tailwind's utility classes
- Use `dark:` variant for dark mode styles

```css
/* Defining theme colors in globals.css */
:root {
  --primary: oklch(0.208 0.042 265.755);
  --primary-foreground: oklch(0.984 0.003 247.858);
  /* ... other variables */
}

.dark {
  --primary: oklch(0.929 0.013 255.508);
  --primary-foreground: oklch(0.208 0.042 265.755);
  /* ... other variables */
}
```

```tsx
// Using theme colors in components
<div className="bg-primary text-primary-foreground">
  This uses theme colors
</div>
```

### Theme Provider

- Use the `ThemeProvider` to manage theme state
- Access theme with `useTheme()` hook for dynamic theme switching

```tsx
// Theme switching example
function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  
  return (
    <Button 
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      Toggle Theme
    </Button>
  );
}
```

## Forms & Validation

### Form Components

- **Use React Hook Form** for form state management
- **Use Zod** for schema validation
- **Use shadcn/ui form components** for consistent UI

```tsx
// Form with validation example
const formSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
});

function LeadForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Other form fields */}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

### Input Components

- Use form components consistently throughout the application
- Include proper labels and error messages for accessibility
- Consider creating domain-specific input components for common patterns

## Responsive Design

### Using Tailwind Breakpoints

- **Use responsive prefixes** in Tailwind classes (sm, md, lg, xl)
- **Design for mobile-first**, then add breakpoint variants
- **Avoid fixed widths/heights** where possible

```tsx
// Good: Mobile-first responsive design
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {items.map(item => (
    <Card key={item.id}>
      {/* Card content */}
    </Card>
  ))}
</div>
```

### Responsive Layout Components

- Create layout components that handle responsiveness
- Use CSS Grid and Flexbox for layouts
- Consider common patterns like sidebar collapse on mobile

```tsx
// Example of responsive sidebar layout
<SidebarLayout
  sidebar={<Navigation />}
  collapsible={true}
  collapsedOnMobile={true}
>
  <PageContainer>
    {children}
  </PageContainer>
</SidebarLayout>
```

## Accessibility Considerations

### Keyboard Navigation

- Ensure all interactive elements are keyboard accessible
- Use proper focus styles (provided by shadcn/ui components)
- Test keyboard navigation flows regularly

### Screen Readers

- Use semantic HTML elements
- Include proper ARIA attributes when needed
- Use visually-hidden text for icons and visual-only elements

```tsx
// Good: Icon button with accessible label
<Button variant="icon" aria-label="Delete item">
  <TrashIcon className="h-4 w-4" />
</Button>
```

### Color Contrast

- Ensure sufficient color contrast for text (provided by design tokens)
- Don't rely solely on color to convey information
- Test with color blindness simulators

## Performance Optimization

### Component Optimization

- Use `React.memo()` for expensive components
- Implement virtualization for long lists
- Consider code-splitting for large components

### Reducing CSS Bloat

- Avoid excessive custom CSS
- Leverage Tailwind's built-in utilities before creating custom ones
- Use PurgeCSS (built into Tailwind) to remove unused styles

### Lazy Loading

- Implement lazy loading for off-screen content
- Use Suspense and dynamic imports for code splitting
- Consider using Intersection Observer API for images and content

```tsx
// Lazy loading example
const DashboardCharts = React.lazy(() => import('./DashboardCharts'));

function Dashboard() {
  return (
    <div>
      <React.Suspense fallback={<LoadingSpinner />}>
        <DashboardCharts />
      </React.Suspense>
    </div>
  );
}
```

## How to Contribute to This Guide

This guide is a living document. If you have suggestions for improvements or additions:

1. Submit a PR with your proposed changes
2. Include examples to illustrate your patterns
3. Ensure your patterns align with the project's core principles

---

*Last updated: 2025-05-08*