# Partner Lead Management Portal V2.0 Handoff Summary

## Project Overview

This document serves as a guide for incremental development of the Partner Lead Management Portal V2.0. It provides a high-level overview of the project goals, guiding principles, and a checklist of features to implement.

### Purpose

The Partner Lead Management Portal V2.0 aims to replace the previous Power Pages implementation with a more scalable, maintainable, and customizable solution using modern web technologies. This rebuild addresses limitations in the previous version and aligns with multi-state expansion plans.

### Guiding Principles

- **Security**: Implement robust authentication, authorization, and data protection
- **Stability**: Build reliable, predictable, and fault-tolerant systems
- **Scalability**: Design for growth and multi-state expansion
- **Maintainability**: Create clean, documented, and modular code
- **Knowledge Sharing**: Build code that's accessible across all experience levels
- **Clarity**: Develop intuitive interfaces and clear code patterns
- **Simplicity**: Favor straightforward solutions over complex ones
- **Modern Best Practices**: Utilize current industry standards and patterns

## Architecture Overview

- **Framework**: Next.js App Router with React Server Components and Client Components
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand for global state, React Hook Form for forms
- **Authentication**: Auth.js (NextAuth v5) with Azure AD
- **Backend Integration**: Backend-for-Frontend pattern via Next.js API Routes
- **Data Handling**: TanStack Query (React Query v5) for data fetching and caching
- **Hosting**: Azure Static Web Apps with CI/CD via Azure DevOps

## Feature Checklist

This checklist represents features organized by POC module, with each module focused on a specific technical concern. We will tackle these POC implementations in the order listed, with each building on the lessons learned from previous POCs.

### ✅ Foundation (Completed)
- [x] Project bootstrapped with Next.js App Router
- [x] Basic authentication setup with Auth.js and Microsoft Entra ID
- [x] Initial API route for Dataverse integration
- [x] Basic UI components with shadcn/ui and Tailwind

### ✅ Core Infrastructure POC
- [x] Complete Dataverse client implementation
- [x] Set up proper environment variable configuration
- [x] Implement token management and caching strategy
- [x] Create centralized error handling utilities
- [x] Add comprehensive API error responses
- [x] Build working demo at `/poc/core` demonstrating data integration

**POC Goal**: Create a robust foundation for secure API communication that demonstrates clean separation of concerns and proper error handling.

### ✅ Authentication & Authorization POC (Completed)
- [x] Complete user authentication flow with session management
- [x] Implement protected routes with middleware
- [x] Add role-based access control (RBAC) demonstration
- [x] Set up proper auth state persistence
- [x] Add CSRF protection
- [x] Create working demo at `/poc/auth` showing complete authentication flow

**POC Goal**: Demonstrate secure authentication patterns and role-based access control that can be integrated into any part of the application.

### 🎨 UI Framework & Design System POC
- [ ] Implement brand theming with Tailwind configuration
- [ ] Create responsive layout components (navigation, sidebar, etc.)
- [ ] Build reusable form components with React Hook Form and validation
- [ ] Add data display components (tables, cards, etc.)
- [ ] Demonstrate theme switching capability
- [ ] Create comprehensive demo at `/poc/ui` showcasing all components

**POC Goal**: Build a comprehensive UI toolkit that demonstrates consistent design patterns and responsive components.

### 🔌 Backend-for-Frontend (BFF) Pattern POC
- [ ] Implement secure API endpoints following the BFF pattern
- [ ] Create examples of different API request types (GET, POST, PATCH)
- [ ] Demonstrate proper error handling and validation
- [ ] Implement authentication and authorization checks
- [ ] Build working demo at `/poc/bff` showing API interactions

**POC Goal**: Demonstrate the Backend-for-Frontend architectural pattern using Next.js API routes to create a secure communication layer between the frontend and backend services.

### 📊 State Management & Data Handling POC
- [ ] Configure Zustand store for global state management
- [ ] Set up TanStack Query client with caching strategies
- [ ] Implement React Query dev tools for debugging
- [ ] Create data validation layer with Zod
- [ ] Demonstrate optimistic updates pattern
- [ ] Build working demo at `/poc/state` showing data flow

**POC Goal**: Establish patterns for state management, data fetching, and validation that can be applied consistently across the application.

### 📋 Lead Management Mini-App POC
- [ ] Implement lead listing page with pagination and filtering
- [ ] Create lead detail view with related data
- [ ] Build lead creation/edit form with validation
- [ ] Add lead status management workflow
- [ ] Implement basic reporting capabilities
- [ ] Create demo at `/poc/leads` demonstrating end-to-end lead management journey

