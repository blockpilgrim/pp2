# Partner Portal V2.0 - Decisions Log

This document contains a record of significant architectural and implementation decisions made throughout the Partner Portal V2.0 project development. Each decision includes the problem being addressed, options considered, the final decision, rationale, and implications.

## How to Use This Log

When making new architectural or implementation decisions:

1. Document the problem clearly
2. List the options that were considered
3. State the decision that was made
4. Explain the rationale behind the decision
5. Outline implications for future development

## Decisions

```
Decision: Development Approach - Modular POCs vs Comprehensive Prototype
Problem: Need to determine whether to build separate POCs or a single comprehensive prototype
Options:
- Build a single comprehensive prototype with all features
- Develop separate, focused POCs for key technical areas
- Create a hybrid approach with interconnected POCs
Decision: Implement focused POC modules with clear integration paths
Rationale: 
- Enables targeted demonstrations of specific technical challenges
- Allows faster validation of key technologies and patterns
- Facilitates easier team review of isolated concerns
- Reduces complexity in each development cycle
- Establishes clearer technical boundaries between components
Implications: 
- Requires careful documentation of integration points
- Needs consistent patterns across POCs to ensure future compatibility
- May require refactoring when integrating POCs into a full solution
```

```
Decision: Authentication Flow and Session Management
Problem: Need a secure and user-friendly authentication approach for the Partner Portal
Options:
- Simple JWT-based authentication with basic session management
- Enhanced authentication with role-based access controls and middleware protection
- Third-party identity provider integration with full session management
Decision: Implemented comprehensive Auth.js (NextAuth v5) solution with Microsoft Entra ID and role-based access control
Rationale:
- Provides enterprise-grade security with Microsoft Entra ID integration
- Implements robust RBAC model that can be extended as the application grows
- Uses middleware for route protection, offering both security and flexibility
- Creates reusable patterns for auth-related UI components
- Implements session monitoring and token refresh capabilities
Implications:
- Requires proper configuration of Microsoft Entra ID in all environments
- Authentication flow must be carefully managed to prevent issues across environments
- Role assignments will need to be sourced from an external system in production
```

```
Decision: Token Caching Strategy for Core Infrastructure POC
Problem: Need an efficient way to cache Dataverse API tokens to reduce authentication overhead
Options:
- In-memory caching
- Redis caching
- Database storage
- Azure Key Vault
Decision: Implemented in-memory token caching for POC with clear path to production alternatives
Rationale:
- Simple to implement for demonstration purposes
- Sufficient for development environment
- Clearly documented limitations and production alternatives
Implications:
- Will need to be replaced with Redis or Azure Key Vault in production
- Provides a clean abstraction that can be swapped without changing consumer code
```

```
Decision: Error Handling Pattern
Problem: Need consistent error handling across API routes and client code
Options:
- Ad-hoc error handling in each route
- Generic error middleware
- Centralized error utility functions with typed errors
Decision: Implemented centralized error utilities with typed errors
Rationale:
- Provides consistent error responses across all API routes
- Makes error handling more predictable for frontend code
- Type safety helps prevent errors during development
Implications:
- All API routes should use the error handling utilities
- Frontend code can rely on consistent error structure
```

```
Decision: Environment Variable Validation
Problem: Need to ensure all required environment variables are present and valid
Options:
- Manual validation in application code
- Simple existence checks
- Schema-based validation with Zod
Decision: Implemented Zod schema validation for environment variables
Rationale:
- Provides type safety and runtime validation
- Clear error messages when configuration is missing or invalid
- Separates validation concerns from application logic
Implications:
- All environment access should go through the validated config
- Makes configuration requirements explicit and self-documenting
```

```
Decision: URL Structure and Folder Organization
Problem: The project had an inconsistency between URL structure in documentation and actual implementation
Options:
- Continue using the app/(poc) route group (URLs like /auth-test)
- Follow the documentation and use app/poc/* (URLs like /poc/auth-test)
- Introduce a new structure entirely
Decision: Standardized on app/poc/* to follow documentation specification
Rationale:
- Aligns implementation with documented URL pattern (/poc/*)
- Creates consistency between documentation and code
- Follows Next.js routing conventions more clearly
Implications:
- Provides clearer understanding of URL structure
- Makes it easier to navigate the codebase by having consistent naming
- Avoids confusion for future developers
```

```
Decision: Directory Structure and API Route Patterns Alignment
Problem: Project structure didn't fully align with the documented folder structure and API route patterns
Options:
- Keep the existing structure with d365Client in lib/ and API under /api/core/dataverse
- Reorganize to match documentation with d365Client in lib/clients/ and API under /api/dataverse
- Create a hybrid approach with partial reorganization
Decision: Fully align with documented structure
Rationale:
- Creates consistency between documentation and implementation
- Follows established naming conventions and directory structure
- Improves maintainability by making the codebase predictable
- Adheres to the guiding principles of clarity and maintainability
Implications:
- Requires updating imports across the codebase
- May initially break existing routes if not all references are updated
- Establishes a pattern for future code organization
```

