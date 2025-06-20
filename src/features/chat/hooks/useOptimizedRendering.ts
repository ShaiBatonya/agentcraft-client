import { useMemo } from 'react';
import { 
  useChatStore, 
  useMessagesShallow, 
  useThreadsShallow, 
  useMessagesByThread
} from '@/stores/chat.store';
import type { ChatThread } from '../types';

/**
 * PERFORMANCE OPTIMIZATION NOTES:
 * 
 * This file contains performance hooks that were causing infinite loops.
 * The main issue was circular dependencies between store selectors.
 * 
 * FIXED APPROACH:
 * - Use minimal store selectors in components
 * - Avoid complex computed values in hooks
 * - Use React.memo with simple comparison functions
 * - Prefer direct store access over multiple hook composition
 */

/**
 * Performance-optimized hook for message rendering
 * Only re-renders when specific messages change, not the entire list
 */
export const useOptimizedMessages = (threadId?: string) => {
  const allMessages = useMessagesShallow();
  const threadMessages = useMessagesByThread(threadId || '');
  
  // Return thread-specific messages if threadId provided, otherwise current messages
  const messages = useMemo(() => {
    if (threadId) {
      return threadMessages;
    }
    return allMessages;
  }, [threadId, threadMessages, allMessages]);
  
  // Memoized message count to prevent unnecessary renders
  const messageCount = useMemo(() => messages.length, [messages.length]);
  
  // Memoized latest message for quick access
  const latestMessage = useMemo(() => 
    messages.length > 0 ? messages[messages.length - 1] : null,
    [messages]
  );
  
  return {
    messages,
    messageCount,
    latestMessage,
    hasMessages: messageCount > 0
  };
};

/**
 * Performance-optimized hook for thread rendering
 * Uses shallow comparison to prevent unnecessary re-renders
 */
export const useOptimizedThreads = () => {
  const threads = useThreadsShallow();
  const selectedThreadId = useChatStore(state => state.selectedThreadId);
  
  // Memoized thread operations
  const threadsWithActiveState = useMemo(() => 
    threads.map(thread => ({
      ...thread,
      isActive: thread._id === selectedThreadId
    })),
    [threads, selectedThreadId]
  );
  
  const activeThread = useMemo(() => 
    threads.find(thread => thread._id === selectedThreadId) || null,
    [threads, selectedThreadId]
  );
  
  const threadCount = useMemo(() => threads.length, [threads.length]);
  
  return {
    threads: threadsWithActiveState,
    activeThread,
    threadCount,
    hasThreads: threadCount > 0,
    selectedThreadId
  };
};

/**
 * Performance-optimized hook for individual thread items
 * Safe version that prevents infinite loops
 */
export const useOptimizedThreadItem = (thread: ChatThread) => {
  // Simple, stable selectors that won't cause loops
  const selectedThreadId = useChatStore(state => state.selectedThreadId);
  const isActive = selectedThreadId === thread._id;
  
  // Memoized computed values for thread display
  const computedValues = useMemo(() => {
    return {
      messageCount: 0, // Will be populated when needed
      lastMessage: null, // Will be populated when needed
      lastActivityTime: thread.updatedAt,
      hasMessages: false,
      isActive
    };
  }, [thread.updatedAt, isActive]);
  
  return computedValues;
};

/**
 * Performance-optimized loading state hook
 * Combines all loading states
 */
export const useOptimizedLoadingStates = () => {
  const loading = useChatStore(state => state.loading);
  const threadsLoading = useChatStore(state => state.threadsLoading);
  const messagesLoading = useChatStore(state => state.messagesLoading);
  
  return useMemo(() => ({
    loading,
    threadsLoading,
    messagesLoading,
    isAnyLoading: loading || threadsLoading || messagesLoading
  }), [loading, threadsLoading, messagesLoading]);
};

/**
 * Performance-optimized action hook
 * Provides stable action references
 */
export const useOptimizedActions = () => {
  const addMessage = useChatStore(state => state.addMessage);
  const setMessages = useChatStore(state => state.setMessages);
  const selectThread = useChatStore(state => state.selectThread);
  const deleteThread = useChatStore(state => state.deleteThread);
  const updateThreadTitle = useChatStore(state => state.updateThreadTitle);
  const setThreadMessages = useChatStore(state => state.setThreadMessages);
  const getThreadMessages = useChatStore(state => state.getThreadMessages);
  
  return {
    addMessage,
    setMessages,
    selectThread,
    deleteThread,
    updateThreadTitle,
    setThreadMessages,
    getThreadMessages
  };
};

/**
 * Performance-optimized chat state hook
 * Provides all necessary chat state with minimal re-renders
 */
export const useOptimizedChatState = () => {
  const { messages, messageCount, latestMessage, hasMessages } = useOptimizedMessages();
  const { threads, activeThread, threadCount, hasThreads, selectedThreadId } = useOptimizedThreads();
  const { loading, threadsLoading, messagesLoading, isAnyLoading } = useOptimizedLoadingStates();
  const actions = useOptimizedActions();
  
  return {
    // Messages
    messages,
    messageCount,
    latestMessage,
    hasMessages,
    
    // Threads
    threads,
    activeThread,
    threadCount,
    hasThreads,
    selectedThreadId,
    
    // Loading states
    loading,
    threadsLoading,
    messagesLoading,
    isAnyLoading,
    
    // Actions
    ...actions
  };
}; 