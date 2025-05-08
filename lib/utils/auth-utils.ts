import { auth } from "@/lib/auth";
import { type Session } from "next-auth";
import { UserRole } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Check if the user has the required role(s)
 * @param session User session
 * @param requiredRoles Role or roles required for access
 * @returns Boolean indicating if the user has the required role(s)
 */
export function hasRole(
  session: Session | null,
  requiredRoles: UserRole | UserRole[]
): boolean {
  // If no session or no user, return false
  if (!session?.user) return false;

  // Get user roles, defaulting to empty array if none exists
  const userRoles = session.user.roles || [];

  // If requiredRoles is a single role, convert it to an array
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

  // Check if the user has any of the required roles
  return roles.some((role) => userRoles.includes(role));
}

/**
 * Server component helper to check if user is authenticated
 * Redirects to login page if not authenticated
 */
export async function requireAuth() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }
  
  return session;
}

/**
 * Server component helper to check if user has required role
 * Redirects to unauthorized page if user doesn't have the required role
 * @param requiredRoles Role or roles required for access
 */
export async function requireRole(requiredRoles: UserRole | UserRole[]) {
  const session = await requireAuth();
  
  if (!hasRole(session, requiredRoles)) {
    redirect("/unauthorized");
  }
  
  return session;
}

/**
 * React hook for client components to check if user has the required role
 * @param session User session from useSession()
 * @param requiredRoles Role or roles required for access
 * @returns Boolean indicating if the user has the required role
 */
export function useHasRole(
  session: Session | null,
  requiredRoles: UserRole | UserRole[]
): boolean {
  return hasRole(session, requiredRoles);
}