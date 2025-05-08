'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

/**
 * SessionMonitor component
 * 
 * This component helps track and display session persistence information.
 * Useful for debugging session issues and demonstrating session persistence.
 */
export default function SessionMonitor() {
  const { data: session, status, update } = useSession();
  const [sessionHistory, setSessionHistory] = useState<{ timestamp: Date; event: string }[]>([]);
  const [lastActivity, setLastActivity] = useState<Date | null>(null);
  const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null);
  
  // Calculate the session expiry time when the session loads
  useEffect(() => {
    if (session && status === 'authenticated') {
      const now = new Date();
      setLastActivity(now);
      
      // Add the session initialization to history
      setSessionHistory(prev => [
        { timestamp: now, event: 'Session initialized/refreshed' },
        ...prev.slice(0, 9), // Keep only the last 10 events
      ]);
      
      // Calculate approximate session expiry
      // This is just an estimate based on the default Next Auth settings
      if (session.expires) {
        const expiry = new Date(session.expires);
        setSessionExpiry(expiry);
      } else {
        // Default to 30 days from now if no explicit expiry
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 30);
        setSessionExpiry(expiry);
      }
    }
  }, [session, status]);
  
  // Track user activity to demonstrate session refreshing
  useEffect(() => {
    const trackActivity = () => {
      const now = new Date();
      setLastActivity(now);
      
      // Add activity to history
      setSessionHistory(prev => [
        { timestamp: now, event: 'User activity detected' },
        ...prev.slice(0, 9), // Keep only the last 10 events
      ]);
    };
    
    // Set up event listeners for common user activities
    window.addEventListener('click', trackActivity);
    window.addEventListener('keypress', trackActivity);
    window.addEventListener('scroll', trackActivity);
    
    // Attempt to refresh the session every 5 minutes of activity
    const activityInterval = setInterval(() => {
      if (lastActivity) {
        const now = new Date();
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
        
        if (lastActivity > fiveMinutesAgo && status === 'authenticated') {
          // Only update session if there's been activity in the last 5 minutes
          update(); // Trigger a session refresh
          
          // Add refresh attempt to history
          setSessionHistory(prev => [
            { timestamp: now, event: 'Session refresh attempted' },
            ...prev.slice(0, 9), // Keep only the last 10 events
          ]);
        }
      }
    }, 5 * 60 * 1000); // Check every 5 minutes
    
    return () => {
      // Clean up event listeners
      window.removeEventListener('click', trackActivity);
      window.removeEventListener('keypress', trackActivity);
      window.removeEventListener('scroll', trackActivity);
      clearInterval(activityInterval);
    };
  }, [lastActivity, status, update]);
  
  // Check for session errors
  useEffect(() => {
    if (session?.error) {
      const now = new Date();
      setSessionHistory(prev => [
        { timestamp: now, event: `Session error: ${session.error}` },
        ...prev.slice(0, 9), // Keep only the last 10 events
      ]);
    }
  }, [session]);
  
  return (
    <div className="border rounded-lg p-4 bg-white">
      <h3 className="font-semibold mb-3">Session Health Monitor</h3>
      
      <div className="space-y-4">
        {/* Current Status */}
        <div>
          <h4 className="text-sm font-medium">Current Status</h4>
          <div className="flex items-center mt-1">
            <div 
              className={`w-3 h-3 rounded-full mr-2 ${
                status === 'authenticated'
                  ? 'bg-green-500'
                  : status === 'loading'
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
            />
            <span className="text-sm">
              {status === 'authenticated'
                ? 'Authenticated'
                : status === 'loading'
                ? 'Loading...'
                : 'Not authenticated'}
            </span>
          </div>
        </div>
        
        {/* Session Timing */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <h4 className="text-sm font-medium">Last Activity</h4>
            <p className="text-sm text-gray-600">
              {lastActivity ? lastActivity.toLocaleTimeString() : 'N/A'}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium">Session Expires</h4>
            <p className="text-sm text-gray-600">
              {sessionExpiry ? sessionExpiry.toLocaleString() : 'N/A'}
            </p>
          </div>
        </div>
        
        {/* Session Information */}
        {session && (
          <div>
            <h4 className="text-sm font-medium">Session Data</h4>
            <div className="mt-1 text-xs bg-gray-50 p-2 rounded max-h-24 overflow-auto">
              <pre>{JSON.stringify({ user: session.user }, null, 2)}</pre>
            </div>
          </div>
        )}
        
        {/* Activity Log */}
        <div>
          <h4 className="text-sm font-medium">Session Activity</h4>
          <div className="mt-1 max-h-40 overflow-y-auto">
            <table className="text-xs w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-1 text-left">Time</th>
                  <th className="p-1 text-left">Event</th>
                </tr>
              </thead>
              <tbody>
                {sessionHistory.length > 0 ? (
                  sessionHistory.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-1">{item.timestamp.toLocaleTimeString()}</td>
                      <td className="p-1">{item.event}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="p-1 text-gray-500 text-center">No activity recorded</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Session Persistence Demo */}
        <div className="bg-blue-50 p-3 rounded border border-blue-200">
          <h4 className="text-sm font-medium mb-1">Session Persistence Demo</h4>
          <p className="text-xs text-gray-700 mb-2">
            To test session persistence:
          </p>
          <ol className="list-decimal list-inside text-xs text-gray-700">
            <li>Sign in and note session expiry time</li>
            <li>Refresh or navigate to different pages</li>
            <li>Return to view that session persists</li>
            <li>Close and reopen browser to test cookie persistence</li>
          </ol>
        </div>
      </div>
    </div>
  );
}