// Global types and interfaces used across the application

export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  error?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export type Theme = 'light' | 'dark'; 