```
Decision: POC Directory Naming Standardization
Problem: POC directory names in app/poc/* had inconsistent naming patterns (auth-test, bff-test, styling-test)
Options:
- Keep existing inconsistent naming (auth-test, bff-test, styling-test)
- Standardize on cleaner names without the "-test" suffix (auth, bff, ui)
- Adopt a completely different naming convention
Decision: Standardize on cleaner POC names without the "-test" suffix
Rationale:
- Creates consistency with documentation which references /poc/auth, /poc/ui, etc.
- Makes URLs cleaner and more professional (e.g., /poc/ui instead of /poc/styling-test)
- Establishes a consistent pattern for future POCs (state, leads)
- Better represents the purpose of each POC as a concept demonstration, not just a test
Implications:
- Required updating references in navigation and documentation
- Simplified the URL structure for better usability
- Helps clarify that these are proper Proof-of-Concept modules, not just test pages
```

```
Decision: API URL Pattern Standardization
Problem: The handoff documentation suggests `/api/{domain}/{action}` URLs (e.g., `/api/leads/list`), but the implementation uses RESTful `/api/{domain}` with HTTP methods
Options:
- Switch to action-based URLs as documented (`/api/leads/list`, `/api/leads/create`)
- Maintain RESTful resource-based approach (`/api/leads` with GET, POST, PATCH)
- Implement hybrid approach with both patterns
Decision: Standardize on RESTful resource-based API URLs with HTTP methods
Rationale:
- Aligns with modern REST API best practices
- Improves developer experience through familiar patterns
- Works seamlessly with Next.js API route handlers
- Enables cleaner code organization by grouping related operations
- Follows guiding principles of clarity, maintainability, and modern best practices
Implications:
- Slight deviation from initial documentation, but more aligned with industry standards
- Increased consistency and maintainability across API endpoints
- Better adherence to the Backend-for-Frontend (BFF) pattern as specified in architecture
- Requires clear documentation of the API design pattern for developers
```

```
Decision: UI Component Architecture and Data Table Implementation
Problem: Need a consistent and flexible way to build UI components, particularly for complex data tables
Options:
- Use basic shadcn/ui components with custom data table implementation
- Integrate TanStack Table with shadcn/ui for advanced data handling
- Use a third-party data grid component with different styling conventions
Decision: Integrated TanStack Table with shadcn/ui components
Rationale:
- TanStack Table provides powerful data handling features while remaining framework-agnostic
- shadcn/ui components offer consistent styling and accessibility features
- The integration preserves the design system's visual consistency
- Provides advanced features like sorting, filtering, pagination without compromising design
- Follows the project's guiding principles of clarity and modern best practices
Implications:
- Requires additional dependencies to be installed (TanStack Table, various Radix UI primitives)
- Creates a stronger coupling between the UI framework and data management
- Provides a reusable pattern for all data-heavy interfaces in the application
- Establishes a comprehensive approach for the Lead Management Mini-App POC
```

```
Decision: POC Navigation Structure Refinement
Problem: The main POC navigation component (`PocNavigation`) was becoming cluttered with links to sub-pages of individual POCs (e.g., UI POC's Forms, Tables). This made top-level navigation less clear, and sub-pages within complex POCs lacked dedicated, contextual navigation.
Options:
- Option 1: Keep all navigation links (top-level POCs and sub-pages) within the single `PocNavigation` component.
- Option 2: Implement hierarchical/dropdown menus within `PocNavigation` for POCs with sub-pages.
- Option 3: Refine `PocNavigation` to only include top-level POCs and introduce separate sub-navigation components for individual POCs with multiple sections (e.g., for UI POC).
Decision: Implemented Option 3. Refined `PocNavigation` to link only to major POC modules (`/poc/core`, `/poc/auth`, `/poc/ui`, `/poc/bff`). Created a new `UiPocSubNavigation` component for UI POC sub-pages (`/poc/ui`, `/poc/ui/forms`, `/poc/ui/tables`, `/poc/ui/data-display`) and integrated it into the `app/poc/ui/layout.tsx`.
Rationale:
- Clarity & Simplicity: Keeps the main `PocNavigation` clean and focused on high-level POC modules.
- Contextual Navigation: Provides clear, dedicated navigation within complex POCs like the UI POC, improving user experience.
- Maintainability & Scalability: Establishes a modular pattern for handling navigation in POCs that might grow to have multiple sub-sections.
- Adherence to Guiding Principles: Aligns with principles of Clarity, Simplicity, and Maintainability.
Implications:
- Establishes a pattern that can be replicated for other POCs if they develop multiple sub-pages.
- Requires maintaining the `PocNavigation` for top-level navigation and specific sub-navigation components (like `UiPocSubNavigation`) as needed.
- The layout file for POCs with sub-navigation (e.g., `app/poc/ui/layout.tsx`) becomes responsible for rendering the relevant sub-navigation component.
```

