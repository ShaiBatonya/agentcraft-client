// Chat service for API communication with backend
import { apiService } from '@/services/api';
import type { ChatRequest, ChatResponse, Message, ChatHistoryRequest } from '../types';

export class ChatService {
  /**
   * Send a chat message to the backend and get AI response
   */
  static async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
  
      
      // Use the centralized API service
      const response = await apiService.chat.sendMessage(request.prompt);
      


      // Transform backend response to frontend format
      // Backend returns: { success: true, data: { reply: "..." } }
      // Frontend expects: { response: "..." }
      if (response.success && response.data?.reply) {
        const transformedResponse: ChatResponse = {
          response: response.data.reply
        };
        
  
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
   * Get chat history for the authenticated user from the last 7 days
   */
  static async getChatHistory(params?: ChatHistoryRequest): Promise<Message[]> {
    try {
  
      
      // Calculate 7 days ago for filtering
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      // Try to get history from backend first
      try {
        const response = await apiService.chat.getHistory({
          ...params,
          after: sevenDaysAgo, // Only get messages from last 7 days
          limit: params?.limit || 100,
        });
        
        if (response.success && response.data?.messages) {
    
          
          // Transform backend messages to frontend format
          const messages: Message[] = response.data.messages.map((msg: Record<string, unknown>) => ({
            id: msg.id as string,
            role: msg.role as 'user' | 'assistant',
            content: msg.content as string,
            timestamp: new Date(msg.timestamp as string), // Ensure timestamp is Date object
            userId: msg.userId as string,
            synced: true, // Messages from backend are already synced
          }));
          
          return messages;
        }
      } catch (backendError) {
        console.warn('⚠️ Chat Service: Backend history unavailable, using local storage:', backendError);
      }
      
      // Fallback: Return empty array if backend is unavailable
      // The chat store will handle local persistence

      return [];
      
    } catch (error) {
      console.error('❌ Chat Service: Failed to get chat history:', error);
      
      // Don't throw error for history loading - gracefully degrade
      console.warn('⚠️ Chat Service: History loading failed, continuing without history');
      return [];
    }
  }

  /**
   * Save message to backend for persistence
   */
  static async saveMessage(message: Message): Promise<boolean> {
    try {
  
      
      const response = await apiService.chat.saveMessage({
        id: message.id,
        role: message.role,
        content: message.content,
        timestamp: message.timestamp,
        userId: message.userId,
      });
      
      if (response.success) {

        return true;
      } else {
        console.warn('⚠️ Chat Service: Failed to save message:', response);
        return false;
      }
    } catch (error) {
      console.error('❌ Chat Service: Failed to save message:', error);
      return false;
    }
  }

  /**
   * Health check endpoint
   */
  static async healthCheck(): Promise<{ status: string }> {
    try {
  
      
      const response = await apiService.chat.healthCheck();
  
      
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