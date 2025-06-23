import React, { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface OAuthLoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  onTimeout?: () => void;
  timeoutMs?: number;
}

export const OAuthLoadingOverlay: React.FC<OAuthLoadingOverlayProps> = ({
  isVisible,
  message = 'Redirecting to Google for authentication...',
  onTimeout,
  timeoutMs = 10000, // 10 seconds timeout
}) => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(message);

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      setCurrentMessage(message);
      return;
    }

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        return newProgress > 95 ? 95 : newProgress; // Cap at 95% until actual redirect
      });
    }, 100);

    // Message updates
    const messageTimeout1 = setTimeout(() => {
      setCurrentMessage('Connecting to Google OAuth...');
    }, 2000);

    const messageTimeout2 = setTimeout(() => {
      setCurrentMessage('Please complete authentication in the new window...');
    }, 5000);

    // Timeout handler
    const timeoutHandler = setTimeout(() => {
      if (onTimeout) {
        onTimeout();
      }
    }, timeoutMs);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(messageTimeout1);
      clearTimeout(messageTimeout2);
      clearTimeout(timeoutHandler);
    };
  }, [isVisible, message, onTimeout, timeoutMs]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-500">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 mx-4 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
            <LoadingSpinner size="lg" className="text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Authenticating...
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {currentMessage}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            If the page doesn't redirect automatically, please check if popups are blocked.
          </p>
        </div>

        {/* Google branding */}
        <div className="absolute top-4 right-4">
          <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        </div>
      </div>
    </div>
  );
}; 