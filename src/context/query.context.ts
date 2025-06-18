import { QueryClient } from '@tanstack/react-query';

// Query client configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: how long data is considered fresh
      staleTime: 5 * 60 * 1000, // 5 minutes
      
      // Cache time: how long data stays in cache after being unused
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      
      // Retry configuration
      retry: (failureCount, error: unknown) => {
        const apiError = error as { status?: number };
        // Don't retry for authentication errors
        if (apiError?.status === 401 || apiError?.status === 403) {
          return false;
        }
        
        // Don't retry for client errors (4xx), but retry for server errors (5xx)
        if (apiError?.status && apiError.status >= 400 && apiError.status < 500) {
          return false;
        }
        
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch configuration
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      refetchOnReconnect: true,    // Refetch when connection is restored
      refetchOnMount: true,        // Refetch when component mounts
      
      // Error handling
      throwOnError: false, // Don't throw errors, handle them in components
    },
    mutations: {
      // Retry configuration for mutations
      retry: (failureCount, error: unknown) => {
        const apiError = error as { status?: number };
        // Don't retry authentication errors
        if (apiError?.status === 401 || apiError?.status === 403) {
          return false;
        }
        
        // Don't retry client errors
        if (apiError?.status && apiError.status >= 400 && apiError.status < 500) {
          return false;
        }
        
        // Retry once for server errors
        return failureCount < 1;
      },
      
      // Error handling
      throwOnError: false,
    },
  },
});

// Utility function to invalidate queries by pattern
export const invalidateQueries = (pattern: string[]) => {
  return queryClient.invalidateQueries({ queryKey: pattern });
};

// Utility function to prefetch queries
export const prefetchQuery = <T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options?: { staleTime?: number }
) => {
  return queryClient.prefetchQuery({
    queryKey,
    queryFn,
    staleTime: options?.staleTime || 5 * 60 * 1000,
  });
};

// Utility function to set query data
export const setQueryData = <T>(queryKey: string[], data: T) => {
  return queryClient.setQueryData(queryKey, data);
};

// Utility function to get query data
export const getQueryData = <T>(queryKey: string[]): T | undefined => {
  return queryClient.getQueryData(queryKey);
};

// Utility function to clear all queries
export const clearAllQueries = () => {
  queryClient.clear();
}; 