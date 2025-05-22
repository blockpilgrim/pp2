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
- [x] Build working demo at `/poc/core` demonstrating data integration
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
- [ ] **Thorough Testing (End-to-End) (Current Focus):**
    - [ ] User exists in Azure AD and D365 (with roles correctly mapped).
    - [ ] User exists in Azure AD but not in D365 (or not linked).
    - [ ] Various D365 role configurations and error scenarios (e.g., API errors, malformed role data).
- [ ] **Security Baseline**: Verify session cookie attributes (HttpOnly; Secure, typically default in prod; SameSite=Lax or Strict; appropriate expiry).
- [ ] **Security Baseline**: Test session lifecycle thoroughly (e.g., proper invalidation on logout, session timeout behavior, handling of concurrent sessions if applicable).
- [ ] Update UI components further to display D365-sourced profile information (e.g., on a dedicated profile page).
- [ ] Adapt UI/UX based on `isD365User` status more broadly.
- [ ] Refine error handling in auth flow for D365 integration issues (e.g., user-facing messages for `D365LookupFailed`).
- [ ] Implement `updateContactProfile` in `D365ContactService` with actual D365 client call and test profile updates from the portal.

**POC Goal**: Demonstrate secure authentication patterns using Azure AD, with user profile details and application-specific roles managed in Dynamics 365, and role-based access control integrated throughout the application. Ensure robust and secure session management.

### UI Framework & Design System POC (Completed)
- [x] Implement brand theming with Tailwind configuration (colors, spacing, typography)
- [x] Create a comprehensive shadcn/ui component library inventory with customized variants
- [x] Build a custom component showcase page demonstrating shadcn/ui theming and extensions
- [x] Create responsive layout components (navigation, sidebar, etc.) using shadcn/ui primitives
- [x] Build reusable form components with React Hook Form, Zod validation, and shadcn/ui form elements
- [x] Add data display components (tables, cards, etc.) with shadcn/ui styling conventions
- [x] Demonstrate theme switching capability using Tailwind and shadcn/ui theming system
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
- [ ] Configure Zustand store for global state management
- [ ] Set up TanStack Query client with caching strategies
- [ ] Implement React Query dev tools for debugging
- [ ] Create data validation layer with Zod (ensure this primarily refers to client-side validation, with server-side being the authoritative source).
- [ ] **Security Baseline**: Ensure all data mutations triggered from the client are subject to robust server-side input validation (as covered in BFF POC) before affecting state or backend systems.
- [ ] Demonstrate optimistic updates pattern
- [ ] Build working demo at `/poc/state` showing data flow

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

- [x] Set up Vitest for unit testing with React, path aliases (`@/`), and coverage reporting (v8 provider, text/json/html reporters). ([See Vitest Guidelines](./vitest-guidelines.md))
- [ ] Configure React Testing Library for component tests (to be used with Vitest for testing component interactions and rendering).
- [ ] Add Cypress for end-to-end testing (consideration for later project phases).
- [x] Implement type checking (TypeScript) and linting standards (ESLint). (Assuming linting is also set up based on typical Next.js projects and `eslint.config.mjs` presence)
- [x] Create initial example unit tests for utility functions (`lib/utils/example-utils.test.ts`).
- [ ] Expand test coverage with example tests for each POC module as they are developed.
- **Available test scripts** (from `package.json`):
    - `npm run test`: Runs all tests once (Vitest run).
    - `npm run test:ui`: Starts Vitest with its interactive UI.
    - `npm run test:watch`: Runs tests in watch mode.
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
- Minimal but sufficient unit and component test coverage, following the guidelines in [Vitest Testing Framework: Guidelines and Best Practices](./vitest-guidelines.md).

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

## Session Planning Guide

This section provides guidance for structuring productive AI conversations to develop each feature area:

### Conversation Structure
1. **Start with Context**: Begin each session by referencing the handoff summary and previous work
2. **Identify Goals**: Clearly specify which feature subset you're targeting in the current session
3. **Establish Requirements**: List specific requirements for the feature being developed
4. **Implementation Strategy**: Discuss approach before diving into code
5. **Code Implementation**: Develop the feature while explaining key decisions
6. **Review & Refine**: Evaluate the implementation against guiding principles
7. **Document**: Update Feature Checklist progress as we go. Update BOTH the Decisions Log (./decisions-log.md) and Technical Debt document (./technical-debt.md) when completing a POC

