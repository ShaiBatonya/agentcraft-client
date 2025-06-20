import { useEffect, useRef, useCallback } from 'react';
import { useChatStore } from '@/features/chat/store/chat.store';
import { useChatThreads } from './useChatThreads';

/**
 * Custom hook to synchronize messages between the main chat store and thread store
 * This ensures that messages sent through the existing ChatInput are properly
 * saved to the current active thread
 */
export const useChatThreadSync = () => {
  const { messages, clearMessages } = useChatStore();
  const { 
    activeThreadId, 
    createNewThread, 
    addMessage, 
    getActiveThread,
    setActiveThread 
  } = useChatThreads();

  // Track last synced message to prevent infinite loops
  const lastSyncedMessageIdRef = useRef<string | null>(null);
  const isUpdatingRef = useRef(false);

  // Sync new messages from chat store to active thread
  useEffect(() => {
    if (isUpdatingRef.current || messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    
    // Skip if we already synced this message
    if (lastSyncedMessageIdRef.current === lastMessage.id) return;

    isUpdatingRef.current = true;

    try {
      // If no active thread exists, create one with the first user message
      if (!activeThreadId) {
        // Find the first user message to create the thread
        const firstUserMessage = messages.find(msg => msg.role === 'user');
        if (firstUserMessage) {
          const newThread = createNewThread(firstUserMessage);
          lastSyncedMessageIdRef.current = firstUserMessage.id;
          
          // Add any remaining messages to the new thread
          messages.forEach(msg => {
            if (msg.id !== firstUserMessage.id && msg.id !== lastSyncedMessageIdRef.current) {
              addMessage(newThread.id, msg);
            }
          });
          lastSyncedMessageIdRef.current = lastMessage.id;
        }
      } else {
        // Check if the last message already exists in the active thread
        const activeThread = getActiveThread();
        if (activeThread) {
          const messageExists = activeThread.messages.some(msg => msg.id === lastMessage.id);
          
          if (!messageExists) {
            addMessage(activeThreadId, lastMessage);
            lastSyncedMessageIdRef.current = lastMessage.id;
          }
        }
      }
    } finally {
      isUpdatingRef.current = false;
    }
  }, [messages.length, activeThreadId]); // Only depend on message count and activeThreadId

  // Create a new thread and clear current chat
  const startNewThread = useCallback(() => {
    isUpdatingRef.current = true;
    try {
      clearMessages();
      setActiveThread(null);
      lastSyncedMessageIdRef.current = null;
    } finally {
      // Delay the ref reset to allow state updates to complete
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 100);
    }
  }, [clearMessages, setActiveThread]);

  return {
    startNewThread,
  };
};

export default useChatThreadSync; 