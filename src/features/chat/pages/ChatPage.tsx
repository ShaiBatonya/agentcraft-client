// Premium ChatPage with modern styling and animations
import React, { useEffect } from 'react';
import { ChatBox } from '../components/ChatBox';
import { ChatInput } from '../components/ChatInput';
import { useChatStore } from '../store/chat.store';

export const ChatPage: React.FC = () => {
  const { messages, error, isLoading, clearError, clearChat } = useChatStore();

  useEffect(() => {
    // Add a welcome message if no messages exist
    if (messages.length === 0) {
      useChatStore.getState().setMessages([
        {
          id: '1',
          role: 'assistant',
          content: 'Hello! I\'m your AI assistant. How can I help you today?',
          timestamp: new Date(),
        },
      ]);
    }
  }, [messages.length]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Chat Header */}
      <div className="glass-card-subtle mx-4 mt-4 mb-0 border-b-0 rounded-b-none">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full animate-pulse" />
            </div>
            
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                AI Assistant
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Online & Ready to Help
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={clearChat}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200"
              title="Clear Chat"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            
            <button
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200"
              title="Settings"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mx-4 mb-4">
          <div className="glass-card-subtle border-red-200 dark:border-red-800 bg-red-50/80 dark:bg-red-900/20 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    Something went wrong
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {error}
                  </p>
                </div>
              </div>
              <button
                onClick={clearError}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages Container */}
      <div className="flex-1 mx-4">
        <div className="glass-card-subtle h-full rounded-t-none border-t-0 flex flex-col">
          <ChatBox />
        </div>
      </div>

      {/* Chat Input Container */}
      <div className="mx-4 mb-4">
        <div className="glass-card-subtle rounded-t-none border-t-0 p-6">
          <ChatInput />
          
          {/* Input Helper */}
          <div className="flex items-center justify-between mt-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs">Enter</kbd>
                to send
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs">Shift</kbd>
                +
                <kbd className="px-1 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs">Enter</kbd>
                for new line
              </span>
            </div>
            
            {isLoading && (
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce delay-200" />
                </div>
                <span>AI is thinking...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 