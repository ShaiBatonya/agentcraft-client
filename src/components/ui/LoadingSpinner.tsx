import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'white';
  message?: string;
  className?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  message,
  className = '',
  fullScreen = false,
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'md':
        return 'w-6 h-6';
      case 'lg':
        return 'w-8 h-8';
      case 'xl':
        return 'w-12 h-12';
      default:
        return 'w-6 h-6';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'border-accent-500/30 border-t-accent-500';
      case 'secondary':
        return 'border-white/30 border-t-white';
      case 'white':
        return 'border-white/30 border-t-white';
      default:
        return 'border-accent-500/30 border-t-accent-500';
    }
  };

  const getMessageTextClass = () => {
    switch (variant) {
      case 'primary':
        return 'text-white/80';
      case 'secondary':
        return 'text-white/60';
      case 'white':
        return 'text-white';
      default:
        return 'text-white/80';
    }
  };

  const spinner = (
    <div className={`loading-spinner ${getSizeClasses()} ${getVariantClasses()} ${className}`} />
  );

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      {spinner}
      {message && (
        <p className={`text-sm font-medium ${getMessageTextClass()}`}>
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="loading-container p-8 rounded-2xl">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

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