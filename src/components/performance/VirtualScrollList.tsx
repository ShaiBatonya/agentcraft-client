import React, { 
  useState, 
  useEffect, 
  useRef, 
  useCallback, 
  useMemo,
  memo,
  CSSProperties
} from 'react';

interface VirtualScrollItem {
  id: string | number;
  height?: number;
  data?: unknown;
}

interface VirtualScrollListProps<T extends VirtualScrollItem> {
  items: T[];
  itemHeight?: number;
  containerHeight: number;
  renderItem: (item: T, index: number, isVisible: boolean) => React.ReactNode;
  getItemHeight?: (item: T, index: number) => number;
  overscan?: number;
  onScroll?: (scrollTop: number, scrollDirection: 'up' | 'down') => void;
  onEndReached?: () => void;
  endReachedThreshold?: number;
  className?: string;
  style?: CSSProperties;
  scrollToIndex?: number;
  maintainScrollPosition?: boolean;
  enableSmoothScrolling?: boolean;
}

interface ViewportInfo {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
  startIndex: number;
  endIndex: number;
  totalHeight: number;
}

// Cache for item heights
const heightCache = new Map<string | number, number>();

// Default item height
const DEFAULT_ITEM_HEIGHT = 60;

// Throttle function for performance
const throttle = <T extends unknown[]>(
  func: (...args: T) => void,
  delay: number
): ((...args: T) => void) => {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;
  
  return (...args: T) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};

