import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryProvider } from '@/context/query.provider';
import { router } from '@/router';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useAuthStore, useAuthHydrated, useAuthLoading } from '@/stores/auth.store';
import ToastContainer from '@/components/ui/ToastContainer';
import { useToasts, useRemoveToast } from '@/stores/toast.store';

function App() {
  const { initialize } = useAuthStore();
  const isHydrated = useAuthHydrated();
  const isLoading = useAuthLoading();
  const toasts = useToasts();
  const removeToast = useRemoveToast();

  // Initialize auth state on app mount
  useEffect(() => {
    if (!isHydrated) {
      initialize();
    }
  }, [isHydrated, initialize]);

  // Show loading screen while auth is initializing
  if (!isHydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <div className="text-center">
            <p className="text-white font-medium">AgentCraft</p>
            <p className="text-gray-400 text-sm">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <QueryProvider>
        <RouterProvider router={router} />
      </QueryProvider>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ErrorBoundary>
  );
}

export default App;
