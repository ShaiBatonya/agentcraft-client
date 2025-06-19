import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useAuthStore } from '@/stores/auth.store';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import './App.css'

function App() {
  const { checkAuthStatus, isLoading, clearError, setLoading } = useAuthStore();
  const [initializationComplete, setInitializationComplete] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize authentication when app starts
    const initializeAuth = async () => {
      console.log('🚀 App: Starting auth initialization', { 
        path: window.location.pathname,
        isLoading 
      });

      const authTimeout = setTimeout(() => {
        console.error('⏰ App: Auth initialization timeout after 10 seconds');
        setLoading(false);
        setInitializationError('Authentication check timed out');
        setInitializationComplete(true);
      }, 10000); // 10 second timeout
      
      try {
        // Clear any previous errors
        clearError();
        setInitializationError(null);
        
        // Skip auth check on callback route (handled by AuthCallbackPage)
        if (window.location.pathname === '/auth/callback') {
          console.log('⏭️ App: Skipping auth check for callback route');
          setLoading(false);
          setInitializationComplete(true);
          clearTimeout(authTimeout);
          return;
        }
        
        console.log('🔄 App: Checking auth status for route:', window.location.pathname);
        
        // Check authentication status for all other routes
        await checkAuthStatus();
        
        console.log('✅ App: Auth initialization complete');
        setInitializationComplete(true);
        clearTimeout(authTimeout);
      } catch (error) {
        console.error('❌ App: Auth initialization error:', error);
        setLoading(false); // Ensure loading is cleared on error
        setInitializationError(error instanceof Error ? error.message : 'Authentication failed');
        setInitializationComplete(true);
        clearTimeout(authTimeout);
      }
    };

    initializeAuth();
  }, [checkAuthStatus, clearError, setLoading]);

  // Show loading screen during initial auth check
  if (!initializationComplete && window.location.pathname !== '/auth/callback') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-500 border-t-transparent" />
          <p className="text-white/70 text-sm">Initializing application...</p>
          {initializationError && (
            <div className="mt-4 text-center">
              <p className="text-red-400 text-sm mb-2">{initializationError}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-accent-600 hover:bg-accent-700 text-white text-sm px-4 py-2 rounded transition-colors"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;
