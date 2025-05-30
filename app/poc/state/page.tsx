"use client";

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useItemFilterStore, ItemFilter } from '@/lib/itemFilterStore';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
// import { Toaster } from '@/components/ui/sonner'; // Commented out to resolve import error
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Trash2, Pencil, CheckSquare, Square } from 'lucide-react';

// Zod schema for item validation (client-side)
const itemFormSchema = z.object({
  text: z.string().min(3, 'Text must be at least 3 characters long'),
});

type ItemFormData = z.infer<typeof itemFormSchema>;

// Type for API item (matches backend)
interface Item {
  id: string;
  text: string;
  completed: boolean;
}

// API endpoint
const ITEMS_API_ENDPOINT = '/api/state-poc/items';

// Fetch function for items
const fetchItems = async (): Promise<Item[]> => {
  // console.log('Fetching items...');
  // await new Promise(resolve => setTimeout(resolve, 750)); // Simulate slower fetch

  const response = await fetch(ITEMS_API_ENDPOINT);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export default function StatePocPage() {
  const [editingItem, setEditingItem] = useState<{ id: string; text: string } | null>(null);
  const queryClient = useQueryClient();
  const { filter: currentFilter, setFilter } = useItemFilterStore();

  // 1. TanStack Query: Fetching data
  const { data: items, isLoading, isError, error: itemsError } = useQuery<Item[], Error>({
    queryKey: ['pocItems'],
    queryFn: fetchItems,
    // staleTime: 0, // For easier testing of caching and refetching
    // refetchOnWindowFocus: true,
  });

  // Filtered items based on Zustand store
  const filteredItems = useMemo(() => {
    if (!items) return [];
    if (currentFilter === 'all') return items;
    if (currentFilter === 'active') return items.filter(item => !item.completed);
    if (currentFilter === 'completed') return items.filter(item => item.completed);
    return items;
  }, [items, currentFilter]);

  // 2. TanStack Query: Mutations (Add, Edit, Delete)
  // Zod schema for the add/edit form
  const formSchema = z.object({
    text: z.string().min(1, 'Item text cannot be empty').max(100, 'Text too long'),
  });
  type FormValues = z.infer<typeof formSchema>;

  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors: formErrors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  // Add Item Mutation
  const addItemMutation = useMutation<Item, Error, { text: string }, { previousItems: Item[] | undefined }>(
    {
      mutationFn: async (newItem) => {
        const response = await fetch(ITEMS_API_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem),
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to add item. Server error.' }));
          throw new Error(errorData.message || 'Failed to add item');
        }
        return response.json();
      },
      onMutate: async (newItemData) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries({ queryKey: ['pocItems'] });

        // Snapshot the previous value
        const previousItems = queryClient.getQueryData<Item[]>(['pocItems']);

        // Optimistically update to the new value
        queryClient.setQueryData<Item[]>(['pocItems'], (old) => 
          old ? [...old, { id: `temp-${Date.now()}`, ...newItemData, completed: false }] : []
        );
        // console.log('Item added optimistically!'); // toast.success('Item added optimistically!'); // For simplicity, we're not showing a toast here but you could.
        reset(); // Reset form optimistically
        return { previousItems }; // Return context with the optimistic item and previous items
      },
      onError: (err, newItem, context) => {
        // Rollback to the previous value if mutation fails
        if (context?.previousItems) {
          queryClient.setQueryData(['pocItems'], context.previousItems);
        }
        console.error(`Failed to add item: ${err.message}`); // toast.error(`Failed to add item: ${err.message}`);
      },
      onSettled: () => {
        // Invalidate and refetch after error or success
        queryClient.invalidateQueries({ queryKey: ['pocItems'] });
      },
    }
  );

  const onSubmitItem = (data: FormValues) => {
    addItemMutation.mutate({ text: data.text });
  };

  // Toggle Item Completion Mutation
  const toggleItemMutation = useMutation<
    Item, 
    Error, 
    { id: string; completed: boolean }, 
    { previousItems?: Item[] } // Context type
  >(
    {
      mutationFn: async ({ id, completed }) => {
        const response = await fetch(`${ITEMS_API_ENDPOINT}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, completed }),
          }
        );
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to toggle item. Server error.' }));
          throw new Error(errorData.message || 'Failed to toggle item');
        }
        return response.json();
      },
      onMutate: async ({ id, completed }) => {
        await queryClient.cancelQueries({ queryKey: ['pocItems'] });
        const previousItems = queryClient.getQueryData<Item[]>(['pocItems']);
        
        queryClient.setQueryData<Item[]>(['pocItems'], (old) =>
          old?.map(item => item.id === id ? { ...item, completed } : item)
        );
        // console.log(`Optimistically toggling item...`); // toast.info(`Optimistically toggling item...`);
        return { previousItems };
      },
      onError: (err, variables, context) => {
        if (context?.previousItems) {
          queryClient.setQueryData(['pocItems'], context.previousItems);
        }
        console.error(`Failed to toggle item: ${err.message}`); // toast.error(`Failed to toggle item: ${err.message}`);
      },
      onSettled: (data, error, variables) => {
        // Invalidate the specific item or refetch all. For simplicity, refetch all.
        // More granular update: queryClient.invalidateQueries({ queryKey: ['pocItems', variables.id] });
        queryClient.invalidateQueries({ queryKey: ['pocItems'] });
      },
    }
  );

  const handleToggleComplete = (id: string, currentStatus: boolean) => {
    toggleItemMutation.mutate({ id, completed: !currentStatus });
  };

  // Delete Item Mutation
  const deleteItemMutation = useMutation<
    { id: string }, // Expected success response (can be just the ID or a success message)
    Error, 
    string, // Type of the variable passed to mutationFn (item ID)
    { previousItems?: Item[] } // Context type
  >(
    {
      mutationFn: async (itemId) => {
        const response = await fetch(`${ITEMS_API_ENDPOINT}`,
          {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: itemId }),
          }
        );
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to delete item. Server error.' }));
          throw new Error(errorData.message || 'Failed to delete item');
        }
        // Assuming the API returns the deleted item's ID or a success message
        return response.json(); 
      },
      onMutate: async (itemIdToDelete) => {
        await queryClient.cancelQueries({ queryKey: ['pocItems'] });
        const previousItems = queryClient.getQueryData<Item[]>(['pocItems']);
        
        queryClient.setQueryData<Item[]>(['pocItems'], (old) =>
          old?.filter(item => item.id !== itemIdToDelete)
        );
        // console.log(`Optimistically deleting item ${itemIdToDelete}...`); // toast.info(`Optimistically deleting item ${itemIdToDelete}...`);
        return { previousItems };
      },
      onError: (err, itemId, context) => {
        if (context?.previousItems) {
          queryClient.setQueryData(['pocItems'], context.previousItems);
        }
        console.error(`Failed to delete item ${itemId}: ${err.message}`); // toast.error(`Failed to delete item ${itemId}: ${err.message}`);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['pocItems'] });
      },
    }
  );

  const handleDeleteItem = (id: string) => {
    // Optional: Add a confirmation dialog here
    // if (confirm('Are you sure you want to delete this item?')) {
    deleteItemMutation.mutate(id);
    // }
  };

  // Edit Item Mutation
  const editItemMutation = useMutation<
    Item, // Expected return type from mutationFn
    Error, // Error type
    { id: string; text: string }, // Variables type for mutationFn
    { previousItems?: Item[] } // Context type for onMutate
  >(
    {
      mutationFn: async ({ id, text }) => {
        const response = await fetch(`${ITEMS_API_ENDPOINT}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, text }), // Send only id and new text
          }
        );
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to update item. Server error.' }));
          throw new Error(errorData.message || 'Failed to update item');
        }
        return response.json();
      },
      onMutate: async (updatedItem) => {
        await queryClient.cancelQueries({ queryKey: ['pocItems'] });
        const previousItems = queryClient.getQueryData<Item[]>(['pocItems']);
        queryClient.setQueryData<Item[]>(['pocItems'], (old) =>
          old?.map(item => item.id === updatedItem.id ? { ...item, text: updatedItem.text } : item)
        );
        // console.log(`Optimistically updating item ${updatedItem.id}...`);
        return { previousItems };
      },
      onError: (err, variables, context) => {
        if (context?.previousItems) {
          queryClient.setQueryData(['pocItems'], context.previousItems);
        }
        console.error(`Failed to update item ${variables.id}: ${err.message}`);
        setEditingItem(null); // Clear editing state on error
      },
      onSuccess: () => {
        setEditingItem(null); // Clear editing state on success
      },
      onSettled: (data, error, variables) => {
        queryClient.invalidateQueries({ queryKey: ['pocItems'] });
        // queryClient.invalidateQueries({ queryKey: ['pocItems', variables.id] }); // More granular
      },
    }
  );

  const handleEditItem = (item: Item) => {
    setEditingItem({ id: item.id, text: item.text });
  };

  const handleSaveEdit = () => {
    if (editingItem) {
      editItemMutation.mutate({ id: editingItem.id, text: editingItem.text });
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };


  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* <Toaster /> */}
      <header className="text-center">
        <h1 className="text-3xl font-bold mb-2">State Management & Data Handling POC</h1>
        <p className="text-muted-foreground">
          Demonstrating TanStack Query (data fetching, caching, optimistic updates), Zod (validation), and Zustand (global client-side state for filtering).
        </p>
      </header>

      {/* Item Filter UI */}
      <div className="flex justify-center space-x-2 mb-6">
        {(['all', 'active', 'completed'] as ItemFilter[]).map((filterValue) => (
          <Button
            key={filterValue}
            variant={currentFilter === filterValue ? 'default' : 'outline'}
            onClick={() => setFilter(filterValue)}
          >
            {filterValue.charAt(0).toUpperCase() + filterValue.slice(1)}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>TanStack Query: Data Fetching & Caching</CardTitle>
          <CardDescription>
            Fetching a list of items from an API. TanStack Query handles loading, error states, and caching automatically.
            Try navigating away and back to this page to see cached data load instantly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <p>Loading items...</p>}
          {itemsError && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error Fetching Items</AlertTitle>
              <AlertDescription>{itemsError.message}</AlertDescription>
            </Alert>
          )}
          {items && filteredItems.length === 0 && items.length > 0 && !isLoading && (
            <p>No items match the current filter "{currentFilter}".</p>
          )}
          {items && items.length === 0 && !isLoading && <p>No items yet. Add one above!</p>}
          {filteredItems && filteredItems.length > 0 && (
            <ul className="space-y-2">
              {filteredItems.map((item: Item) => (
                <li key={item.id} className="flex items-center justify-between p-2 border rounded-md min-h-[60px]">
                                    {editingItem?.id === item.id ? (
                    <div className="flex-grow mr-2">
                      <Input 
                        type="text" 
                        value={editingItem.text} 
                        onChange={(e) => editingItem && setEditingItem({ ...editingItem, id: editingItem.id, text: e.target.value })}
                        className="h-8"
                      />
                    </div>
                  ) : (
                    <span className={`${item.completed ? 'line-through text-muted-foreground' : ''} flex-grow`}>{item.text}</span>
                  )}
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleToggleComplete(item.id, item.completed)}
                      disabled={(toggleItemMutation.isPending && toggleItemMutation.variables?.id === item.id) || !!editingItem}
                      className="h-8 w-8"
                    >
                      {item.completed ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                    </Button>
                    {editingItem?.id === item.id ? (
                      <>
                        <Button variant="outline" size="icon" onClick={handleSaveEdit} className="h-8 w-8 mr-1" disabled={editItemMutation.isPending || !editingItem.text.trim()}>
                          <CheckSquare className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={handleCancelEdit} className="h-8 w-8">
                          <Square className="h-4 w-4 text-red-500" /> {/* Using Square as a stand-in for Cancel/X icon */}
                        </Button>
                      </>
                    ) : (
                      <Button variant="outline" size="icon" onClick={() => handleEditItem(item)} className="h-8 w-8" disabled={deleteItemMutation.isPending || toggleItemMutation.isPending || addItemMutation.isPending || !!editingItem}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      onClick={() => handleDeleteItem(item.id)}
                      disabled={(deleteItemMutation.isPending && deleteItemMutation.variables === item.id) || !!editingItem}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {items && items.length === 0 && <p>No items found. Try adding some!</p>}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            React Query Devtools are available (usually in the bottom corner in development mode) for inspecting query states and cache.
          </p>
        </CardFooter>
      </Card>

      {/* Placeholder sections for Mutations, Optimistic Updates, Zustand, Zod Form */}
      <Card>
        <CardHeader>
          <CardTitle>TanStack Query: Mutations & Optimistic Updates</CardTitle>
          <CardDescription>Add, edit, and delete items with automatic cache updates and optimistic UI changes.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmitItem)} className="space-y-4">
            <div>
              <Input 
                {...register('text')}
                placeholder="Enter new item text"
                className={formErrors.text ? 'border-red-500' : ''}
              />
              {formErrors.text && <p className="text-red-500 text-sm mt-1">{formErrors.text.message}</p>}
            </div>
            <Button type="submit" disabled={isSubmitting || addItemMutation.isPending}>
              {addItemMutation.isPending ? 'Adding...' : 'Add Item'}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground mt-4">
            This form demonstrates adding an item with optimistic updates. The UI updates immediately,
            and then syncs with the server. If the server request fails, the change is reverted.
            Client-side validation is handled by Zod and React Hook Form.
          </p>
          <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
            <h4 className="font-semibold text-sm mb-1">Try this:</h4>
            <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
              <li>Add a valid item. Notice it appears instantly.</li>
              <li>Try to submit an empty item (client-side validation).</li>
              <li>(If backend is configured to fail sometimes) Observe optimistic revert.</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Zustand: Global Client-Side State</CardTitle>
          <CardDescription>A simple example of managing global state that is not tied to server data.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">[Zustand example will be implemented here]</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Client-Side Validation with Zod & React Hook Form</CardTitle>
          <CardDescription>Using Zod for schema validation integrated with React Hook Form for a seamless user experience.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            The 'Add Item' form above already demonstrates Zod validation with React Hook Form.
            The schema (`itemFormSchema`) defines that the 'text' field is required and must be at least 1 character long.
            Try submitting an empty form or very short text to see the inline validation messages.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Explanation of Patterns</CardTitle>
          <CardDescription>
            This page demonstrates key patterns for modern frontend development
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">TanStack Query (React Query)</h3>
              <p className="text-sm text-muted-foreground">
                Used for fetching, caching, synchronizing, and updating server state.
                It simplifies data fetching logic, handles loading/error states, provides caching out-of-the-box (reducing redundant API calls),
                and enables advanced features like optimistic updates and automatic cache invalidation after mutations.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Zustand</h3>
              <p className="text-sm text-muted-foreground">
                A small, fast, and scalable bearbones state-management solution. It's used here for managing global client-side state
                that doesn't necessarily come from or sync with a server (e.g., UI preferences, ephemeral state shared across distant components).
                It's chosen for its simplicity and minimal boilerplate compared to other solutions like Redux for cases where TanStack Query's cache isn't the right fit.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Zod</h3>
              <p className="text-sm text-muted-foreground">
                A TypeScript-first schema declaration and validation library. It's used here to define data schemas and validate
                form inputs on the client-side before data is sent to the server. This provides immediate feedback to users and reduces invalid requests.
                Zod can also be used on the server-side for robust validation (as seen in the API route for this POC).
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">React Hook Form</h3>
              <p className="text-sm text-muted-foreground">
                Used for building performant and flexible forms. It integrates seamlessly with Zod for validation,
                providing excellent developer experience with minimal re-renders and built-in validation support.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Benefits of This Architecture</CardTitle>
          <CardDescription>
            Key advantages of using these modern frontend patterns together
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-semibold">Improved Developer Experience</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Clear separation of concerns, less boilerplate for data fetching and state management.
              </p>
            </div>
            
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-semibold">Better Performance</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Caching reduces API calls, optimistic updates make the UI feel faster.
              </p>
            </div>
            
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-semibold">Enhanced User Experience</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Clear loading/error states, instant feedback from client-side validation.
              </p>
            </div>
            
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-semibold">Maintainability</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Well-defined patterns make the codebase easier to understand and scale.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
