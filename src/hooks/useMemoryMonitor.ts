import { useCallback, useEffect, useRef } from 'react';

interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  percentage: number;
}

interface MemoryMonitorOptions {
  threshold?: number; // Memory usage percentage threshold
  interval?: number; // Check interval in milliseconds
  onMemoryWarning?: (info: MemoryInfo) => void;
  enableLogging?: boolean;
}

// Extend Performance interface to include memory
interface PerformanceWithMemory extends Performance {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

// Global memory monitoring state
const memoryState = {
  isMonitoring: false,
  intervalId: null as NodeJS.Timeout | null,
  lastCheck: 0,
  warnings: 0,
};

const getMemoryInfo = (): MemoryInfo | null => {
  const perf = performance as PerformanceWithMemory;
  
  if (!perf.memory) {
    return null;
  }

  const memory = perf.memory;
  return {
    usedJSHeapSize: memory.usedJSHeapSize,
    totalJSHeapSize: memory.totalJSHeapSize,
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
    percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
  };
};

export const useMemoryMonitor = (options: MemoryMonitorOptions = {}) => {
  const {
    threshold = 80, // 80% memory usage warning
    interval = 10000, // Check every 10 seconds
    onMemoryWarning,
    enableLogging = import.meta.env.DEV,
  } = options;

  const warningCallbackRef = useRef(onMemoryWarning);
  warningCallbackRef.current = onMemoryWarning;

  const checkMemory = useCallback(() => {
    const memoryInfo = getMemoryInfo();
    
    if (!memoryInfo) return;

    const now = Date.now();
    memoryState.lastCheck = now;

    if (enableLogging) {
      console.log(`🧠 Memory: ${(memoryInfo.usedJSHeapSize / 1024 / 1024).toFixed(1)}MB / ${(memoryInfo.jsHeapSizeLimit / 1024 / 1024).toFixed(1)}MB (${memoryInfo.percentage.toFixed(1)}%)`);
    }

    // Check if memory usage exceeds threshold
    if (memoryInfo.percentage > threshold) {
      memoryState.warnings++;
      
      if (enableLogging) {
        console.warn(`⚠️ High memory usage: ${memoryInfo.percentage.toFixed(1)}% (Warning #${memoryState.warnings})`);
      }

      // Call warning callback
      warningCallbackRef.current?.(memoryInfo);

      // Force garbage collection if available (Chrome DevTools)
      if ('gc' in window) {
        try {
          (window as { gc?: () => void }).gc?.();
          console.log('🗑️ Forced garbage collection');
        } catch {
          // Ignore errors silently
        }
      }
    }

    return memoryInfo;
  }, [threshold, enableLogging]);

  // Start monitoring
  useEffect(() => {
    if (memoryState.isMonitoring) {
      return; // Already monitoring globally
    }

    memoryState.isMonitoring = true;
    memoryState.intervalId = setInterval(checkMemory, interval);

    if (enableLogging) {
      console.log('🎯 Memory monitoring started');
    }

    return () => {
      if (memoryState.intervalId) {
        clearInterval(memoryState.intervalId);
        memoryState.intervalId = null;
        memoryState.isMonitoring = false;
        
        if (enableLogging) {
          console.log('🛑 Memory monitoring stopped');
        }
      }
    };
  }, [checkMemory, interval, enableLogging]);

  // Manual memory check
  const getCurrentMemory = useCallback(() => {
    return getMemoryInfo();
  }, []);

  // Force garbage collection
  const forceGarbageCollection = useCallback(() => {
    if ('gc' in window) {
      try {
        (window as { gc?: () => void }).gc?.();
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }, []);

  // Clear large objects from memory
  const clearCaches = useCallback(() => {
    // Clear React Query cache
    import('@/context/query.context').then(({ clearQueryCache }) => {
      clearQueryCache();
    });

    // Clear Zustand stores
    import('@/stores/chat.store').then(({ useChatStore }) => {
      const store = useChatStore.getState();
      if ('clearOldMessages' in store) {
        (store as unknown as { clearOldMessages: () => void }).clearOldMessages();
      }
    });

    // Clear any other caches
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }
  }, []);

  return {
    getCurrentMemory,
    forceGarbageCollection,
    clearCaches,
    checkMemory,
    isSupported: !!(performance as PerformanceWithMemory).memory,
    lastCheck: memoryState.lastCheck,
    warnings: memoryState.warnings,
  };
}; 