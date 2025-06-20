import type { ChatThread, ChatMessage } from '../types';

/**
 * Gets the appropriate title for a thread based on its content
 * If title !== "New Chat" → return title
 * Else → fetch first user message and extract first 6–8 words
 */
export const getThreadTitle = (thread: ChatThread, messagesByThread?: Record<string, ChatMessage[]>): string => {
  // If thread has a custom title (not "New Chat"), use it
  if (thread.title && thread.title !== 'New Chat') {
    return thread.title;
  }

  // Get messages for this thread from messagesByThread record
  const threadMessages = messagesByThread?.[thread._id] || [];
  
  // If no messages, fallback to thread title
  if (threadMessages.length === 0) {
    return thread.title || 'New Chat';
  }

  // Find the first user message
  const firstUserMessage = threadMessages.find(msg => msg.role === 'user');
  
  if (firstUserMessage && firstUserMessage.content) {
    // Extract first 6-8 words from the user's first message
    const words = firstUserMessage.content.trim().split(/\s+/);
    const previewWords = words.slice(0, 8);
    let preview = previewWords.join(' ');
    
    // Add ellipsis if truncated
    if (words.length > 8) {
      preview += '...';
    }
    
    // Limit to reasonable length (50 chars max)
    if (preview.length > 50) {
      preview = preview.substring(0, 47) + '...';
    }
    
    return preview;
  }

  return thread.title || 'New Chat';
};

/**
 * Generates a preview title for a thread based on its messages
 * If title is "New Chat" and there are messages, shows first 6-8 words of first user message
 * @deprecated Use getThreadTitle instead for consistency with requirements
 */
export const getThreadDisplayTitle = (thread: ChatThread, messages?: ChatMessage[]): string => {
  // If thread has a custom title (not "New Chat"), use it
  if (thread.title && thread.title !== 'New Chat') {
    return thread.title;
  }

  // If no messages provided or empty, fallback to thread title
  if (!messages || messages.length === 0) {
    return thread.title || 'New Chat';
  }

  // Find the first user message
  const firstUserMessage = messages.find(msg => msg.role === 'user');
  
  if (firstUserMessage && firstUserMessage.content) {
    // Extract first 6-8 words from the user's first message
    const words = firstUserMessage.content.trim().split(/\s+/);
    const previewWords = words.slice(0, 8);
    let preview = previewWords.join(' ');
    
    // Add ellipsis if truncated
    if (words.length > 8) {
      preview += '...';
    }
    
    // Limit to reasonable length (50 chars max)
    if (preview.length > 50) {
      preview = preview.substring(0, 47) + '...';
    }
    
    return preview;
  }

  return thread.title || 'New Chat';
};

/**
 * Formats timestamp for display in thread list
 * Shows time for today, "Yesterday" for yesterday, day name for this week, date for older
 */
export const formatThreadTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return '';
  }
  
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // Today - show time
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  } else if (diffDays === 1) {
    // Yesterday
    return 'Yesterday';
  } else if (diffDays < 7) {
    // This week - show day name
    return date.toLocaleDateString([], { weekday: 'short' });
  } else if (diffDays < 365) {
    // This year - show month and day
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric' 
    });
  } else {
    // Older - show month, day, and year
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      year: '2-digit'
    });
  }
};

/**
 * Gets the timestamp of the last message in a thread for sorting/display
 */
export const getLastMessageTime = (messages: ChatMessage[]): string => {
  if (!messages || messages.length === 0) {
    return new Date().toISOString();
  }

  // Sort messages by creation time and get the latest
  const sortedMessages = [...messages].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return sortedMessages[0].createdAt;
};

/**
 * Checks if a thread is currently empty (no messages)
 */
export const isThreadEmpty = (messages?: ChatMessage[]): boolean => {
  return !messages || messages.length === 0;
};

/**
 * Gets a thread's message count
 */
export const getThreadMessageCount = (messages?: ChatMessage[]): number => {
  return messages ? messages.length : 0;
}; 