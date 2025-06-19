// Enhanced ChatPage with proper error handling and UX
import React, { useEffect, useCallback, useMemo } from 'react';
import { ChatBox } from '../components/ChatBox';
import { ChatInput } from '../components/ChatInput';
import { useChatStore } from '../store/chat.store';
import { LoadingSpinner, ConnectionStatus } from '@/components/ui';
import { useAuthStore } from '@/stores/auth.store';

export const ChatPage: React.FC = () => {
  const { 
    messages, 
    error, 
    isLoading, 
    clearError, 
    clearChat,
    setMessages 
  } = useChatStore();
  
  const { user, isAuthenticated } = useAuthStore();

  // Memoize welcome message to prevent unnecessary re-renders
  const welcomeMessage = useMemo(() => ({
    id: 'welcome-1',
    role: 'assistant' as const,
    content: `Hello${user?.name ? `, ${user.name}` : ''}! I'm your AI assistant. How can I help you today?`,
    timestamp: new Date(),
  }), [user?.name]);

  // Initialize welcome message
  useEffect(() => {
    if (messages.length === 0 && isAuthenticated) {
      setMessages([welcomeMessage]);
    }
  }, [messages.length, isAuthenticated, welcomeMessage, setMessages]);

  // Clear error after a delay
  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  // Auto-clear errors after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // Connection status
  const connectionStatus = useMemo(() => {
    if (error) {
      if (error.includes('404') || error.includes('Failed to fetch')) {
        return 'error';
      }
      return 'disconnected';
    }
    if (isLoading) {
      return 'connecting';
    }
    return 'connected';
  }, [error, isLoading]);

  // Render error banner
  const renderErrorBanner = () => {
    if (!error) return null;

    const getErrorMessage = () => {
      if (error.includes('404')) {
        return 'Chat service is currently unavailable. Please try again later.';
      }
      if (error.includes('Please log in')) {
        return 'You need to be logged in to send messages.';
      }
      if (error.includes('Network') || error.includes('fetch')) {
        return 'Network connection failed. Please check your internet connection.';
      }
      if (error.includes('timeout')) {
        return 'Request timed out. The server might be busy, please try again.';
      }
      return error || 'Something went wrong. Please try again.';
    };

    return (
      <div className="mx-4 mb-4 animate-in slide-in-from-bottom-2">
        <div className="error-container p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="error-icon">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white mb-1">
                  Connection Issue
                </p>
                <p className="text-xs error-text leading-relaxed">
                  {getErrorMessage()}
                </p>
              </div>
            </div>
            <button
              onClick={handleClearError}
              className="flex-shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Dismiss error"
            >
              <svg className="w-4 h-4 text-white/60 hover:text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Chat Header */}
      <div className="glass-card-subtle mx-4 mt-4 mb-0 border-b-0 rounded-b-none relative overflow-hidden">
        {/* Header background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5" />
        
        <div className="relative flex items-center justify-between p-4 sm:p-6">
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              {/* Status indicator */}
              <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4">
                <ConnectionStatus 
                  status={connectionStatus as 'connected' | 'connecting' | 'disconnected' | 'error'} 
                  className="absolute bottom-0 right-0"
                />
              </div>
            </div>
            
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-bold text-white truncate">
                AI Assistant
              </h1>
              <div className="flex items-center gap-2">
                <ConnectionStatus status={connectionStatus as 'connected' | 'connecting' | 'disconnected' | 'error'} />
                {user && (
                  <span className="hidden sm:inline text-xs text-white/40">
                    • Welcome, {user.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={clearChat}
              className="p-2 text-white/60 hover:text-white/80 hover:bg-white/10 rounded-lg transition-all duration-200 focus-ring"
              title="Clear Chat"
              disabled={isLoading}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            
            <button
              className="p-2 text-white/60 hover:text-white/80 hover:bg-white/10 rounded-lg transition-all duration-200 focus-ring"
              title="Settings"
              disabled={isLoading}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {renderErrorBanner()}

      {/* Chat Messages Container */}
      <div className="flex-1 mx-4 min-h-0">
        <div className="glass-card-subtle h-full rounded-t-none border-t-0 flex flex-col overflow-hidden">
          <ChatBox />
        </div>
      </div>

      {/* Chat Input Container */}
      <div className="mx-4 mb-4 flex-shrink-0">
        <div className="glass-card-subtle rounded-t-none border-t-0 p-4 sm:p-6">
          <ChatInput />
          
          {/* Input Helper */}
          <div className="flex items-center justify-between mt-3 text-xs text-white/60">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <span className="hidden sm:flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs font-mono">Enter</kbd>
                to send
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs font-mono">Shift</kbd>
                +
                <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs font-mono">Enter</kbd>
                for new line
              </span>
              
              {/* Mobile helper */}
              <span className="sm:hidden text-xs text-white/50">
                Press send or tap Enter
              </span>
            </div>
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-accent-400">
                <LoadingSpinner size="sm" variant="primary" />
                <span className="hidden sm:inline">AI is thinking...</span>
                <span className="sm:hidden">Thinking...</span>
              </div>
            )}
            
            {/* Message count */}
            {!isLoading && messages.length > 1 && (
              <span className="text-white/40">
                {messages.length - 1} message{messages.length !== 2 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Default export for dynamic imports
export default ChatPage; 