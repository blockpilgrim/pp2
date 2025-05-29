# Partner Portal V2.0 - Technical Debt Tracking

This document tracks shortcuts taken during POC development that would need to be addressed before moving to production. Each item includes:

1. Description of the current implementation
2. Why it's considered technical debt
3. Potential approach for production-ready solution
4. Priority level (High/Medium/Low)

## Current Technical Debt Items

```
Item: In-memory token caching
Description: Core Infrastructure POC uses simple in-memory caching for Dataverse tokens via `d365Client.ts`.
Why it's debt: In-memory caching doesn't persist across serverless function invocations and is not suitable for a scaled production environment.
Production approach: Replace with Redis cache or Azure Key Vault for token storage.
Priority: Medium
```

```
Item: Role management sourced from Dynamics 365
Description: Authentication POC sources user roles from a specific field in the Dynamics 365 Contact entity. While this is an improvement over hardcoded roles, the management of these roles within D365 (e.g., ensuring data integrity, providing an interface for administrators) is not part of the current portal.
Why it's debt: Role management is external and relies on D365 data entry. Production environments may require more robust role management features, auditing, or integration with Entra ID group-based roles if D365 is not the sole source of truth for app roles.
Production approach: Evaluate long-term role management strategy. Options include: enhancing D365 role management processes, building administrative interfaces within the portal for role assignment (if appropriate), or integrating more deeply with Microsoft Entra ID group-to-role mapping.
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

```
Item: Hard-coded filter in Dataverse query
Description: Current implementation uses a fixed filter (contains(emailaddress1,'@thecontingent.org')) in some older/example Dataverse queries (Note: review if this is still present outside of `d365ContactService` which uses dynamic filters).
Why it's debt: Not configurable for multi-tenant usage and prevents proper filtering if still used.
Production approach: Implement configurable filters based on tenant settings and user inputs. Ensure all Dataverse queries are dynamic and secure.
Priority: High
```

```
Item: UI component dependency management
Description: UI components from shadcn/ui and their Radix UI dependencies are manually installed as needed
Why it's debt: Error-prone process that can lead to missing dependencies and broken components
Production approach: Create a component installation script or use a more comprehensive dependency management approach
Priority: Medium
```

```
Item: Duplicate React keys in navigation component
Description: Console warnings about duplicate keys in the POC navigation component (Note: This was for the old UI POC specific nav, likely resolved by new PocNavigation structure)
Why it's debt: Can cause rendering issues and inefficiencies in React's reconciliation process
Production approach: Refactor navigation component to ensure unique keys for all rendered elements. Review current PocNavigation and UiPocSubNavigation for any remaining issues.
Priority: Low
```

```
Item: Dark mode styling inconsistencies
Description: Some UI elements don't fully respect dark mode theming
Why it's debt: Creates an inconsistent user experience when using dark mode
Production approach: Audit all components in dark mode and ensure consistent styling
Priority: Low
```

```
Item: Mock Data in BFF POC API
Description: The BFF POC API (`/api/bff-poc/items`) uses an in-memory `mockItems` array for data storage.
Why it's debt: 
- Data is not persistent and resets on server restart.
- Not suitable for a real application requiring data persistence.
- Does not demonstrate integration with a proper backend data source (e.g., Dataverse, database).
Production approach: Replace mock data implementation with calls to a persistent data store (e.g., Dataverse via the d365Client, or another database/service).
Priority: High (for moving beyond POC to a real feature)
```

```
Item: Basic Server-Side Validation in BFF POC API
Description: The BFF POC API (`/api/bff-poc/items`) performs only basic type and existence checks for request payloads.
Why it's debt: 
- Lacks robust validation (e.g., string lengths, formats, specific value constraints).
- Does not use a schema-based validation library like Zod, which is planned for the project.
- Error messages for validation failures are generic.
Production approach: Implement comprehensive server-side validation using Zod schemas for request bodies and query parameters in all API routes. Provide detailed error messages.
Priority: Medium (High before any production use of such an endpoint)
```

```
Item: Missing Entra ID access token refresh mechanism in JWT callback
Description: The `lib/auth.ts` JWT callback stores the user's Entra ID access token (e.g., for MS Graph API calls) but lacks logic to refresh it upon expiration.
Why it's debt: If the access token is used for API calls and expires, those calls will fail, leading to a degraded user experience or loss of functionality. This is critical if features rely on this user-delegated token.
Production approach: Implement a robust token refresh mechanism within the JWT callback using the stored refresh token to obtain a new access token from Microsoft Entra ID. Ensure proper error handling for refresh failures. If the access token is not actively used, consider removing it from the JWT.
Priority: High (if access token is actively used), Low (if not used)
```

```
Item: Theme-specific logo implementation incomplete
Description: Logo switching logic exists in PocNavigation but all themes currently use the same logo (/ar.svg)
Why it's debt: The conditional logic adds complexity without current benefit, and actual theme-specific logos are not implemented
Production approach: Add appropriate logo files for each theme (/tn.svg for Tennessee/green theme) and update the image paths in the switching logic
Priority: Low
```

```
Item: Hardcoded session refetch interval
Description: Session refetch interval is hardcoded to 5 minutes in providers.tsx
Why it's debt: Not configurable for different environments or security requirements
Production approach: Move refetch interval to environment variables for configurability
Priority: Low
```

```
Item: Client component pattern cleanup
Description: Fixed anti-pattern where 'use client' directives were declared inside server components, but similar patterns may exist elsewhere
Why it's debt: Can cause hydration mismatches and violates Next.js 13+ best practices
Production approach: Audit all components for proper client/server separation
Priority: Medium
```

## Adding New Technical Debt Items

To add a new technical debt item to this log, follow this template:

```
Item: [Title]
Description: [Description of the current implementation]
Why it's debt: [Explanation of why this is considered technical debt]
Production approach: [Proposed approach for a production-ready solution]
Priority: [High/Medium/Low]
```

## Technical Debt Resolution

When resolving technical debt items, please:

1. Update the item with a "Resolved" status and date
2. Document the solution implemented
3. Keep the item in the log for historical reference

Example of a resolved item:

```
Item: In-memory token caching (RESOLVED: 2025-06-01)
Description: Core Infrastructure POC uses simple in-memory caching for Dataverse tokens
Why it's debt: In-memory caching doesn't persist across serverless function invocations
Production approach: Replace with Redis cache or Azure Key Vault for token storage
Priority: Medium
Resolution: Implemented Azure Key Vault for secure token storage with automatic rotation and proper access controls
```

---

*This document should be regularly reviewed and updated as technical debt items are added or resolved.*
