import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import type { ChatThread, ChatMessage } from '@/features/chat/types';

interface ChatState {
  // Thread management
  threads: ChatThread[];
  selectedThreadId: string | null;
  
  // Message management
  messages: ChatMessage[];
  threadMessages: Record<string, ChatMessage[]>; // Messages organized by thread ID
  
  // Loading states
  loading: boolean;
  threadsLoading: boolean;
  messagesLoading: boolean;
  
  // Actions
  setThreads: (threads: ChatThread[]) => void;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  selectThread: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setThreadsLoading: (loading: boolean) => void;
  setMessagesLoading: (loading: boolean) => void;
  clearMessages: () => void;
  clearThreads: () => void;
  updateThreadTimestamp: (threadId: string) => void;
  addThread: (thread: ChatThread) => void;
  deleteThread: (threadId: string) => void;
  updateThreadTitle: (threadId: string, title: string) => void;
  setThreadMessages: (threadId: string, messages: ChatMessage[]) => void;
  getThreadMessages: (threadId: string) => ChatMessage[];
}

export const useChatStore = create<ChatState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        threads: [],
        selectedThreadId: null,
        messages: [],
        threadMessages: {},
        loading: false,
        threadsLoading: false,
        messagesLoading: false,
        
        // Actions
        setThreads: (threads) => {
          set({ threads: Array.isArray(threads) ? threads : [] });
        },
        
        setMessages: (messages) => set({ messages }),
        
        addMessage: (message) => {
          const { messages, threadMessages, selectedThreadId } = get();
          
          // Update global messages
          const newMessages = [...messages, message];
          
          // CRITICAL FIX: Also update thread-specific messages
          // Use the message's threadId if available, otherwise use selectedThreadId
          const threadId = message.threadId || selectedThreadId;
          
          if (threadId) {
            const currentThreadMessages = threadMessages[threadId] || [];
            const updatedThreadMessages = {
              ...threadMessages,
              [threadId]: [...currentThreadMessages, message]
            };
            
            set({ 
              messages: newMessages, 
              threadMessages: updatedThreadMessages 
            });
          } else {
            // Fallback - just update global messages
            set({ messages: newMessages });
          }
        },
        
        selectThread: (id) => set({ selectedThreadId: id }),
        
        setLoading: (loading) => set({ loading }),
        
        setThreadsLoading: (loading) => set({ threadsLoading: loading }),
        
        setMessagesLoading: (loading) => set({ messagesLoading: loading }),
        
        clearMessages: () => set({ messages: [] }),
        
        clearThreads: () => set({ threads: [], selectedThreadId: null }),
        
        updateThreadTimestamp: (threadId) => {
          const { threads } = get();
          const updatedThreads = threads.map(thread => 
            thread._id === threadId 
              ? { ...thread, updatedAt: new Date().toISOString() }
              : thread
          );
          set({ threads: updatedThreads });
        },
        
        addThread: (thread) => {
          const { threads } = get();
          set({ threads: [thread, ...threads] });
        },
        
        deleteThread: (threadId) => {
          const { threads, selectedThreadId, threadMessages } = get();
          const updatedThreads = threads.filter(thread => thread._id !== threadId);
          
          // Remove messages for this thread
          const remainingThreadMessages = { ...threadMessages };
          delete remainingThreadMessages[threadId];
          
          // If the deleted thread was selected, clear selection and messages
          if (selectedThreadId === threadId) {
            set({ 
              threads: updatedThreads,
              selectedThreadId: null,
              messages: [],
              threadMessages: remainingThreadMessages
            });
          } else {
            set({ 
              threads: updatedThreads,
              threadMessages: remainingThreadMessages
            });
          }
        },
        
        updateThreadTitle: (threadId, title) => {
          const { threads } = get();
          const updatedThreads = threads.map(thread =>
            thread._id === threadId ? { ...thread, title } : thread
          );
          set({ threads: updatedThreads });
        },
        
        setThreadMessages: (threadId, messages) => {
          const { threadMessages } = get();
          set({
            threadMessages: {
              ...threadMessages,
              [threadId]: messages
            }
          });
        },
        
        getThreadMessages: (threadId) => {
          const { threadMessages } = get();
          return threadMessages[threadId] || [];
        },
      }),
      {
        name: 'chat-threads-store',
        partialize: (state) => ({
          threads: Array.isArray(state.threads) ? state.threads : [],
          selectedThreadId: state.selectedThreadId,
          // Don't persist messages - they'll be loaded per thread
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            // Ensure threads is always an array after rehydration
            if (!Array.isArray(state.threads)) {
              state.threads = [];
            }
          }
        },
      }
    ),
    { name: 'ChatStore' }
  )
);

// Selector hooks for optimized re-renders
export const useThreads = () => useChatStore(state => state.threads);
export const useSelectedThreadId = () => useChatStore(state => state.selectedThreadId);
export const useMessages = () => useChatStore(state => state.messages);
export const useLoading = () => useChatStore(state => state.loading);
export const useThreadsLoading = () => useChatStore(state => state.threadsLoading);
export const useMessagesLoading = () => useChatStore(state => state.messagesLoading);

// Action hooks
export const useDeleteThread = () => useChatStore(state => state.deleteThread);
export const useUpdateThreadTitle = () => useChatStore(state => state.updateThreadTitle);
export const useSetThreadMessages = () => useChatStore(state => state.setThreadMessages);
export const useGetThreadMessages = () => useChatStore(state => state.getThreadMessages);

// Optimized selectors to prevent unnecessary re-renders
export const useThreadById = (threadId: string) => 
  useChatStore(state => state.threads.find(t => t._id === threadId));

export const useIsThreadActive = (threadId: string) => 
  useChatStore(state => state.selectedThreadId === threadId);

export const useThreadCount = () => 
  useChatStore(state => state.threads.length);

// Selector for messagesByThread
export const useMessagesByThreadRecord = () => 
  useChatStore(state => state.threadMessages);

// Selector to get messages for a specific thread (memoized)
export const useGetMessagesForThread = () => 
  useChatStore(state => state.getThreadMessages);

// Performance-optimized selectors with shallow comparison
export const useMessagesShallow = () => 
  useChatStore(state => state.messages);

export const useThreadsShallow = () => 
  useChatStore(state => state.threads);

export const useMessagesByThread = (threadId: string) => 
  useChatStore(state => state.threadMessages[threadId] || []);

export const useLoadingStates = () => 
  useChatStore(state => ({
    loading: state.loading,
    threadsLoading: state.threadsLoading,
    messagesLoading: state.messagesLoading
  }));

// Computed selectors for complex operations  
export const useActiveThreadData = () => 
  useChatStore(state => {
    const activeThread = state.selectedThreadId 
      ? state.threads.find(t => t._id === state.selectedThreadId)
      : null;
    return {
      thread: activeThread,
      messages: state.messages,
      isLoading: state.messagesLoading
    };
  });

// Shallow comparison utility for manual use
export { shallow }; 