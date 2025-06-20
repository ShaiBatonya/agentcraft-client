// Premium ChatBox component with modern styling and smooth animations
import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import { useChatStore } from '../store/chat.store';

export const ChatBox: React.FC = () => {
  const { messages, isLoading } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'end'
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderTypingIndicator = () => (
    <div className="flex items-start gap-3 mb-6 animate-in slide-in-from-bottom-2 duration-300">
      {/* AI Avatar */}
      <div className="flex-shrink-0 mt-1">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      </div>

      {/* Typing Bubble */}
      <div className="flex flex-col max-w-[80%]">
        <div className="relative bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-2xl rounded-bl-md shadow-lg border border-slate-200 dark:border-slate-700 px-6 py-4">
          {/* Message tail */}
          <div className="absolute left-[-6px] top-3 w-3 h-3 transform rotate-45 bg-white dark:bg-slate-800 border-l border-b border-slate-200 dark:border-slate-700" />
          
          {/* Typing Animation */}
          <div className="flex items-center gap-1">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75" />
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150" />
            </div>
            <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">
              AI is thinking...
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl float-animation">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
          Start a Conversation
        </h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          Ask me anything! I'm here to help you with questions, creative tasks, problem-solving, and more.
        </p>
        
        {/* Suggested Prompts */}
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="glass-card-subtle p-3 hover:scale-105 transition-all duration-200 cursor-pointer">
            <span className="text-slate-600 dark:text-slate-400">
              "Explain quantum computing in simple terms"
            </span>
          </div>
          <div className="glass-card-subtle p-3 hover:scale-105 transition-all duration-200 cursor-pointer">
            <span className="text-slate-600 dark:text-slate-400">
              "Help me write a creative story"
            </span>
          </div>
          <div className="glass-card-subtle p-3 hover:scale-105 transition-all duration-200 cursor-pointer">
            <span className="text-slate-600 dark:text-slate-400">
              "What are the latest AI trends?"
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  if (messages.length === 0) {
    return renderEmptyState();
  }

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto chat-scrollbar p-6 space-y-0"
      style={{ 
        scrollbarGutter: 'stable',
        overscrollBehavior: 'contain'
      }}
    >
      {/* Messages */}
      <div className="space-y-0">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {/* Typing Indicator */}
        {isLoading && renderTypingIndicator()}
        
        {/* Scroll anchor */}
        <div ref={messagesEndRef} className="h-0" />
      </div>

      {/* Scroll to bottom button */}
      {messages.length > 3 && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-32 right-8 w-10 h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-200 opacity-80 hover:opacity-100"
          title="Scroll to bottom"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      )}
    </div>
  );
}; 