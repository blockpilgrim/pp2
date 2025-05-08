'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useHasRole } from '@/lib/utils/auth-utils';
import { UserRole } from '@/lib/auth';
import { AdminOnly, PartnerOnly, AuthenticatedOnly } from '@/components/custom/auth/role-gate';

/**
 * Role-Based Access Control Demonstration Component
 * This component showcases different ways to implement RBAC in the application
 */
export default function RbacDemo() {
  const { data: session, status } = useSession();
  
  // Use the useHasRole hook for role checks
  const isAdmin = useHasRole(session, UserRole.ADMIN);
  const isPartner = useHasRole(session, UserRole.PARTNER);
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Role-Based Access Control Demonstration</h2>
      
      {/* Section 1: Different methods of implementing RBAC */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">RBAC Implementation Methods</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Method 1: Hook-based approach */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">Method 1: Hook-based RBAC</h4>
            <p className="text-sm text-gray-600 mb-4">
              Using the <code>useHasRole</code> hook to conditionally render content
            </p>
            
            <div className="bg-gray-50 p-3 rounded mb-2">
              <p className="font-medium text-sm mb-1">Your roles:</p>
              <ul className="list-disc list-inside text-sm">
                {session?.user?.roles?.map((role, index) => (
                  <li key={index}>{role}</li>
                ))}
                {(!session?.user?.roles || session.user.roles.length === 0) && (
                  <li className="text-gray-500">No roles assigned</li>
                )}
              </ul>
            </div>
            
            <div className="space-y-2">
              {isAdmin && (
                <div className="bg-purple-50 p-2 rounded border border-purple-200">
                  <p className="text-sm">This content is only visible to admins (using hook)</p>
                </div>
              )}
              
              {isPartner && (
                <div className="bg-blue-50 p-2 rounded border border-blue-200">
                  <p className="text-sm">This content is only visible to partners (using hook)</p>
                </div>
              )}
              
              {!isAdmin && !isPartner && session && (
                <div className="bg-green-50 p-2 rounded border border-green-200">
                  <p className="text-sm">This content is visible to any authenticated user (using hook)</p>
                </div>
              )}
              
              {!session && (
                <div className="bg-gray-50 p-2 rounded border">
                  <p className="text-sm text-gray-500">Sign in to see role-specific content</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Method 2: Component-based approach */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">Method 2: Component-based RBAC</h4>
            <p className="text-sm text-gray-600 mb-4">
              Using role gate components to conditionally render content
            </p>
            
            <div className="space-y-2">
              <AdminOnly fallback={
                <div className="bg-gray-50 p-2 rounded border">
                  <p className="text-sm text-gray-500">Admin content not available (using component)</p>
                </div>
              }>
                <div className="bg-purple-50 p-2 rounded border border-purple-200">
                  <p className="text-sm">This content is only visible to admins (using component)</p>
                </div>
              </AdminOnly>
              
              <PartnerOnly fallback={
                <div className="bg-gray-50 p-2 rounded border">
                  <p className="text-sm text-gray-500">Partner content not available (using component)</p>
                </div>
              }>
                <div className="bg-blue-50 p-2 rounded border border-blue-200">
                  <p className="text-sm">This content is only visible to partners (using component)</p>
                </div>
              </PartnerOnly>
              
              <AuthenticatedOnly fallback={
                <div className="bg-gray-50 p-2 rounded border">
                  <p className="text-sm text-gray-500">Sign in to see authenticated content</p>
                </div>
              }>
                <div className="bg-green-50 p-2 rounded border border-green-200">
                  <p className="text-sm">This content is visible to any authenticated user (using component)</p>
                </div>
              </AuthenticatedOnly>
            </div>
          </div>
        </div>
      </div>
      
      {/* Section 2: Advanced RBAC patterns */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Advanced RBAC Patterns</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Multiple role check */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">Multiple Role Checks</h4>
            <p className="text-sm text-gray-600 mb-4">
              Checking for multiple roles (admin OR partner)
            </p>
            
            {(isAdmin || isPartner) ? (
              <div className="bg-indigo-50 p-3 rounded border border-indigo-200">
                <p className="text-sm">This content is visible to both admins and partners</p>
                <p className="text-xs text-gray-600 mt-1">
                  Your role(s): {session?.user?.roles?.join(', ')}
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 p-3 rounded border">
                <p className="text-sm text-gray-500">
                  You need either admin or partner role to view this content
                </p>
              </div>
            )}
          </div>
          
          {/* Progressive UI enhancement */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">Progressive UI Enhancement</h4>
            <p className="text-sm text-gray-600 mb-4">
              Adding more UI elements based on increasing privilege levels
            </p>
            
            <div className="space-y-2">
              <AuthenticatedOnly>
                <div className="bg-green-50 p-2 rounded border border-green-200">
                  <p className="text-sm">Basic user features - visible to all users</p>
                </div>
                
                <PartnerOnly>
                  <div className="bg-blue-50 p-2 rounded border border-blue-200">
                    <p className="text-sm">Partner features - visible to partners and admins</p>
                  </div>
                  
                  <AdminOnly>
                    <div className="bg-purple-50 p-2 rounded border border-purple-200">
                      <p className="text-sm">Admin features - visible only to admins</p>
                    </div>
                  </AdminOnly>
                </PartnerOnly>
              </AuthenticatedOnly>
            </div>
          </div>
        </div>
      </div>
      
      {/* Section 3: RBAC for actions and forms */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">RBAC for Actions and Forms</h3>
        
        <div className="border rounded-lg p-4 mb-4">
          <h4 className="font-medium mb-2">Form with Role-Based Fields</h4>
          <p className="text-sm text-gray-600 mb-4">
            This form adapts based on the user's role, showing different fields
          </p>
          
          <AuthenticatedOnly fallback={
            <p className="text-sm text-gray-500">Sign in to see this form</p>
          }>
            <form className="space-y-3">
              {/* Common fields for all users */}
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded"
                  placeholder="Enter title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea 
                  className="w-full p-2 border rounded"
                  placeholder="Enter description"
                  rows={2}
                />
              </div>
              
              {/* Partner-only fields */}
              <PartnerOnly>
                <div className="p-2 bg-blue-50 rounded border border-blue-200">
                  <label className="block text-sm font-medium mb-1">Partner Data</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded"
                    placeholder="Partner-specific data"
                  />
                  <p className="text-xs text-gray-600 mt-1">This field is only shown to partners</p>
                </div>
              </PartnerOnly>
              
              {/* Admin-only fields */}
              <AdminOnly>
                <div className="p-2 bg-purple-50 rounded border border-purple-200">
                  <label className="block text-sm font-medium mb-1">Admin Settings</label>
                  <select className="w-full p-2 border rounded">
                    <option>Default Settings</option>
                    <option>Advanced Settings</option>
                    <option>Custom Configuration</option>
                  </select>
                  <p className="text-xs text-gray-600 mt-1">These settings are only shown to admins</p>
                </div>
              </AdminOnly>
              
              {/* Role-based submit buttons */}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Submit
                </button>
                
                <AdminOnly>
                  <button
                    type="button"
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                  >
                    Admin Action
                  </button>
                </AdminOnly>
              </div>
            </form>
          </AuthenticatedOnly>
        </div>
        
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-2">Role-Based Actions</h4>
          <p className="text-sm text-gray-600 mb-4">
            Different action buttons based on user roles
          </p>
          
          <div className="bg-gray-50 p-3 rounded mb-4">
            <h5 className="font-medium text-sm mb-2">Item: Sample Document</h5>
            <p className="text-sm text-gray-600">This is a sample document that has role-based actions.</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <AuthenticatedOnly>
              <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200 transition-colors">
                View
              </button>
            </AuthenticatedOnly>
            
            <PartnerOnly>
              <button className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200 transition-colors">
                Edit
              </button>
              <button className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm hover:bg-yellow-200 transition-colors">
                Share
              </button>
            </PartnerOnly>
            
            <AdminOnly>
              <button className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200 transition-colors">
                Delete
              </button>
              <button className="px-3 py-1 bg-purple-100 text-purple-800 rounded text-sm hover:bg-purple-200 transition-colors">
                Change Owner
              </button>
            </AdminOnly>
          </div>
        </div>
      </div>
      
      {/* Section 4: Implementation code examples */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Implementation Code Examples</h3>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">Hook-based RBAC Example</h4>
            <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto">
{`// Using the useHasRole hook
const { data: session } = useSession();
const isAdmin = useHasRole(session, UserRole.ADMIN);

// Then in your JSX:
{isAdmin && (
  <div>Admin only content</div>
)}

// For multiple roles:
const hasPermission = useHasRole(session, [UserRole.ADMIN, UserRole.PARTNER]);
`}
            </pre>
          </div>
          
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">Component-based RBAC Example</h4>
            <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto">
{`// Import the component
import { AdminOnly, PartnerOnly } from '@/components/custom/auth/role-gate';

// Then in your JSX:
<AdminOnly fallback={<p>Not authorized</p>}>
  <div>Admin only content</div>
</AdminOnly>

// For multiple roles:
<RoleGate allowedRoles={[UserRole.ADMIN, UserRole.PARTNER]}>
  <div>Content for admins or partners</div>
</RoleGate>
`}
            </pre>
          </div>
          
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">Server Component RBAC Example</h4>
            <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto">
{`// In a Server Component:
import { requireRole } from '@/lib/utils/auth-utils';
import { UserRole } from '@/lib/auth';

export default async function AdminPage() {
  // This will redirect to /unauthorized if user doesn't have admin role
  const session = await requireRole(UserRole.ADMIN);
  
  return (
    <div>
      <h1>Welcome, Admin {session.user.name}</h1>
      {/* Rest of the admin content */}
    </div>
  );
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}