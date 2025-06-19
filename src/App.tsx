import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useAuthStore } from './stores/auth.store';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/ui';
import './styles/global.css';

// Enhanced loading screen component
const AppLoadingScreen = ({ message = 'Initializing application...' }: { message?: string }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-accent-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          {/* Animated ring */}
          <div className="absolute inset-0 rounded-3xl border-4 border-accent-500/30 animate-ping" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-white">AgentCraft</h1>
          <div className="flex items-center justify-center gap-3">
            <LoadingSpinner size="sm" variant="accent" />
            <p className="text-white/60 text-sm">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced error fallback
const AppErrorFallback = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="error-container p-8 space-y-6 text-center">
          <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <div>
            <h1 className="text-xl font-semibold text-white mb-2">
              Application Error
            </h1>
            <p className="error-text text-sm">
              Something went wrong while loading the application.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full btn-primary text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reload Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const { checkAuthStatus, isLoading, error, clearError } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  // Initialize auth with enhanced error handling
  useEffect(() => {
    const initializeAuth = async () => {
      // Skip auth check on callback route
      if (window.location.pathname === '/auth/callback') {
        setIsInitialized(true);
        return;
      }

      const timeout = setTimeout(() => {
        console.warn('Auth initialization timeout - continuing without auth');
        setIsInitialized(true);
        setInitError('Authentication check timed out');
      }, 10000); // 10 second timeout

      try {
        clearError();
        setInitError(null);
        await checkAuthStatus();
        setIsInitialized(true);
        clearTimeout(timeout);
      } catch (err) {
        console.error('Auth initialization failed:', err);
        setIsInitialized(true);
        setInitError(err instanceof Error ? err.message : 'Authentication failed');
        clearTimeout(timeout);
      }
    };

    initializeAuth();
  }, [checkAuthStatus, clearError]);

  // Auto-clear errors
  useEffect(() => {
    if (error || initError) {
      const timer = setTimeout(() => {
        clearError();
        setInitError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, initError, clearError]);

  // Show loading screen during initialization
  if (!isInitialized) {
    return <AppLoadingScreen message="Checking authentication..." />;
  }

  return (
    <ErrorBoundary fallback={<AppErrorFallback />}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        {/* Global error banner */}
        {(error || initError) && (
          <div className="fixed top-0 left-0 right-0 z-50 p-4">
            <div className="max-w-md mx-auto">
              <div className="error-container p-4 animate-in slide-in-from-bottom-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-6 h-6 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">
                        {initError ? 'Initialization Error' : 'Authentication Error'}
                      </p>
                      <p className="text-xs error-text">
                        {initError || error}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      clearError();
                      setInitError(null);
                    }}
                    className="flex-shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Dismiss error"
                  >
                    <svg className="w-4 h-4 text-white/60 hover:text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main app content */}
        <RouterProvider router={router} />

        {/* Development debug panel */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 z-50">
            <details className="bg-black/80 backdrop-blur-sm rounded-lg border border-white/10 text-xs">
              <summary className="p-2 cursor-pointer text-white/60 hover:text-white/80">
                🔧 Debug
              </summary>
              <div className="p-3 border-t border-white/10 space-y-1 text-white/60 min-w-[200px]">
                <div>🔐 Auth Loading: {isLoading ? '🔄' : '✅'}</div>
                <div>🚀 Initialized: {isInitialized ? '✅' : '❌'}</div>
                <div>🌍 Environment: {process.env.NODE_ENV}</div>
                <div>⚡ Vite Mode: {import.meta.env.MODE}</div>
                <div>📍 Route: {window.location.pathname}</div>
                {(error || initError) && (
                  <div className="pt-2 border-t border-white/10">
                    <div className="text-red-400 text-xs">
                      ❌ {initError || error}
                    </div>
                  </div>
                )}
              </div>
            </details>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
