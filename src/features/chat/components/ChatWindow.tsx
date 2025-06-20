import React, { useEffect, useMemo, useRef, useCallback, useState } from 'react';
import { useMessages, useSelectedThreadId, useLoading, useMessagesLoading } from '@/stores/chat.store';
import { useCreateThread } from '../hooks/useThreads';
import { ChatInput } from './ChatInput';
import ChatMessage from './ChatMessage';
import { LoadingSpinner } from '@/components/ui';
import { useDebouncedCallback, isNearBottom, scrollToBottom } from '@/shared/utils';

interface ChatWindowProps {
  className?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = React.memo(({ className = '' }) => {
  const messages = useMessages();
  const selectedThreadId = useSelectedThreadId();
  const loading = useLoading();
  const messagesLoading = useMessagesLoading();
  const createThread = useCreateThread();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isUserNearBottom, setIsUserNearBottom] = useState(true);
  const lastMessageCountRef = useRef(0);
  const isInitialLoadRef = useRef(true);
  const lastThreadIdRef = useRef<string | null>(null);

  // Optimized scroll detection with debouncing for performance
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const nearBottom = isNearBottom(container, 150);
    setIsUserNearBottom(nearBottom);
  }, []);

  // Debounced scroll handler for 60fps performance
  const debouncedHandleScroll = useDebouncedCallback(handleScroll, 16);

  // Smart auto-scroll: ONLY when new messages arrive and user is near bottom
  useEffect(() => {
    const currentMessageCount = messages.length;
    const hasNewMessage = currentMessageCount > lastMessageCountRef.current;
    const isSameThread = selectedThreadId === lastThreadIdRef.current;
    
    // Update refs
    lastMessageCountRef.current = currentMessageCount;
    
    // Only auto-scroll for new messages when:
    // 1. It's a new message (not thread switch)
    // 2. User is near bottom
    // 3. Not initial load
    // 4. Same thread (to prevent scroll on thread switch)
    if (hasNewMessage && isUserNearBottom && !isInitialLoadRef.current && isSameThread) {
      const container = messagesContainerRef.current;
      if (container) {
        scrollToBottom(container, 'smooth');
      }
    }
    
    // Mark as no longer initial load after first message count update
    if (isInitialLoadRef.current && currentMessageCount > 0) {
      isInitialLoadRef.current = false;
    }
  }, [messages.length, isUserNearBottom, selectedThreadId]);

  // Reset state when switching threads (NO AUTO-SCROLL on thread switch)
  useEffect(() => {
    const currentThreadId = selectedThreadId;
    
    // Only reset if this is actually a different thread
    if (currentThreadId !== lastThreadIdRef.current) {
      setIsUserNearBottom(true);
      lastMessageCountRef.current = messages.length;
      isInitialLoadRef.current = true;
      lastThreadIdRef.current = currentThreadId;
      
      // NO scrollIntoView here - preserve user's scroll position
    }
  }, [selectedThreadId, messages.length]);

  // Memoized handlers for performance
  const handleStartNewChat = useCallback(async () => {
    try {
      await createThread();
    } catch (error) {
      console.error('Failed to create new thread:', error);
    }
  }, [createThread]);



  // Convert ChatMessage to Message format for ChatMessage component
  const convertedMessages = useMemo(() => 
    messages.map(msg => ({
      id: msg._id,
      role: msg.role,
      content: msg.content,
      timestamp: new Date(msg.createdAt),
      userId: 'current', // For now, all messages are from current user session
      synced: true,
    })),
    [messages]
  );

  // Optimized welcome screen
  const WelcomeScreen = useMemo(() => (
    <div className="flex items-center justify-center h-full p-4 md:p-6">
      <div className="text-center max-w-sm md:max-w-md">
        <div className="w-12 h-12 md:w-16 md:h-16 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 md:mb-6 animate-optimized">
          <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4">
          Welcome to AgentCraft AI
        </h2>
        <p className="text-gray-400 mb-6 md:mb-8 text-sm md:text-base leading-relaxed">
          Start a conversation to explore AI capabilities. Your chats are automatically saved and organized by threads.
        </p>

        <button
          onClick={handleStartNewChat}
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors duration-200 text-base touch-optimized focus-optimized"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Start New Chat
        </button>
      </div>
    </div>
  ), [handleStartNewChat]);

  // Optimized empty thread state
  const EmptyThreadState = useMemo(() => (
    <div className="flex items-center justify-center h-full p-4">
      <div className="text-center max-w-sm">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
          <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-lg md:text-xl font-medium text-white mb-2">
          Start the conversation
        </h3>
        <p className="text-gray-400 text-sm md:text-base">
          Send a message below to begin.
        </p>
      </div>
    </div>
  ), []);

  // If no active thread, show welcome screen
  if (!selectedThreadId) {
    return (
      <div className={`flex flex-col h-full ${className}`}>
        <div className="flex-1 min-h-0 overflow-hidden">
          {WelcomeScreen}
        </div>
        
        {/* Input area - always visible with proper spacing */}
        <footer className="flex-shrink-0 p-3 md:p-4 border-t border-gray-800 bg-slate-900/95 backdrop-blur-sm">
          <div className="w-full max-w-4xl mx-auto">
            <ChatInput />
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Compact Chat Header */}
      <header className="flex-shrink-0 px-3 md:px-4 py-2.5 md:py-3 border-b border-gray-800 bg-slate-900/95 backdrop-blur-sm">
        <div className="flex items-center justify-between w-full max-w-4xl mx-auto">
          <div className="flex-1 min-w-0">
            <h1 className="text-sm md:text-base font-medium text-white truncate">
              Chat Thread
            </h1>
            <p className="text-xs text-gray-400">
              {messages.length} message{messages.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <button className="p-1.5 text-gray-400 hover:text-white hover:bg-slate-800 rounded transition-colors duration-200 touch-optimized focus-optimized">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Messages Area - Optimized for performance and perfect height on all devices */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 min-h-0 overflow-y-auto scroll-optimized"
        onScroll={debouncedHandleScroll}
        style={{ 
          transform: 'translateZ(0)', // Hardware acceleration
          backfaceVisibility: 'hidden', // Reduce paint operations
          WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
          willChange: 'scroll', // Optimize scroll performance
          overscrollBehavior: 'contain' // Prevent bounce on mobile
        }}
      >
        {messagesLoading ? (
          /* Loading messages */
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg backdrop-blur-sm">
              <LoadingSpinner size="sm" />
              <span className="text-gray-400 text-sm">Loading messages...</span>
            </div>
          </div>
        ) : messages.length === 0 ? (
          EmptyThreadState
        ) : (
          <div className="w-full max-w-4xl mx-auto px-3 md:px-4 py-3 md:py-4">
            <div className="space-y-3 md:space-y-4">
              {convertedMessages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                />
              ))}
              
              {/* Loading indicator for new message */}
              {loading && (
                <div className="flex items-center justify-center py-3 md:py-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg backdrop-blur-sm">
                    <LoadingSpinner size="sm" />
                    <span className="text-gray-400 text-sm">AI is thinking...</span>
                  </div>
                </div>
              )}
              
              {/* Scroll anchor - minimal height to avoid layout shift */}
              <div ref={messagesEndRef} className="h-px" />
            </div>
          </div>
        )}
      </div>

      {/* Chat Input - Always visible at bottom with enhanced mobile support */}
      <footer className="flex-shrink-0 p-3 md:p-4 border-t border-gray-800 bg-slate-900/95 backdrop-blur-sm">
        <div className="w-full max-w-4xl mx-auto">
          <ChatInput />
        </div>
      </footer>
    </div>
  );
});

ChatWindow.displayName = 'ChatWindow';

export default ChatWindow; 