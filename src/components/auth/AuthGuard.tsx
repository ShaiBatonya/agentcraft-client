import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore, useAuthHydrated } from '@/stores/auth.store';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  fallbackPath?: string;
  loadingMessage?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAdmin = false,
  fallbackPath = '/login',
  loadingMessage = 'Verifying authentication...',
}) => {
  const location = useLocation();
  const { user, isAuthenticated, isLoading, initialize, checkAuthStatus } = useAuthStore();
  const isHydrated = useAuthHydrated();
  const [retryCount, setRetryCount] = useState(0);
  const [showRetry, setShowRetry] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    if (!isHydrated) {
      initialize();
    }
  }, [isHydrated, initialize]);

  // Enhanced loading timeout with retry option
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setShowRetry(true);
      }, 8000); // Show retry option after 8 seconds

      return () => clearTimeout(timer);
    } else {
      setShowRetry(false);
    }
  }, [isLoading]);

  const handleRetry = async () => {
    setRetryCount(prev => prev + 1);
    setShowRetry(false);
    
    try {
      await checkAuthStatus(true); // Force recheck
    } catch (error) {
      console.error('Auth retry failed:', error);
      // After 3 retries, redirect to login
      if (retryCount >= 2) {
        window.location.href = fallbackPath;
      }
    }
  };

  // Show loading while initializing or checking authentication
  if (!isHydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <div className="flex flex-col items-center space-y-6 max-w-md mx-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
            <div className="flex flex-col items-center space-y-4">
              <LoadingSpinner size="lg" className="text-blue-400" />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {loadingMessage}
                </h3>
                <p className="text-white/60 text-sm">
                  Please wait while we verify your session...
                </p>
                {retryCount > 0 && (
                  <p className="text-yellow-400 text-xs mt-2">
                    Retry attempt {retryCount}/3
                  </p>
                )}
              </div>
            </div>
            
            {showRetry && (
              <div className="mt-6 text-center border-t border-white/20 pt-4">
                <p className="text-white/60 text-sm mb-3">
                  Taking longer than expected?
                </p>
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Retry Authentication
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check admin requirement
  if (requireAdmin && user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-white/70">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}; 