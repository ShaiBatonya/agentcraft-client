// Types and interfaces for chat feature

export interface ChatRequest {
  prompt: string;
}

export interface ChatResponse {
  response: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Keep legacy alias for compatibility
export type ChatMessage = Message;

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
} 