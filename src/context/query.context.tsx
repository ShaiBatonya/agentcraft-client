import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Query client configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: how long data is considered fresh
      staleTime: 5 * 60 * 1000, // 5 minutes
      
      // Cache time: how long data stays in cache after being unused
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      
      // Retry configuration
      retry: (failureCount, error: any) => {
        // Don't retry for authentication errors
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        
        // Don't retry for client errors (4xx), but retry for server errors (5xx)
        if (error?.status >= 400 && error?.status < 500) {
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
      retry: (failureCount, error: any) => {
        // Don't retry authentication errors
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        
        // Don't retry client errors
        if (error?.status >= 400 && error?.status < 500) {
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

// Global error handler for queries
queryClient.setMutationDefaults(['auth', 'login'], {
  mutationFn: async (variables: any) => {
    // This will be overridden by actual mutation functions
    throw new Error('Mutation function not implemented');
  },
  onError: (error: any) => {
    console.error('Authentication error:', error);
    
    // Handle authentication errors globally
    if (error?.status === 401) {
      // Redirect to login or refresh token
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
  },
});

// Global query error handler
queryClient.setQueryDefaults(['user'], {
  queryFn: async () => {
    throw new Error('Query function not implemented');
  },
  onError: (error: any) => {
    console.error('User query error:', error);
    
    if (error?.status === 401) {
      // Clear user data and redirect to login
      queryClient.setQueryData(['user'], null);
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Show React Query dev tools in development */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools 
          initialIsOpen={false}
          position="bottom-right"
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}

// Export query client for use in custom hooks
export { queryClient };

// Utility function to invalidate queries by pattern
export const invalidateQueries = (pattern: string[]) => {
  return queryClient.invalidateQueries({ queryKey: pattern });
};

// Utility function to prefetch queries
export const prefetchQuery = <T extends unknown>(
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
export const setQueryData = <T extends unknown>(queryKey: string[], data: T) => {
  return queryClient.setQueryData(queryKey, data);
};

// Utility function to get query data
export const getQueryData = <T extends unknown>(queryKey: string[]): T | undefined => {
  return queryClient.getQueryData(queryKey);
};

// Utility function to clear all queries
export const clearAllQueries = () => {
  queryClient.clear();
}; 