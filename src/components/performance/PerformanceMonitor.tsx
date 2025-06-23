import React, { useEffect, useRef, useState, memo } from 'react';

interface PerformanceMetrics {
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte
  memoryUsage?: {
    used: number;
    limit: number;
    percentage: number;
  };
  connectionType?: string;
  deviceMemory?: number;
}

interface PerformanceMonitorProps {
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
  enableLogging?: boolean;
  showOverlay?: boolean;
}

// Type for performance entries with extended properties
interface ExtendedPerformanceEntry extends PerformanceEntry {
  processingStart?: number;
  value?: number;
  hadRecentInput?: boolean;
}

// Type for memory info
interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

// Type for navigator with extended properties
interface ExtendedNavigator extends Navigator {
  connection?: {
    effectiveType?: string;
  };
  deviceMemory?: number;
}

// Check if we're in development mode
const isDev = import.meta.env.DEV;

// Performance observer for Core Web Vitals
const observePerformance = (callback: (metrics: PerformanceMetrics) => void) => {
  const metrics: PerformanceMetrics = {};

  // Observe navigation timing
  if ('performance' in window && 'getEntriesByType' in performance) {
    const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (navigationEntries.length > 0) {
      const entry = navigationEntries[0];
      metrics.TTFB = entry.responseStart - entry.requestStart;
    }
  }

  // Observe paint timing
  if ('PerformanceObserver' in window) {
    try {
      // First Contentful Paint
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            metrics.FCP = entry.startTime;
            callback({ ...metrics });
          }
        });
      }).observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          metrics.LCP = lastEntry.startTime;
          callback({ ...metrics });
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries() as ExtendedPerformanceEntry[];
        entries.forEach((entry) => {
          if (entry.processingStart) {
            metrics.FID = entry.processingStart - entry.startTime;
            callback({ ...metrics });
          }
        });
      }).observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      let clsValue = 0;
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries() as ExtendedPerformanceEntry[];
        entries.forEach((entry) => {
          if (!entry.hadRecentInput && entry.value) {
            clsValue += entry.value;
            metrics.CLS = clsValue;
            callback({ ...metrics });
          }
        });
      }).observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('Performance Observer not fully supported:', error);
    }
  }

  return metrics;
};

// Get memory usage information
const getMemoryUsage = (): PerformanceMetrics['memoryUsage'] => {
  const performance = window.performance as Performance & { memory?: MemoryInfo };
  if (performance.memory) {
    const memory = performance.memory;
    return {
      used: Math.round(memory.usedJSHeapSize / 1048576), // MB
      limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
      percentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100),
    };
  }
  return undefined;
};

// Get connection information
const getConnectionInfo = (): Pick<PerformanceMetrics, 'connectionType' | 'deviceMemory'> => {
  const navigator = window.navigator as ExtendedNavigator;
  return {
    connectionType: navigator.connection?.effectiveType || 'unknown',
    deviceMemory: navigator.deviceMemory || undefined,
  };
};

// Performance grade calculation
const getPerformanceGrade = (metrics: PerformanceMetrics): string => {
  let score = 0;
  let factors = 0;

  if (metrics.FCP !== undefined) {
    score += metrics.FCP < 1800 ? 100 : metrics.FCP < 3000 ? 75 : 50;
    factors++;
  }

  if (metrics.LCP !== undefined) {
    score += metrics.LCP < 2500 ? 100 : metrics.LCP < 4000 ? 75 : 50;
    factors++;
  }

  if (metrics.FID !== undefined) {
    score += metrics.FID < 100 ? 100 : metrics.FID < 300 ? 75 : 50;
    factors++;
  }

  if (metrics.CLS !== undefined) {
    score += metrics.CLS < 0.1 ? 100 : metrics.CLS < 0.25 ? 75 : 50;
    factors++;
  }

  const averageScore = factors > 0 ? score / factors : 0;
  
  if (averageScore >= 90) return 'A';
  if (averageScore >= 80) return 'B';
  if (averageScore >= 70) return 'C';
  if (averageScore >= 60) return 'D';
  return 'F';
};

