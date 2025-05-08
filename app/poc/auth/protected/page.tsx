import React from 'react';
import { requireAuth } from '@/lib/utils/auth-utils';
import Link from 'next/link';

// This is a server component that uses the requireAuth helper
// It will automatically redirect to /login if the user is not authenticated
export default async function ProtectedPage() {
  // Get the session - will redirect to login if not authenticated
  const session = await requireAuth();
  
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                <strong>Authentication Success!</strong> You have successfully accessed a protected route.
              </p>
            </div>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Protected Page</h1>
        <p className="mb-4">This page is only accessible to authenticated users. The middleware checks your authentication status before allowing access to this route.</p>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-2">Your Session Information</h2>
          <div className="overflow-x-auto">
            <pre className="text-xs bg-gray-100 p-3 rounded">
              {JSON.stringify(
                {
                  user: {
                    name: session.user?.name,
                    email: session.user?.email,
                    roles: session.user?.roles,
                  },
                  expires: session.expires,
                }, 
                null, 
                2
              )}
            </pre>
          </div>
        </div>
        
        <h2 className="text-lg font-semibold mb-2">How It Works</h2>
        <p className="mb-4">
          This page is protected using Next.js middleware. When you visit this route:
        </p>
        <ol className="list-decimal pl-5 mb-6 space-y-1">
          <li>The middleware intercepts the request</li>
          <li>It checks for a valid authentication session</li>
          <li>If authenticated, access is granted</li>
          <li>If not authenticated, you're redirected to the login page</li>
        </ol>
        
        <div className="flex justify-between mt-8">
          <Link 
            href="/poc/auth" 
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            Back to Auth Demo
          </Link>
        </div>
      </div>
    </div>
  );
}