'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoginPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-32 mx-auto" />
            <Skeleton className="h-4 w-48 mx-auto" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        {session ? (
          <>
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg 
                    className="h-6 w-6 text-primary" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </div>
              </div>
              <CardTitle className="text-xl">Welcome Back</CardTitle>
              <CardDescription>
                Signed in as {session.user?.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => window.location.href = callbackUrl}
                className="w-full"
                size="lg"
              >
                Continue to {callbackUrl === '/' ? 'Home' : 'Requested Page'}
              </Button>
              <Button
                onClick={() => signOut({ callbackUrl: '/' })}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Sign Out
              </Button>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg 
                    className="h-6 w-6 text-primary" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" 
                    />
                  </svg>
                </div>
              </div>
              <CardTitle className="text-2xl">Partner Portal</CardTitle>
              <CardDescription>
                Sign in to access your partner dashboard and manage leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => signIn('microsoft-entra-id', { 
                  callbackUrl,
                  redirect: true
                })}
                className="w-full"
                size="lg"
              >
                <svg 
                  className="mr-2 h-4 w-4" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4z"/>
                  <path d="M24 11.4H12.6V0H24v11.4z" fill="currentColor" fillOpacity="0.8"/>
                </svg>
                Sign in with Microsoft Entra ID
              </Button>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
