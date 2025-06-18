// Chat service for API communication with backend
import { api } from '../../../shared/utils/api';
import type { ChatRequest, ChatResponse } from '../types';

export class ChatService {
  /**
   * Send a chat message to the backend and get AI response
   */
  static async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await api.post<ChatResponse>('/chat', request);
      return response.data;
    } catch (error) {
      console.error('Failed to send chat message:', error);
      throw error;
    }
  }

  /**
   * Health check endpoint
   */
  static async healthCheck(): Promise<{ status: string }> {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
} 