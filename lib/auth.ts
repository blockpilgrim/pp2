import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import { type JWT } from "next-auth/jwt";
import { type Session, type User } from "next-auth";

// Define user roles for the application
export enum UserRole {
  USER = "user",
  PARTNER = "partner",
  ADMIN = "admin",
}

// Extend the session and JWT types to include our custom fields
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      roles?: UserRole[];
    };
    error?: string;
  }

  interface User {
    id?: string;
    roles?: UserRole[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    roles?: UserRole[];
    // Track token metadata for refresh
    accessTokenExpires?: number;
    refreshToken?: string;
    error?: string;
  }
}

/**
 * NextAuth v5 configuration
 * All provider credentials are inferred from environment variables
 *   AUTH_MICROSOFT_ENTRA_ID_ID
 *   AUTH_MICROSOFT_ENTRA_ID_SECRET
 *   AUTH_MICROSOFT_ENTRA_ID_ISSUER
 *   AUTH_SECRET (for JWT encryption)
 */
export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
      authorization: {
        params: {
          prompt: "select_account", // Allow selecting an account but don't force login every time
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours - how frequently to resave session
  },
  pages: {
    signIn: "/login",
    error: "/login",
    signOut: "/login",
  },
  // Enable debugging in development
  debug: process.env.NODE_ENV === "development",
  // CSRF protection - adjusted for development
  useSecureCookies: false, // Set to false in development, true in production
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" 
        ? `__Secure-next-auth.session-token`
        : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name: process.env.NODE_ENV === "production" 
        ? `__Secure-next-auth.callback-url`
        : `next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: process.env.NODE_ENV === "production" 
        ? `__Host-next-auth.csrf-token`
        : `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async jwt({ token, user, account, profile }: { token: JWT; user?: User; account?: any; profile?: any }) {
      // Initial sign-in
      if (user) {
        // For this POC, we'll assign roles based on email domain
        // In a real app, roles would likely come from the ID token or a database
        const roles = [];
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

        // Store the initial token info for later refreshing
        if (account) {
          token.accessToken = account.access_token;
          token.refreshToken = account.refresh_token;
          token.accessTokenExpires = account.expires_at * 1000; // Convert to milliseconds
        }

        return {
          ...token,
          id: user.id,
          roles,
        };
      }
      
      // Subsequent requests: check if token needs refresh
      // This only matters for OAuth providers that support refresh tokens
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const tokenExpiresIn = (token.accessTokenExpires || 0) - currentTimestamp;
      
      // If token is still valid, return it
      if (tokenExpiresIn > 60 * 30) { // More than 30 minutes left
        return token;
      }

      // If we have a refresh token, attempt to refresh
      if (token.refreshToken) {
        try {
          // NOTE: In a real implementation, you would use the provider's 
          // refresh token flow here. This is a placeholder for demonstration.
          console.log('Token refresh would happen here in production implementation');
          
          // Return the existing token for now (in a real impl you'd return the refreshed token)
          return token;
        } catch (error) {
          console.error("Error refreshing access token", error);
          
          // On error, return the token with an error flag to be handled in the session callback
          return { ...token, error: "RefreshAccessTokenError" };
        }
      }
      
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        // Pass information from token to the client-side session
        session.user.id = token.id;
        session.user.roles = token.roles;
        
        // Pass any token errors to the client
        if (token.error) {
          session.error = token.error;
        }
      }
      return session;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Allow relative URLs and internal absolute URLs
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      // Allow absolute URLs on the same origin
      else if (new URL(url).origin === baseUrl) {
        return url;
      }
      // Default to the homepage for external URLs (for security)
      return baseUrl;
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // Log sign-in event (in production this might go to a monitoring service)
      console.log(`User signed in: ${user.email}`);
    },
    async signOut({ token, session }) {
      // Log sign-out event
      console.log(`User signed out: ${token?.email}`);
    },
    async session({ token, session }) {
      // Useful for monitoring session updates
      if (process.env.NODE_ENV === "development") {
        console.log("Session updated");
      }
    },
  },
});
