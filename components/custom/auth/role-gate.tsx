'use client';

import { useSession } from 'next-auth/react';
import { useHasRole } from '@/lib/utils/auth-utils';
import { UserRole } from '@/lib/auth';
import React, { ReactNode, useState, useEffect } from 'react';

interface RoleGateProps {
  children: ReactNode;
  allowedRoles: UserRole | UserRole[];
  fallback?: ReactNode;
}

/**
 * Role-based component wrapper that only renders children if the user has one of the allowed roles
 * @param children Content to render if allowed
 * @param allowedRoles Role or roles allowed to see the content
 * @param fallback Optional content to show if the user doesn't have permission
 */
export default function RoleGate({ 
  children, 
  allowedRoles, 
  fallback 
}: RoleGateProps) {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [hasRole, setHasRole] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Only perform role check on the client side after hydration
  useEffect(() => {
    setIsClient(true);
    setIsLoading(status === 'loading');
    setHasRole(useHasRole(session, allowedRoles));
  }, [session, status, allowedRoles]);
  
  // During server rendering or initial client hydration, render nothing
  // This prevents hydration mismatch errors
  if (!isClient) {
    return null;
  }
  
  // While loading, render nothing (or a loading indicator if needed)
  if (isLoading) {
    return null;
  }
  
  // If user has required role, render children
  if (hasRole) {
    return <>{children}</>;
  }
  
  // Otherwise, render fallback if provided or nothing
  return fallback ? <>{fallback}</> : null;
}

// Export convenience wrappers for common roles
export function AdminOnly({ children, fallback }: Omit<RoleGateProps, 'allowedRoles'>) {
  return <RoleGate allowedRoles={UserRole.ADMIN} fallback={fallback}>{children}</RoleGate>;
}

export function PartnerOnly({ children, fallback }: Omit<RoleGateProps, 'allowedRoles'>) {
  return <RoleGate allowedRoles={UserRole.PARTNER} fallback={fallback}>{children}</RoleGate>;
}

export function AuthenticatedOnly({ children, fallback }: Omit<RoleGateProps, 'allowedRoles'>) {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Only check authentication on the client side after hydration
  useEffect(() => {
    setIsClient(true);
    setIsLoading(status === 'loading');
    setIsAuthenticated(!!session);
  }, [session, status]);
  
  // During server rendering or initial client hydration, render nothing
  if (!isClient) {
    return null;
  }
  
  if (isLoading) {
    return null;
  }
  
  if (isAuthenticated) {
    return <>{children}</>;
  }
  
  return fallback ? <>{fallback}</> : null;
}