// Format time in milliseconds
const formatTime = (time: number) => {
  return `${Math.round(time)}ms`;
};

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = memo(({
  onMetricsUpdate,
  enableLogging = isDev,
  showOverlay = isDev,
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isVisible, setIsVisible] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isDev && !enableLogging) return;

    const handleMetricsUpdate = (newMetrics: PerformanceMetrics) => {
      setMetrics(prevMetrics => {
        const updatedMetrics = { ...prevMetrics, ...newMetrics };
        onMetricsUpdate?.(updatedMetrics);
        return updatedMetrics;
      });
    };

    // Start observing performance
    observePerformance(handleMetricsUpdate);

    // Update memory and connection info periodically
    intervalRef.current = setInterval(() => {
      const memoryUsage = getMemoryUsage();
      const connectionInfo = getConnectionInfo();
      
      handleMetricsUpdate({
        memoryUsage,
        ...connectionInfo,
      });
    }, 5000);

    // Log performance metrics
    if (enableLogging) {
      setTimeout(() => {
        const grade = getPerformanceGrade(metrics);
        console.group('🚀 Performance Metrics');
        console.log('Grade:', grade);
        console.log('Metrics:', metrics);
        console.groupEnd();
      }, 3000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enableLogging, onMetricsUpdate, metrics]);

  // Show/hide overlay with keyboard shortcut
  useEffect(() => {
    if (!showOverlay) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.shiftKey && event.ctrlKey && event.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showOverlay]);

  if (!showOverlay || !isDev) return null;

  const grade = getPerformanceGrade(metrics);
  const gradeColor = {
    A: 'text-green-400 border-green-400',
    B: 'text-blue-400 border-blue-400',
    C: 'text-yellow-400 border-yellow-400',
    D: 'text-orange-400 border-orange-400',
    F: 'text-red-400 border-red-400',
  }[grade];

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 left-4 z-[9999] p-2 bg-gray-900/90 border border-gray-600 rounded-lg text-white text-xs font-mono hover:bg-gray-800 transition-colors"
        title="Performance Monitor (Ctrl+Shift+P)"
      >
        🚀 {grade}
      </button>

      {/* Performance overlay */}
      {isVisible && (
        <div className="fixed bottom-16 left-4 z-[9999] p-4 bg-gray-900/95 backdrop-blur-sm border border-gray-600 rounded-lg text-white text-xs font-mono max-w-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Performance</h3>
            <span className={`px-2 py-1 border rounded ${gradeColor}`}>
              Grade {grade}
            </span>
          </div>

          <div className="space-y-2">
            {/* Core Web Vitals */}
            <div className="border-b border-gray-600 pb-2">
              <div className="text-gray-400 mb-1">Core Web Vitals</div>
              {metrics.FCP && (
                <div className="flex justify-between">
                  <span>FCP:</span>
                  <span className={metrics.FCP < 1800 ? 'text-green-400' : 'text-yellow-400'}>
                    {formatTime(metrics.FCP)}
                  </span>
                </div>
              )}
              {metrics.LCP && (
                <div className="flex justify-between">
                  <span>LCP:</span>
                  <span className={metrics.LCP < 2500 ? 'text-green-400' : 'text-yellow-400'}>
                    {formatTime(metrics.LCP)}
                  </span>
                </div>
              )}
              {metrics.FID && (
                <div className="flex justify-between">
                  <span>FID:</span>
                  <span className={metrics.FID < 100 ? 'text-green-400' : 'text-yellow-400'}>
                    {formatTime(metrics.FID)}
                  </span>
                </div>
              )}
              {metrics.CLS !== undefined && (
                <div className="flex justify-between">
                  <span>CLS:</span>
                  <span className={metrics.CLS < 0.1 ? 'text-green-400' : 'text-yellow-400'}>
                    {metrics.CLS.toFixed(3)}
                  </span>
                </div>
              )}
            </div>

            {/* Memory Usage */}
            {metrics.memoryUsage && (
              <div className="border-b border-gray-600 pb-2">
                <div className="text-gray-400 mb-1">Memory</div>
                <div className="flex justify-between">
                  <span>Used:</span>
                  <span className={metrics.memoryUsage.percentage > 80 ? 'text-red-400' : 'text-green-400'}>
                    {metrics.memoryUsage.used}MB ({metrics.memoryUsage.percentage}%)
                  </span>
                </div>
              </div>
            )}

            {/* Connection */}
            <div>
              <div className="text-gray-400 mb-1">Connection</div>
              <div className="flex justify-between">
                <span>Type:</span>
                <span>{metrics.connectionType}</span>
              </div>
              {metrics.deviceMemory && (
                <div className="flex justify-between">
                  <span>Device RAM:</span>
                  <span>{metrics.deviceMemory}GB</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-gray-600 text-gray-400 text-xs">
            Press Ctrl+Shift+P to toggle
          </div>
        </div>
      )}
    </>
  );
});

PerformanceMonitor.displayName = 'PerformanceMonitor';

export default PerformanceMonitor; 