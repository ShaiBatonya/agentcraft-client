import { useCallback } from 'react';
import { useChatStore } from '@/stores/chat.store';
import { useAddToast } from '@/stores/toast.store';
import { api } from '@/services/api';
import type { ChatThread, CreateThreadResponse } from '../types';

// Hook for loading all threads
export const useLoadThreads = () => {
  const { setThreads, setThreadsLoading } = useChatStore();

  return useCallback(async () => {
    setThreadsLoading(true);
    try {
      const response = await api.get('/chat/threads');
      console.log('Threads API response:', response);
      
      // Check if the response has the expected structure
      let threads: ChatThread[] = [];
      const data = response.data as ChatThread[] | { data: ChatThread[] } | { threads: ChatThread[] };
      
      if (Array.isArray(data)) {
        threads = data;
      } else if (data && 'data' in data && Array.isArray(data.data)) {
        // Handle case where API returns {data: [...]}
        threads = data.data;
      } else if (data && 'threads' in data && Array.isArray(data.threads)) {
        // Handle case where API returns {threads: [...]}
        threads = data.threads;
      }
      
      console.log('Processed threads:', threads);
      setThreads(threads);
    } catch (error) {
      console.error('Failed to load threads:', error);
      // Set empty array on error to prevent map error
      setThreads([]);
      // Don't throw error to prevent component crashes
    } finally {
      setThreadsLoading(false);
    }
  }, [setThreads, setThreadsLoading]);
};

// Hook for creating a new thread
export const useCreateThread = () => {
  const { addThread, selectThread } = useChatStore();

  return useCallback(async (title?: string) => {
    console.log('useCreateThread called with title:', title);
    try {
      const response = await api.post<CreateThreadResponse>('/chat/thread', 
        title ? { title } : {}
      );
      
      console.log('Create thread API response:', response);
      
      const newThread: ChatThread = {
        _id: response.data._id,
        title: response.data.title,
        updatedAt: response.data.updatedAt,
        createdAt: response.data.createdAt,
      };
      
      console.log('Created newThread object:', newThread);
      
      // Add to store and select it
      addThread(newThread);
      selectThread(response.data._id);
      
      console.log('Thread added to store and selected');
      return newThread;
    } catch (error) {
      console.error('Failed to create thread:', error);
      throw error;
    }
  }, [addThread, selectThread]);
};

// Hook for selecting a thread and loading its messages
export const useSelectThread = () => {
  const { selectThread, setMessages, setMessagesLoading, setThreadMessages, getThreadMessages } = useChatStore();

  return useCallback(async (threadId: string) => {
    console.log('🎯 SELECTING THREAD:', threadId);
    
    // Immediately select the thread for UI responsiveness
    selectThread(threadId);
    
    try {
      // First, check if we already have messages for this thread in memory
      const cachedMessages = getThreadMessages(threadId);
      
      if (cachedMessages && cachedMessages.length > 0) {
        console.log('📚 Using cached messages for thread:', threadId, '- Count:', cachedMessages.length);
        // Use cached messages immediately
        setMessages(cachedMessages);
        return;
      }
      
      // No cached messages, need to load from API
      console.log('🌐 Loading messages from API for thread:', threadId);
      setMessagesLoading(true);
      
      // Import the API client
      const { api } = await import('@/services/api');
      
      const response = await api.get(`/chat/${threadId}/messages`);
      console.log('📨 Messages API response:', response);
      
      // Handle different possible response structures
      let messages = [];
      const data = response.data;
      
      if (Array.isArray(data)) {
        messages = data;
      } else if (data && 'data' in data && Array.isArray(data.data)) {
        messages = data.data;
      } else if (data && 'messages' in data && Array.isArray(data.messages)) {
        messages = data.messages;
      }
      
      console.log('✅ Processed messages for thread:', threadId, '- Count:', messages.length);
      
      // Update both global and thread-specific storage
      setMessages(messages);
      setThreadMessages(threadId, messages);
      
    } catch (error) {
      console.error('❌ Failed to load messages for thread:', threadId, error);
      // Clear messages on error
      setMessages([]);
      setThreadMessages(threadId, []);
    } finally {
      setMessagesLoading(false);
    }
  }, [selectThread, setMessages, setMessagesLoading, setThreadMessages, getThreadMessages]);
};

// Hook for deleting a thread
export const useDeleteThread = () => {
  const { deleteThread, addThread, threads } = useChatStore();
  const addToast = useAddToast();

  return useCallback(async (threadId: string) => {
    console.log('🚀 DELETE THREAD REQUEST STARTING...');
    console.log('Thread ID to delete:', threadId);
    console.log('API endpoint will be: /chat/thread/' + threadId);
    
    // Store the thread data for potential rollback
    const threadToDelete = threads.find(t => t._id === threadId);
    if (!threadToDelete) {
      console.error('❌ Thread not found in store:', threadId);
      addToast('error', '❌ Thread not found');
      return;
    }
    
    // OPTIMISTIC UI: Remove thread immediately for better UX
    console.log('🔄 Optimistic UI: Removing thread from store...');
    deleteThread(threadId);
    
    try {
      // Call API to delete thread with detailed logging
      console.log('📡 Making DELETE request to backend...');
      const response = await api.delete(`/chat/thread/${threadId}`);
      
      console.log('✅ DELETE request successful!');
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      // Show success toast
      console.log('🎉 Showing success toast...');
      addToast('success', '✅ Chat deleted successfully');
      
    } catch (error) {
      console.error('❌ DELETE THREAD FAILED!');
      console.error('Error type:', typeof error);
      console.error('Error object:', error);
      
      // ROLLBACK: Re-add the thread since deletion failed
      console.log('🔄 Rolling back: Re-adding thread to store...');
      addThread(threadToDelete);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; statusText?: string; data?: unknown }; config?: { url?: string; method?: string } };
        console.error('HTTP Status:', axiosError.response?.status);
        console.error('HTTP Status Text:', axiosError.response?.statusText);
        console.error('Response Data:', axiosError.response?.data);
        console.error('Request URL:', axiosError.config?.url);
        console.error('Request Method:', axiosError.config?.method);
      }
      
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      
      // Show detailed error toast based on error type
      let errorMessage = '❌ Failed to delete chat. Try again later.';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        const status = axiosError.response?.status;
        
        if (status === 401) {
          errorMessage = '❌ Authentication failed. Please log in again.';
        } else if (status === 403) {
          errorMessage = '❌ Permission denied. Cannot delete this chat.';
        } else if (status === 404) {
          errorMessage = '❌ Chat not found. It may have been already deleted.';
        } else if (status === 500) {
          errorMessage = '❌ Server error. Please try again later.';
        } else if (!navigator.onLine) {
          errorMessage = '❌ No internet connection. Check your network.';
        }
      }
      
      addToast('error', errorMessage);
      
      throw error;
    }
  }, [deleteThread, addThread, threads, addToast]);
}; 