import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import { type JWT } from "next-auth/jwt";
import { type Session, type User as NextAuthUser } from "next-auth"; // Renamed User to NextAuthUser
import { D365ContactService, type AppContactProfile } from "@/lib/services/d365ContactService";

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
      id: string; // This will be the Azure AD Object ID
      contactId?: string; // D365 Contact ID, if found
      name?: string | null;
      email?: string | null;
      image?: string | null;
      roles?: UserRole[]; // Roles sourced from D365
      states?: string[]; // State assignments from D365
      d365Profile?: Partial<AppContactProfile>; // To store parts of the D365 profile
      isD365User?: boolean; // Flag to indicate if a D365 contact was successfully linked
    };
    error?: string; // For propagating errors like token refresh failure or D365 lookup issues
  }

  // The User object passed to JWT callback on initial sign-in from the provider
  interface User extends NextAuthUser {
    id: string; // Azure AD Object ID from the provider
    roles?: UserRole[]; // Initial roles (will be overridden by D365 roles)
    oid?: string; // Azure AD profile often provides 'oid' (Object ID)
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string; // Azure AD Object ID (maps to user.id or profile.oid)
    contactId?: string; // D365 Contact ID
    roles?: UserRole[]; // Roles sourced from D365
    states?: string[]; // State assignments from D365
    d365Profile?: Partial<AppContactProfile>;
    isD365User?: boolean;

    // Standard JWT claims that NextAuth might add or expect
    name?: string | null;
    email?: string | null;
    picture?: string | null; // For user image

    // Fields for token refresh management (if applicable)
    accessToken?: string;
    accessTokenExpires?: number; // Store as timestamp (milliseconds)
    refreshToken?: string;
    error?: string; // For token-related errors or D365 lookup issues
  }
}

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
          scope: "openid profile email User.Read", // Request 'oid' via 'profile'
          prompt: "select_account",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours - how frequently to resave session
  },
  pages: {
    signIn: "/login",
    error: "/auth/error", // Redirect to a custom error page
    signOut: "/login",
  },
  debug: process.env.NODE_ENV === "development",
  useSecureCookies: process.env.NODE_ENV === "production",
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
      // Use __Host- prefix in production for more security (requires secure: true, path: "/")
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
    async jwt({ token, user, account, profile }) {
      // `user`, `account`, `profile` are only passed on the initial sign-in
      if (user && account) {
        // `profile.oid` (Object ID) is the preferred unique identifier from Azure AD.
        // `user.id` from the MicrosoftEntraID provider should also be the OID.
        const azureAdObjectId = (profile as any)?.oid || user.id;
        token.id = azureAdObjectId; // Store AAD OID as the primary ID in the JWT

        // Persist the OAuth access_token and other details to the token right after sign-in
        // These are typically for calling other APIs (e.g., MS Graph) on behalf of the user.
        if (account.access_token) token.accessToken = account.access_token;
        if (account.refresh_token) token.refreshToken = account.refresh_token;
        // account.expires_at is in seconds, convert to milliseconds for consistency with Date.now()
        if (account.expires_at) token.accessTokenExpires = account.expires_at * 1000; 

        // Set initial name, email, picture from AAD profile, can be overridden by D365
        token.name = user.name || (profile as any)?.name; // profile might not have name directly typed
        token.email = user.email || (profile as any)?.email; // profile might not have email directly typed
        token.picture = user.image || (profile as any)?.picture; // profile might not have picture directly typed

        // Fetch D365 Contact details and roles
        try {
          const contactProfile = await D365ContactService.getContactByAzureADObjectId(azureAdObjectId);

          if (contactProfile) {
            token.contactId = contactProfile.contactId;
            token.roles = contactProfile.roles; // Roles from D365 take precedence
            token.states = contactProfile.states; // State assignments from D365
            token.d365Profile = { // Store relevant D365 profile info
              firstName: contactProfile.firstName,
              lastName: contactProfile.lastName,
              email: contactProfile.email,
              states: contactProfile.states,
            };
            token.isD365User = true;

            // Update token's name and email from D365 if available and preferred
            if (contactProfile.firstName) {
              token.name = `${contactProfile.firstName} ${contactProfile.lastName || ''}`.trim();
            }
            if (contactProfile.email) {
              token.email = contactProfile.email; // D365 email can augment/override AAD email
            }
          } else {
            // No D365 contact found. User is authenticated via AAD but not in our D365 system.
            console.warn(`No D365 Contact found for AAD OID ${azureAdObjectId}. Assigning default role(s).`);
            token.roles = [UserRole.USER]; // Assign a default basic role
            token.isD365User = false;
          }
        } catch (error) {
          console.error("Error fetching D365 contact in JWT callback:", error);
          token.roles = [UserRole.USER]; // Fallback role on error
          token.isD365User = false;
          token.error = "D365LookupFailed"; // Propagate error to be handled in session or client
        }
      }

      // TODO: Implement Entra ID access token refresh logic if token.accessToken is actively used.
      // This is crucial if the accessToken is used for calling APIs like Microsoft Graph.
      // The current Entra ID ID tokens are typically long-lived and refreshed via SSO.
      // This placeholder addresses the refresh of the *access token* if it has a shorter lifespan.
      if (token.accessTokenExpires && Date.now() > token.accessTokenExpires) {
        if (token.refreshToken) {
          console.log("Access token expired. Attempting refresh (placeholder)...");
          // Example structure for token refresh:
          // try {
          //   const refreshedTokens = await refreshAccessToken(token.refreshToken); // Implement this function
          //   token.accessToken = refreshedTokens.access_token;
          //   token.accessTokenExpires = Date.now() + refreshedTokens.expires_in * 1000;
          //   token.refreshToken = refreshedTokens.refresh_token ?? token.refreshToken; // Fallback to old refresh token
          //   delete token.error; // Clear previous errors
          // } catch (refreshError) {
          //   console.error("Error refreshing access token:", refreshError);
          //   token.error = "RefreshAccessTokenError";
          //   // Potentially sign out the user or restrict access
          // }
          // For now, just mark an error as a reminder if refresh is not implemented.
           token.error = token.error || "RefreshAccessTokenError"; // Keep existing error or add new one
        } else {
          console.warn("Access token expired, but no refresh token available.");
          token.error = token.error || "MissingRefreshTokenError";
        }
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      // Transfer properties from JWT token to the client-side session object
      session.user.id = token.id; // Azure AD Object ID

      if (token.contactId) session.user.contactId = token.contactId;
      if (token.roles) session.user.roles = token.roles;
      if (token.states) session.user.states = token.states;
      if (token.d365Profile) {
        session.user.d365Profile = token.d365Profile;
        // Ensure session name/email reflect D365 profile if available
        session.user.name = token.d365Profile.firstName ? `${token.d365Profile.firstName} ${token.d365Profile.lastName || ''}`.trim() : token.name;
        session.user.email = token.d365Profile.email || token.email;
      } else {
        // Fallback to token's name/email if d365Profile is not set
        session.user.name = token.name;
        session.user.email = token.email;
      }
      session.user.image = token.picture; // User image from token (originally from AAD)
      session.user.isD365User = token.isD365User;

      // Propagate any errors from the JWT callback (e.g., D365 lookup failure, token refresh error)
      if (token.error) {
        session.error = token.error;
      }

      return session;
    },

    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl; // Default to redirecting to the base URL
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      const azureAdObjectId = (profile as any)?.oid || user.id;
      console.log(`User signed in: ${user.email} (AAD OID: ${azureAdObjectId}). New user: ${isNewUser}`);
    },
    async signOut({ token, session }) {
      // token might be null if the session was already invalidated
      console.log(`User signed out: ${token?.email || session?.user?.email}`);
    },
    // The 'session' event can be very frequent if updateAge is low. Use with caution for logging.
    // async session({ token, session }) {
    //   if (process.env.NODE_ENV === "development") {
    //     console.log("Session event triggered. Current token email:", token?.email);
    //   }
    // },
  },
});
