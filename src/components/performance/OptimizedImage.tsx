import React, { useState, useRef, useEffect, useCallback, memo } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
  blurDataURL?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  loading?: 'lazy' | 'eager';
}

// WebP format detection
const supportsWebP = (() => {
  if (typeof window === 'undefined') return false;
  const canvas = document.createElement('canvas');
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
})();

// Generate optimized image sources
const generateSources = (src: string, quality = 80) => {
  const sources = [];
  
  if (supportsWebP) {
    sources.push({
      srcSet: `${src}?format=webp&quality=${quality}`,
      type: 'image/webp',
    });
  }
  
  sources.push({
    srcSet: `${src}?quality=${quality}`,
    type: 'image/jpeg',
  });
  
  return sources;
};

// Generate blur placeholder
const generateBlurPlaceholder = (width = 20, height = 20) => {
  if (typeof window === 'undefined') return '';
  
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#374151');
  gradient.addColorStop(0.5, '#1f2937');
  gradient.addColorStop(1, '#111827');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL();
};

export const OptimizedImage: React.FC<OptimizedImageProps> = memo(({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder,
  blurDataURL,
  priority = false,
  quality = 80,
  sizes,
  onLoad,
  onError,
  objectFit = 'cover',
  loading = 'lazy',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState('');
  
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView || loading === 'eager') return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.disconnect();
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority, isInView, loading]);

  // Handle image loading
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  // Progressive loading - start with low quality, then high quality
  useEffect(() => {
    if (!isInView && !priority) return;

    // Start with low quality for faster initial load
    const lowQualitySrc = `${src}?quality=20&blur=2`;
    setCurrentSrc(lowQualitySrc);

    // Preload high quality image
    const highQualityImg = new Image();
    highQualityImg.onload = () => {
      setCurrentSrc(`${src}?quality=${quality}`);
    };
    highQualityImg.src = `${src}?quality=${quality}`;
  }, [isInView, priority, src, quality]);

  // Generate placeholder
  const placeholderSrc = blurDataURL || placeholder || generateBlurPlaceholder();

  // Error fallback
  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-800 text-gray-400 ${className}`}
        style={{ width, height }}
        role="img"
        aria-label="Image failed to load"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
      </div>
    );
  }

  return (
    <div 
      className={`relative overflow-hidden ${className}`} 
      ref={imgRef}
      style={{ width, height }}
    >
      {/* Blur placeholder */}
      {!isLoaded && placeholderSrc && (
        <img
          src={placeholderSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: 'blur(10px)',
            transform: 'scale(1.1)',
            transition: 'opacity 0.3s ease',
          }}
          aria-hidden="true"
        />
      )}

      {/* Actual image with progressive enhancement */}
      {(isInView || priority) && (
        <picture>
          {generateSources(src, quality).map((source, index) => (
            <source
              key={index}
              srcSet={source.srcSet}
              type={source.type}
              sizes={sizes}
            />
          ))}
          <img
            src={currentSrc || src}
            alt={alt}
            width={width}
            height={height}
            className={`w-full h-full transition-opacity duration-500 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              objectFit,
              contentVisibility: 'auto',
              containIntrinsicSize: width && height ? `${width}px ${height}px` : undefined,
            }}
            onLoad={handleLoad}
            onError={handleError}
            loading={loading}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
          />
        </picture>
      )}

      {/* Loading spinner */}
      {(isInView || priority) && !isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage; 