import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { ChatSession, Message } from '@/types';
import { apiService } from '@/services/api';

interface ChatState {
  // Current session
  currentSession: ChatSession | null;
  
  // UI state
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
  
  // Input state
  inputValue: string;
  isTyping: boolean;
}

interface ChatActions {
  // Session management
  setCurrentSession: (session: ChatSession | null) => void;
  createNewSession: (title?: string) => Promise<ChatSession>;
  updateSessionTitle: (sessionId: string, title: string) => Promise<void>;
  
  // Message management
  sendMessage: (content: string) => Promise<void>;
  addMessage: (message: Message) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  removeMessage: (messageId: string) => void;
  clearMessages: () => void;
  
  // Streaming
  startStreaming: () => void;
  stopStreaming: () => void;
  appendToLastMessage: (content: string) => void;
  
  // Input management
  setInputValue: (value: string) => void;
  setTyping: (typing: boolean) => void;
  clearInput: () => void;
  
  // UI state
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Cleanup
  reset: () => void;
}

type ChatStore = ChatState & ChatActions;

const initialState: ChatState = {
  currentSession: null,
  isLoading: false,
  isStreaming: false,
  error: null,
  inputValue: '',
  isTyping: false,
};

export const useChatStore = create<ChatStore>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      // Session management
      setCurrentSession: (session: ChatSession | null) => {
        set(state => {
          state.currentSession = session;
          state.error = null;
        });
      },

      createNewSession: async (title?: string) => {
        try {
          set(state => {
            state.isLoading = true;
            state.error = null;
          });

          const response = await apiService.chat.createSession(title);
          const newSession = response.data;
          
          set(state => {
            state.currentSession = newSession;
            state.isLoading = false;
          });

          return newSession;
        } catch (error) {
          set(state => {
            state.isLoading = false;
            state.error = error instanceof Error ? error.message : 'Failed to create session';
          });
          throw error;
        }
      },

      updateSessionTitle: async (sessionId: string, title: string) => {
        try {
          const response = await apiService.chat.updateSession(sessionId, { title });
          
          set(state => {
            if (state.currentSession && state.currentSession.id === sessionId) {
              state.currentSession.title = response.data.title;
              state.currentSession.updatedAt = response.data.updatedAt;
            }
          });
        } catch (error) {
          set(state => {
            state.error = error instanceof Error ? error.message : 'Failed to update session';
          });
          throw error;
        }
      },

      // Message management
      sendMessage: async (content: string) => {
        const { currentSession } = get();
        
        if (!currentSession) {
          throw new Error('No active session');
        }

        try {
          set(state => {
            state.isLoading = true;
            state.error = null;
          });

          const userMessage: Message = {
            id: `temp-${Date.now()}`,
            content,
            role: 'user',
            timestamp: new Date(),
          };

          set(state => {
            if (state.currentSession) {
              state.currentSession.messages.push(userMessage);
            }
            state.inputValue = '';
            state.isTyping = false;
          });

          const response = await apiService.chat.sendMessage(currentSession.id, content);
          
          set(state => {
            if (state.currentSession) {
              const tempIndex = state.currentSession.messages.findIndex((m: Message) => m.id === userMessage.id);
              if (tempIndex !== -1) {
                state.currentSession.messages[tempIndex] = response.data;
              }
            }
            state.isLoading = false;
          });

        } catch (error) {
          set(state => {
            state.isLoading = false;
            state.error = error instanceof Error ? error.message : 'Failed to send message';
          });
          throw error;
        }
      },

      addMessage: (message: Message) => {
        set(state => {
          if (state.currentSession) {
            state.currentSession.messages.push(message);
          }
        });
      },

      updateMessage: (messageId: string, updates: Partial<Message>) => {
        set(state => {
          if (state.currentSession) {
            const messageIndex = state.currentSession.messages.findIndex((m: Message) => m.id === messageId);
            if (messageIndex !== -1) {
              Object.assign(state.currentSession.messages[messageIndex], updates);
            }
          }
        });
      },

      removeMessage: (messageId: string) => {
        set(state => {
          if (state.currentSession) {
            state.currentSession.messages = state.currentSession.messages.filter((m: Message) => m.id !== messageId);
          }
        });
      },

      clearMessages: () => {
        set(state => {
          if (state.currentSession) {
            state.currentSession.messages = [];
          }
        });
      },

      // Streaming
      startStreaming: () => {
        set(state => {
          state.isStreaming = true;
          state.isLoading = false;
        });
      },

      stopStreaming: () => {
        set(state => {
          state.isStreaming = false;
        });
      },

      appendToLastMessage: (content: string) => {
        set(state => {
          if (state.currentSession && state.currentSession.messages.length > 0) {
            const lastMessage = state.currentSession.messages[state.currentSession.messages.length - 1];
            if (lastMessage.role === 'assistant') {
              lastMessage.content += content;
            }
          }
        });
      },

      // Input management
      setInputValue: (value: string) => {
        set(state => {
          state.inputValue = value;
          state.isTyping = value.trim().length > 0;
        });
      },

      setTyping: (typing: boolean) => {
        set(state => {
          state.isTyping = typing;
        });
      },

      clearInput: () => {
        set(state => {
          state.inputValue = '';
          state.isTyping = false;
        });
      },

      // UI state
      setLoading: (loading: boolean) => {
        set(state => {
          state.isLoading = loading;
        });
      },

      setError: (error: string | null) => {
        set(state => {
          state.error = error;
        });
      },

      clearError: () => {
        set(state => {
          state.error = null;
        });
      },

      // Cleanup
      reset: () => {
        set(() => ({ ...initialState }));
      },
    })),
    {
      name: 'chat-store',
    }
  )
);

// Selectors for better performance
export const useCurrentSession = () => useChatStore(state => state.currentSession);
export const useMessages = () => useChatStore(state => state.currentSession?.messages || []);
export const useChatLoading = () => useChatStore(state => state.isLoading);
export const useChatStreaming = () => useChatStore(state => state.isStreaming);
export const useChatError = () => useChatStore(state => state.error);
export const useInputValue = () => useChatStore(state => state.inputValue);
export const useIsTyping = () => useChatStore(state => state.isTyping);

// Action selectors
export const useChatActions = () => useChatStore(state => ({
  setCurrentSession: state.setCurrentSession,
  createNewSession: state.createNewSession,
  updateSessionTitle: state.updateSessionTitle,
  sendMessage: state.sendMessage,
  addMessage: state.addMessage,
  updateMessage: state.updateMessage,
  removeMessage: state.removeMessage,
  clearMessages: state.clearMessages,
  startStreaming: state.startStreaming,
  stopStreaming: state.stopStreaming,
  appendToLastMessage: state.appendToLastMessage,
  setInputValue: state.setInputValue,
  setTyping: state.setTyping,
  clearInput: state.clearInput,
  setLoading: state.setLoading,
  setError: state.setError,
  clearError: state.clearError,
  reset: state.reset,
})); 