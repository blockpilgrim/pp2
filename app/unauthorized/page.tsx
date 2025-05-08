'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { data: session } = useSession();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="mb-6">
          You don't have permission to access this resource. This could be because:
        </p>
        <ul className="list-disc pl-5 mb-6 space-y-2">
          <li>You're not logged in</li>
          <li>Your account doesn't have the required permissions</li>
          <li>You need a different role to access this page</li>
        </ul>
        
        <div className="flex flex-col space-y-2">
          {session ? (
            <>
              <p className="text-sm mb-2">
                Logged in as: <span className="font-medium">{session.user?.email}</span>
              </p>
              <p className="text-sm mb-4">
                Roles: <span className="font-medium">{session.user?.roles?.join(', ') || 'None'}</span>
              </p>
            </>
          ) : (
            <p className="text-sm mb-4">You are not currently logged in.</p>
          )}
          
          <button 
            onClick={() => router.push('/')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </button>
          
          <button 
            onClick={() => router.push('/login')}
            className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}