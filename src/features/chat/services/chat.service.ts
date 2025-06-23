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
      const response = await apiService.chat.sendMessage(request.threadId || '', request.prompt);

      // Transform backend response to frontend format
      if (response.data?.messages?.assistantMessage?.content) {
        const transformedResponse: ChatResponse = {
          response: response.data.messages.assistantMessage.content
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
   * Get chat history for a thread
   */
  static async getChatHistory(params?: ChatHistoryRequest): Promise<Message[]> {
    try {
      // Get messages for the thread
      const response = await apiService.chat.getMessages(params?.threadId || '');
      
      if (response.data) {
        // Transform backend messages to frontend format
        const messages: Message[] = response.data.map((msg: Record<string, unknown>) => ({
          id: msg._id as string,
          role: msg.role as 'user' | 'assistant',
          content: msg.content as string,
          timestamp: new Date(msg.createdAt as string), // Ensure timestamp is Date object
          threadId: msg.threadId as string,
          userId: msg.userId as string,
          synced: true, // Messages from backend are already synced
        }));
        
        return messages;
      }

      return [];
    } catch (error) {
      console.error('❌ Chat Service: Failed to get chat history:', error);
      console.warn('⚠️ Chat Service: History loading failed, continuing without history');
      return [];
    }
  }

  /**
   * Save message to backend for persistence
   */
  static async saveMessage(message: Message): Promise<boolean> {
    try {
      const response = await apiService.chat.sendMessage(message.threadId || '', message.content);
      return response.status === 200;
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
      const response = await apiService.chat.test();
      return {
        status: response.status === 200 ? 'healthy' : 'unhealthy'
      };
    } catch (error) {
      console.error('❌ Chat Service: Health check failed:', error);
      return {
        status: 'unhealthy'
      };
    }
  }
} 