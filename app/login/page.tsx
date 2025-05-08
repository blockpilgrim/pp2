'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import React from 'react';

export default function LoginPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Get the callback URL from the URL query parameters
  const getCallbackUrl = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('callbackUrl') || '/';
    }
    return '/';
  };
  
  const callbackUrl = getCallbackUrl();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {session ? (
        <>
          <p className="mb-4">Signed in as {session.user?.email}</p>
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Sign out
            </button>
            <button
              onClick={() => window.location.href = callbackUrl}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Continue to {callbackUrl === '/' ? 'Home' : 'Requested Page'}
            </button>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-6">Login</h1>
          <button
            onClick={() => signIn('microsoft-entra-id', { 
              callbackUrl,
              redirect: true
            })}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Sign in with Microsoft Entra ID
          </button>
        </>
      )}
    </div>
  );
}
