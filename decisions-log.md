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