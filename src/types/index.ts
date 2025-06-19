// Global application types
export interface User {
  id: string;
  googleId?: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
  isAdmin: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  userId?: string;
  metadata?: MessageMetadata;
}

export interface MessageMetadata {
  tokens?: number;
  model?: string;
  processingTime?: number;
  confidence?: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Component props types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  'data-testid'?: string;
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

// Form types
export interface FormFieldError {
  message: string;
  type: string;
}

export interface FormState {
  isSubmitting: boolean;
  isValid: boolean;
  errors: Record<string, FormFieldError>;
}

// Store types
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  theme: Theme;
  isLoading: boolean;
  error: string | null;
}

export interface ChatState {
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
}

// Hook return types
export interface UseApiResult<T> {
  data: T | null;
  isLoading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}

export interface UseFormResult<T> {
  data: T;
  errors: Record<keyof T, FormFieldError>;
  isSubmitting: boolean;
  isValid: boolean;
  handleSubmit: (onSubmit: (data: T) => Promise<void>) => (e: React.FormEvent) => Promise<void>;
  register: (name: keyof T) => object;
  setValue: (name: keyof T, value: T[keyof T]) => void;
  reset: () => void;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

// Event types
export interface CustomEvents {
  'theme:change': { theme: Theme };
  'auth:login': { user: User };
  'auth:logout': Record<string, never>;
  'chat:message': { message: Message };
  'error:api': { error: ApiError };
}

export type EventCallback<T extends keyof CustomEvents> = (data: CustomEvents[T]) => void;

// Configuration types
export interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
    retries: number;
  };
  features: {
    enableDarkMode: boolean;
    enableVoiceInput: boolean;
    enableFileUpload: boolean;
  };
  limits: {
    maxMessageLength: number;
    maxSessionMessages: number;
    maxFileSizeMB: number;
  };
}

// Environment types
export interface Environment {
  NODE_ENV: 'development' | 'production' | 'test';
  VITE_API_URL: string;
  VITE_APP_NAME: string;
  VITE_APP_VERSION: string;
} 