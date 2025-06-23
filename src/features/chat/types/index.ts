// Types and interfaces for chat feature

// New thread persistence types
export interface ChatThread {
  _id: string;
  title: string;
  updatedAt: string;
  createdAt?: string;
}

export interface ChatMessage {
  _id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  threadId: string;
}

// Thread-related API response types
export interface CreateThreadResponse {
  _id: string;
  title: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageResponse {
  userMsg: ChatMessage;
  assistantMsg: ChatMessage;
}

export interface ChatRequest {
  prompt: string;
  threadId?: string;
}

export interface ChatResponse {
  response: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  threadId?: string;
  userId?: string; // User ID for namespacing messages
  synced?: boolean; // Whether message has been saved to backend
  error?: boolean; // Whether message failed to send
  deleted?: boolean; // Soft delete flag
  edited?: boolean; // Whether message was edited
  originalContent?: string; // Original content before editing
  reactions?: MessageReaction[]; // Future: message reactions
}

export interface MessageReaction {
  id: string;
  emoji: string;
  userId: string;
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  filteredMessages: Message[];
  selectedMessageId: string | null;
  isSearching: boolean;
}

// Chat history request/response types
export interface ChatHistoryRequest {
  userId?: string;
  threadId?: string;
  limit?: number;
  before?: Date;
  after?: Date;
}

export interface ChatHistoryResponse {
  messages: Message[];
  total: number;
  hasMore: boolean;
}

// Search and filter types
export interface SearchFilters {
  role?: 'user' | 'assistant' | 'all';
  dateFrom?: Date;
  dateTo?: Date;
  content?: string;
  hasError?: boolean;
  onlyUnsynced?: boolean;
}

export interface SearchResult {
  message: Message;
  highlights: SearchHighlight[];
  relevanceScore: number;
}

export interface SearchHighlight {
  start: number;
  end: number;
  text: string;
}

// Chat utilities and operations
export interface ChatOperations {
  searchMessages: (query: string, filters?: SearchFilters) => SearchResult[];
  deleteMessage: (messageId: string) => Promise<void>;
  editMessage: (messageId: string, newContent: string) => Promise<void>;
  clearSearch: () => void;
  exportChat: (format: 'json' | 'txt' | 'md') => string;
}

// Chat configuration and preferences
export interface ChatPreferences {
  autoScroll: boolean;
  showTimestamps: boolean;
  compactMode: boolean;
  soundEnabled: boolean;
  searchHighlightColor: string;
  messageGrouping: boolean;
  typingIndicator: boolean;
}

// Chat performance and metrics
export interface ChatMetrics {
  totalMessages: number;
  responseTime: number;
  activeUsers: number;
  searchPerformance: number;
  errorRate: number;
} 