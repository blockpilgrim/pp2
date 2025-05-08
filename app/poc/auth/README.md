# Authentication & Authorization POC

This Proof of Concept (POC) demonstrates a complete authentication and authorization implementation for the Partner Lead Management Portal V2.0.

## Features

- Complete user authentication flow with Microsoft Entra ID
- Protected routes with Next.js middleware
- Role-based access control (RBAC) implementation
- Secure session management with JWT tokens
- Token refresh and session persistence
- CSRF protection
- Role-based UI components and patterns
- Session monitoring and health tracking

## Implementation Details

### Authentication System

The authentication system is built using [NextAuth v5 (Auth.js)](https://authjs.dev/), which provides a secure and flexible authentication solution for Next.js applications.

Key files:
- `/lib/auth.ts` - Main authentication configuration
- `/app/api/auth/[...nextauth]/route.ts` - Auth.js API routes
- `/middleware.ts` - Route protection middleware
- `/lib/utils/auth-utils.ts` - Authentication and authorization utilities
- `/components/custom/auth/role-gate.tsx` - Role-based UI components
- `/components/custom/auth/session-monitor.tsx` - Session tracking component
- `/components/custom/auth/rbac-demo.tsx` - RBAC demonstration components

### Authentication Flow

1. User clicks "Sign In" button on the login page
2. User is redirected to Microsoft Entra ID login page
3. After successful authentication, user is redirected back to the application
4. JWT token is generated with user information and custom claims (roles)
5. Session is stored in a secure, HttpOnly cookie
6. Token refresh logic monitors token expiration
7. Authenticated user can now access protected routes

### Role-Based Access Control (RBAC)

The POC demonstrates role-based access control where different users have different levels of access:

- **User Role**: Basic access level for all authenticated users
- **Partner Role**: Access to partner-specific features
- **Admin Role**: Access to administrative features

For this POC, roles are assigned based on email domains:

```typescript
// Example from lib/auth.ts
if (token.email) {
  roles.push(UserRole.USER);
  
  // Example: assign partner role based on email domain
  if (token.email.endsWith("@partner.com")) {
    roles.push(UserRole.PARTNER);
  }
  
  // Example: assign admin role based on specific email
  if (token.email === "admin@example.com") {
    roles.push(UserRole.ADMIN);
  }
}
```

In a production environment, roles would typically come from:
- Claims in the identity token from Entra ID
- A database lookup for the user
- Integration with an external authorization service

### Route Protection

Routes are protected through Next.js middleware, which intercepts requests and verifies authentication and authorization:

```typescript
// Example middleware logic
if (adminRequiredPaths.some(path => pathname.startsWith(path))) {
  const userRoles = session.user.roles || [];
  if (!userRoles.includes(UserRole.ADMIN)) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }
}
```

Protected routes in this POC:
- `/poc/auth/protected` - Requires any authenticated user
- `/poc/auth/admin` - Requires admin role
- `/poc/auth/partner` - Requires partner role

### Role-Based UI Components

The POC includes reusable components for conditional rendering based on roles:

```tsx
// Using the RoleGate component
<AdminOnly>
  <p>This content is only visible to admins</p>
</AdminOnly>

<PartnerOnly>
  <p>This content is only visible to partners</p>
</PartnerOnly>
```

### Session Persistence and Token Refresh

Session persistence is implemented with the following features:

- JWT tokens stored in secure HttpOnly cookies
- Token refresh logic to maintain long-lived sessions
- Session expiration tracking
- Activity-based session refreshing
- Error handling for token refresh failures

```typescript
// Example token refresh logic
if (tokenExpiresIn < 60 * 30 && token.refreshToken) {
  try {
    // Refresh the token using the provider's refresh flow
    const refreshedToken = await refreshAccessToken(token);
    return refreshedToken;
  } catch (error) {
    return { ...token, error: "RefreshAccessTokenError" };
  }
}
```

### CSRF Protection

CSRF protection is implemented through:
- Secure, HttpOnly cookies for session storage
- SameSite cookie policy set to "lax"
- Secure cookies in production environments
- CSRF token validation for sensitive operations

### Session Monitoring

The POC includes a session monitoring component that:
- Tracks session health and expiration
- Monitors user activity
- Logs session events
- Demonstrates session persistence
- Detects and handles session errors

## Advanced RBAC Patterns

The POC demonstrates several advanced RBAC patterns:

### 1. Hook-based RBAC

Using the `useHasRole` hook for conditional rendering:

```tsx
const isAdmin = useHasRole(session, UserRole.ADMIN);

{isAdmin && (
  <div>Admin only content</div>
)}
```

### 2. Component-based RBAC

Using the role gate components for declarative access control:

```tsx
<AdminOnly fallback={<p>Not authorized</p>}>
  <div>Admin only content</div>
</AdminOnly>
```

### 3. Multiple Role Checks

Checking for multiple roles:

```tsx
// Using hooks
const hasPermission = useHasRole(session, [UserRole.ADMIN, UserRole.PARTNER]);

// Using components
<RoleGate allowedRoles={[UserRole.ADMIN, UserRole.PARTNER]}>
  <div>Content for admins or partners</div>
</RoleGate>
```

### 4. Server-Side Role Checks

Protecting server components:

```tsx
const session = await requireRole(UserRole.ADMIN);
```

### 5. Progressive UI Enhancement

Building UIs that adapt to increasing privilege levels:

```tsx
<AuthenticatedOnly>
  <div>Basic user features</div>
  
  <PartnerOnly>
    <div>Partner features</div>
    
    <AdminOnly>
      <div>Admin features</div>
    </AdminOnly>
  </PartnerOnly>
</AuthenticatedOnly>
```

### 6. Role-Based Actions and Forms

Dynamic interfaces based on user roles:

```tsx
<button>View</button>

<PartnerOnly>
  <button>Edit</button>
</PartnerOnly>

<AdminOnly>
  <button>Delete</button>
</AdminOnly>
```

## Usage Examples

### Authentication Check

```tsx
'use client';

import { useSession } from 'next-auth/react';

export default function MyComponent() {
  const { data: session } = useSession();
  
  if (!session) {
    return <p>Please log in to view this content</p>;
  }
  
  return <p>Welcome, {session.user.name}!</p>;
}
```

### Server-Side Authentication

```tsx
import { requireAuth } from '@/lib/utils/auth-utils';

export default async function ProtectedPage() {
  const session = await requireAuth();
  
  return <p>Welcome, {session.user.name}!</p>;
}
```

### Role-Based Authorization

```tsx
import { requireRole } from '@/lib/utils/auth-utils';
import { UserRole } from '@/lib/auth';

export default async function AdminPage() {
  const session = await requireRole(UserRole.ADMIN);
  
  return <p>Welcome, Admin {session.user.name}!</p>;
}
```

### Client-Side Role Check

```tsx
'use client';

import { useSession } from 'next-auth/react';
import { useHasRole } from '@/lib/utils/auth-utils';
import { UserRole } from '@/lib/auth';

export default function MyComponent() {
  const { data: session } = useSession();
  const isAdmin = useHasRole(session, UserRole.ADMIN);
  
  return (
    <div>
      {isAdmin ? (
        <p>Admin content here</p>
      ) : (
        <p>You need admin access to see this content</p>
      )}
    </div>
  );
}
```

### Role-Based UI Components

```tsx
import { AdminOnly, PartnerOnly } from '@/components/custom/auth/role-gate';

export default function MyPage() {
  return (
    <div>
      <h1>Welcome</h1>
      
      <AdminOnly fallback={<p>Admin content not available</p>}>
        <div className="admin-panel">
          <h2>Admin Panel</h2>
          <p>Admin-only content here</p>
        </div>
      </AdminOnly>
      
      <PartnerOnly>
        <div className="partner-panel">
          <h2>Partner Resources</h2>
          <p>Partner-only content here</p>
        </div>
      </PartnerOnly>
    </div>
  );
}
```

### Session Monitoring

```tsx
import SessionMonitor from '@/components/custom/auth/session-monitor';

export default function MyPage() {
  return (
    <div>
      <h1>Session Health</h1>
      <SessionMonitor />
    </div>
  );
}
```

## Integration with Other POCs

To integrate this authentication system with other POCs:

1. Import the appropriate authentication utilities:
   ```tsx
   import { requireAuth, requireRole } from '@/lib/utils/auth-utils';
   import { UserRole } from '@/lib/auth';
   ```

2. For server components that require authentication:
   ```tsx
   const session = await requireAuth();
   ```

3. For server components that require specific roles:
   ```tsx
   const session = await requireRole(UserRole.ADMIN);
   ```

4. For client components, use the session hook and role utilities:
   ```tsx
   const { data: session } = useSession();
   const isAdmin = useHasRole(session, UserRole.ADMIN);
   ```

5. For conditional UI rendering, use the role gate components:
   ```tsx
   import { AdminOnly, PartnerOnly, AuthenticatedOnly } from '@/components/custom/auth/role-gate';
   ```

6. For session monitoring, use the session monitor component:
   ```tsx
   import { SessionMonitor } from '@/components/custom/auth/session-monitor';
   ```

## Security Considerations

This POC implements several security best practices:

- **JWT Token Security**: Using secure, HttpOnly cookies for storing tokens
- **CSRF Protection**: Implementing SameSite cookie policy and CSRF tokens
- **Token Refresh**: Implementing secure token refresh logic
- **Route Protection**: Protecting routes at the middleware level
- **Server-Side Validation**: Validating permissions on the server for all protected operations
- **Role-Based Access**: Implementing fine-grained access control based on user roles
- **Session Monitoring**: Tracking session health and detecting issues

## Future Enhancements

For production implementation, consider these enhancements:

1. **External Role Store**: Store user roles in a database or integrate with an external RBAC system
2. **Permission-Based Access Control**: Add more granular permissions beyond roles
3. **Audit Logging**: Log authentication and authorization events for security monitoring
4. **Account Management**: Add user profile management features
5. **Multi-Factor Authentication**: Integrate MFA for sensitive operations
6. **Session Invalidation**: Add ability to revoke sessions remotely
7. **Distributed Token Store**: Use Redis or a similar solution for token storage in serverless environments

## Environment Variables

This POC requires the following environment variables:

```
AUTH_MICROSOFT_ENTRA_ID_ID=your-client-id
AUTH_MICROSOFT_ENTRA_ID_SECRET=your-client-secret
AUTH_MICROSOFT_ENTRA_ID_ISSUER=https://login.microsoftonline.com/your-tenant-id/v2.0
AUTH_SECRET=your-secret-for-jwt-encryption
NEXTAUTH_URL=your-app-url (in production)
```

## Demo Pages

The Authentication POC includes the following demo pages:

- `/poc/auth` - Main authentication demo page
- `/poc/auth/protected` - Protected page (requires authentication)
- `/poc/auth/admin` - Admin-only page (requires admin role)
- `/poc/auth/partner` - Partner-only page (requires partner role)
- `/unauthorized` - Error page for unauthorized access
- `/login` - Authentication page