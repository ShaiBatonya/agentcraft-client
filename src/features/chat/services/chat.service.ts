// Chat service for API communication with backend
import { apiService } from '@/services/api';
import type { ChatRequest, ChatResponse } from '../types';

export class ChatService {
  /**
   * Send a chat message to the backend and get AI response
   */
  static async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      console.log('🔄 Chat Service: Sending message request:', request);
      
      // Use the centralized API service
      const response = await apiService.chat.sendMessage(request.prompt);
      
      console.log('✅ Chat Service: API response received:', response);

      // Transform backend response to frontend format
      // Backend returns: { success: true, data: { reply: "..." } }
      // Frontend expects: { response: "..." }
      if (response.success && response.data?.reply) {
        const transformedResponse: ChatResponse = {
          response: response.data.reply
        };
        
        console.log('✅ Chat Service: Transformed response:', transformedResponse);
        return transformedResponse;
      } else {
        console.error('❌ Chat Service: Invalid response format:', response);
        throw new Error('Invalid response format from server');
      }
      
    } catch (error) {
      console.error('❌ Chat Service: Failed to send chat message:', error);
      
      // Provide user-friendly error messages
      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          throw new Error('Please log in to send messages');
        } else if (error.message.includes('404')) {
          throw new Error('Chat service is not available. Please try again later.');
        } else if (error.message.includes('timeout')) {
          throw new Error('Request timed out. Please try again.');
        } else if (error.message.includes('Network Error')) {
          throw new Error('Network connection failed. Please check your internet connection.');
        }
      }
      
      throw new Error('Failed to send message. Please try again.');
    }
  }

  /**
   * Health check endpoint
   */
  static async healthCheck(): Promise<{ status: string }> {
    try {
      console.log('🔄 Chat Service: Performing health check');
      
      const response = await apiService.chat.healthCheck();
      console.log('✅ Chat Service: Health check response:', response);
      
      return {
        status: response.success ? 'healthy' : 'unhealthy'
      };
    } catch (error) {
      console.error('❌ Chat Service: Health check failed:', error);
      return {
        status: 'unhealthy'
      };
    }
  }
} 