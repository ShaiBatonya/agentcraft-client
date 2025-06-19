// Enhanced Zustand store for chat state management with history persistence
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Message, ChatState } from '../types';
import { ChatService } from '../services/chat.service';
import { useAuthStore } from '@/stores/auth.store';

interface ChatActions {
  sendMessage: (prompt: string) => Promise<void>;
  loadChatHistory: () => Promise<void>;
  clearMessages: () => void;
  clearChat: () => void;
  clearError: () => void;
  setMessages: (messages: Message[]) => void;
  setError: (error: string | null) => void;
  clearOldMessages: () => void;
  initializeChat: () => Promise<void>;
}

interface ChatStoreState extends ChatState {
  lastSyncTimestamp: number;
  isInitialized: boolean;
}

export const useChatStore = create<ChatStoreState & ChatActions>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        messages: [],
        isLoading: false,
        error: null,
        lastSyncTimestamp: 0,
        isInitialized: false,

        // Actions
        initializeChat: async () => {
          console.log('🔄 ChatStore: Initializing chat...');
          const state = get();
          
          // Only initialize once per session
          if (state.isInitialized) {
            console.log('✅ ChatStore: Already initialized');
            return;
          }

          try {
            const authStore = useAuthStore.getState();
            
            if (authStore.isAuthenticated && authStore.user) {
              console.log('🔄 ChatStore: Loading chat history for authenticated user');
              await get().loadChatHistory();
            } else {
              console.log('📝 ChatStore: User not authenticated, skipping history load');
            }
            
            // Clear old messages (older than 7 days)
            get().clearOldMessages();
            
            set({
              ...state,
              isInitialized: true,
            });
            
            console.log('✅ ChatStore: Chat initialized successfully');
          } catch (error) {
            console.error('❌ ChatStore: Failed to initialize chat:', error);
            set({
              ...state,
              error: 'Failed to load chat history',
              isInitialized: true, // Still mark as initialized to prevent loops
            });
          }
        },

        loadChatHistory: async () => {
          console.log('🔄 ChatStore: Loading chat history from backend...');
          const authStore = useAuthStore.getState();
          
          if (!authStore.isAuthenticated || !authStore.user) {
            console.log('⚠️ ChatStore: Cannot load history - user not authenticated');
            return;
          }

          try {
            set(state => ({
              ...state,
              error: null,
            }));

            const history = await ChatService.getChatHistory();
            console.log('✅ ChatStore: Chat history loaded:', history.length, 'messages');
            
            set(state => ({
              ...state,
              messages: history,
              lastSyncTimestamp: Date.now(),
            }));
          } catch (error) {
            console.error('❌ ChatStore: Failed to load chat history:', error);
            set(state => ({
              ...state,
              error: error instanceof Error ? error.message : 'Failed to load chat history',
            }));
          }
        },

        sendMessage: async (prompt: string) => {
          const authStore = useAuthStore.getState();
          
          const userMessage: Message = {
            id: crypto.randomUUID(),
            role: 'user',
            content: prompt,
            timestamp: new Date(),
            userId: authStore.user?.id || 'anonymous',
            synced: false, // Not yet saved to backend
          };

          // Add user message immediately for responsive UX
          set(state => ({
            ...state,
            messages: [...state.messages, userMessage],
            isLoading: true,
            error: null,
          }));

          try {
            // Send message to backend
            const response = await ChatService.sendMessage({ prompt });
            
            const assistantMessage: Message = {
              id: crypto.randomUUID(),
              role: 'assistant',
              content: response.response,
              timestamp: new Date(),
              userId: authStore.user?.id || 'anonymous',
              synced: false, // Will be synced by backend
            };

            set(state => {
              // Mark user message as synced and add assistant response
              const updatedMessages = state.messages.map(msg => 
                msg.id === userMessage.id ? { ...msg, synced: true } : msg
              );
              
              return {
                ...state,
                messages: [...updatedMessages, assistantMessage],
                isLoading: false,
                lastSyncTimestamp: Date.now(),
              };
            });

            console.log('✅ ChatStore: Message sent and response received');
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
            console.error('❌ ChatStore: Send message failed:', error);
            
            set(state => {
              // Mark the user message as failed
              const updatedMessages = state.messages.map(msg =>
                msg.id === userMessage.id ? { ...msg, error: true } : msg
              );
              
              return {
                ...state,
                messages: updatedMessages,
                isLoading: false,
                error: errorMessage,
              };
            });
          }
        },

        clearOldMessages: () => {
          console.log('🧹 ChatStore: Clearing messages older than 7 days...');
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          
          set(state => {
            const originalCount = state.messages.length;
            const filteredMessages = state.messages.filter(message => {
              try {
                // Handle both Date objects and string timestamps
                const messageDate = message.timestamp instanceof Date 
                  ? message.timestamp 
                  : new Date(message.timestamp);
                
                // Skip messages with invalid dates
                if (isNaN(messageDate.getTime())) {
                  console.warn('ChatStore: Message with invalid timestamp found:', message.id);
                  return false; // Remove messages with invalid dates
                }
                
                return messageDate > sevenDaysAgo;
              } catch (error) {
                console.warn('ChatStore: Error processing message timestamp:', message.id, error);
                return false; // Remove messages that can't be processed
              }
            });
            const removedCount = originalCount - filteredMessages.length;
            
            if (removedCount > 0) {
              console.log(`🧹 ChatStore: Removed ${removedCount} old messages`);
            }
            
            return {
              ...state,
              messages: filteredMessages,
            };
          });
        },

        clearMessages: () => {
          console.log('🧹 ChatStore: Clearing all messages');
          set(state => ({
            ...state,
            messages: [],
            error: null,
          }));
        },

        clearChat: () => {
          console.log('🧹 ChatStore: Clearing entire chat state');
          set(state => ({
            ...state,
            messages: [],
            error: null,
            isLoading: false,
            lastSyncTimestamp: 0,
          }));
        },

        clearError: () => {
          set(state => ({
            ...state,
            error: null,
          }));
        },

        setMessages: (messages: Message[]) => {
          set(state => ({
            ...state,
            messages,
          }));
        },

        setError: (error: string | null) => {
          set(state => ({
            ...state,
            error,
          }));
        },
      }),
      {
        name: 'chat-store',
        // Only persist messages and sync timestamp, not loading/error states
        partialize: (state) => ({
          messages: state.messages,
          lastSyncTimestamp: state.lastSyncTimestamp,
        }),
        // Storage version for future migrations
        version: 1,
        onRehydrateStorage: () => (state) => {
          if (state) {
            console.log('🔄 ChatStore: Rehydrated from storage', {
              messageCount: state.messages?.length || 0,
              lastSync: state.lastSyncTimestamp ? new Date(state.lastSyncTimestamp) : 'never'
            });
            
            // Convert string timestamps back to Date objects after rehydration
            if (state.messages && state.messages.length > 0) {
              state.messages = state.messages.map(message => ({
                ...message,
                timestamp: new Date(message.timestamp), // Ensure timestamp is a Date object
              }));
              console.log('✅ ChatStore: Converted timestamps to Date objects');
            }
            
            // Clean old messages on rehydration
            state.clearOldMessages?.();
          }
        },
      }
    ),
    {
      name: 'chat-store',
    }
  )
);

// Stable selectors for better performance
export const useMessages = () => useChatStore(state => state.messages);
export const useChatLoading = () => useChatStore(state => state.isLoading);
export const useChatError = () => useChatStore(state => state.error);
export const useChatInitialized = () => useChatStore(state => state.isInitialized);

// Individual action selectors for stable references
export const useSendMessage = () => useChatStore(state => state.sendMessage);
export const useLoadChatHistory = () => useChatStore(state => state.loadChatHistory);
export const useClearMessages = () => useChatStore(state => state.clearMessages);
export const useClearChat = () => useChatStore(state => state.clearChat);
export const useClearError = () => useChatStore(state => state.clearError);
export const useSetMessages = () => useChatStore(state => state.setMessages);
export const useSetError = () => useChatStore(state => state.setError);
export const useInitializeChat = () => useChatStore(state => state.initializeChat); 