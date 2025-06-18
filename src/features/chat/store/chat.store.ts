// Zustand store for chat state management
import { create } from 'zustand';
import type { ChatMessage, ChatState } from '../types';
import { ChatService } from '../services/chat.service';

interface ChatActions {
  sendMessage: (prompt: string) => Promise<void>;
  clearMessages: () => void;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatState & ChatActions>((set) => ({
  // State
  messages: [],
  isLoading: false,
  error: null,

  // Actions
  sendMessage: async (prompt: string) => {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      type: 'user',
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
      
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        type: 'assistant',
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

  setError: (error: string | null) => {
    set({ error });
  },
})); 