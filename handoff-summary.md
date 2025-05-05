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

### 🔄 Core Infrastructure POC
- [ ] Complete Dataverse client implementation
- [ ] Set up proper environment variable configuration
- [ ] Implement token management and caching strategy
- [ ] Create centralized error handling utilities
- [ ] Add comprehensive API error responses
- [ ] Build working demo at `/poc/core` demonstrating data integration

**POC Goal**: Create a robust foundation for secure API communication that demonstrates clean separation of concerns and proper error handling.

### 🔒 Authentication & Authorization POC
- [ ] Complete user authentication flow with session management
- [ ] Implement protected routes with middleware
- [ ] Add role-based access control (RBAC) demonstration
- [ ] Set up proper auth state persistence
- [ ] Add CSRF protection
- [ ] Create working demo at `/poc/auth` showing complete authentication flow

**POC Goal**: Demonstrate secure authentication patterns and role-based access control that can be integrated into any part of the application.

### 🎨 UI Framework & Design System POC
- [ ] Implement brand theming with Tailwind configuration
- [ ] Create responsive layout components (navigation, sidebar, etc.)
- [ ] Build reusable form components with React Hook Form and validation
- [ ] Add data display components (tables, cards, etc.)
- [ ] Demonstrate theme switching capability
- [ ] Create comprehensive demo at `/poc/ui` showcasing all components

**POC Goal**: Build a comprehensive UI toolkit that demonstrates consistent design patterns and responsive components.

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
4. **State Management POC**: Global state, data fetching, caching
5. **Lead Management Mini-App**: Integration of all previous POCs

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
  - `app/(poc)/`: POC demonstration pages
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

## Next Steps

### Immediate Action Items

1. **Complete Core Infrastructure POC**:
   - Implement the d365Client.ts class with proper token management
   - Move token caching logic from API route to client
   - Create centralized error handling utilities
   - Set up environment variable validation
   - Complete the BFF test page to demonstrate working integration

2. **Enhance Authentication POC**:
   - Complete the auth-test page with working authentication flows
   - Add protected route examples
   - Implement basic role-based access control (RBAC)
   - Document integration points with other POCs

3. **Develop UI Framework and Design System POC**:
   - Expand on existing styling-test with theming capabilities
   - Create layout components with responsive design
   - Build form component library with validation
   - Document component usage and integration patterns

4. **Integrate Documentation Across POCs**:
   - Create a README for each POC with integration instructions
   - Define shared interfaces and patterns between POCs
   - Document environment setup requirements for each POC

Start with the Core Infrastructure items as they form the foundation for all other POCs. Then proceed to Authentication & Authorization to ensure secure access patterns are established before implementing business functionality.

---

*This document will be updated throughout the development process to reflect completed items and any changes to the approach.*