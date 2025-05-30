import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { UserRole } from "@/lib/auth";

// List of paths that require authentication
const authRequiredPaths = [
  "/poc/auth/protected",
  "/poc/auth/admin",
  "/poc/auth/partner",
  "/profile",
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
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*|images).*)',
  ],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Create response object early to handle cookies
  let response = NextResponse.next();
  
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
  
  return response;
}