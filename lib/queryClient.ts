import { QueryClient } from '@tanstack/react-query';

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered stale after 5 minutes
      staleTime: 1000 * 60 * 5,
      // Data is removed from the cache after 30 minutes of inactivity
      cacheTime: 1000 * 60 * 30,
    },
  },
});

export default queryClient;
