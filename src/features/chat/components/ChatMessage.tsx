// Premium ChatMessage component with modern styling and animations
import React from 'react';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  const renderAvatar = () => {
    if (isUser) {
      return (
        <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
      );
    }

    return (
      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
    );
  };

  return (
    <div
      className={`flex items-start gap-3 mb-6 group animate-in slide-in-from-bottom-2 duration-300 ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mt-1">
        {renderAvatar()}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Message Bubble */}
        <div
          className={`relative px-4 py-3 transition-all duration-200 group-hover:scale-[1.02] ${
            isUser
              ? 'message-user ml-auto'
              : 'message-assistant'
          }`}
        >
          {/* Message tail */}
          <div
            className={`absolute top-3 w-3 h-3 transform rotate-45 ${
              isUser
                ? 'right-[-6px] bg-gradient-to-br from-blue-500 to-indigo-500'
                : 'left-[-6px] bg-white dark:bg-slate-800 border-l border-b border-slate-200 dark:border-slate-700'
            }`}
          />

          {/* Message Text */}
          <div className={`relative z-10 text-sm leading-relaxed ${
            isUser ? 'text-white' : 'text-slate-800 dark:text-slate-200'
          }`}>
            {message.content.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < message.content.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>

          {/* Message Status for User Messages */}
          {isUser && (
            <div className="absolute bottom-1 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <svg className="w-3 h-3 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className={`mt-1 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
          <span className="text-xs text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>

      {/* Copy Button */}
      <div className={`flex-shrink-0 mt-1 ${isUser ? 'order-first mr-2' : 'ml-2'}`}>
        <button
          onClick={() => navigator.clipboard.writeText(message.content)}
          className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200"
          title="Copy message"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}; 