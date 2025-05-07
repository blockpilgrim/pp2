'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Type for API test result
 */
type TestResult = {
  success: boolean;
  message: string;
  timestamp?: string;
  error?: {
    type?: string;
    details?: any;
  };
  contacts?: Array<{
    firstname?: string;
    lastname?: string;
    emailaddress1?: string;
    [key: string]: any;
  }>;
};

export default function CorePocPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Test Dataverse connection
   */
  const testDataverseConnection = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('/api/dataverse/test');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to test Dataverse connection');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('Error testing Dataverse connection:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Core Infrastructure POC</h1>
      
      <p className="mb-8">
        This POC demonstrates the core infrastructure components needed for the Partner Lead Management 
        Portal, including Dataverse integration, error handling, and environment configuration.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dataverse Connection Test</CardTitle>
            <CardDescription>
              Test the connection to Dynamics 365 Dataverse API and token caching
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testDataverseConnection} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Testing...' : 'Test Connection'}
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            {error && (
              <div className="text-red-500 text-sm w-full p-4 bg-red-50 rounded-md mb-4">
                <p className="font-semibold">Error:</p>
                <p>{error}</p>
              </div>
            )}
            
            {result && (
              <div className="w-full">
                <div className={`p-4 rounded-md mb-4 ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
                  <p className={`font-semibold ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                    {result.success ? 'Success!' : 'Failed'}
                  </p>
                  <p className="text-sm">{result.message}</p>
                  {result.timestamp && (
                    <p className="text-xs text-gray-500 mt-1">Timestamp: {result.timestamp}</p>
                  )}
                </div>

                {result.contacts && result.contacts.length > 0 && (
                  <div>
                    <p className="font-semibold mb-2">Sample Contacts:</p>
                    <div className="border rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              First Name
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Last Name
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {result.contacts.map((contact, idx) => (
                            <tr key={idx}>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">{contact.firstname || '-'}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">{contact.lastname || '-'}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm font-mono text-xs">{contact.emailaddress1 || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Core Infrastructure Features</CardTitle>
            <CardDescription>
              This POC implements the following core infrastructure components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li className="text-sm">
                <span className="font-semibold">D365 Dataverse Client</span> - Reusable client for Dynamics 365 integration
              </li>
              <li className="text-sm">
                <span className="font-semibold">Token Management</span> - In-memory token caching with expiration
              </li>
              <li className="text-sm">
                <span className="font-semibold">Error Handling</span> - Centralized error utilities and typed errors
              </li>
              <li className="text-sm">
                <span className="font-semibold">Environment Configuration</span> - Zod schema validation for environment variables
              </li>
              <li className="text-sm">
                <span className="font-semibold">API Error Responses</span> - Standardized API error responses
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-gray-500">
              Note: This POC uses in-memory token caching which works for development but should be 
              replaced with a more robust solution like Redis or Azure Key Vault in production.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}