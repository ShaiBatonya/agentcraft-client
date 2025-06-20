import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
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

// Offline mode simulation
let isOfflineMode = false;
interface OfflineMessage {
  _id: string;
  threadId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

interface OfflineThread {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

const offlineData: {
  threads: OfflineThread[];
  messages: Record<string, OfflineMessage[]>;
  threadCounter: number;
  messageCounter: number;
} = {
  threads: [],
  messages: {},
  threadCounter: 1,
  messageCounter: 1,
};

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and offline mode
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error: AxiosError) => {
    console.error(`❌ API Error: ${error.response?.status || 'NETWORK'} ${error.config?.url}`);
    
    // Check if server is unreachable
    if (!error.response && (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK')) {
      console.log('🔌 Server unreachable, enabling offline mode...');
      isOfflineMode = true;
      
      // Handle offline requests
      return handleOfflineRequest(error.config);
    }
    
    return Promise.reject(error);
  }
);

// Offline mode request handler
function handleOfflineRequest(config: unknown): Promise<AxiosResponse> {
  const { method, url, data } = config as { method?: string; url?: string; data?: { title?: string; content?: string } };
  
  console.log(`🔄 Handling offline request: ${method?.toUpperCase()} ${url}`);
  
  // Simulate API responses for different endpoints
  return new Promise((resolve) => {
    setTimeout(() => {
      if (url === '/chat/threads' && method === 'get') {
        resolve({
          data: offlineData.threads,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        } as AxiosResponse);
      }
      
      else if (url === '/chat/thread' && method === 'post') {
        const thread = {
          _id: `offline_thread_${offlineData.threadCounter++}`,
          title: data?.title || 'New Chat (Offline)',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        offlineData.threads.unshift(thread);
        offlineData.messages[thread._id] = [];
        
        resolve({
          data: thread,
          status: 201,
          statusText: 'Created',
          headers: {},
          config,
        } as AxiosResponse);
      }
      
      else if (url?.includes('/messages') && method === 'get') {
        const threadId = url.split('/')[2];
        const messages = offlineData.messages[threadId] || [];
        
        resolve({
          data: messages,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        } as AxiosResponse);
      }
      
      else if (url?.includes('/message') && method === 'post') {
        const threadId = url.split('/')[2];
        const content = data?.content || '';
        
        const userMessage = {
          _id: `offline_msg_${offlineData.messageCounter++}`,
          threadId,
          role: 'user' as const,
          content: content,
          createdAt: new Date().toISOString(),
        };
        
        const assistantMessage = {
          _id: `offline_msg_${offlineData.messageCounter++}`,
          threadId,
          role: 'assistant' as const,
          content: `🔌 Offline Mode: Your message "${content}" has been received. This is a simulated response since the server is not available.`,
          createdAt: new Date().toISOString(),
        };
        
        if (!offlineData.messages[threadId]) {
          offlineData.messages[threadId] = [];
        }
        
        offlineData.messages[threadId].push(userMessage, assistantMessage);
        
        resolve({
          data: {
            success: true,
            messages: {
              userMessage,
              assistantMessage,
            }
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        } as AxiosResponse);
      }
      
      else if (url?.includes('/thread/') && method === 'delete') {
        const threadId = url.split('/').pop();
        if (threadId) {
          offlineData.threads = offlineData.threads.filter(t => t._id !== threadId);
          delete offlineData.messages[threadId];
        }
        
        resolve({
          data: {
            success: true,
            message: 'Thread deleted successfully (offline mode)'
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        } as AxiosResponse);
      }
      
      else {
        // Default offline response
        resolve({
          data: {
            success: false,
            error: 'Offline mode - limited functionality available'
          },
          status: 503,
          statusText: 'Service Unavailable',
          headers: {},
          config,
        } as AxiosResponse);
      }
    }, 500); // Simulate network delay
  });
}

// Utility function to check if we're in offline mode
export const isOffline = () => isOfflineMode;

// Function to manually enable offline mode for testing
export const enableOfflineMode = () => {
  isOfflineMode = true;
  console.log('🔌 Offline mode enabled manually');
};

// Function to disable offline mode
export const disableOfflineMode = () => {
  isOfflineMode = false;
  console.log('🌐 Online mode restored');
};

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