```
Decision: Global Navigation Implementation
Problem: POC navigation component was only displayed on POC-specific pages, leading to inconsistent navigation experience across the application
Options:
- Keep navigation POC-specific and create a separate global navigation
- Duplicate navigation component in each layout that needs it
- Move POC navigation to root layout to serve as global navigation
Decision: Moved PocNavigation component to root layout, making it the global navigation
Rationale:
- Simplicity: Single navigation component serves entire application
- Consistency: Users see the same navigation on all pages
- Maintainability: One component to update when navigation changes
- Clarity: Clear navigation available throughout the application
Implications:
- Navigation now appears on all pages including home and auth error pages
- Removed redundant login button from home page
- Future navigation updates only need to be made in one place
- Sets pattern for global UI elements
```

```
Decision: Theme-Specific Logo Switching Architecture
Problem: Need to support different logos based on theme/role but maintain clean code structure
Options:
- Remove logo switching logic entirely until needed
- Keep conditional logic in place for future implementation
- Implement complex role-based switching immediately
Decision: Maintain conditional logo switching structure with placeholders for future implementation
Rationale:
- Scalability: Architecture ready for multi-state/role-based branding
- Forward-thinking: Prevents refactoring when actual logos are available
- Clean implementation: Logic is in place but uses same logo for now
- Aligns with multi-state expansion plans mentioned in project purpose
Implications:
- Code includes conditional logic that currently shows same logo
- When different logos are available (e.g., /tn.svg), only image paths need updating
- Establishes pattern for theme/role-based UI variations
```

```
Decision: State-Specific Theming Implementation Approach
Problem: Need to assign state-specific themes based on user's Dynamics 365 Contact record data without modifying D365 schema
Options:
- Option 1: Create separate D365 fields for states and roles
- Option 2: Use prefix notation in existing role field (e.g., "role:admin,state:arkansas")
- Option 3: Allow mixed values with smart parsing
- Option 4: Store JSON structure in the field
Decision: Implemented prefix-based notation approach (Option 2)
Rationale:
- Simplicity: Easy to understand and configure in D365 without schema changes
- Flexibility: Allows both roles and states in a single field
- Backward Compatibility: Maintains support for unprefixed role values
- Clarity: Clear visual distinction between roles and states
- Scalability: Easy to add new prefixes in the future if needed
Implications:
- D365 administrators must use prefix notation when configuring user access
- Parsing logic required in D365ContactService to separate roles from states
- Documentation needed for D365 field configuration format
- Theme suggestions offered automatically based on state assignments
- Cookie-based theme persistence prevents flash on page loads
```

```
Decision: Simplification of Theme Management to D365 State Exclusivity
Problem: The application included manual theme toggling capabilities and a demo page which were complex, had minor UI issues, and were not aligned with the core requirement of D365 state-driven theming.
Options:
- Debug and fix the ThemeToggle component and maintain manual switching.
- Remove all manual theme toggling, the demo page, and simplify to D365 state-driven theming only.
Decision: Removed all manual theme toggling capabilities, the `/poc/ui/theme-switcher` demo page, and associated UI elements. The application's visual theme is now exclusively determined by the user's D365 state via `StateThemeChecker`.
Rationale:
- Alignment with Core User Story: Primary requirement is D365-driven theming.
- Simplified User Experience: Consistent theme based on D365 context.
- Reduced Code Complexity: Eliminates components/pages for manual toggling.
- Focus on D365 as Source of Truth: Reinforces guiding principles.
- Issue Resolution: Sidesteps minor UI issues with `ThemeToggle` by removing the non-essential feature.
Implications:
- `StateThemeChecker` is the sole driver for programmatic theme changes.
- `ThemeProvider` manages theme state, but `StateThemeChecker` dictates the theme.
- D365 state theme always overrides `localStorage`.
- Codebase related to theme management is significantly simplified.
```

## Adding New Decisions

To add a new decision to this log, follow this template:

```
Decision: [Title]
Problem: [Description of the issue being addressed]
Options:
- [Option 1]
- [Option 2]
- [Option 3]
Decision: [What was decided]
Rationale:
- [Reason 1]
- [Reason 2]
- [Reason 3]
Implications:
- [Implication 1]
- [Implication 2]
- [Implication 3]
```

---

*This document should be updated whenever significant architectural or implementation decisions are made.*
