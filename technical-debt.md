# Partner Portal V2.0 - Technical Debt Tracking

This document tracks shortcuts taken during POC development that would need addressing before moving to production. Each item includes:

1. Description of the current implementation
2. Why it's considered technical debt
3. Potential approach for production-ready solution
4. Priority level (High/Medium/Low)

## Current Technical Debt Items

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

```
Item: Hard-coded filter in Dataverse query
Description: Current implementation uses a fixed filter (contains(emailaddress1,'@thecontingent.org'))
Why it's debt: Not configurable for multi-tenant usage and prevents proper filtering
Production approach: Implement configurable filters based on tenant settings and user inputs
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
Description: Console warnings about duplicate keys in the POC navigation component
Why it's debt: Can cause rendering issues and inefficiencies in React's reconciliation process
Production approach: Refactor navigation component to ensure unique keys for all rendered elements
Priority: Low
```

```
Item: Dark mode styling inconsistencies
Description: Some UI elements don't fully respect dark mode theming
Why it's debt: Creates an inconsistent user experience when using dark mode
Production approach: Audit all components in dark mode and ensure consistent styling
Priority: Low
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