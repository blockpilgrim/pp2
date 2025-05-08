# UI Component Library Inventory

This document provides a comprehensive inventory of all UI components available in the Partner Lead Management Portal. Components are organized by category and include usage examples.

## Currently Implemented Components

### Core Components

#### Button
- **File**: `/components/ui/button.tsx`
- **Description**: Versatile button component with multiple variants 
- **Variants**: default, destructive, outline, secondary, ghost, link
- **Sizes**: default, sm, lg, icon
- **Usage**:
```tsx
import { Button } from "@/components/ui/button";

// Default
<Button>Click me</Button>

// Variants
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><IconComponent /></Button>
```

#### Input
- **File**: `/components/ui/input.tsx`
- **Description**: Form input component with validation styling
- **Variants**: default
- **Usage**:
```tsx
import { Input } from "@/components/ui/input";

<Input type="text" placeholder="Enter your name" />
<Input type="email" placeholder="Email address" />
<Input type="password" placeholder="Password" />
<Input aria-invalid={true} /> {/* Shows error state */}
```

#### Card
- **File**: `/components/ui/card.tsx`
- **Description**: Container component for grouping related content
- **Subcomponents**: Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent
- **Usage**:
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <p>Card footer</p>
  </CardFooter>
</Card>
```

#### DropdownMenu
- **File**: `/components/ui/dropdown-menu.tsx`
- **Description**: Menu component for displaying lists of actions or options
- **Subcomponents**: DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, etc.
- **Usage**:
```tsx
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuItem>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Components To Be Implemented

### Layout Components
- **Dialog/Modal**: For displaying focused content that requires user interaction
- **Sheet**: Slide-in panel for additional content or controls
- **Tabs**: For organizing content into multiple sections
- **NavigationMenu**: For primary navigation with dropdown support
- **Sidebar**: Customized navigation sidebar with collapsible sections

### Form Components
- **Form**: Container for form elements with validation support
- **Checkbox**: Selectable option control
- **RadioGroup**: Exclusive selection control
- **Select**: Dropdown selection control
- **Textarea**: Multi-line text input
- **Switch**: Toggle control for binary settings
- **Slider**: Range selection control
- **DatePicker**: Date selection control

### Data Display Components
- **Table**: For displaying structured data
- **Badge**: For status indicators or labels
- **Avatar**: User or entity representation
- **Progress**: Visual indicator of completion
- **Tooltip**: Contextual information on hover
- **Toast**: Temporary notification messages
- **Alert**: Important contextual feedback

### Theme Switching
- **ThemeProvider**: Context provider for theme state
- **ThemeToggle**: Control for switching between light/dark modes

## Component Usage Guidelines

When implementing new components, follow these guidelines:

1. **Consistency**: Maintain consistent API patterns across components
2. **Accessibility**: Ensure all components meet WCAG 2.1 AA standards
3. **Responsiveness**: Design components to work across all screen sizes
4. **Performance**: Consider render optimization for complex components
5. **Composition**: Prefer composition over inheritance
6. **Variants**: Implement consistent variant patterns across similar components

## Implementation Roadmap

1. Implement core layout components (NavigationMenu, Sidebar, Tabs)
2. Add form components with validation integration
3. Develop data display components for the lead management features
4. Create theme switching capabilities
5. Document all components with usage examples

This inventory will be updated as new components are added to the system.