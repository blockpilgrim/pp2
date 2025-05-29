'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useHasRole } from '@/lib/utils/auth-utils';
import { UserRole } from '@/lib/auth';
import RbacDemo from '@/components/custom/auth/rbac-demo';
import SessionMonitor from '@/components/custom/auth/session-monitor';

export default function AuthPocPage() {
  const { data: session, status, update: updateSession } = useSession(); // Added updateSession
  const [isLoadingClient, setIsLoadingClient] = useState(true); // Renamed to avoid conflict with status === 'loading'
  
  // State to track which demo panel is expanded
  const [expandedPanel, setExpandedPanel] = useState<string | null>(null);
  
  // Derived states based on session
  const isAuthenticated = status === 'authenticated' && !!session;
  const isAdmin = isAuthenticated && useHasRole(session, UserRole.ADMIN);
  const isPartner = isAuthenticated && useHasRole(session, UserRole.PARTNER);
  
  useEffect(() => {
    // This effect runs once on mount to ensure client-side state is initialized
    // and to potentially set the initial expanded panel.
    setIsLoadingClient(false);
    if (status !== 'loading') { // Only set panel if session status is determined
      setExpandedPanel('authentication');
    }
  }, [status]); // Rerun if session status changes, e.g., after login/logout

  // Optional: If there's a specific need to force a session refresh on mount,
  // for example, if redirects or specific flows lead to stale session data
  // that SessionProvider's polling doesn't catch immediately.
  // useEffect(() => {
  //   if (status === 'authenticated') { // Or some other condition
  //     // updateSession(); // Call this to force a session refetch from server
  //   }
  // }, [status, updateSession]); // Careful with dependencies to avoid infinite loops

  const handleSignIn = async () => {
    try {
      await signIn('microsoft-entra-id', { 
        callbackUrl: '/poc/auth',
        redirect: true
      });
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };
  
  if (isLoadingClient || status === 'loading') {
    return (
      <div className="container mx-auto p-6 max-w-5xl text-center">
        <p>Loading authentication details...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Authentication & Authorization POC</h1>
      
      {/* Authentication Status */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Current Authentication Status</h2>
        
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <div className={`w-3 h-3 rounded-full mr-2 ${isAuthenticated ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="font-medium">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</span>
          </div>
          
          {isAuthenticated && session?.user && (
            <div className="ml-5 mt-2">
              <p className="text-sm text-gray-600">Logged in as: <span className="font-medium">{session.user.email}</span></p>
              <p className="text-sm text-gray-600">Name: <span className="font-medium">{session.user.name}</span></p>
              <p className="text-sm text-gray-600">Roles: <span className="font-medium">{session.user.roles?.join(', ') || 'None'}</span></p>
              <p className="text-sm text-gray-600">D365 User: <span className="font-medium">{session.user.isD365User ? 'Yes' : 'No'}</span></p>
              {session.error && (
                <p className="text-sm text-red-500">Session Error: <span className="font-medium">{session.error}</span></p>
              )}
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-3">
          {!isAuthenticated ? (
            <button
              onClick={handleSignIn}
              className="bg-[var(--button-primary-bg)] hover:bg-[var(--button-primary-bg-hover)] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-150"
            >
              Sign In with Microsoft Entra ID
            </button>
          ) : (
            <button
              onClick={() => signOut({ 
                callbackUrl: '/poc/auth',
                redirect: true
              })}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
      
      {/* Demo Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Protected Routes Panel */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <button 
            className="w-full p-4 text-left font-semibold text-lg bg-gray-50 flex justify-between items-center"
            onClick={() => setExpandedPanel(expandedPanel === 'protected-routes' ? null : 'protected-routes')}
          >
            Protected Routes Demo
            <svg 
              className={`w-5 h-5 transition-transform ${expandedPanel === 'protected-routes' ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          
          {expandedPanel === 'protected-routes' && (
            <div className="p-4">
              <p className="mb-4">These pages demonstrate Next.js route protection using middleware:</p>
              
              <div className="space-y-3 mb-4">
                <div className="border rounded-lg p-3">
                  <h3 className="font-medium mb-1">Authentication Required</h3>
                  <p className="text-sm text-gray-600 mb-2">This page requires any authenticated user</p>
                  <Link 
                    href="/poc/auth/protected"
                    className="text-blue-600 hover:underline text-sm inline-block"
                  >
                    Visit Protected Page
                  </Link>
                </div>
                
                <div className="border rounded-lg p-3">
                  <h3 className="font-medium mb-1">Admin Access</h3>
                  <p className="text-sm text-gray-600 mb-2">This page requires admin role access</p>
                  <Link 
                    href="/poc/auth/admin"
                    className="text-blue-600 hover:underline text-sm inline-block"
                  >
                    Visit Admin Page
                  </Link>
                  {!isAdmin && isAuthenticated && (
                    <p className="text-xs text-red-500 mt-1">
                      Note: You don't have admin role and will be redirected to unauthorized
                    </p>
                  )}
                </div>
                
                <div className="border rounded-lg p-3">
                  <h3 className="font-medium mb-1">Partner Access</h3>
                  <p className="text-sm text-gray-600 mb-2">This page requires partner role access</p>
                  <Link 
                    href="/poc/auth/partner"
                    className="text-blue-600 hover:underline text-sm inline-block"
                  >
                    Visit Partner Page
                  </Link>
                  {!isPartner && isAuthenticated && (
                    <p className="text-xs text-red-500 mt-1">
                      Note: You don't have partner role and will be redirected to unauthorized
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Role-Based UI Components */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <button 
            className="w-full p-4 text-left font-semibold text-lg bg-gray-50 flex justify-between items-center" 
            onClick={() => setExpandedPanel(expandedPanel === 'rbac-ui' ? null : 'rbac-ui')}
          >
            Role-Based UI Components
            <svg 
              className={`w-5 h-5 transition-transform ${expandedPanel === 'rbac-ui' ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          
          {expandedPanel === 'rbac-ui' && (
            <div className="p-4">
              <p className="mb-4">These UI components demonstrate conditional rendering based on user role:</p>
              
              <div className="space-y-4">
                {/* Any User Content */}
                <div className="border rounded-lg p-3">
                  <h3 className="font-medium mb-2">User Content</h3>
                  {isAuthenticated ? (
                    <div className="bg-gray-50 p-3 rounded">
                      <p>This content is visible to any authenticated user.</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Log in to see content for authenticated users.</p>
                  )}
                </div>
                
                {/* Partner Content */}
                <div className="border rounded-lg p-3">
                  <h3 className="font-medium mb-2">Partner Content</h3>
                  {isPartner ? (
                    <div className="bg-blue-50 p-3 rounded">
                      <p>This content is only visible to users with the Partner role.</p>
                      <p className="text-sm mt-2">Partners can access special features and data.</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      {isAuthenticated 
                        ? "You don't have the Partner role to view this content." 
                        : "Log in with a Partner account to see this content."}
                    </p>
                  )}
                </div>
                
                {/* Admin Content */}
                <div className="border rounded-lg p-3">
                  <h3 className="font-medium mb-2">Admin Content</h3>
                  {isAdmin ? (
                    <div className="bg-purple-50 p-3 rounded">
                      <p>This content is only visible to users with the Admin role.</p>
                      <div className="mt-2 p-2 bg-white rounded border border-purple-200">
                        <h4 className="text-sm font-medium">Admin Dashboard Preview</h4>
                        <p className="text-xs mt-1">User management, system settings, and audit logs would appear here.</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      {isAuthenticated 
                        ? "You don't have the Admin role to view this content." 
                        : "Log in with an Admin account to see this content."}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Session Persistence Demo */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <button 
          className="w-full p-4 text-left font-semibold text-lg bg-gray-50 flex justify-between items-center"
          onClick={() => setExpandedPanel(expandedPanel === 'session-demo' ? null : 'session-demo')}
        >
          Session Persistence Demo
          <svg 
            className={`w-5 h-5 transition-transform ${expandedPanel === 'session-demo' ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        
        {expandedPanel === 'session-demo' && (
          <div className="p-4">
            <SessionMonitor />
          </div>
        )}
      </div>
      
      {/* Comprehensive RBAC Demo */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <button 
          className="w-full p-4 text-left font-semibold text-lg bg-gray-50 flex justify-between items-center"
          onClick={() => setExpandedPanel(expandedPanel === 'rbac-demo' ? null : 'rbac-demo')}
        >
          Advanced RBAC Demonstration
          <svg 
            className={`w-5 h-5 transition-transform ${expandedPanel === 'rbac-demo' ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        
        {expandedPanel === 'rbac-demo' && (
          <div className="p-4">
            <RbacDemo />
          </div>
        )}
      </div>
      
      {/* Implementation Notes */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <button 
          className="w-full p-4 text-left font-semibold text-lg bg-gray-50 flex justify-between items-center"
          onClick={() => setExpandedPanel(expandedPanel === 'implementation' ? null : 'implementation')}
        >
          Implementation Notes
          <svg 
            className={`w-5 h-5 transition-transform ${expandedPanel === 'implementation' ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        
        {expandedPanel === 'implementation' && (
          <div className="p-4">
            <h3 className="font-medium mb-3">Authentication & Authorization Implementation</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li><strong>Auth Provider:</strong> NextAuth v5 (Auth.js) with Microsoft Entra ID</li>
              <li><strong>Session Strategy:</strong> JWT-based with custom claims for user roles</li>
              <li><strong>Route Protection:</strong> Next.js middleware for route-based access control</li>
              <li><strong>Role Management:</strong> User roles sourced from Dynamics 365, stored in JWT and session</li>
              <li><strong>UI Integration:</strong> Role-based conditional rendering patterns</li>
              <li><strong>Helpers:</strong> Server and client utilities for role checking</li>
            </ul>
            
            <div className="mt-6">
              <h3 className="font-medium mb-3">Security Features</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><strong>CSRF Protection:</strong> NextAuth's built-in CSRF protection</li>
                <li><strong>Secure Session:</strong> JWT tokens with proper expiration and secure cookie settings</li>
                <li><strong>Protected Routes:</strong> Authentication checks via middleware</li>
                <li><strong>Role Verification:</strong> Multiple levels of role-based access control</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
