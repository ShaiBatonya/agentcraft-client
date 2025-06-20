// World-Class Responsive ChatContainer with advanced features and auto-scroll
import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import ChatMessage from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatToolbar } from './ChatToolbar';
import { 
  useMessages, 
  useChatLoading, 
  useChatError, 
  useChatInitialized,
  useClearError,
  useInitializeChat,
  useFilteredMessages,
  useSearchQuery
} from '../store/chat.store';
import { useAuthStore } from '@/stores/auth.store';

interface ChatContainerProps {
  className?: string;
}

export const ChatContainer: React.FC<ChatContainerProps> = React.memo(({ className = '' }) => {
  const messages = useMessages();
  const filteredMessages = useFilteredMessages();
  const searchQuery = useSearchQuery();
  const isLoading = useChatLoading();
  const error = useChatError();
  const isInitialized = useChatInitialized();
  const clearError = useClearError();
  const initializeChat = useInitializeChat();
  const { isAuthenticated } = useAuthStore();
  
  // Local state for UI
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  
  // Refs for smooth scrolling and performance
  const initRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Determine which messages to display
  const displayMessages = useMemo(() => {
    // If there's a search query, show filtered results
    if (searchQuery.trim() && filteredMessages.length > 0) {
      return filteredMessages;
    }
    // Otherwise show all active messages
    return messages.filter(msg => !msg.deleted);
  }, [messages, filteredMessages, searchQuery]);

  // Initialize chat when component mounts - run only once
  useEffect(() => {
    if (!initRef.current && !isInitialized) {
      initRef.current = true;
      try {
        initializeChat();
      } catch (error) {
        console.error('Failed to initialize chat:', error);
      }
    }
  }, []); // Empty dependency array - run only once

  // Smooth auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: smooth ? 'smooth' : 'auto',
        block: 'end'
      });
    }
  }, []);

  // Enhanced scroll detection with throttling
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    setShowScrollToBottom(!isNearBottom && displayMessages.length > 0);
    setShouldAutoScroll(isNearBottom);
    
    // Detect if user is actively scrolling
    setIsUserScrolling(true);
    const timeoutId = setTimeout(() => setIsUserScrolling(false), 1000);
    
    return () => clearTimeout(timeoutId);
  }, [displayMessages.length]);

  // Auto-scroll when new messages arrive (only if user hasn't scrolled up)
  useEffect(() => {
    if (shouldAutoScroll && !isUserScrolling && displayMessages.length > 0 && !searchQuery.trim()) {
      const timeoutId = setTimeout(() => scrollToBottom(true), 100);
      return () => clearTimeout(timeoutId);
    }
  }, [displayMessages.length, shouldAutoScroll, isUserScrolling, scrollToBottom, searchQuery]);

  // Scroll to bottom on initial load
  useEffect(() => {
    if (isInitialized && displayMessages.length > 0 && !searchQuery.trim()) {
      scrollToBottom(false);
    }
  }, [isInitialized, scrollToBottom, searchQuery]);



  // Memoized empty state for performance
  const EmptyState = useMemo(() => {
    if (searchQuery.trim() && filteredMessages.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
          <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center shadow-xl">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">No Results Found</h3>
            <p className="text-white/70 mb-6 text-sm sm:text-base leading-relaxed">
              No messages match your search criteria. Try different keywords or adjust your filters.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
        <div className="text-center max-w-md mx-auto animate-in fade-in duration-700">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent-500 to-purple-600 flex items-center justify-center shadow-xl">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Welcome to AgentCraft</h3>
          <p className="text-white/70 mb-6 text-sm sm:text-base leading-relaxed">
            Start a conversation with our AI assistant! Ask anything, get instant intelligent responses.
          </p>
          {isAuthenticated ? (
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-white/60">
              <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Your conversations are saved for 7 days
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-white/60">
              <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Sign in to save your conversations
            </div>
          )}
        </div>
      </div>
    );
  }, [isAuthenticated, searchQuery, filteredMessages.length]);

  // Enhanced loading indicator with better animations
  const LoadingIndicator = useMemo(() => (
    <div className="flex items-center justify-center p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-accent-500/30 border-t-accent-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-6 h-6 sm:w-8 sm:h-8 border border-accent-500/20 rounded-full animate-pulse"></div>
        </div>
        <span className="text-white/70 text-sm sm:text-base font-medium">Loading messages...</span>
      </div>
    </div>
  ), []);

  // Enhanced typing indicator for AI responses
  const TypingIndicator = useMemo(() => (
    <div className="flex items-start gap-3 sm:gap-4 mb-6 sm:mb-8 animate-in slide-in-from-bottom-4 fade-in duration-500">
      {/* AI Avatar */}
      <div className="relative group flex-shrink-0 mt-1">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600">
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-2xl opacity-60 blur-sm animate-pulse" />
      </div>
      
      {/* Typing Bubble */}
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-[1.5rem] rounded-bl-lg border border-white/20 dark:border-slate-700/50 px-6 py-4 shadow-lg">
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className="text-xs text-slate-500 ml-2">AI is thinking...</span>
        </div>
      </div>
    </div>
  ), []);

  // Memoized error retry handler
  const handleRetryMessage = useCallback(() => {
    clearError();
  }, [clearError]);

  return (
    <div className={`flex flex-col h-full bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900 ${className}`}>
      {/* Chat Toolbar */}
      <ChatToolbar />

      {/* Error Banner with better mobile handling */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg mx-3 sm:mx-4 mt-3 sm:mt-4 p-3 sm:p-4 flex items-center justify-between animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-red-400 text-sm flex-1 min-w-0 break-words">{error}</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-3">
            <button
              onClick={handleRetryMessage}
              className="text-xs px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors touch-manipulation"
            >
              Retry
            </button>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-300 transition-colors p-1 touch-manipulation"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Search Results Indicator */}
      {searchQuery.trim() && (
        <div className="mx-3 sm:mx-4 mt-3 sm:mt-4 p-3 bg-accent-500/10 border border-accent-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-accent-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>
              Showing {filteredMessages.length} result{filteredMessages.length === 1 ? '' : 's'} for "{searchQuery}"
            </span>
          </div>
        </div>
      )}

      {/* Messages Container with optimized scrolling */}
      <div className="flex-1 relative overflow-hidden">
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto overscroll-behavior-contain scroll-smooth"
          style={{ 
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent'
          }}
        >
          <div className="px-3 sm:px-4 pb-4 pt-4 sm:pt-6 min-h-full">
            {isLoading && displayMessages.length === 0 ? (
              LoadingIndicator
            ) : displayMessages.length === 0 ? (
              EmptyState
            ) : (
              <div className="space-y-0">
                {/* Render messages with simplified props */}
                {displayMessages.map((message) => (
                  <ChatMessage 
                    key={message.id} 
                    message={message}
                  />
                ))}
                
                {/* Typing indicator for AI responses */}
                {isLoading && !searchQuery.trim() && TypingIndicator}
                
                {/* Scroll anchor */}
                <div ref={messagesEndRef} className="h-0" />
              </div>
            )}
          </div>
        </div>

        {/* Scroll to Bottom Button */}
        {showScrollToBottom && !searchQuery.trim() && (
          <button
            onClick={() => scrollToBottom(true)}
            className={`
              absolute bottom-20 right-4 sm:right-6 z-10 
              w-12 h-12 bg-gradient-to-br from-accent-500 to-purple-600 
              text-white rounded-full shadow-lg hover:shadow-xl 
              transition-all duration-300 hover:scale-110 
              flex items-center justify-center touch-manipulation
              animate-in slide-in-from-bottom-4 fade-in duration-300
            `}
            aria-label="Scroll to bottom"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        )}
      </div>

      {/* Chat Input with enhanced mobile handling */}
      <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm p-3 sm:p-4 safe-area-inset-bottom">
        <ChatInput />
      </div>
    </div>
  );
}); 