export const VirtualScrollList = memo(<T extends VirtualScrollItem>({
  items,
  itemHeight = DEFAULT_ITEM_HEIGHT,
  containerHeight,
  renderItem,
  getItemHeight,
  overscan = 5,
  onScroll,
  onEndReached,
  endReachedThreshold = 0.8,
  className = '',
  style = {},
  scrollToIndex,
  maintainScrollPosition = false,
  enableSmoothScrolling = true,
}: VirtualScrollListProps<T>) => {
  const [viewportInfo, setViewportInfo] = useState<ViewportInfo>({
    scrollTop: 0,
    scrollHeight: 0,
    clientHeight: containerHeight,
    startIndex: 0,
    endIndex: 0,
    totalHeight: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);
  const scrollDirection = useRef<'up' | 'down'>('down');
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // Calculate item heights with caching
  const getCalculatedItemHeight = useCallback((item: T, index: number): number => {
    const cacheKey = `${item.id}_${index}`;
    
    if (heightCache.has(cacheKey)) {
      return heightCache.get(cacheKey)!;
    }
    
    const height = getItemHeight ? getItemHeight(item, index) : itemHeight;
    heightCache.set(cacheKey, height);
    return height;
  }, [getItemHeight, itemHeight]);

  // Calculate total height and item positions
  const { totalHeight, itemPositions } = useMemo(() => {
    let currentTop = 0;
    const positions: number[] = [];
    
    for (let i = 0; i < items.length; i++) {
      positions[i] = currentTop;
      currentTop += getCalculatedItemHeight(items[i], i);
    }
    
    return {
      totalHeight: currentTop,
      itemPositions: positions,
    };
  }, [items, getCalculatedItemHeight]);

  // Find visible item range
  const getVisibleRange = useCallback((scrollTop: number, clientHeight: number) => {
    let startIndex = 0;
    let endIndex = items.length - 1;
    
    // Binary search for start index
    let left = 0;
    let right = items.length - 1;
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const itemTop = itemPositions[mid];
      const itemBottom = itemTop + getCalculatedItemHeight(items[mid], mid);
      
      if (itemBottom > scrollTop) {
        startIndex = mid;
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    
    // Find end index
    let visibleHeight = 0;
    for (let i = startIndex; i < items.length; i++) {
      if (visibleHeight > clientHeight) {
        endIndex = i;
        break;
      }
      visibleHeight += getCalculatedItemHeight(items[i], i);
    }
    
    // Apply overscan
    startIndex = Math.max(0, startIndex - overscan);
    endIndex = Math.min(items.length - 1, endIndex + overscan);
    
    return { startIndex, endIndex };
  }, [items, itemPositions, getCalculatedItemHeight, overscan]);

  // Handle scroll events with throttling
  const handleScroll = useCallback(
    throttle((event: React.UIEvent<HTMLDivElement>) => {
      const element = event.currentTarget;
      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight;
      const clientHeight = element.clientHeight;
      
      // Determine scroll direction
      scrollDirection.current = scrollTop > lastScrollTop.current ? 'down' : 'up';
      lastScrollTop.current = scrollTop;
      
      // Calculate visible range
      const { startIndex, endIndex } = getVisibleRange(scrollTop, clientHeight);
      
      // Update viewport info
      setViewportInfo({
        scrollTop,
        scrollHeight,
        clientHeight,
        startIndex,
        endIndex,
        totalHeight,
      });
      
      // Call scroll callback
      onScroll?.(scrollTop, scrollDirection.current);
      
      // Check if we've reached the end
      if (onEndReached && scrollTop / scrollHeight >= endReachedThreshold) {
        onEndReached();
      }
      
      // Set scrolling state
      isScrolling.current = true;
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        isScrolling.current = false;
      }, 150);
    }, 16), // ~60fps
    [getVisibleRange, totalHeight, onScroll, onEndReached, endReachedThreshold]
  );

  // Scroll to specific index
  const scrollToItem = useCallback((index: number, behavior: ScrollBehavior = 'smooth') => {
    if (!scrollElementRef.current || index < 0 || index >= items.length) return;
    
    const targetTop = itemPositions[index];
    scrollElementRef.current.scrollTo({
      top: targetTop,
      behavior: enableSmoothScrolling ? behavior : 'auto',
    });
  }, [itemPositions, items.length, enableSmoothScrolling]);

  // Handle scroll to index prop
  useEffect(() => {
    if (scrollToIndex !== undefined && scrollToIndex >= 0) {
      scrollToItem(scrollToIndex);
    }
  }, [scrollToIndex, scrollToItem]);

  // Initialize viewport
  useEffect(() => {
    if (items.length > 0) {
      const { startIndex, endIndex } = getVisibleRange(0, containerHeight);
      setViewportInfo(prev => ({
        ...prev,
        startIndex,
        endIndex,
        totalHeight,
      }));
    }
  }, [items.length, getVisibleRange, containerHeight, totalHeight]);

  // Maintain scroll position when items change (useful for chat)
  useEffect(() => {
    if (!maintainScrollPosition || !scrollElementRef.current) return;
    
    const element = scrollElementRef.current;
    const wasAtBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 10;
    
    if (wasAtBottom) {
      // Maintain position at bottom
      requestAnimationFrame(() => {
        element.scrollTop = element.scrollHeight - element.clientHeight;
      });
    }
  }, [items, maintainScrollPosition]);

  // Render visible items with position
  const visibleItems = useMemo(() => {
    const rendered = [];
    
    for (let i = viewportInfo.startIndex; i <= viewportInfo.endIndex; i++) {
      if (i >= items.length) break;
      
      const item = items[i];
      const top = itemPositions[i];
      const height = getCalculatedItemHeight(item, i);
      const isVisible = !isScrolling.current; // Hide during fast scrolling for performance
      
      rendered.push(
        <div
          key={item.id}
          className="virtual-list-item"
          style={{
            position: 'absolute',
            top: `${top}px`,
            left: 0,
            right: 0,
            height: `${height}px`,
            transform: 'translateZ(0)', // Hardware acceleration
            backfaceVisibility: 'hidden',
            willChange: isScrolling.current ? 'transform' : 'auto',
          }}
        >
          {renderItem(item, i, isVisible)}
        </div>
      );
    }
    
    return rendered;
  }, [
    items,
    viewportInfo.startIndex,
    viewportInfo.endIndex,
    itemPositions,
    getCalculatedItemHeight,
    renderItem,
  ]);

  // Container styles
  const containerStyle: CSSProperties = {
    position: 'relative',
    height: containerHeight,
    overflow: 'auto',
    ...style,
  };

  // Virtual content styles
  const contentStyle: CSSProperties = {
    position: 'relative',
    height: totalHeight,
    width: '100%',
  };

  return (
    <div
      ref={containerRef}
      className={`virtual-scroll-container ${className}`}
      style={containerStyle}
    >
      <div
        ref={scrollElementRef}
        className="virtual-scroll-viewport"
        style={{
          height: '100%',
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
        }}
        onScroll={handleScroll}
      >
        <div
          className="virtual-scroll-content"
          style={contentStyle}
        >
          {visibleItems}
        </div>
      </div>
      
      {/* Debug info in development */}
      {import.meta.env.DEV && (
        <div className="virtual-scroll-debug fixed top-4 right-4 bg-black/80 text-white text-xs p-2 rounded font-mono z-50">
          <div>Items: {items.length}</div>
          <div>Visible: {viewportInfo.startIndex}-{viewportInfo.endIndex}</div>
          <div>Height: {totalHeight}px</div>
          <div>Scroll: {Math.round(viewportInfo.scrollTop)}px</div>
        </div>
      )}
    </div>
  );
});

export default VirtualScrollList; 