import React from 'react';
import { requireRole } from '@/lib/utils/auth-utils';
import { UserRole } from '@/lib/auth';
import Link from 'next/link';

// This is a server component that uses the requireRole helper
// It will automatically redirect to /unauthorized if the user doesn't have admin role
export default async function AdminPage() {
  // Get the session - will redirect to unauthorized if not admin
  const session = await requireRole(UserRole.ADMIN);
  
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="bg-purple-100 border-l-4 border-purple-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-purple-700">
                <strong>Admin Access Granted!</strong> You have successfully accessed the admin area.
              </p>
            </div>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p className="mb-4">This page is only accessible to users with the <strong>Admin</strong> role. The middleware checks your role before allowing access to this route.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <h3 className="font-medium text-gray-800 mb-2">User Management</h3>
            <p className="text-sm text-gray-600">Manage users, roles, and permissions across the system.</p>
          </div>
          
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <h3 className="font-medium text-gray-800 mb-2">System Settings</h3>
            <p className="text-sm text-gray-600">Configure global application settings and properties.</p>
          </div>
          
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <h3 className="font-medium text-gray-800 mb-2">Audit Logs</h3>
            <p className="text-sm text-gray-600">View system activity and security audit trails.</p>
          </div>
          
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <h3 className="font-medium text-gray-800 mb-2">API Management</h3>
            <p className="text-sm text-gray-600">Manage API keys, rate limits, and integration settings.</p>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-2">Admin Session Information</h2>
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
          This page is protected using Next.js middleware with role-based access control:
        </p>
        <ol className="list-decimal pl-5 mb-6 space-y-1">
          <li>The middleware intercepts the request</li>
          <li>It checks for a valid authentication session</li>
          <li>It then verifies that the user has the admin role</li>
          <li>If both checks pass, access is granted</li>
          <li>If not, you're redirected to the unauthorized page</li>
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