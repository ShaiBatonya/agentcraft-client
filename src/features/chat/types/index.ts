// Types and interfaces for chat feature

export interface ChatRequest {
  prompt: string;
}

export interface ChatResponse {
  response: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
} 