// Zustand store for chat state management
import { create } from 'zustand';
import type { Message, ChatState } from '../types';
import { ChatService } from '../services/chat.service';

interface ChatActions {
  sendMessage: (prompt: string) => Promise<void>;
  clearMessages: () => void;
  clearChat: () => void;
  clearError: () => void;
  setMessages: (messages: Message[]) => void;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatState & ChatActions>((set) => ({
  // State
  messages: [],
  isLoading: false,
  error: null,

  // Actions
  sendMessage: async (prompt: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: prompt,
      timestamp: new Date(),
    };

    // Add user message immediately
    set((state) => ({
      messages: [...state.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      const response = await ChatService.sendMessage({ prompt });
      
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  clearMessages: () => {
    set({ messages: [], error: null });
  },

  clearChat: () => {
    set({ messages: [], error: null });
  },

  clearError: () => {
    set({ error: null });
  },

  setMessages: (messages: Message[]) => {
    set({ messages });
  },

  setError: (error: string | null) => {
    set({ error });
  },
})); 