**POC Goal**: Build a small but complete application that integrates all previous POCs to demonstrate a real business workflow.

### 🧪 Testing & Quality Assurance Standards
- [ ] Set up Jest for unit testing
- [ ] Configure React Testing Library for component tests
- [ ] Add Cypress for end-to-end testing (optional)
- [ ] Implement type checking and linting standards
- [ ] Create example tests for each POC module

**Testing Goal**: Establish consistent testing patterns that can be applied across all POC modules.

### 🚀 Deployment & Documentation
- [ ] Set up deployment pipeline example
- [ ] Create documentation for environment configuration
- [ ] Document integration points between POCs 
- [ ] Establish code standards and contribution guidelines

**Documentation Goal**: Ensure each POC is well-documented with clear integration guidance.

## Development Approach

### Modular POC Approach with Integration Path

After careful consideration, we've decided to pursue focused Proof-of-Concept (POC) modules rather than a single comprehensive prototype. This approach offers several advantages:

- **Focused demonstration** of specific technical challenges
- **Faster validation** of key technologies and patterns
- **Easier team review** of isolated concerns
- **Reduced complexity** in each development cycle
- **Clearer technical boundaries** between components

Each POC will be developed as a standalone module with clear integration points and documentation:

1. **Core Infrastructure POC**: Dataverse client, token management, error handling
2. **Authentication POC**: Complete auth flows, RBAC implementation
3. **UI Framework POC**: Component system, theming, layouts
4. **Backend-for-Frontend (BFF) POC**: API endpoints, request/response handling
5. **State Management POC**: Global state, data fetching, caching
6. **Lead Management Mini-App**: Integration of all previous POCs

Each POC will include:
- Independent deployment capabilities
- Integration documentation
- Consistent patterns and libraries
- Minimal but sufficient test coverage

This approach enables targeted demonstrations while maintaining a clear path to integration when ready to build the comprehensive solution.

### Shared Libraries & Folder Structure

To ensure consistency across POCs and facilitate future integration, we'll follow these conventions:

#### URL/Route Structure
- POC demonstration pages: `/poc/{poc-name}` (e.g., `/poc/auth`, `/poc/ui`, `/poc/state`, `/poc/core`)
- API routes: `/api/{domain}/{action}` (e.g., `/api/leads/list`, `/api/auth/roles`)

#### Folder Structure
- `lib/`: Shared utilities and clients
  - `lib/clients/`: API clients (e.g., d365Client.ts)
  - `lib/utils/`: Helper functions
  - `lib/hooks/`: Custom React hooks
  - `lib/types/`: TypeScript interfaces and types
  - `lib/config/`: Configuration (e.g., environment variables)
- `components/`: UI components
  - `components/ui/`: Primitive UI components (from shadcn/ui)
  - `components/custom/`: Domain-specific components
  - `components/layouts/`: Page layouts and containers
- `app/`: Next.js App Router pages and routes
  - `app/api/`: API routes using BFF pattern
  - `app/poc/`: POC demonstration pages
- `styles/`: Global styles and theming

#### Naming Conventions
- Files: kebab-case for general files (e.g., `error-handler.ts`)
- Components: PascalCase for component files and functions (e.g., `LeadCard.tsx`)
- Interfaces: Prefixed with "I" (e.g., `ILead`)
- Types: PascalCase without prefix (e.g., `LeadStatus`)
- Environment variables: Uppercase with underscores, prefixed by domain (e.g., `AUTH_CLIENT_ID`, `DATAVERSE_URL`)

#### Environment Variables
Each POC should document its required environment variables in a `.env.example` file, following this pattern:
```
# Core Infrastructure
DATAVERSE_URL=https://yourtenant.crm.dynamics.com
DATAVERSE_CLIENT_ID=your-client-id
DATAVERSE_CLIENT_SECRET=your-client-secret
DATAVERSE_TENANT_ID=your-tenant-id

# Authentication
AUTH_MICROSOFT_ENTRA_ID_ID=your-client-id
AUTH_MICROSOFT_ENTRA_ID_SECRET=your-client-secret
AUTH_MICROSOFT_ENTRA_ID_ISSUER=https://login.microsoftonline.com/your-tenant-id/v2.0
```

The development of each POC will follow this progression:
1. Backend API implementation
2. Data fetching and state management
3. UI components and interactions
4. Minimal testing and validation

