// Enhanced Zustand store for chat state management with advanced features
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Message, ChatState, SearchResult, SearchFilters } from '../types';
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
  
  // Advanced features
  deleteMessage: (messageId: string) => Promise<void>;
  restoreMessage: (messageId: string) => void;
  editMessage: (messageId: string, newContent: string) => void;
  searchMessages: (query: string, filters?: SearchFilters) => SearchResult[];
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: SearchResult[]) => void;
  clearSearch: () => void;
  setSelectedMessage: (messageId: string | null) => void;
  exportChat: (format: 'json' | 'txt' | 'md') => string;
  getMessageStats: () => {
    total: number;
    userMessages: number;
    assistantMessages: number;
    errorMessages: number;
    unsyncedMessages: number;
    editedMessages: number;
    deletedMessages: number;
  };
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
        searchQuery: '',
        filteredMessages: [],
        selectedMessageId: null,
        isSearching: false,
        lastSyncTimestamp: 0,
        isInitialized: false,

        // Actions
        initializeChat: async () => {
          const state = get();
          
          // Only initialize once per session
          if (state.isInitialized) {
            return;
          }

          try {
            const authStore = useAuthStore.getState();
            
            if (authStore.isAuthenticated && authStore.user) {
              await get().loadChatHistory();
            }
            
            // Clear old messages (older than 7 days)
            get().clearOldMessages();
            
            set({
              ...state,
              isInitialized: true,
            });
          } catch {
            set({
              ...state,
              error: 'Failed to load chat history',
              isInitialized: true, // Still mark as initialized to prevent loops
            });
          }
        },

        loadChatHistory: async () => {
          const authStore = useAuthStore.getState();
          
          if (!authStore.isAuthenticated || !authStore.user) {
            return;
          }

          try {
            set(state => ({
              ...state,
              error: null,
            }));

            const history = await ChatService.getChatHistory();
            
            set(state => ({
              ...state,
              messages: history,
              lastSyncTimestamp: Date.now(),
            }));
          } catch (error) {
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


          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
            
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
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          
          set(state => {
            const filteredMessages = state.messages.filter(message => {
              try {
                // Handle both Date objects and string timestamps
                const messageDate = message.timestamp instanceof Date 
                  ? message.timestamp 
                  : new Date(message.timestamp);
                
                // Skip messages with invalid dates
                if (isNaN(messageDate.getTime())) {
                  return false; // Remove messages with invalid dates
                }
                
                return messageDate > sevenDaysAgo;
              } catch {
                return false; // Remove messages that can't be processed
              }
            });
            
            return {
              ...state,
              messages: filteredMessages,
            };
          });
        },

        // Advanced Features

        deleteMessage: async (messageId: string) => {
          set(state => ({
            ...state,
            messages: state.messages.map(msg => 
              msg.id === messageId 
                ? { ...msg, deleted: true, originalContent: msg.originalContent || msg.content, content: '[Message deleted]' }
                : msg
            ),
          }));

          // TODO: Send delete request to backend
          try {
            // await ChatService.deleteMessage(messageId);
          } catch {
            // Rollback the deletion
            set(state => ({
              ...state,
              messages: state.messages.map(msg => 
                msg.id === messageId && msg.deleted
                  ? { ...msg, deleted: false, content: msg.originalContent || msg.content }
                  : msg
              ),
            }));
          }
        },

        restoreMessage: (messageId: string) => {
          set(state => ({
            ...state,
            messages: state.messages.map(msg => 
              msg.id === messageId 
                ? { ...msg, deleted: false, content: msg.originalContent || msg.content }
                : msg
            ),
          }));
        },

        editMessage: (messageId: string, newContent: string) => {
          set(state => ({
            ...state,
            messages: state.messages.map(msg => 
              msg.id === messageId 
                ? { 
                    ...msg, 
                    content: newContent,
                    edited: true,
                    originalContent: msg.originalContent || msg.content
                  }
                : msg
            ),
          }));
        },

        searchMessages: (query: string, filters: SearchFilters = {}) => {
          const state = get();
          
          if (!query.trim() && !Object.keys(filters).some(key => {
            const value = filters[key as keyof SearchFilters];
            return value !== undefined && value !== 'all';
          })) {
            return [];
          }

          const normalizedQuery = query.toLowerCase().trim();
          let filteredMessages = state.messages.filter(msg => !msg.deleted);

          // Apply filters
          if (filters.role && filters.role !== 'all') {
            filteredMessages = filteredMessages.filter(msg => msg.role === filters.role);
          }

          if (filters.dateFrom) {
            filteredMessages = filteredMessages.filter(msg => new Date(msg.timestamp) >= filters.dateFrom!);
          }

          if (filters.dateTo) {
            filteredMessages = filteredMessages.filter(msg => new Date(msg.timestamp) <= filters.dateTo!);
          }

          if (filters.hasError !== undefined) {
            filteredMessages = filteredMessages.filter(msg => Boolean(msg.error) === filters.hasError);
          }

          if (filters.onlyUnsynced) {
            filteredMessages = filteredMessages.filter(msg => !msg.synced);
          }

          // Perform text search
          const results: SearchResult[] = [];

          for (const message of filteredMessages) {
            const content = message.content.toLowerCase();
            let score = 0;

            if (normalizedQuery && content.includes(normalizedQuery)) {
              score = 10;
              
              // Create simple highlights
              const highlights = [];
              let index = content.indexOf(normalizedQuery);
              while (index !== -1) {
                highlights.push({
                  start: index,
                  end: index + normalizedQuery.length,
                  text: message.content.substring(index, index + normalizedQuery.length)
                });
                index = content.indexOf(normalizedQuery, index + 1);
              }

              results.push({
                message,
                highlights,
                relevanceScore: score
              });
            } else if (!normalizedQuery && Object.keys(filters).some(key => {
              const value = filters[key as keyof SearchFilters];
              return value !== undefined && value !== 'all';
            })) {
              // If only filters are applied, include all filtered messages
              results.push({
                message,
                highlights: [],
                relevanceScore: 1
              });
            }
          }

          // Sort by relevance and date
          return results.sort((a, b) => {
            const scoreDiff = b.relevanceScore - a.relevanceScore;
            if (scoreDiff !== 0) return scoreDiff;
            return new Date(b.message.timestamp).getTime() - new Date(a.message.timestamp).getTime();
          });
        },

        setSearchQuery: (query: string) => {
          set(state => ({
            ...state,
            searchQuery: query,
          }));
        },

        setSearchResults: (results: SearchResult[]) => {
          set(state => ({
            ...state,
            filteredMessages: results.map(r => r.message),
          }));
        },

        clearSearch: () => {
          set(state => ({
            ...state,
            searchQuery: '',
            filteredMessages: [],
            selectedMessageId: null,
          }));
        },

        setSelectedMessage: (messageId: string | null) => {
          set(state => ({
            ...state,
            selectedMessageId: messageId,
          }));
        },

        exportChat: (format: 'json' | 'txt' | 'md' = 'json') => {
          const state = get();
          const activeMessages = state.messages.filter(msg => !msg.deleted);

          switch (format) {
            case 'json':
              return JSON.stringify(activeMessages, null, 2);
            
            case 'txt': {
              const lines = [`Chat Export - ${new Date().toLocaleString()}`, '='.repeat(50), ''];
              for (const message of activeMessages) {
                const timestamp = new Date(message.timestamp).toLocaleString();
                const speaker = message.role === 'user' ? 'You' : 'Assistant';
                lines.push(`[${timestamp}] ${speaker}:`);
                lines.push(message.content);
                lines.push('');
              }
              return lines.join('\n');
            }
            
            case 'md': {
              const mdLines = [
                `# Chat Export`,
                `*Generated on ${new Date().toLocaleString()}*`,
                '',
                '---',
                ''
              ];
              for (const message of activeMessages) {
                const timestamp = new Date(message.timestamp).toLocaleString();
                const speaker = message.role === 'user' ? '👤 **You**' : '🤖 **Assistant**';
                mdLines.push(`## ${speaker}`);
                mdLines.push(`*${timestamp}*`);
                mdLines.push('');
                mdLines.push(message.content);
                mdLines.push('');
                mdLines.push('---');
                mdLines.push('');
              }
              return mdLines.join('\n');
            }
            
            default:
              throw new Error(`Unsupported export format: ${format}`);
          }
        },

        getMessageStats: () => {
          const state = get();
          const activeMessages = state.messages.filter(msg => !msg.deleted);
          
          return {
            total: activeMessages.length,
            userMessages: activeMessages.filter(msg => msg.role === 'user').length,
            assistantMessages: activeMessages.filter(msg => msg.role === 'assistant').length,
            errorMessages: activeMessages.filter(msg => msg.error).length,
            unsyncedMessages: activeMessages.filter(msg => !msg.synced).length,
            editedMessages: activeMessages.filter(msg => msg.edited).length,
            deletedMessages: state.messages.filter(msg => msg.deleted).length,
          };
        },

        clearMessages: () => {
          set(state => ({
            ...state,
            messages: [],
            error: null,
            filteredMessages: [],
            searchQuery: '',
            selectedMessageId: null,
          }));
        },

        clearChat: () => {
          set(state => ({
            ...state,
            messages: [],
            error: null,
            isLoading: false,
            lastSyncTimestamp: 0,
            searchQuery: '',
            filteredMessages: [],
            selectedMessageId: null,
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
        version: 2, // Incremented for new features
        onRehydrateStorage: () => (state) => {
          if (state) {
            // Convert string timestamps back to Date objects after rehydration
            if (state.messages && state.messages.length > 0) {
              state.messages = state.messages.map(message => ({
                ...message,
                timestamp: new Date(message.timestamp), // Ensure timestamp is a Date object
              }));
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

// Enhanced selectors for better performance
export const useMessages = () => useChatStore(state => state.messages);
export const useChatLoading = () => useChatStore(state => state.isLoading);
export const useChatError = () => useChatStore(state => state.error);
export const useChatInitialized = () => useChatStore(state => state.isInitialized);
export const useSearchQuery = () => useChatStore(state => state.searchQuery);
export const useFilteredMessages = () => useChatStore(state => state.filteredMessages);
export const useSelectedMessage = () => useChatStore(state => state.selectedMessageId);

// Individual action selectors for stable references
export const useSendMessage = () => useChatStore(state => state.sendMessage);
export const useLoadChatHistory = () => useChatStore(state => state.loadChatHistory);
export const useClearMessages = () => useChatStore(state => state.clearMessages);
export const useClearChat = () => useChatStore(state => state.clearChat);
export const useClearError = () => useChatStore(state => state.clearError);
export const useSetMessages = () => useChatStore(state => state.setMessages);
export const useSetError = () => useChatStore(state => state.setError);
export const useInitializeChat = () => useChatStore(state => state.initializeChat);

// Advanced feature selectors
export const useDeleteMessage = () => useChatStore(state => state.deleteMessage);
export const useRestoreMessage = () => useChatStore(state => state.restoreMessage);
export const useEditMessage = () => useChatStore(state => state.editMessage);
export const useSearchMessages = () => useChatStore(state => state.searchMessages);
export const useSetSearchQuery = () => useChatStore(state => state.setSearchQuery);
export const useSetSearchResults = () => useChatStore(state => state.setSearchResults);
export const useClearSearch = () => useChatStore(state => state.clearSearch);
export const useSetSelectedMessage = () => useChatStore(state => state.setSelectedMessage);
export const useExportChat = () => useChatStore(state => state.exportChat);
export const useMessageStats = () => useChatStore(state => state.getMessageStats); 