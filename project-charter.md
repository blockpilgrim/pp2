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
- **Authentication**: Auth.js (NextAuth v5) with Azure AD, leveraging Dynamics 365 for user profile and roles.
- **Backend Integration**: Backend-for-Frontend pattern via Next.js API Routes
- **Data Handling**: TanStack Query (React Query v5) for data fetching and caching
- **Hosting**: Azure Static Web Apps with CI/CD via Azure DevOps

## Feature Checklist

This checklist represents features organized by POC module, with each module focused on a specific technical concern. We will tackle these POC implementations in the order listed, with each building on the lessons learned from previous POCs. Security MVP baseline items are integrated within relevant POCs.

### Foundation
- [x] Project bootstrapped with Next.js App Router
- [x] Basic authentication setup with Auth.js and Microsoft Entra ID
- [x] Initial API route for Dataverse integration
- [x] Basic UI components with shadcn/ui and Tailwind
- [ ] **Security Baseline**: Implement foundational security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` or `SAMEORIGIN`, basic `Referrer-Policy`) in `next.config.js` or middleware.

### Core Infrastructure POC
- [x] Complete Dataverse client implementation (`lib/clients/d365Client.ts`)
- [x] Set up proper environment variable configuration (including D365 connection details)
- [x] Implement token management and caching strategy (within `d365Client.ts`)
- [x] Create centralized error handling utilities (`lib/utils/error-handler.ts`, `DataverseError` in `d365Client.ts`)
- [x] Add comprehensive API error responses (demonstrated in `d365Client.ts`)
- [ ] **Security Baseline**: Implement robust server-side input validation (using Zod or similar) for all API route inputs to prevent common vulnerabilities (XSS, injection, etc.).
- [x] ~~Build working demo at `/poc/core` demonstrating data integration~~ (Removed: Dataverse client integration is demonstrated via Authentication & Authorization POC and Profile features)
- [ ] **Security Baseline**: Conduct Dataverse Least Privilege Audit:
    - [ ] Document permissions assigned to the application's service principal in D365.
    - [ ] Confirm permissions adhere to the principle of least privilege for all Dataverse operations.
- [ ] **Security Baseline**: Verify secure parameter handling for all Dataverse API calls originating from `d365Client.ts`.
- [ ] **Security Baseline**: Test centralized error handling (`lib/utils/error-handler.ts`) to ensure no sensitive information (stack traces, detailed system paths) is leaked via API responses or logs accessible to users.

**POC Goal**: Create a robust foundation for secure API communication that demonstrates clean separation of concerns and proper error handling, including Dataverse integration adhering to the principle of least privilege.

### Authentication & Authorization POC (Refinement In Progress)
- [x] Complete user authentication flow with session management via Azure AD
- [x] Implement protected routes with middleware
- [x] Add role-based access control (RBAC) demonstration (initial setup)
- [x] Set up proper auth state persistence
- [x] Add CSRF protection
- [x] **Strategy Defined:** Azure AD for auth, Dynamics 365 for user profile & roles.
- [x] **`D365ContactService` Created:** (`lib/services/d365ContactService.ts`) for D365 interactions.
- [x] **`Auth.js` Callbacks Updated:** `jwt` and `session` in `lib/auth.ts` integrate D365 data.
- [x] **TypeScript Types Augmented:** `Session` and `JWT` in `lib/auth.ts` include D365 fields.
- [x] **Environment Variables Configured:** `.env.example` updated for D365 field names (`DATAVERSE_CONTACT_AAD_OBJECT_ID_FIELD`, `DATAVERSE_CONTACT_APP_ROLES_FIELD`).
- [x] **D365 Field Name Usage:** `D365ContactService` uses environment variables for field names.
- [x] **UI Updated:** `poc-navigation.tsx` displays D365 user status and session errors.
- [x] **Adapt `mapD365RolesToAppRoles` (Completed):** Logic in `D365ContactService` confirmed to handle comma-separated string format for roles; other examples retained as comments.
- [x] **State Assignment Support:** Extended D365ContactService to parse state assignments using prefix notation (e.g., "state:arkansas")
- [x] **State Theme Integration:** Implemented automatic theme suggestions based on user's D365 state assignments
- [ ] **Thorough Testing (End-to-End) (Current Focus):**
    - **Authentication & Authorization POC:**
        - [ ] User exists in Azure AD and D365 (with roles correctly mapped).
        - [ ] User exists in Azure AD but not in D365 (or not linked).
        - [ ] Test different D365 role configurations and error/edge cases.
        - [ ] Verify `updateContactProfile` functionality (once implemented).
        - [ ] Monitor server-side logs for D365 integration details.
    - **State Management & Data Handling POC Follow-up:**
        - [ ] Conduct thorough testing of all CRUD operations (add, edit, toggle, delete items) on the `/poc/state` page, including optimistic update behavior and error handling (e.g., simulate API errors).
        - [ ] Verify client-side validation (Zod + React Hook Form) for the add item form, testing various valid and invalid inputs.
        - [ ] Test the Zustand-based item filtering (`all`, `active`, `completed`) to ensure it correctly updates the displayed list.
        - [ ] Review the implementation for any potential race conditions or edge cases, especially with optimistic updates.
        - [ ] Consider adding more robust UI feedback for ongoing operations or errors (e.g., using toast notifications if `sonner` is integrated).
- [ ] **Security Baseline**: Verify session cookie attributes (HttpOnly; Secure, typically default in prod; SameSite=Lax or Strict; appropriate expiry).
- [ ] **Security Baseline**: Test session lifecycle thoroughly (e.g., proper invalidation on logout, session timeout behavior, handling of concurrent sessions if applicable).
- [x] Update UI components further to display D365-sourced profile information (e.g., on a dedicated profile page).
- [ ] Adapt UI/UX based on `isD365User` status more broadly.
- [ ] Refine error handling in auth flow for D365 integration issues (e.g., user-facing messages for `D365LookupFailed`).
- [x] Implement `updateContactProfile` in `D365ContactService` with actual D365 client call and test profile updates from the portal.

**POC Goal**: Demonstrate secure authentication patterns using Azure AD, with user profile details and application-specific roles managed in Dynamics 365, and role-based access control integrated throughout the application. Ensure robust and secure session management.

### UI Framework & Design System POC (Completed)
- [x] Implement brand theming with Tailwind configuration (colors, spacing, typography)
- [x] Create a comprehensive shadcn/ui component library inventory with customized variants
- [x] Build a custom component showcase page demonstrating shadcn/ui theming and extensions
- [x] Create responsive layout components (navigation, sidebar, etc.) using shadcn/ui primitives
- [x] Build reusable form components with React Hook Form, Zod validation, and shadcn/ui form elements
- [x] Add data display components (tables, cards, etc.) with shadcn/ui styling conventions
- [x] ~~Demonstrate theme switching capability using Tailwind and shadcn/ui theming system~~ (Removed: Manual theme switching scoped out; D365 state-driven theming is now exclusive)
- [x] Implement exclusive state-specific theming system, automatically driven by D365 state assignments.
- [x] Document Tailwind/shadcn component usage patterns and best practices
- [x] Create comprehensive demo at `/poc/ui` showcasing all components with interactive examples

**POC Goal**: Build a comprehensive UI toolkit that demonstrates consistent design patterns and responsive components, specifically highlighting the integration and customization of shadcn/ui with Tailwind CSS.

### Backend-for-Frontend (BFF) Pattern POC
- [x] Implement secure API endpoints following the BFF pattern (See `/api/bff-poc/items`)
- [x] Create examples of different API request types (GET, POST, PATCH) (Implemented in `/api/bff-poc/items/route.ts`)
- [x] Demonstrate proper error handling and validation (Basic error handling and type checks in API routes)
- [x] Implement authentication and authorization checks (Auth.js session checks in API routes)
- [x] Build working demo at `/poc/bff` showing API interactions (Client-side UI at `/poc/bff` interacts with API)
- [ ] **Security Baseline**: Implement robust server-side input validation (using Zod or similar) for all API route inputs to prevent common vulnerabilities (XSS, injection, etc.).
- [ ] **Security Baseline**: Review all API responses to ensure no unintended sensitive data is exposed to the client-side.

**POC Goal**: Demonstrate the Backend-for-Frontend architectural pattern using Next.js API routes to create a secure communication layer between the frontend and backend services, with comprehensive server-side input validation and minimized data exposure.

### State Management & Data Handling POC
- [x] Establish patterns for client-side state management (Zustand)
- [x] Implement data fetching and caching strategies (React Query)
- [x] Demonstrate optimistic updates pattern
- [x] Create data validation layer with Zod (client-side validation for forms, complementing server-side validation in API routes).
- [x] Implement React Query dev tools for debugging
- [ ] **Security Baseline**: Ensure all data mutations triggered from the client are subject to robust server-side input validation (as covered in BFF POC) before affecting state or backend systems. (Note: Server-side validation for `/api/state-poc/items` was implemented using Zod).

**Patterns Established in `/poc/state`:**
- **TanStack Query (React Query):** Used for all server-side data interactions (fetching, creating, updating, deleting items) with optimistic updates for a responsive UI. Query keys are used for cache management.
- **Zod & React Hook Form:** Zod schemas define client-side validation rules for forms, integrated with React Hook Form.
- **Zustand:** Manages global client-side UI state not persisted on the server (e.g., item display filters). Stores are lean and focused.
- **React `useState`:** Used for local component state.
- **Separation of Concerns:** Clear distinction between server state (TanStack Query), global client UI state (Zustand), and local component state (`useState`).
- [x] Build working demo at `/poc/state` showing data flow

**POC Goal**: Establish patterns for state management, data fetching, and validation that can be applied consistently across the application, emphasizing that server-side validation is paramount for security.

### Lead Management Mini-App POC
- [ ] Implement lead listing page with pagination and filtering
- [ ] Create lead detail view with related data
- [ ] Build lead creation/edit form with validation
- [ ] Add lead status management workflow
- [ ] Implement basic reporting capabilities
- [ ] Create demo at `/poc/leads` demonstrating end-to-end lead management journey
- [ ] **Security Baseline**: Ensure comprehensive server-side input validation (using Zod) for all API endpoints related to lead management.
- [ ] **Security Baseline**: Perform API endpoint security testing, specifically for Insecure Direct Object References (IDOR) and ensuring correct authorization logic for accessing and modifying lead data.
- [ ] **Security Baseline**: Verify no sensitive data is unnecessarily exposed in lead management UI components or API responses beyond what is required for the user's role and context.

**POC Goal**: Build a small but complete application that integrates all previous POCs to demonstrate a real business workflow, with a strong emphasis on secure data handling, robust server-side validation, and role-based access control to lead data.

### Testing & Quality Assurance Standards
- [x] Set up Vitest for unit testing
- [ ] Configure React Testing Library for component tests (to be used with Vitest)
- [ ] Add Cypress for end-to-end testing (optional)
- [ ] Implement type checking and linting standards
- [ ] Create example tests for each POC module
- Available test scripts: `npm test` (run all tests), `npm run test:ui` (interactive UI), `npm run test:watch` (watch mode).
- [ ] **Security Baseline**: Review any new third-party scripts or services introduced during MVP development for security implications (e.g., supply chain risks, CSP compatibility).
- [ ] **Security Baseline**: Document a basic checklist for security regression testing to be performed before releases.

#### Prioritized Unit Test Implementation

Based on the implemented features and security-first principles, the following unit tests should be implemented in priority order:

**🔴 Priority 1: Security & Authentication (Critical)**
- [ ] `lib/clients/d365Client.ts` - Token acquisition/refresh, error handling, retry mechanism, secure parameter handling
- [ ] `lib/services/d365ContactService.ts` - Contact lookup, role mapping (comma-separated parsing), error scenarios
- [ ] `lib/auth.ts` - JWT/session callbacks with D365 integration, error handling, role assignment
- [ ] `middleware.ts` - Protected route enforcement, session validation, redirect behavior

**🟠 Priority 2: Core Infrastructure**
- [ ] `lib/utils/token-cache.ts` - Token storage/retrieval, expiration handling, cache invalidation
- [ ] `lib/utils/error-handler.ts` - Error categorization, sensitive data sanitization, client-safe messages
- [ ] `lib/config/env.ts` - Environment variable validation, required vs optional configs

**🟡 Priority 3: API Routes (BFF Pattern)**
- [ ] `app/api/bff-poc/items/route.ts` - Authentication checks, input validation, CRUD operations
- [ ] `app/api/leads/route.ts` - Lead operations, authorization logic, Dataverse integration

**🟢 Priority 4: Utilities & Helpers**
- [ ] `lib/utils/auth-utils.ts` - Helper function behavior and edge cases
- [ ] `lib/utils.ts` - Utility function correctness and type safety
- [ ] `lib/queryClient.ts` - React Query configuration and cache settings

**Test Implementation Guidelines:**
- Focus on business logic, not implementation details
- Test error scenarios thoroughly
- Ensure no sensitive data leaks in tests
- Mock external dependencies (Azure AD, D365)
- Follow the project's [Vitest Guidelines](./vitest-guidelines.md)

**Testing Goal**: Establish and maintain a comprehensive testing strategy that ensures code quality, stability, and maintainability, aligning with our core principles (Security, Stability, Scalability, Maintainability, Knowledge Sharing, Clarity, Simplicity, Modern Best Practices). This includes robust unit tests for business logic and utilities, component tests for UI interactions, and a plan for future integration and end-to-end testing. All tests should be clear, easy to understand, and contribute to a reliable and secure application. Refer to the [Vitest Testing Framework: Guidelines and Best Practices](./vitest-guidelines.md) for detailed guidance.

### Deployment & Documentation
- [ ] Set up deployment pipeline example
- [ ] Create documentation for environment configuration
- [ ] Document integration points between POCs
- [ ] Establish code standards and contribution guidelines
- [ ] **Security Baseline**: Confirm foundational security headers are correctly implemented and verified in the deployed environment(s).

**Documentation Goal**: Ensure each POC is well-documented with clear integration guidance, and deployment considerations include verification of security basics.

## Development Approach

### Modular POC Approach with Integration Path

After careful consideration, we've decided to pursue focused Proof-of-Concept (POC) modules rather than a single comprehensive prototype. This approach allows for dedicated attention to specific technical challenges, including the systematic integration and verification of security requirements at each stage. It offers several advantages:

- **Focused demonstration** of specific technical challenges
- **Faster validation** of key technologies and patterns (including security controls)
- **Easier team review** of isolated concerns
- **Reduced complexity** in each development cycle
- **Clearer technical boundaries** between components

Each POC will be developed as a standalone module with clear integration points and documentation:

1.  **Core Infrastructure POC**: Dataverse client, token management, error handling, initial security verifications
2.  **Authentication POC**: Complete auth flows, RBAC implementation (D365 integration), session security
3.  **UI Framework POC**: Component system, theming, layouts
4.  **Backend-for-Frontend (BFF) POC**: API endpoints, request/response handling, server-side validation
5.  **State Management POC**: Global state, data fetching, caching, secure data flow
6.  **Lead Management Mini-App**: Integration of all previous POCs, end-to-end security validation

Each POC will include:
- Independent deployment capabilities
- Integration documentation
- Consistent patterns and libraries
- Verification of relevant Security Baseline items as defined in the Feature Checklist
- Minimal but sufficient functional test coverage

This approach enables targeted demonstrations while maintaining a clear path to integration when ready to build the comprehensive solution.

### Shared Libraries & Folder Structure

To ensure consistency across POCs and facilitate future integration, we'll follow these conventions:

#### URL/Route Structure
- POC demonstration pages: `/poc/{poc-name}` (e.g., `/poc/auth`, `/poc/ui`, `/poc/state`, `/poc/core`, `/poc/bff`)
- API routes: `/api/{domain}` with HTTP methods (e.g., `GET /api/leads` to list leads, `POST /api/leads` to create)

#### Folder Structure
- `lib/`: Shared utilities and clients
  - `lib/clients/`: API clients (e.g., d365Client.ts)
  - `lib/services/`: Service classes abstracting business logic (e.g., `d365ContactService.ts`)
  - `lib/utils/`: Helper functions (including validation and security utilities)
  - `lib/hooks/`: Custom React hooks
  - `lib/types/`: TypeScript interfaces and types
  - `lib/config/`: Configuration (e.g., environment variables, security headers if configured via code)
- `components/`: UI components
  - `components/ui/`: Primitive UI components (from shadcn/ui)
  - `components/custom/`: Domain-specific components (e.g., `poc-navigation.tsx`, `ui-poc-sub-navigation.tsx`)
  - `components/layouts/`: Page layouts and containers
- `app/`: Next.js App Router pages and routes
  - `app/api/`: API routes using BFF pattern (e.g., `app/api/bff-poc/items/route.ts`)
  - `app/poc/`: POC demonstration pages (e.g., `app/poc/bff/page.tsx`)
- `styles/`: Global styles and theming
- `middleware.ts`: For handling protected routes and potentially some security headers.

#### Naming Conventions
- Files: kebab-case for general files (e.g., `error-handler.ts`, `d365-contact-service.ts`)
- Components: PascalCase for component files and functions (e.g., `LeadCard.tsx`)
- Interfaces: Prefixed with "I" (e.g., `ILead`) - *Note: Current BFF POC `Item` interface does not follow this; `AppContactProfile` in `d365ContactService.ts` also does not. Consider for future consistency.*
- Types: PascalCase without prefix (e.g., `LeadStatus`, `UserRole`)
- Environment variables: Uppercase with underscores, prefixed by domain (e.g., `AUTH_CLIENT_ID`, `DATAVERSE_URL`)

#### Environment Variables
Each POC should document its required environment variables in a `.env.example` file, following this pattern:
```
# Core Infrastructure
DATAVERSE_URL=https://yourtenant.crm.dynamics.com
DATAVERSE_CLIENT_ID=your-client-id
DATAVERSE_CLIENT_SECRET=your-client-secret
DATAVERSE_TENANT_ID=your-tenant-id
# Field in D365 Contact entity storing Azure AD Object ID (e.g., crXXX_azureadobjectid)
DATAVERSE_CONTACT_AAD_OBJECT_ID_FIELD=yourprefix_azureadobjectidfield
# Field in D365 Contact entity storing application roles (e.g., crXXX_approles, comma-separated string)
DATAVERSE_CONTACT_APP_ROLES_FIELD=yourprefix_applicationrolesfield

# Authentication
AUTH_MICROSOFT_ENTRA_ID_ID=your-client-id
AUTH_MICROSOFT_ENTRA_ID_SECRET=your-client-secret
AUTH_MICROSOFT_ENTRA_ID_ISSUER=https://login.microsoftonline.com/your-tenant-id/v2.0
AUTH_SECRET=generate-a-secure-random-string-at-least-32-chars

# App Configuration
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

The development of each POC will follow this progression:
1. Backend API implementation (including server-side validation and security considerations from the outset)
2. Data fetching and state management (ensuring secure data flow and handling)
3. UI components and interactions
4. Functional testing, validation, and verification of all applicable Security Baseline items

This methodical approach ensures that at each stage, we have working functionality that can be demonstrated, validated, and confirmed against security requirements.

## Project References

### Key References

- [Decisions Log](./decisions-log.md) - Documentation of architectural and implementation decisions
- [Technical Debt Tracking](./technical-debt.md) - Known technical debt items and remediation plans

Reference these files as needed for detailed architectural discussions or when addressing technical debt.

## Current Focus Area

Continue hammering away at POCs in Feature Checklist

---

*This document will be updated throughout the development process to reflect completed items and any changes to the approach.*
