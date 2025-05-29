"use client";

import { useAppStore } from '@/lib/stores/appStore';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { exampleContactSchema, ExampleContactFormValues } from '@/lib/schemas/exampleContactSchema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import PocNavigation from '@/components/custom/poc-navigation';
import PageContainer from '@/components/layouts/page-container'; // Corrected import path

const fetchMockData = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { id: 1, name: 'Mock Data Item', description: 'This is some data fetched via TanStack Query.' };
};

const StateManagementDemoPage = () => {
  // Zustand
  const { counter, theme, increment, decrement, toggleTheme } = useAppStore();

  // TanStack Query
  const { data: mockData, isLoading, isError, error } = useQuery({
    queryKey: ['mockData'],
    queryFn: fetchMockData,
  });

  // React Hook Form with Zod
  const form = useForm<ExampleContactFormValues>({
    resolver: zodResolver(exampleContactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = (values: ExampleContactFormValues) => {
    console.log('Form submitted:', values);
    alert('Form submitted! Check the console for data.');
  };

  return (
    <PageContainer>
      <PocNavigation />
      <header className="mb-6">
        <h1 className="text-3xl font-bold">State Management & Data Handling Demo</h1>
        <p className="text-muted-foreground">
          This page demonstrates the integration of Zustand for global state, TanStack Query for data fetching,
          and React Hook Form with Zod for form validation.
        </p>
      </header>

      <section className="mb-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Zustand Global State</h2>
        <p className="mb-2">Current Counter: <span className="font-bold text-primary">{counter}</span></p>
        <p className="mb-4">Current Theme: <span className="font-bold text-primary">{theme}</span></p>
        <div className="flex space-x-2">
          <Button onClick={increment}>Increment</Button>
          <Button onClick={decrement}>Decrement</Button>
          <Button onClick={toggleTheme} variant="outline">Toggle Theme</Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Zustand is used here to manage a simple counter and theme preference across the application.
          Changes made here will persist even if you navigate away and come back (within the same session).
        </p>
      </section>

      <section className="mb-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">TanStack Query (React Query) Data Fetching</h2>
        {isLoading && <p>Loading mock data...</p>}
        {isError && <p className="text-destructive">Error fetching data: {error?.message || 'Unknown error'}</p>}
        {mockData && (
          <div>
            <h3 className="text-lg font-medium">Fetched Data:</h3>
            <pre className="bg-muted p-3 rounded-md text-sm">{JSON.stringify(mockData, null, 2)}</pre>
          </div>
        )}
        <p className="mt-4 text-sm text-muted-foreground">
          TanStack Query handles asynchronous data fetching. This section simulates fetching data from an API,
          displaying loading, error, and success states. The data is cached and managed by React Query.
        </p>
      </section>

      <section className="p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">React Hook Form with Zod Validation</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Please enter your full name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your.email@example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    We'll use this to contact you.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Your message..." {...field} />
                  </FormControl>
                  <FormDescription>
                    What would you like to tell us? (Min 10 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit Contact Form</Button>
          </form>
        </Form>
        <p className="mt-4 text-sm text-muted-foreground">
          This form demonstrates client-side validation using React Hook Form and Zod.
          Try submitting with invalid data to see the error messages defined in `exampleContactSchema.ts`.
        </p>
      </section>
    </PageContainer>
  );
};

export default StateManagementDemoPage;
