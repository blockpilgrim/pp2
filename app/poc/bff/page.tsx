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

  // State for updating an item
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
      // If there are items and no item is currently selected for update,
      // pre-fill the update form with the first item for demonstration purposes.
      if (data.length > 0 && !updateItemId) { 
        setUpdateItemId(data[0].id);
        setUpdateItemName(data[0].name);
        setUpdateItemDescription(data[0].description);
      } else if (data.length === 0) {
        // If no items, clear the update form
        setUpdateItemId(null);
        setUpdateItemName('');
        setUpdateItemDescription('');
      }
    } catch (err: any) {
      setError(err.message);
      setItems([]); // Clear items on error
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
      await fetchItems(); // Refresh the list and potentially pre-fill update form
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
      const updatedItemData: Item = await response.json();
      setSuccessMessage(`Item "${updatedItemData.name}" updated successfully!`);
      await fetchItems(); // Refresh the list
      // Keep the updated item selected for further edits if needed
      setUpdateItemId(updatedItemData.id);
      setUpdateItemName(updatedItemData.name);
      setUpdateItemDescription(updatedItemData.description);

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
    setSuccessMessage(null); // Clear messages when selecting a new item
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
          <Alert variant="destructive" className="my-4">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {successMessage && (
          <Alert variant="default" className="my-4 bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700 text-green-700 dark:text-green-200">
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
              <CardDescription>Fetch and display a list of items. Click "Edit" to populate the update form.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && items.length === 0 && <p className="text-muted-foreground">Loading items...</p>}
              {!isLoading && items.length === 0 && !error && <p className="text-muted-foreground">No items found. Try creating one!</p>}
              {items.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id} className={item.id === updateItemId ? "bg-muted/50" : ""}>
                        <TableCell className="font-mono text-xs">{item.id.substring(0,5)}...</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                <CardDescription>Update an existing item. Select an item from the list to edit its details here.</CardDescription>
              </CardHeader>
              <form onSubmit={handleUpdateItem}>
                <CardContent className="space-y-4">
                   {updateItemId ? (
                    <>
                      <div>
                        <Label htmlFor="updateItemIdDisplay">Item ID (Editing)</Label>
                        <Input id="updateItemIdDisplay" value={updateItemId} readOnly disabled className="font-mono text-xs" />
                      </div>
                      <div>
                        <Label htmlFor="updateItemName">New Name</Label>
                        <Input
                          id="updateItemName"
                          value={updateItemName}
                          onChange={(e) => setUpdateItemName(e.target.value)}
                          placeholder="Enter new name"
                          required
                          disabled={isLoading}
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
                          disabled={isLoading}
                        />
                      </div>
                    </>
                   ) : (
                    <p className="text-muted-foreground py-10 text-center">Select an item from the list to enable editing.</p>
                   )}
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading || !updateItemId}>
                    {isLoading ? 'Updating...' : 'Update Selected Item'}
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
                <strong>Dynamic UI Updates:</strong> List refreshes after create/update operations. Item selection for update form.
              </li>
              <li>
                <strong>Loading and Error States:</strong> Visual feedback for API call status and form input disabling during operations.
              </li>
              <li>
                <strong>Basic Form Validation:</strong> Client-side `required` attributes. Server-side validation is present in the API.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
