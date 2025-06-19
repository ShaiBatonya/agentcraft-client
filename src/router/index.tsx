// Enhanced Router Configuration with all pages and proper error handling
import React, { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { MainLayout } from '@/layout/MainLayout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// Lazy load all pages for better performance
const HomePage = React.lazy(() => import('@/pages/HomePage').then(module => ({ default: module.HomePage })));
const LoginPage = React.lazy(() => import('@/pages/LoginPage').then(module => ({ default: module.LoginPage })));
const AuthCallbackPage = React.lazy(() => import('@/pages/AuthCallbackPage').then(module => ({ default: module.AuthCallbackPage })));
const ChatPage = React.lazy(() => import('@/features/chat/pages/ChatPage'));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage').then(module => ({ default: module.ProfilePage })));
const SettingsPage = React.lazy(() => import('@/pages/SettingsPage').then(module => ({ default: module.SettingsPage })));
const SupportPage = React.lazy(() => import('@/pages/SupportPage').then(module => ({ default: module.SupportPage })));
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage').then(module => ({ default: module.NotFoundPage })));

// Enhanced loading component
const PageLoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
    <div className="text-center">
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-accent-500 to-purple-600 flex items-center justify-center shadow-elevation-4 mx-auto">
          <LoadingSpinner size="lg" variant="white" />
        </div>
        <div className="absolute -inset-4 bg-gradient-to-br from-accent-500/20 to-purple-600/20 rounded-3xl blur-xl opacity-50" />
      </div>
      <p className="text-white/70 text-sm">Loading...</p>
    </div>
  </div>
);

// Enhanced error fallback component
const PageErrorFallback = ({ error, retry }: { error: Error; retry: () => void }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
    <div className="text-center max-w-md mx-auto p-8">
      <div className="glass-card-subtle p-8">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-3">Something went wrong</h2>
        <p className="text-white/70 mb-6 text-sm">
          {error.message || 'An unexpected error occurred while loading this page.'}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={retry}
            className="btn-primary text-sm px-4 py-2"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="btn-secondary text-sm px-4 py-2"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Wrapper component for pages with layout and suspense
const PageWrapper: React.FC<{ children: React.ReactNode; requireAuth?: boolean }> = ({ 
  children, 
  requireAuth = false 
}) => (
  <MainLayout>
    <Suspense fallback={<PageLoadingSpinner />}>
      {requireAuth ? (
        <AuthGuard>
          {children}
        </AuthGuard>
      ) : (
        children
      )}
    </Suspense>
  </MainLayout>
);

// Router configuration
export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PageWrapper>
        <HomePage />
      </PageWrapper>
    ),
    errorElement: <PageErrorFallback error={new Error('Failed to load home page')} retry={() => window.location.reload()} />,
  },
  {
    path: '/login',
    element: (
      <PageWrapper>
        <LoginPage />
      </PageWrapper>
    ),
    errorElement: <PageErrorFallback error={new Error('Failed to load login page')} retry={() => window.location.reload()} />,
  },
  {
    path: '/auth/callback',
    element: (
      <PageWrapper>
        <AuthCallbackPage />
      </PageWrapper>
    ),
    errorElement: <PageErrorFallback error={new Error('Failed to load auth callback')} retry={() => window.location.reload()} />,
  },
  {
    path: '/chat',
    element: (
      <PageWrapper>
        <ChatPage />
      </PageWrapper>
    ),
    errorElement: <PageErrorFallback error={new Error('Failed to load chat page')} retry={() => window.location.reload()} />,
  },
  {
    path: '/profile',
    element: (
      <PageWrapper requireAuth>
        <ProfilePage />
      </PageWrapper>
    ),
    errorElement: <PageErrorFallback error={new Error('Failed to load profile page')} retry={() => window.location.reload()} />,
  },
  {
    path: '/settings',
    element: (
      <PageWrapper>
        <SettingsPage />
      </PageWrapper>
    ),
    errorElement: <PageErrorFallback error={new Error('Failed to load settings page')} retry={() => window.location.reload()} />,
  },
  {
    path: '/support',
    element: (
      <PageWrapper>
        <SupportPage />
      </PageWrapper>
    ),
    errorElement: <PageErrorFallback error={new Error('Failed to load support page')} retry={() => window.location.reload()} />,
  },
  // Catch-all route for 404 errors
  {
    path: '*',
    element: (
      <PageWrapper>
        <NotFoundPage />
      </PageWrapper>
    ),
    errorElement: <PageErrorFallback error={new Error('Page not found')} retry={() => window.location.reload()} />,
  },
]);

export default router; 