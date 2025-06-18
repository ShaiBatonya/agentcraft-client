// Router configuration with lazy-loaded routes
import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { MainLayout } from '../layout/MainLayout';

// Lazy load components
const HomePage = lazy(() => import('../pages/HomePage').then(module => ({ default: module.HomePage })));
const ChatPage = lazy(() => import('../features/chat').then(module => ({ default: module.ChatPage })));

// Loading component
const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
);

// Router configuration
export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                        <HomePage />
                    </Suspense>
                ),
            },
            {
                path: 'chat',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                        <div className="h-[calc(100vh-8rem)]">
                            <ChatPage />
                        </div>
                    </Suspense>
                ),
            },
        ],
    },
]); 