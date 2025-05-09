"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { PageContainer } from '@/components/layouts/page-container';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

// Define the Item interface, matching the backend
interface Item {
  id: string;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function BffPocPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // State for creating a new item
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemDescription, setNewItemDescription] = useState<string>('');

  // State for updating an item (simplified: targets the first item for demo)
  const [updateItemId, setUpdateItemId] = useState<string | null>(null);
  const [updateItemName, setUpdateItemName] = useState<string>('');
  const [updateItemDescription, setUpdateItemDescription] = useState<string>('');

  // Fetch items from the BFF API
  const fetchItems = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await fetch('/api/bff-poc/items');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch items: ${response.statusText}`);
      }
      const data: Item[] = await response.json();
      setItems(data);
      if (data.length > 0 && !updateItemId) { // Pre-fill update form with first item for demo
        setUpdateItemId(data[0].id);
        setUpdateItemName(data[0].name);
        setUpdateItemDescription(data[0].description);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Initial fetch

  // Handle creating a new item
  const handleCreateItem = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await fetch('/api/bff-poc/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newItemName, description: newItemDescription }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to create item: ${response.statusText}`);
      }
      const createdItem: Item = await response.json();
      setSuccessMessage(`Item "${createdItem.name}" created successfully!`);
      setNewItemName('');
      setNewItemDescription('');
      fetchItems(); // Refresh the list
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle updating an item
  const handleUpdateItem = async (e: FormEvent) => {
    e.preventDefault();
    if (!updateItemId) {
      setError("No item selected for update.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await fetch(`/api/bff-poc/items?id=${updateItemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: updateItemName, description: updateItemDescription }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update item: ${response.statusText}`);
      }
      const updatedItem: Item = await response.json();
      setSuccessMessage(`Item "${updatedItem.name}" updated successfully!`);
      fetchItems(); // Refresh the list
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const selectItemForUpdate = (item: Item) => {
    setUpdateItemId(item.id);
    setUpdateItemName(item.name);
    setUpdateItemDescription(item.description);
    setSuccessMessage(null);
    setError(null);
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Backend-for-Frontend (BFF) Pattern POC</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            This page demonstrates interactions with Next.js API Routes acting as a BFF.
            It showcases GET, POST, and PATCH operations for a mock "items" resource.
          </p>
        </header>

        {error && (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {successMessage && (
          <Alert variant="default" className="bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Section for GET and Displaying Items */}
          <Card>
            <CardHeader>
              <CardTitle>GET /api/bff-poc/items</CardTitle>
              <CardDescription>Fetch and display a list of items.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && items.length === 0 && <p>Loading items...</p>}
              {!isLoading && items.length === 0 && !error && <p>No items found. Try creating one!</p>}
              {items.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-xs">{item.id.substring(0,5)}...</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => selectItemForUpdate(item)}>
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={fetchItems} disabled={isLoading}>
                {isLoading ? 'Refreshing...' : 'Refresh Items'}
              </Button>
            </CardFooter>
          </Card>

          <div className="space-y-8">
            {/* Section for POST Item */}
            <Card>
              <CardHeader>
                <CardTitle>POST /api/bff-poc/items</CardTitle>
                <CardDescription>Create a new item.</CardDescription>
              </CardHeader>
              <form onSubmit={handleCreateItem}>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="newItemName">Name</Label>
                    <Input
                      id="newItemName"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      placeholder="Enter item name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="newItemDescription">Description</Label>
                    <Textarea
                      id="newItemDescription"
                      value={newItemDescription}
                      onChange={(e) => setNewItemDescription(e.target.value)}
                      placeholder="Enter item description"
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Item'}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            {/* Section for PATCH Item */}
            <Card>
              <CardHeader>
                <CardTitle>PATCH /api/bff-poc/items?id=&#123;itemId&#125;</CardTitle>
                <CardDescription>Update an existing item. Select an item from the list above to edit.</CardDescription>
              </CardHeader>
              <form onSubmit={handleUpdateItem}>
                <CardContent className="space-y-4">
                   {updateItemId ? (
                    <>
                      <div>
                        <Label htmlFor="updateItemId">Item ID (Editing)</Label>
                        <Input id="updateItemId" value={updateItemId} readOnly disabled />
                      </div>
                      <div>
                        <Label htmlFor="updateItemName">New Name</Label>
                        <Input
                          id="updateItemName"
                          value={updateItemName}
                          onChange={(e) => setUpdateItemName(e.target.value)}
                          placeholder="Enter new name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="updateItemDescription">New Description</Label>
                        <Textarea
                          id="updateItemDescription"
                          value={updateItemDescription}
                          onChange={(e) => setUpdateItemDescription(e.target.value)}
                          placeholder="Enter new description"
                          required
                        />
                      </div>
                    </>
                   ) : (
                    <p className="text-muted-foreground">Select an item from the list to enable editing.</p>
                   )}
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading || !updateItemId}>
                    {isLoading ? 'Updating...' : 'Update Item'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Key Features Demonstrated</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
              <li>
                <strong>Secure API Endpoints:</strong> Authentication is checked by the BFF API routes (not explicitly visible here, but enforced by the backend).
              </li>
              <li>
                <strong>Client-Side API Interaction:</strong> Using `fetch` to communicate with Next.js API Routes.
              </li>
              <li>
                <strong>GET, POST, PATCH Operations:</strong> Demonstrating fetching, creating, and updating data.
              </li>
              <li>
                <strong>Dynamic UI Updates:</strong> List refreshes after create/update operations.
              </li>
              <li>
                <strong>Loading and Error States:</strong> Basic visual feedback for API call status.
              </li>
              <li>
                <strong>(Planned) Input Validation:</strong> Currently basic `required` on forms. Server-side validation is in the API. Zod for client-side is for a future POC.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
