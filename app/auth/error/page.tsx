'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// A simple mapping for known error codes to user-friendly messages
const errorMessages: Record<string, string> = {
  default: 'An unexpected error occurred during authentication. Please try again.',
  Configuration: 'There is a configuration problem with the authentication system. Please contact support.',
  AccessDenied: 'You do not have permission to access this resource. Please contact support if you believe this is an error.',
  Verification: 'The sign-in link is no longer valid. It may have been used already or expired.',
  // NextAuth.js specific errors (can be found in their documentation or by observing query params)
  OAuthSignin: 'There was an error signing in with the OAuth provider. Please try again.',
  OAuthCallback: 'There was an error during the OAuth callback. Please try again.',
  OAuthCreateAccount: 'Could not create a user account using the OAuth provider. The email may already be in use with a different sign-in method.',
  EmailCreateAccount: 'Could not create a user account with the email provider. The email may already be in use.',
  Callback: 'There was an error in the callback handling. Please try again.',
  OAuthAccountNotLinked: 'This OAuth account is not linked to a user. If you have an existing account, please sign in with that method first.',
  EmailSignin: 'Sending the sign-in email failed. Please try again.',
  CredentialsSignin: 'Sign in failed. Check the details you provided are correct.',
  SessionRequired: 'Please sign in to access this page.',
  // Custom errors from our lib/auth.ts
  D365LookupFailed: 'We could not retrieve your profile details from our system. Some features might be limited. Please contact support if this persists.',
  RefreshAccessTokenError: 'Your session has expired or needs to be refreshed. Please try signing in again.',
  MissingRefreshTokenError: 'Your session is missing critical information for refresh. Please sign in again.',

};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const errorType = searchParams.get('error');
  const [errorMessage, setErrorMessage] = useState<string>(errorMessages.default);

  useEffect(() => {
    if (errorType && errorMessages[errorType]) {
      setErrorMessage(errorMessages[errorType]);
    } else if (errorType) {
      // Fallback for unknown error types, still showing the type if available
      setErrorMessage(`An error occurred: ${errorType}. Please try again or contact support.`);
    } else {
      setErrorMessage(errorMessages.default);
    }
  }, [errorType]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 md:p-12 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-red-600 dark:text-red-500 mb-4">Authentication Error</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          {errorMessage}
        </p>
        <div className="space-y-3">
          <Link 
            href="/login" 
            className="block w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Try Signing In Again
          </Link>
          <Link 
            href="/" 
            className="block w-full px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
        {errorType && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
            Error code: {errorType}
          </p>
        )}
      </div>
    </div>
  );
}
