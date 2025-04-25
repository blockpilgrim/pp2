import NextAuth from "next-auth"
import AzureAD from "next-auth/providers/azure-ad"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    AzureAD({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
      // Optional: Configure profile, scope, etc. if needed
      // authorization: { params: { scope: "openid profile email User.Read" } },
    }),
  ],
  // Optional: Add callbacks for JWT, session customization if needed later
  // callbacks: {
  //   async jwt({ token, account }) {
  //     // Persist the OAuth access_token to the token right after signin
  //     if (account) {
  //       token.accessToken = account.access_token
  //     }
  //     return token
  //   },
  //   async session({ session, token, user }) {
  //     // Send properties to the client, like an access_token from JWT
  //     session.accessToken = token.accessToken;
  //     return session
  //   }
  // }
  // Add pages configuration if using custom sign-in pages
  // pages: {
  //   signIn: '/auth/signin',
  // }
})
