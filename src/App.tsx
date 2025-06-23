import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PerformanceMonitor } from '@/components/performance/PerformanceMonitor';
import { useMemoryMonitor } from '@/hooks/useMemoryMonitor';
import { router } from '@/router';
import { useAuthStore } from '@/stores/auth.store';
import { showToast } from '@/stores/toast.store';
import { Suspense, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

interface PerformanceMetrics {
  FCP?: number;
  LCP?: number;
  FID?: number;
  CLS?: number;
  TTFB?: number;
  memoryUsage?: {
    used: number;
    limit: number;
    percentage: number;
  };
}

function App() {
  const { initialize, isLoading } = useAuthStore();

  // Initialize authentication
  useEffect(() => {
    const initAuth = async () => {
      try {
        await initialize();
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        showToast.error('Authentication initialization failed');
      }
    };

    initAuth();
  }, [initialize]);

  // Memory monitoring with performance optimizations
  const { clearCaches, forceGarbageCollection } = useMemoryMonitor({
    threshold: 85, // 85% memory usage warning
    interval: 30000, // Check every 30 seconds
    enableLogging: import.meta.env.DEV,
    onMemoryWarning: (info) => {
      console.warn(`🚨 High memory usage detected: ${info.percentage.toFixed(1)}%`);

      // Automatic cleanup on high memory usage
      clearCaches();

      // Force garbage collection if available
      const gcSuccess = forceGarbageCollection();
      if (gcSuccess) {
        console.log('♻️ Automatic cleanup performed');
      }

      // Show warning toast in development
      if (import.meta.env.DEV) {
        showToast.error(`High memory usage: ${info.percentage.toFixed(1)}%`, {
          duration: 5000,
          emoji: '⚠️'
        });
      }
    }
  });

  // Performance monitoring
  const handlePerformanceMetrics = (metrics: PerformanceMetrics) => {
    // Log performance issues in development
    if (import.meta.env.DEV) {
      if (metrics.LCP && metrics.LCP > 4000) {
        console.warn(`🐌 Slow LCP detected: ${metrics.LCP}ms`);
      }
      if (metrics.FID && metrics.FID > 300) {
        console.warn(`🐌 Slow FID detected: ${metrics.FID}ms`);
      }
      if (metrics.CLS && metrics.CLS > 0.25) {
        console.warn(`🐌 High CLS detected: ${metrics.CLS}`);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <div className="text-center">
            <p className="text-white font-medium">AgentCraft</p>
            <p className="text-gray-400 text-sm">Initializing...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
                <div className="text-center">
                  <p className="text-white font-medium">Loading...</p>
                </div>
              </div>
            </div>
          }
        >
          <RouterProvider router={router} />
        </Suspense>

        {/* Performance & Memory Monitoring (Development only) */}
        {import.meta.env.DEV && (
          <PerformanceMonitor
            onMetricsUpdate={handlePerformanceMetrics}
            enableLogging={true}
            showOverlay={true}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