### Tips for Effective AI Sessions
- Focus on one conceptual area per conversation
- Provide clear acceptance criteria for features
- Request explanations for complex implementation choices
- Ask for suggestions on alternative approaches
- Reference specific sections of the handoff summary to maintain alignment

## Project References

### Key References

- [Decisions Log](./decisions-log.md) - Documentation of architectural and implementation decisions
- [Technical Debt Tracking](./technical-debt.md) - Known technical debt items and remediation plans
- [Vitest Testing Framework: Guidelines and Best Practices](./vitest-guidelines.md) - Detailed guide for writing tests.

These files are separated from the main handoff summary to optimize context window usage during AI pairing sessions. Reference them as needed for detailed architectural discussions or when addressing technical debt.

## Current Focus Area

**Finalizing and Testing Dynamics 365 Integration for Authentication & Authorization POC.**

The current effort involves completing the integration of Dynamics 365 (D365) as the source of truth for user profile information and application-specific roles. Azure Active Directory (Azure AD) remains the primary authentication provider.

**Implementation Plan & Progress:**

1.  **Strategy Definition (Completed):** Established a hybrid approach: Azure AD for authentication, D365 for user profiles (Contact records) and application roles. `Auth.js` orchestrates this.
2.  **`D365ContactService` Creation & Configuration (Completed):** Service (`lib/services/d365ContactService.ts`) created and configured to use environment variables for D365 field names.
3.  **`Auth.js` Callback Modifications (Completed):** `jwt` and `session` callbacks in `lib/auth.ts` updated to fetch and integrate D365 contact data.
4.  **Type Augmentation (Completed):** TypeScript declarations for `Session` and `JWT` extended.
5.  **D365 Setup & Environment Configuration (User Confirmed Completed):** Necessary fields in D365 (for AAD Object ID and App Roles) are set up, and local `.env` files are populated with their logical names.
6.  **UI Updated (Completed):** `poc-navigation.tsx` now displays D365 user status and session errors.
7.  **Adapt `mapD365RolesToAppRoles` (Completed):**
    *   The developer has confirmed that the D365 `APP_ROLES_FIELD` uses a comma-separated string format.
    *   The existing `mapD365RolesToAppRoles` method in `lib/services/d365ContactService.ts` correctly handles this format. Other parsing examples remain commented out for future reference.
8.  **Verify `d365Client` Functionality (Initial Verification Completed):**
    *   `lib/clients/d365Client.ts` now initializes correctly in both server and client environments (client-side instance is non-functional by design, preventing crashes related to server-only environment variables).
    *   Further verification of Dataverse API request success will occur during end-to-end testing.

**Next Steps for Auth POC Refinement:**

1.  **Thorough End-to-End Testing (CRITICAL - Current Focus):**
    *   Restart the Next.js application.
    *   Test Case 1: User in AAD & D365 with correctly mapped roles. Verify `session.user` details (including roles and `isD365User: true`).
    *   Test Case 2: User in AAD, not in D365 (or not linked via AAD Object ID). Verify default roles (e.g., `UserRole.USER`) and `session.user.isD365User: false`.
    *   Test Case 3: Different D365 role configurations and error/edge cases (e.g., empty roles field, roles not defined in `UserRole` enum, leading/trailing spaces around roles/commas).
    *   Monitor server-side console logs for debugging messages from `D365ContactService` and `lib/auth.ts`, especially regarding D365 contact lookup and role mapping.
2.  **Implement `updateContactProfile` (Post-Testing):**
    *   Complete the `updateContactProfile` method in `D365ContactService` by ensuring `d365Client.updateContact` is called correctly with the appropriate D365 contact ID and payload.
    *   Create a basic UI (e.g., a simple form on a profile page) and a corresponding API route to allow users to update parts of their D365 profile (e.g., first name, last name) from the portal.
3.  **UI/UX Enhancements (Post-Testing):**
    *   Further update UI components to display more D365-sourced profile information (e.g., on a dedicated profile page or dashboard).
    *   Refine how the application behaves for users with `isD365User: false` (e.g., display a message prompting them to contact support if they expect D365 access).
4.  **Refine Error Handling (Post-Testing):**
    *   Implement more user-friendly display of session errors related to D365 integration (e.g., using toast notifications for `D365LookupFailed` or similar errors surfaced in `session.error`).

*Last updated: 2025-05-11* 

---

*This document will be updated throughout the development process to reflect completed items and any changes to the approach.*
