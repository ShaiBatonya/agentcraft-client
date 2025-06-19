// Enhanced Router configuration with proper lazy loading and error handling
import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { MainLayout } from '../layout/MainLayout';
import { AuthGuard } from '../components/auth/AuthGuard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

// Lazy load components with direct imports (more reliable)
const HomePage = lazy(() => import('../pages/HomePage').then(module => ({ default: module.HomePage })));
const LoginPage = lazy(() => import('../pages/LoginPage').then(module => ({ default: module.LoginPage })));
const ChatPage = lazy(() => import('../features/chat/pages/ChatPage'));
const AuthCallbackPage = lazy(() => import('../pages/AuthCallbackPage').then(module => ({ default: module.AuthCallbackPage })));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then(module => ({ default: module.NotFoundPage })));

// Enhanced loading component
const RouteLoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <LoadingSpinner size="lg" variant="primary" message="Loading page..." />
  </div>
);

// Error fallback component for route errors
const RouteErrorFallback = ({ error }: { error?: Error }) => (
  <div className="flex items-center justify-center min-h-[50vh] p-8">
    <div className="text-center max-w-md">
      <div className="error-container p-8 space-y-6">
        <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Page Load Error
          </h2>
          <p className="error-text text-sm mb-4">
            {error?.message || 'Failed to load this page. This might be a temporary issue.'}
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
            Reload Page
          </button>
          
          <button
            onClick={() => window.history.back()}
            className="w-full btn-secondary text-sm"
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Wrapper component for MainLayout with error boundary
const LayoutWrapper = ({ children }: { children: React.ReactNode }) => (
  <MainLayout>{children}</MainLayout>
);

// Enhanced Suspense wrapper with error boundary
const SuspenseWrapper = ({ 
  children, 
  fallback = <RouteLoadingSpinner /> 
}: { 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
);

// Router configuration with proper error handling
export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <LayoutWrapper>
        <SuspenseWrapper>
          <HomePage />
        </SuspenseWrapper>
      </LayoutWrapper>
    ),
    errorElement: <RouteErrorFallback />,
  },
  {
    path: '/login',
    element: (
      <SuspenseWrapper>
        <LoginPage />
      </SuspenseWrapper>
    ),
    errorElement: <RouteErrorFallback />,
  },
  {
    path: '/auth/callback',
    element: (
      <SuspenseWrapper>
        <AuthCallbackPage />
      </SuspenseWrapper>
    ),
    errorElement: <RouteErrorFallback />,
  },
  {
    path: '/chat',
    element: (
      <AuthGuard>
        <LayoutWrapper>
          <SuspenseWrapper>
            <div className="min-h-[calc(100vh-8rem)]">
              <ChatPage />
            </div>
          </SuspenseWrapper>
        </LayoutWrapper>
      </AuthGuard>
    ),
    errorElement: (
      <AuthGuard>
        <LayoutWrapper>
          <RouteErrorFallback />
        </LayoutWrapper>
      </AuthGuard>
    ),
  },
  {
    path: '*',
    element: (
      <SuspenseWrapper>
        <NotFoundPage />
      </SuspenseWrapper>
    ),
    errorElement: <RouteErrorFallback />,
  },
]); 