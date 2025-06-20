import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Message } from '@/features/chat/types';

// ChatThread interface
export interface ChatThread {
  id: string;
  title: string;
  summary: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
  isActive?: boolean;
}

// Thread store state and actions
interface ChatThreadsState {
  threads: ChatThread[];
  activeThreadId: string | null;
  isLoading: boolean;
  error: string | null;
}

interface ChatThreadsActions {
  createNewThread: (initialMessage?: Message) => ChatThread;
  addMessage: (threadId: string, message: Message) => void;
  deleteThread: (threadId: string) => void;
  setActiveThread: (threadId: string | null) => void;
  updateThreadTitle: (threadId: string, title: string) => void;
  getActiveThread: () => ChatThread | null;
  getThreadById: (threadId: string) => ChatThread | null;
  clearAllThreads: () => void;
  duplicateThread: (threadId: string) => ChatThread | null;
  archiveThread: (threadId: string) => void;
  restoreThread: (threadId: string) => void;
}

export const useChatThreadsStore = create<ChatThreadsState & ChatThreadsActions>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        threads: [],
        activeThreadId: null,
        isLoading: false,
        error: null,

        // Actions
        createNewThread: (initialMessage?: Message) => {
          const newThread: ChatThread = {
            id: crypto.randomUUID(),
            title: 'New Chat',
            summary: initialMessage?.content?.slice(0, 50) + '...' || 'Start a new conversation',
            createdAt: new Date(),
            updatedAt: new Date(),
            messages: initialMessage ? [initialMessage] : [],
          };

          set(state => ({
            ...state,
            threads: [newThread, ...state.threads],
            activeThreadId: newThread.id,
          }));

          return newThread;
        },

        addMessage: (threadId: string, message: Message) => {
          set(state => {
            const updatedThreads = state.threads.map(thread => {
              if (thread.id === threadId) {
                const updatedMessages = [...thread.messages, message];
                
                // Update thread title and summary based on first user message
                let title = thread.title;
                let summary = thread.summary;
                
                if (message.role === 'user' && thread.messages.length === 0) {
                  // First message - use it for title and summary
                  title = message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '');
                  summary = message.content.slice(0, 100) + (message.content.length > 100 ? '...' : '');
                } else if (message.role === 'user' && thread.title === 'New Chat') {
                  // Update generic title with first user message
                  title = message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '');
                  summary = message.content.slice(0, 100) + (message.content.length > 100 ? '...' : '');
                }

                return {
                  ...thread,
                  messages: updatedMessages,
                  title,
                  summary,
                  updatedAt: new Date(),
                };
              }
              return thread;
            });

            return {
              ...state,
              threads: updatedThreads,
            };
          });
        },

        deleteThread: (threadId: string) => {
          set(state => {
            const filteredThreads = state.threads.filter(thread => thread.id !== threadId);
            const newActiveThreadId = state.activeThreadId === threadId 
              ? (filteredThreads.length > 0 ? filteredThreads[0].id : null)
              : state.activeThreadId;

            return {
              ...state,
              threads: filteredThreads,
              activeThreadId: newActiveThreadId,
            };
          });
        },

        setActiveThread: (threadId: string | null) => {
          set(state => ({
            ...state,
            activeThreadId: threadId,
          }));
        },

        updateThreadTitle: (threadId: string, title: string) => {
          set(state => ({
            ...state,
            threads: state.threads.map(thread =>
              thread.id === threadId
                ? { ...thread, title, updatedAt: new Date() }
                : thread
            ),
          }));
        },

        getActiveThread: () => {
          const state = get();
          return state.threads.find(thread => thread.id === state.activeThreadId) || null;
        },

        getThreadById: (threadId: string) => {
          const state = get();
          return state.threads.find(thread => thread.id === threadId) || null;
        },

        clearAllThreads: () => {
          set({
            threads: [],
            activeThreadId: null,
            isLoading: false,
            error: null,
          });
        },

        duplicateThread: (threadId: string) => {
          const state = get();
          const threadToDuplicate = state.threads.find(thread => thread.id === threadId);
          
          if (!threadToDuplicate) return null;

          const duplicatedThread: ChatThread = {
            id: crypto.randomUUID(),
            title: `${threadToDuplicate.title} (Copy)`,
            summary: threadToDuplicate.summary,
            createdAt: new Date(),
            updatedAt: new Date(),
            messages: [...threadToDuplicate.messages],
          };

          set(state => ({
            ...state,
            threads: [duplicatedThread, ...state.threads],
          }));

          return duplicatedThread;
        },

        archiveThread: (threadId: string) => {
          set(state => ({
            ...state,
            threads: state.threads.map(thread =>
              thread.id === threadId
                ? { ...thread, updatedAt: new Date() }
                : thread
            ),
          }));
        },

        restoreThread: (threadId: string) => {
          set(state => ({
            ...state,
            threads: state.threads.map(thread =>
              thread.id === threadId
                ? { ...thread, updatedAt: new Date() }
                : thread
            ),
          }));
        },
      }),
      {
        name: 'chat-storage',
        version: 1,
        migrate: (persistedState: unknown, version: number) => {
          // Handle migration between versions
          if (version === 0) {
            const state = persistedState as Record<string, unknown>;
            // Migration from version 0 to 1
            return {
              threads: state.threads || [],
              activeThreadId: state.activeThreadId || null,
              isLoading: false,
              error: null,
            };
          }
          return persistedState as ChatThreadsState;
        },

        onRehydrateStorage: () => (state) => {
          if (state) {
            // Convert timestamp strings back to Date objects
            state.threads.forEach(thread => {
              if (typeof thread.createdAt === 'string') {
                thread.createdAt = new Date(thread.createdAt);
              }
              if (typeof thread.updatedAt === 'string') {
                thread.updatedAt = new Date(thread.updatedAt);
              }
              thread.messages.forEach(message => {
                if (typeof message.timestamp === 'string') {
                  message.timestamp = new Date(message.timestamp);
                }
              });
            });
          }
        },
      }
    ),
    {
      name: 'ChatThreads',
    }
  )
);

// Selector hooks for optimal performance - memoized to prevent infinite loops
export const useChatThreads = () => {
  const state = useChatThreadsStore();
  return {
    threads: state.threads,
    activeThreadId: state.activeThreadId,
    isLoading: state.isLoading,
    error: state.error,
    createNewThread: state.createNewThread,
    addMessage: state.addMessage,
    deleteThread: state.deleteThread,
    setActiveThread: state.setActiveThread,
    updateThreadTitle: state.updateThreadTitle,
    getActiveThread: state.getActiveThread,
    getThreadById: state.getThreadById,
    clearAllThreads: state.clearAllThreads,
    duplicateThread: state.duplicateThread,
    archiveThread: state.archiveThread,
    restoreThread: state.restoreThread,
  };
};

// Individual selector hooks for better performance
export const useThreads = () => useChatThreadsStore(state => state.threads);
export const useActiveThreadId = () => useChatThreadsStore(state => state.activeThreadId);
export const useActiveThread = () => useChatThreadsStore(state => state.getActiveThread());
export const useCreateNewThread = () => useChatThreadsStore(state => state.createNewThread);
export const useSetActiveThread = () => useChatThreadsStore(state => state.setActiveThread);
export const useDeleteThread = () => useChatThreadsStore(state => state.deleteThread);
export const useAddMessage = () => useChatThreadsStore(state => state.addMessage); 