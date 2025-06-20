import { useCallback } from 'react';
import { useChatStore, useSetThreadMessages, useGetThreadMessages } from '@/stores/chat.store';
import { api } from '@/services/api';
import type { ChatMessage, SendMessageResponse } from '../types';

// Hook for loading messages for a specific thread
export const useLoadMessages = () => {
  const { setMessages, setMessagesLoading } = useChatStore();
  const setThreadMessages = useSetThreadMessages();

  return useCallback(async (threadId: string) => {
    console.log('Loading messages for thread:', threadId);
    setMessagesLoading(true);
    try {
      const response = await api.get(`/chat/${threadId}/messages`);
      console.log('Messages API response:', response);
      
      // Handle different possible response structures
      let messages: ChatMessage[] = [];
      const data = response.data as ChatMessage[] | { data: ChatMessage[] } | { messages: ChatMessage[] };
      
      if (Array.isArray(data)) {
        messages = data;
      } else if (data && 'data' in data && Array.isArray(data.data)) {
        messages = data.data;
      } else if (data && 'messages' in data && Array.isArray(data.messages)) {
        messages = data.messages;
      }
      
      console.log('Processed messages:', messages);
      
      // OPTIMIZATION: Only update current view messages and thread-specific storage
      // Avoid triggering re-renders for unrelated components
      setMessages(messages);
      setThreadMessages(threadId, messages);
    } catch (error) {
      console.error('Failed to load messages:', error);
      setMessages([]);
      setThreadMessages(threadId, []);
      // Don't throw error to prevent component crashes
    } finally {
      setMessagesLoading(false);
    }
  }, [setMessages, setMessagesLoading, setThreadMessages]);
};

// Hook for sending a message in a thread
export const useSendMessage = () => {
  const { addMessage, updateThreadTimestamp, setLoading } = useChatStore();
  const setThreadMessages = useSetThreadMessages();
  const getThreadMessages = useGetThreadMessages();

  return useCallback(async (threadId: string, content: string) => {
    console.log('useSendMessage called with:', { threadId, content });
    if (!threadId || !content.trim()) {
      console.error('Missing threadId or content:', { threadId, content });
      throw new Error('Thread ID and message content are required');
    }

    setLoading(true);
    try {
      const response = await api.post(`/chat/${threadId}/message`, {
        content: content.trim(),
      });

      console.log('Send message API response:', response);
      
      const data = response.data;
      let messageData: SendMessageResponse;
      
      // Check what properties exist in the response
      if (data && typeof data === 'object') {
        console.log('Response data properties:', Object.keys(data));
      }
      
      // Handle backend format: {success: true, messages: {...}}
      if (
        data && 
        typeof data === 'object' && 
        'success' in data && 
        data.success === true &&
        'messages' in data &&
        data.messages
      ) {
        console.log('Using backend format: {success: true, messages: {...}}');
        
        // The backend returns messages in a different format
        // Let's see what's inside the messages object
        const messages = data.messages as unknown;
        
        if (messages && typeof messages === 'object') {
          const messagesObj = messages as Record<string, unknown>;
          
          // Check if messages contains userMessage and assistantMessage (actual backend format)
          if ('userMessage' in messagesObj && 'assistantMessage' in messagesObj) {
            messageData = {
              userMsg: messagesObj.userMessage as ChatMessage,
              assistantMsg: messagesObj.assistantMessage as ChatMessage
            };
            console.log('✅ Successfully parsed backend message format');
          }
          // Legacy format support
          else if ('userMsg' in messagesObj && 'assistantMsg' in messagesObj) {
            messageData = {
              userMsg: messagesObj.userMsg as ChatMessage,
              assistantMsg: messagesObj.assistantMsg as ChatMessage
            };
            console.log('Extracted userMsg and assistantMsg from messages (legacy)');
          } else {
            // Try to construct the response from the messages structure
            console.error('Messages structure not as expected:', messages);
            console.error('Expected properties: userMessage, assistantMessage or userMsg, assistantMsg');
            console.error('Found properties:', Object.keys(messagesObj));
            throw new Error('Messages structure not recognized');
          }
        } else {
          console.error('Messages is not an object:', messages);
          throw new Error('Invalid messages format');
        }
      } 
      // Try direct format (legacy)
      else if (
        data && 
        typeof data === 'object' && 
        'userMsg' in data && 
        'assistantMsg' in data
      ) {
        console.log('Using direct format');
        messageData = data as SendMessageResponse;
      } 
      // Try nested data format (legacy)
      else if (
        data && 
        typeof data === 'object' && 
        'data' in data && 
        data.data &&
        typeof data.data === 'object' &&
        'userMsg' in data.data && 
        'assistantMsg' in data.data
      ) {
        console.log('Using nested data format');
        messageData = data.data as SendMessageResponse;
      } 
      else {
        console.error('Unexpected response format:', data);
        console.error('Expected formats:');
        console.error('1. {success: true, messages: {...}}');
        console.error('2. {userMsg: {...}, assistantMsg: {...}}');
        console.error('3. {data: {userMsg: {...}, assistantMsg: {...}}}');
        throw new Error('Invalid response format from server');
      }

      console.log('Processed message data:', messageData);

      // PERFORMANCE OPTIMIZATION: Add messages individually to minimize re-renders
      // Only new ChatMessage components will render, not the entire list
      addMessage(messageData.userMsg);
      addMessage(messageData.assistantMsg);
      
      // Also update thread-specific storage for consistent state
      const currentThreadMessages = getThreadMessages(threadId);
      const updatedThreadMessages = [
        ...currentThreadMessages,
        messageData.userMsg,
        messageData.assistantMsg
      ];
      setThreadMessages(threadId, updatedThreadMessages);
      
      // Update thread timestamp
      updateThreadTimestamp(threadId);

      return messageData;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [addMessage, updateThreadTimestamp, setLoading, setThreadMessages, getThreadMessages]);
};

// Hook for optimistic message sending (shows user message immediately)
export const useOptimisticSendMessage = () => {
  const { addMessage, updateThreadTimestamp, setLoading } = useChatStore();

  return useCallback(async (threadId: string, content: string) => {
    if (!threadId || !content.trim()) {
      throw new Error('Thread ID and message content are required');
    }

    // Create optimistic user message
    const optimisticUserMessage: ChatMessage = {
      _id: `temp-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      createdAt: new Date().toISOString(),
      threadId,
    };

    // Add optimistic message immediately
    addMessage(optimisticUserMessage);
    setLoading(true);

    try {
      const response = await api.post<SendMessageResponse>(`/chat/${threadId}/message`, {
        content: content.trim(),
      });

      // Remove optimistic message and add real messages
      // Note: In a real implementation, you might want to replace the optimistic message
      // For now, we'll just add the real messages (backend handles deduplication)
      addMessage(response.data.assistantMsg);
      
      // Update thread timestamp
      updateThreadTimestamp(threadId);

      return response.data;
    } catch (error) {
      console.error('Failed to send message:', error);
      // In case of error, you might want to mark the optimistic message as failed
      // or remove it. For now, we'll just throw the error.
      throw error;
    } finally {
      setLoading(false);
    }
  }, [addMessage, updateThreadTimestamp, setLoading]);
}; 