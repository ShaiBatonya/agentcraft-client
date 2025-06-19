import type {
  ApiResponse,
  Message,
  ChatSession,
  User,
  PaginatedResponse,
} from '@/types';
import {
  messageSchema,
  chatSessionSchema,
  userSchema,
  apiResponseSchema,
  apiErrorSchema,
  paginatedResponseSchema,
} from '@/validation/schemas';

// API Configuration
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
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

// Request configuration interface
interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

// Enhanced fetch wrapper with retries and error handling
class ApiClient {
  private baseURL: string;
  private defaultConfig: RequestConfig;

  constructor(baseURL: string, defaultConfig: RequestConfig = {}) {
    this.baseURL = baseURL;
    this.defaultConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include HttpOnly cookies
      ...defaultConfig,
    };
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async fetchWithRetry(
    url: string,
    config: RequestConfig = {}
  ): Promise<Response> {
    const {
      timeout = API_CONFIG.timeout,
      retries = API_CONFIG.retries,
      retryDelay = API_CONFIG.retryDelay,
      ...fetchConfig
    } = { ...this.defaultConfig, ...config };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    let lastError: Error;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, {
          ...fetchConfig,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await this.parseErrorResponse(response);
          throw new ApiError(
            errorData.code || 'HTTP_ERROR',
            errorData.message || `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            errorData.details
          );
        }

        return response;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt < retries && this.shouldRetry(lastError)) {
          await this.delay(retryDelay * Math.pow(2, attempt)); // Exponential backoff
          continue;
        }

        clearTimeout(timeoutId);
        throw lastError;
      }
    }

    throw lastError!;
  }

  private shouldRetry(error: Error): boolean {
    if (error instanceof ApiError) {
      // Don't retry client errors (4xx), but retry server errors (5xx)
      return error.status ? error.status >= 500 : true;
    }
    
    // Retry network errors, timeouts, etc.
    return error.name === 'AbortError' || error.name === 'TypeError';
  }

  private async parseErrorResponse(response: Response): Promise<{
    code: string;
    message: string;
    details?: Record<string, unknown>;
  }> {
    try {
      const errorData = await response.json();
      const parsed = apiErrorSchema.safeParse(errorData);
      
      if (parsed.success) {
        return parsed.data;
      }
      
      return {
        code: 'PARSE_ERROR',
        message: 'Failed to parse error response',
        details: errorData,
      };
    } catch {
      return {
        code: 'NETWORK_ERROR',
        message: `HTTP ${response.status}: ${response.statusText}`,
      };
    }
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const data = await response.json();
    return data;
  }

  // HTTP methods
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const response = await this.fetchWithRetry(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      ...config,
    });
    return this.parseResponse<T>(response);
  }

  async post<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    const response = await this.fetchWithRetry(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      ...config,
    });
    return this.parseResponse<T>(response);
  }

  async put<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    const response = await this.fetchWithRetry(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      ...config,
    });
    return this.parseResponse<T>(response);
  }

  async patch<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    const response = await this.fetchWithRetry(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      ...config,
    });
    return this.parseResponse<T>(response);
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const response = await this.fetchWithRetry(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      ...config,
    });
    return this.parseResponse<T>(response);
  }
}

// Create API client instance
const apiClient = new ApiClient(API_CONFIG.baseURL);

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
      
      // Validate response
      const parsed = apiResponseSchema(userSchema).safeParse(response.data);
      if (!parsed.success) {
        throw new ApiError('VALIDATION_ERROR', 'Invalid user data');
      }
      
      return response;
    },

    async health(): Promise<ApiResponse<{ authenticated: boolean }>> {
      return apiClient.get('/auth/health');
    },
  },

  // Chat sessions
  chat: {
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

    async getSession(id: string): Promise<ApiResponse<ChatSession>> {
      const response = await apiClient.get<ApiResponse<ChatSession>>(`/chat/sessions/${id}`);
      
      // Validate response
      const parsed = apiResponseSchema(chatSessionSchema).safeParse(response);
      if (!parsed.success) {
        throw new ApiError('VALIDATION_ERROR', 'Invalid session data');
      }
      
      return response;
    },

    async createSession(title?: string): Promise<ApiResponse<ChatSession>> {
      const response = await apiClient.post<ApiResponse<ChatSession>>('/chat/sessions', {
        title,
      });
      
      // Validate response
      const parsed = apiResponseSchema(chatSessionSchema).safeParse(response);
      if (!parsed.success) {
        throw new ApiError('VALIDATION_ERROR', 'Invalid session data');
      }
      
      return response;
    },

    async updateSession(id: string, data: { title?: string }): Promise<ApiResponse<ChatSession>> {
      const response = await apiClient.put<ApiResponse<ChatSession>>(`/chat/sessions/${id}`, data);
      
      // Validate response
      const parsed = apiResponseSchema(chatSessionSchema).safeParse(response);
      if (!parsed.success) {
        throw new ApiError('VALIDATION_ERROR', 'Invalid session data');
      }
      
      return response;
    },

    async deleteSession(id: string): Promise<ApiResponse<null>> {
      return apiClient.delete(`/chat/sessions/${id}`);
    },

    async sendMessage(sessionId: string, content: string): Promise<ApiResponse<Message>> {
      const response = await apiClient.post<ApiResponse<Message>>(`/chat/sessions/${sessionId}/messages`, {
        content,
      });
      
      // Validate response
      const parsed = apiResponseSchema(messageSchema).safeParse(response);
      if (!parsed.success) {
        throw new ApiError('VALIDATION_ERROR', 'Invalid message data');
      }
      
      return response;
    },

    // Server-Sent Events for streaming responses
    createMessageStream(sessionId: string, content: string): EventSource {
      const params = new URLSearchParams({
        sessionId,
        content,
      });
      
      const eventSource = new EventSource(
        `${API_CONFIG.baseURL}/chat/stream?${params}`,
        { withCredentials: true }
      );
      
      return eventSource;
    },
  },

  // File upload
  files: {
    async upload(file: File): Promise<ApiResponse<{ url: string; filename: string }>> {
      const formData = new FormData();
      formData.append('file', file);

      return apiClient.post('/files/upload', formData, {
        headers: {
          // Remove Content-Type to let browser set boundary for FormData
        },
      });
    },
  },
};

// Export types and client
export { apiClient };
export type { RequestConfig }; 