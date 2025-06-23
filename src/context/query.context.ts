import { QueryClient } from '@tanstack/react-query';

// Performance-optimized query client configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Aggressive caching for better performance
      staleTime: 10 * 60 * 1000, // 10 minutes (data stays fresh longer)
      gcTime: 30 * 60 * 1000, // 30 minutes (cache retention)
      
      // Reduce network requests
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      refetchOnMount: false, // Don't refetch on every mount
      
      // Smart retry logic
      retry: (failureCount, error: unknown) => {
        const apiError = error as { status?: number };
        
        // Never retry auth errors
        if (apiError?.status === 401 || apiError?.status === 403) {
          return false;
        }
        
        // Don't retry client errors (4xx)
        if (apiError?.status && apiError.status >= 400 && apiError.status < 500) {
          return false;
        }
        
        // Retry server errors with exponential backoff (max 2 retries)
        return failureCount < 2;
      },
      
      // Faster retry with exponential backoff
      retryDelay: (attemptIndex) => Math.min(500 * 2 ** attemptIndex, 5000),
      
      // Error handling
      throwOnError: false,
      
      // Network mode for better offline handling
      networkMode: 'online',
    },
    mutations: {
      // Conservative retry for mutations
      retry: (failureCount, error: unknown) => {
        const apiError = error as { status?: number };
        
        // Never retry auth errors or client errors
        if (apiError?.status && apiError.status >= 400 && apiError.status < 500) {
          return false;
        }
        
        // Only retry once for server errors
        return failureCount < 1;
      },
      
      // Error handling
      throwOnError: false,
      
      // Network mode
      networkMode: 'online',
    },
  },
});

// Optimized utility functions
export const invalidateQueries = (pattern: string[]) => {
  return queryClient.invalidateQueries({ 
    queryKey: pattern,
    refetchType: 'active' // Only refetch active queries
  });
};

export const prefetchQuery = <T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options?: { staleTime?: number }
) => {
  return queryClient.prefetchQuery({
    queryKey,
    queryFn,
    staleTime: options?.staleTime || 10 * 60 * 1000,
  });
};

export const setQueryData = <T>(queryKey: string[], data: T) => {
  return queryClient.setQueryData(queryKey, data);
};

export const getQueryData = <T>(queryKey: string[]): T | undefined => {
  return queryClient.getQueryData(queryKey);
};

// Cleanup utility for memory management
export const clearQueryCache = () => {
  queryClient.clear();
};

// Performance monitoring
if (import.meta.env.DEV) {
  queryClient.getQueryCache().subscribe((event) => {
    if (event.type === 'added' || event.type === 'removed') {
      const cacheSize = queryClient.getQueryCache().getAll().length;
      if (cacheSize > 50) {
        console.warn(`🐌 React Query cache has ${cacheSize} queries. Consider cleanup.`);
      }
    }
  });
} 