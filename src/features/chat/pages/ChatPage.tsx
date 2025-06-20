// Enhanced ChatPage with threaded chat support and premium UI
import React, { useEffect } from 'react';
import ThreadedChatPage from './ThreadedChatPage';
import { useAuthStore } from '@/stores/auth.store';
import { useClearChat } from '../store/chat.store';
import { useChatThreads } from '../hooks/useChatThreads';

export const ChatPage: React.FC = React.memo(() => {
  const { isAuthenticated } = useAuthStore();
  const clearChat = useClearChat();
  const { clearAllThreads } = useChatThreads();

  // Clear chat when user logs out to prevent data leakage
  useEffect(() => {
    if (!isAuthenticated) {
      clearChat();
      clearAllThreads();
    }
  }, [isAuthenticated, clearChat, clearAllThreads]);

  return (
    <div 
      className="h-screen chat-mobile-optimized bg-slate-900 overflow-hidden"
      style={{ 
        transform: 'translateZ(0)', // Hardware acceleration
        backfaceVisibility: 'hidden' // Reduce paint operations
      }}
    >
      {/* Full-height Threaded Chat Interface */}
      <ThreadedChatPage />
    </div>
  );
});

ChatPage.displayName = 'ChatPage';

export default ChatPage; 