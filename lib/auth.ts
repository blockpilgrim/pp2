import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

/**
 * NextAuth v5 configuration
 * All provider credentials are inferred from environment variables
 *   AUTH_MICROSOFT_ENTRA_ID_ID
 *   AUTH_MICROSOFT_ENTRA_ID_SECRET
 *   AUTH_MICROSOFT_ENTRA_ID_ISSUER
 */
export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  providers: [MicrosoftEntraID],
  // You can add callbacks, custom pages, etc. later as needed.
});
