// Enhanced ChatPage with premium UI and improved user experience
import React, { useEffect } from 'react';
import { ChatContainer } from '../components/ChatContainer';
import { useAuthStore } from '@/stores/auth.store';
import { useClearChat } from '../store/chat.store';

export const ChatPage: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const clearChat = useClearChat();

  // Clear chat when user logs out to prevent data leakage
  useEffect(() => {
    if (!isAuthenticated) {
      clearChat();
    }
  }, [isAuthenticated, clearChat]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl" />
      </div>
      
      {/* Main Chat Interface */}
      <div className="relative z-10 container-content mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 py-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Chat Icon */}
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-500 to-purple-600 flex items-center justify-center shadow-elevation-3">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="absolute -inset-0.5 bg-gradient-to-br from-accent-500 to-purple-600 rounded-2xl opacity-20 blur-lg" />
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-white">
                  AI Assistant
                </h1>
                <p className="text-sm text-white/60">
                  {isAuthenticated 
                    ? `Welcome back, ${user?.name?.split(' ')[0] || 'there'}!` 
                    : 'Please sign in to save your conversations'
                  }
                </p>
              </div>
            </div>

            {/* Chat Actions */}
            <div className="flex items-center gap-3">
              {/* New Chat Button */}
              <button
                onClick={() => clearChat()}
                className="btn-secondary text-sm px-4 py-2 flex items-center gap-2"
                title="Start new conversation"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Chat
              </button>

              {/* Settings Button */}
              <button
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                title="Chat settings"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 min-h-0">
          <ChatContainer className="h-full" />
        </div>
      </div>

      {/* Mobile Optimization Notice */}
      <div className="sm:hidden fixed bottom-4 left-4 right-4 z-50 pointer-events-none">
        <div className="glass-card-subtle p-3 text-center">
          <p className="text-xs text-white/60">
            💡 Tip: Swipe up for a better chat experience
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage; 