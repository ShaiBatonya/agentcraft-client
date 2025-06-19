import React from 'react';
import { cn } from '@/shared/utils';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'white' | 'accent' | 'gradient' | 'dots' | 'pulse';
  className?: string;
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  className = '',
  label = 'Loading...',
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const baseSpinnerClasses = 'animate-spin rounded-full border-2';

  // Render different spinner variants
  const renderSpinner = () => {
    switch (variant) {
      case 'white':
        return (
          <div
            className={cn(
              baseSpinnerClasses,
              'border-white/30 border-t-white',
              sizeClasses[size],
              className
            )}
            aria-hidden="true"
          />
        );

      case 'accent':
        return (
          <div
            className={cn(
              baseSpinnerClasses,
              'border-accent-500/30 border-t-accent-500',
              sizeClasses[size],
              className
            )}
            aria-hidden="true"
          />
        );

      case 'gradient':
        return (
          <div className={cn('relative', sizeClasses[size], className)}>
            <div
              className={cn(
                baseSpinnerClasses,
                'border-transparent border-t-accent-500',
                sizeClasses[size]
              )}
              aria-hidden="true"
            />
            <div
              className={cn(
                'absolute inset-0 rounded-full bg-gradient-to-r from-accent-500 via-purple-500 to-pink-500 opacity-20 animate-pulse',
                sizeClasses[size]
              )}
              aria-hidden="true"
            />
          </div>
        );

      case 'dots':
        return (
          <div className={cn('flex gap-1', className)} aria-hidden="true">
            <div
              className={cn(
                'rounded-full bg-accent-500 animate-bounce',
                size === 'xs' ? 'w-1 h-1' :
                size === 'sm' ? 'w-1.5 h-1.5' :
                size === 'md' ? 'w-2 h-2' :
                size === 'lg' ? 'w-2.5 h-2.5' : 'w-3 h-3'
              )}
              style={{ animationDelay: '0ms' }}
            />
            <div
              className={cn(
                'rounded-full bg-accent-500 animate-bounce',
                size === 'xs' ? 'w-1 h-1' :
                size === 'sm' ? 'w-1.5 h-1.5' :
                size === 'md' ? 'w-2 h-2' :
                size === 'lg' ? 'w-2.5 h-2.5' : 'w-3 h-3'
              )}
              style={{ animationDelay: '150ms' }}
            />
            <div
              className={cn(
                'rounded-full bg-accent-500 animate-bounce',
                size === 'xs' ? 'w-1 h-1' :
                size === 'sm' ? 'w-1.5 h-1.5' :
                size === 'md' ? 'w-2 h-2' :
                size === 'lg' ? 'w-2.5 h-2.5' : 'w-3 h-3'
              )}
              style={{ animationDelay: '300ms' }}
            />
          </div>
        );

      case 'pulse':
        return (
          <div className={cn('relative', sizeClasses[size], className)}>
            <div
              className={cn(
                'absolute inset-0 rounded-full bg-accent-500 animate-ping opacity-75',
                sizeClasses[size]
              )}
              aria-hidden="true"
            />
            <div
              className={cn(
                'relative rounded-full bg-accent-500 animate-pulse',
                sizeClasses[size]
              )}
              aria-hidden="true"
            />
          </div>
        );

      default:
        return (
          <div
            className={cn(
              baseSpinnerClasses,
              'border-gray-300 dark:border-gray-600 border-t-gray-900 dark:border-t-gray-300',
              sizeClasses[size],
              className
            )}
            aria-hidden="true"
          />
        );
    }
  };

  return (
    <div className="inline-flex items-center gap-2" role="status" aria-live="polite">
      {renderSpinner()}
      {label && (
        <span className="sr-only">
          {label}
        </span>
      )}
    </div>
  );
};

// Specialized loading components for common use cases
export const PageLoader: React.FC<{ message?: string }> = ({ message = 'Loading page...' }) => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900">
    <div className="text-center space-y-4">
      <LoadingSpinner size="xl" variant="gradient" />
      <p className="text-white/70 text-lg font-medium">{message}</p>
    </div>
  </div>
);

export const ButtonLoader: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'sm' }) => (
  <LoadingSpinner size={size} variant="white" />
);

export const InlineLoader: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div className="inline-flex items-center gap-2 text-white/70">
    <LoadingSpinner size="sm" variant="accent" />
    <span className="text-sm">{message}</span>
  </div>
);

// Skeleton loader component for content placeholders
interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  animate = true 
}) => {
  return (
    <div 
      className={`bg-white/10 rounded-lg ${animate ? 'animate-pulse' : ''} ${className}`}
    />
  );
};

// Message skeleton for chat loading
export const MessageSkeleton: React.FC = () => {
  return (
    <div className="flex items-start gap-4 mb-8 animate-in slide-in-from-bottom-2">
      {/* Avatar skeleton */}
      <Skeleton className="w-10 h-10 rounded-2xl flex-shrink-0 mt-1" />
      
      {/* Message content skeleton */}
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
};

// Chat loading indicator
export const ChatLoadingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-3 mb-6 animate-in slide-in-from-bottom-2 duration-300">
      {/* AI Avatar */}
      <div className="flex-shrink-0 mt-1">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      </div>

      {/* Typing Bubble */}
      <div className="flex flex-col max-w-[80%]">
        <div className="relative message-assistant-ultra rounded-3xl rounded-bl-lg px-6 py-4">
          {/* Message tail */}
          <div className="absolute left-[-8px] top-4 w-4 h-4 transform rotate-45 glass-premium border-l border-b border-white/10" />
          
          {/* Typing Animation */}
          <div className="flex items-center gap-2">
            <div className="typing-indicator">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
            <span className="ml-2 text-sm text-white/60">
              AI is thinking...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Connection status indicator
interface ConnectionStatusProps {
  status: 'connected' | 'connecting' | 'disconnected' | 'error';
  className?: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  status, 
  className = '' 
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          color: 'bg-emerald-400',
          text: 'Connected',
          textColor: 'text-emerald-400',
          animate: 'animate-pulse'
        };
      case 'connecting':
        return {
          color: 'bg-yellow-400',
          text: 'Connecting...',
          textColor: 'text-yellow-400',
          animate: 'animate-bounce'
        };
      case 'disconnected':
        return {
          color: 'bg-gray-400',
          text: 'Disconnected',
          textColor: 'text-gray-400',
          animate: ''
        };
      case 'error':
        return {
          color: 'bg-red-400',
          text: 'Connection Error',
          textColor: 'text-red-400',
          animate: 'animate-pulse'
        };
      default:
        return {
          color: 'bg-gray-400',
          text: 'Unknown',
          textColor: 'text-gray-400',
          animate: ''
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div 
        className={`w-2 h-2 rounded-full ${config.color} ${config.animate}`} 
      />
      <span className={`text-xs ${config.textColor}`}>
        {config.text}
      </span>
    </div>
  );
}; 