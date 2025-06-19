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
  userId?: string; // User ID for namespacing messages
  synced?: boolean; // Whether message has been saved to backend
  error?: boolean; // Whether message failed to send
}

// Keep legacy alias for compatibility
export type ChatMessage = Message;

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

// Chat history request/response types
export interface ChatHistoryRequest {
  userId?: string;
  limit?: number;
  before?: Date;
  after?: Date;
}

export interface ChatHistoryResponse {
  messages: Message[];
  total: number;
  hasMore: boolean;
} 