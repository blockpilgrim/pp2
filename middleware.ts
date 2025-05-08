import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { UserRole } from "@/lib/auth";

// List of paths that require authentication
const authRequiredPaths = [
  "/poc/auth/protected",
  "/poc/auth/admin",
  "/poc/auth/partner",
];

// List of paths that require admin role
const adminRequiredPaths = [
  "/poc/auth/admin",
];

// List of paths that require partner role
const partnerRequiredPaths = [
  "/poc/auth/partner",
];

// Define a matcher for routes that should be handled by this middleware
export const config = {
  matcher: [
    // Add routes that should be protected
    "/poc/auth/protected",
    "/poc/auth/admin",
    "/poc/auth/partner",
    // Add other protected routes as needed
  ],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get user session from Auth.js
  const session = await auth();
  
  // Check if route requires authentication
  if (authRequiredPaths.some(path => pathname.startsWith(path))) {
    // If user is not authenticated, redirect to login
    if (!session?.user) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", encodeURI(request.url));
      return NextResponse.redirect(url);
    }
    
    // Check role-based access for admin paths
    if (adminRequiredPaths.some(path => pathname.startsWith(path))) {
      const userRoles = session.user.roles || [];
      if (!userRoles.includes(UserRole.ADMIN)) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }
    
    // Check role-based access for partner paths
    if (partnerRequiredPaths.some(path => pathname.startsWith(path))) {
      const userRoles = session.user.roles || [];
      if (!userRoles.includes(UserRole.PARTNER)) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }
  }
  
  return NextResponse.next();
}