This methodical approach ensures that at each stage, we have working functionality that can be demonstrated and validated.

## Session Planning Guide

This section provides guidance for structuring productive AI conversations to develop each feature area:

### Conversation Structure
1. **Start with Context**: Begin each session by referencing the handoff summary and previous work
2. **Identify Goals**: Clearly specify which feature subset you're targeting in the current session
3. **Establish Requirements**: List specific requirements for the feature being developed
4. **Implementation Strategy**: Discuss approach before diving into code
5. **Code Implementation**: Develop the feature while explaining key decisions
6. **Review & Refine**: Evaluate the implementation against guiding principles
7. **Document**: Update BOTH the Decisions Log and Technical Debt sections for each POC (this is critical for maintaining clear documentation)

### Tips for Effective AI Sessions
- Focus on one conceptual area per conversation
- Provide clear acceptance criteria for features
- Request explanations for complex implementation choices
- Ask for suggestions on alternative approaches
- Reference specific sections of the handoff summary to maintain alignment

## Decisions Log

Use this section to document key architectural and implementation decisions made during development. For each decision, include:

1. The problem or question that prompted the decision
2. Options considered
3. Decision made and rationale
4. Implications for future development

Example:
```
Decision: Token Caching Strategy
Problem: In-memory token caching doesn't work well in serverless environments
Options: 
- Redis caching
- Database storage
- Client-side storage
- Managed service (Azure Key Vault)
Decision: Implemented Azure Key Vault for token caching due to security benefits and Azure integration
Implications: Requires additional Azure configuration but provides better security and scalability
```

### Current Decisions

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

## Technical Debt Tracking

This section acknowledges shortcuts taken during POC development that would need addressing before production. Each item should include:

1. Description of the current implementation
2. Why it's considered technical debt
3. Potential approach for production-ready solution
4. Priority level (High/Medium/Low)

Example:
```
Item: Hard-coded filter in Dataverse query
Description: Current implementation uses a fixed filter (contains(emailaddress1,'@thecontingent.org'))
Why it's debt: Not configurable for multi-tenant usage and prevents proper filtering
Production approach: Implement configurable filters based on tenant settings and user inputs
Priority: High
```

### Current Technical Debt

```
Item: In-memory token caching
Description: Core Infrastructure POC uses simple in-memory caching for Dataverse tokens
Why it's debt: In-memory caching doesn't persist across serverless function invocations
Production approach: Replace with Redis cache or Azure Key Vault for token storage
Priority: Medium
```

```
Item: Manual role assignment in auth flow
Description: Authentication POC assigns roles based on email domains in the JWT callback
Why it's debt: In a production environment, roles should come from the identity provider or a database
Production approach: Integrate with Microsoft Entra ID claims or implement a database-backed role system
Priority: Medium
```

```
Item: Limited error reporting
Description: Errors are logged to console but not captured in a monitoring system
Why it's debt: Makes it difficult to track and respond to production issues
Production approach: Integrate with application monitoring service (e.g., Application Insights)
Priority: Medium
```

```
Item: Missing comprehensive test coverage
Description: POCs have minimal or no automated tests
Why it's debt: Increases risk of regressions and makes changes more difficult
Production approach: Implement comprehensive test suite with Jest and React Testing Library
Priority: High
```

## Next Steps

### Immediate Action Items

1. ✅ **Complete Authentication & Authorization POC** (Completed):
   - ✅ Implement protected routes with middleware
   - ✅ Add role-based access control (RBAC) demonstration
   - ✅ Set up proper auth state persistence
   - ✅ Add CSRF protection
   - ✅ Complete the auth POC page with working authentication flows

2. **Develop UI Framework and Design System POC**:
   - Expand on existing UI POC with theming capabilities
   - Create layout components with responsive design
   - Build form component library with validation
   - Document component usage and integration patterns

3. **Implement State Management POC**:
   - Configure Zustand store for global state management
   - Set up TanStack Query client with caching strategies
   - Create data validation layer with Zod
   - Demonstrate optimistic updates pattern

4. **Integrate Documentation Across POCs**:
   - Create a README for each POC with integration instructions
   - Define shared interfaces and patterns between POCs
   - Document environment setup requirements for each POC

Start with the Authentication & Authorization POC as it builds on the Core Infrastructure and is critical for security.

---

*This document will be updated throughout the development process to reflect completed items and any changes to the approach.*