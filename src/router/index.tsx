// Router configuration with lazy-loaded routes
import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { MainLayout } from '../layout/MainLayout';
import { AuthGuard } from '../components/auth/AuthGuard';

// Lazy load components
const HomePage = lazy(() => import('../pages/HomePage').then(module => ({ default: module.HomePage })));
const LoginPage = lazy(() => import('../pages/LoginPage').then(module => ({ default: module.LoginPage })));
const ChatPage = lazy(() => import('../features/chat').then(module => ({ default: module.ChatPage })));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-500 border-t-transparent" />
  </div>
);

// Wrapper component for MainLayout
const LayoutWrapper = ({ children }: { children: React.ReactNode }) => (
  <MainLayout>{children}</MainLayout>
);

// Router configuration
export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <LayoutWrapper>
        <Suspense fallback={<LoadingSpinner />}>
          <HomePage />
        </Suspense>
      </LayoutWrapper>
    ),
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/chat',
    element: (
      <AuthGuard>
        <LayoutWrapper>
          <Suspense fallback={<LoadingSpinner />}>
            <div className="min-h-[calc(100vh-8rem)]">
              <ChatPage />
            </div>
          </Suspense>
        </LayoutWrapper>
      </AuthGuard>
    ),
  },
]); 