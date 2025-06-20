import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  ApiResponse,
  ChatSession,
  User,
  PaginatedResponse,
} from '@/types';
import {
  chatSessionSchema,
  userSchema,
  paginatedResponseSchema,
} from '@/validation/schemas';

// API Configuration
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  retries: 3,
  retryDelay: 1000,
} as const;

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly status?: number,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Centralized Axios instance
export const api: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  withCredentials: true, // Include HttpOnly cookies for authentication
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Log auth errors for debugging
    if (error.config?.url?.includes('/auth/') || error.response?.status === 401) {
      console.error(`API Error: ${error.response?.status} ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data);
    }
    
    return Promise.reject(error);
  }
);

// Enhanced fetch wrapper with retries and error handling
class ApiClient {
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async apiRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    endpoint: string,
    data?: unknown
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt < API_CONFIG.retries; attempt++) {
      try {
        let response;
        
        switch (method) {
          case 'GET':
            response = await api.get(endpoint);
            break;
          case 'POST':
            response = await api.post(endpoint, data);
            break;
          case 'PUT':
            response = await api.put(endpoint, data);
            break;
          case 'PATCH':
            response = await api.patch(endpoint, data);
            break;
          case 'DELETE':
            response = await api.delete(endpoint);
            break;
        }
        
        return response.data;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (error instanceof AxiosError) {
          // Don't retry client errors (4xx), but retry server errors (5xx)
          if (error.response?.status && error.response.status < 500) {
            throw new ApiError(
              error.response.data?.code || 'CLIENT_ERROR',
              error.response.data?.error || error.message,
              error.response.status,
              error.response.data
            );
          }
        }

        if (attempt < API_CONFIG.retries - 1) {
          await this.delay(API_CONFIG.retryDelay * Math.pow(2, attempt)); // Exponential backoff
          continue;
        }

        throw lastError;
      }
    }

    throw lastError!;
  }

  // HTTP methods
  async get<T>(endpoint: string): Promise<T> {
    return this.apiRequest<T>('GET', endpoint);
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.apiRequest<T>('POST', endpoint, data);
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.apiRequest<T>('PUT', endpoint, data);
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.apiRequest<T>('PATCH', endpoint, data);
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.apiRequest<T>('DELETE', endpoint);
  }
}

// Create API client instance
const apiClient = new ApiClient();

// API service functions
export const apiService = {
  // Health check
  async health(): Promise<{ status: 'ok'; timestamp: string }> {
    return apiClient.get('/health');
  },

  // Authentication
  auth: {
    async logout(): Promise<ApiResponse<null>> {
      return apiClient.post('/auth/logout');
    },

    async me(): Promise<ApiResponse<User>> {
      const response = await apiClient.get<ApiResponse<User>>('/auth/me');
      
      // The response is already in the correct format from the backend
      if (!response.data || !response.success) {
        throw new ApiError('VALIDATION_ERROR', 'Invalid response structure from server');
      }
      
      // Validate the user data
      const userValidation = userSchema.safeParse(response.data);
      if (!userValidation.success) {
        throw new ApiError('VALIDATION_ERROR', 'Invalid user data format');
      }
      
      return response;
    },

    async health(): Promise<ApiResponse<{ authenticated: boolean }>> {
      return apiClient.get('/auth/health');
    },
  },

  // Chat functionality
  chat: {
    async sendMessage(message: string): Promise<ApiResponse<{ reply: string }>> {
      const response = await apiClient.post<ApiResponse<{ reply: string }>>('/chat', {
        prompt: message // Backend expects "prompt" field
      });
      
      return response;
    },

    async getHistory(params?: {
      userId?: string;
      limit?: number;
      before?: Date;
      after?: Date;
    }): Promise<ApiResponse<{ messages: Record<string, unknown>[]; total: number; hasMore: boolean }>> {
      const searchParams = new URLSearchParams();
      if (params?.limit) searchParams.set('limit', params.limit.toString());
      if (params?.before) searchParams.set('before', params.before.toISOString());
      if (params?.after) searchParams.set('after', params.after.toISOString());
      if (params?.userId) searchParams.set('userId', params.userId);

      const response = await apiClient.get<ApiResponse<{ 
        messages: Record<string, unknown>[]; 
        total: number; 
        hasMore: boolean 
      }>>(
        `/chat/history?${searchParams}`
      );
      
      return response;
    },

    async saveMessage(message: {
      id: string;
      role: 'user' | 'assistant';
      content: string;
      timestamp: Date;
      userId?: string;
    }): Promise<ApiResponse<{ id: string; saved: boolean }>> {
      const response = await apiClient.post<ApiResponse<{ id: string; saved: boolean }>>('/chat/message', {
        id: message.id,
        role: message.role,
        content: message.content,
        timestamp: message.timestamp.toISOString(),
        userId: message.userId,
      });
      
      return response;
    },

    async getSessions(params?: {
      page?: number;
      limit?: number;
      search?: string;
    }): Promise<PaginatedResponse<ChatSession>> {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', params.page.toString());
      if (params?.limit) searchParams.set('limit', params.limit.toString());
      if (params?.search) searchParams.set('search', params.search);

      const response = await apiClient.get<PaginatedResponse<ChatSession>>(
        `/chat/sessions?${searchParams}`
      );
      
      // Validate response
      const parsed = paginatedResponseSchema(chatSessionSchema).safeParse(response);
      if (!parsed.success) {
        throw new ApiError('VALIDATION_ERROR', 'Invalid sessions data');
      }
      
      return response;
    },

    async healthCheck(): Promise<ApiResponse<{ status: string; model?: string }>> {
      return apiClient.get('/chat/health');
    },
  },

  // File upload
  files: {
    async upload(file: File): Promise<ApiResponse<{ url: string; filename: string }>> {
      const formData = new FormData();
      formData.append('file', file);

      return apiClient.post('/files/upload', formData);
    },
  },
};

// Export both the raw axios instance and the enhanced client
export { api as axiosInstance, apiClient };
export type { AxiosInstance }; 