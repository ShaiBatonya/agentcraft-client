import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';
import ErrorBoundary from '@/components/ErrorBoundary';
import PerformanceMonitor from '@/components/performance/PerformanceMonitor';
import { useAuthStore, useAuthHydrated, useAuthLoading } from '@/stores/auth.store';
import ToastContainer from '@/components/ui/ToastContainer';
import { useToasts, useRemoveToast } from '@/stores/toast.store';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

function App() {
  const { initialize, checkAuthStatus } = useAuthStore();
  const isHydrated = useAuthHydrated();
  const isLoading = useAuthLoading();
  const toasts = useToasts();
  const removeToast = useRemoveToast();

  // Initialize auth state on app mount
  useEffect(() => {
    if (!isHydrated) {
      initialize().catch(console.error);
    }
  }, [isHydrated, initialize]);

  // Periodically check auth status
  useEffect(() => {
    if (!isHydrated) return;

    const checkAuth = () => {
      checkAuthStatus().catch(console.error);
    };

    // Check immediately after hydration
    checkAuth();

    // Then check every 5 minutes
    const interval = setInterval(checkAuth, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isHydrated, checkAuthStatus]);

  // Show loading screen while auth is initializing
  if (!isHydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <LoadingSpinner size="lg" />
          <div className="text-center">
            <p className="text-white font-medium">AgentCraft</p>
            <p className="text-gray-400 text-sm">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary
      enableRetry={true}
      resetOnPropsChange={true}
      onError={(error, errorInfo) => {
        // Custom error handling - could send to analytics
        console.error('App Error:', { error, errorInfo });
      }}
    >
      <div className="app-root">
        <RouterProvider router={router} />
        
        {/* Performance monitoring in development */}
        <PerformanceMonitor 
          enableLogging={true}
          showOverlay={import.meta.env.DEV}
          onMetricsUpdate={() => {
            // Optional: Send metrics to analytics service
            if (import.meta.env.PROD) {
              // analytics.track('performance_metrics', metrics);
            }
          }}
        />
      </div>
      <ToastContainer toasts={toasts.toasts || []} onRemove={removeToast} />
    </ErrorBoundary>
  );
}

export default App;
