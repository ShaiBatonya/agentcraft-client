// Ultra-Premium ChatMessage with cinematic effects and immersive design
import React, { useState } from 'react';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const isUser = message.role === 'user';

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  const renderAvatar = () => {
    if (isUser) {
      return (
        <div className="relative group">
          <div className="w-10 h-10 bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600 rounded-2xl flex items-center justify-center text-white shadow-elevation-3 group-hover:scale-110 transition-all duration-300">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          {/* Status Ring */}
          <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-75 transition-opacity duration-300 blur-sm" />
        </div>
      );
    }

    return (
      <div className="relative group">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-elevation-3 group-hover:scale-110 transition-all duration-300">
          <div className="relative">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            {/* Thinking Animation */}
            <div className="absolute -top-1 -right-1 w-3 h-3">
              <div className="typing-indicator">
                <div className="typing-dot w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </div>
        </div>
        {/* AI Glow Ring */}
        <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-300 blur-sm animate-pulse" />
        {/* Neural Network Effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent animate-shimmer" />
        </div>
      </div>
    );
  };

  return (
    <div
      className={`flex items-start gap-4 mb-8 group transition-all duration-500 ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      } ${isHovered ? 'scale-[1.01]' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mt-1">
        {renderAvatar()}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Message Bubble */}
        <div
          className={`relative px-6 py-4 transition-all duration-500 transform ${
            isHovered ? 'scale-102 shadow-elevation-4' : 'shadow-elevation-2'
          } ${
            isUser
              ? 'message-user-ultra ml-auto rounded-3xl rounded-br-lg'
              : 'message-assistant-ultra rounded-3xl rounded-bl-lg'
          }`}
        >
          {/* Message tail */}
          <div
            className={`absolute top-4 w-4 h-4 transform rotate-45 transition-all duration-300 ${
              isUser
                ? 'right-[-8px] bg-gradient-to-br from-blue-500 to-purple-600'
                : 'left-[-8px] glass-premium border-l border-b border-white/10'
            }`}
          />

          {/* Shimmer Effect on Hover */}
          {isHovered && (
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-full animate-shimmer" />
            </div>
          )}

          {/* Message Text */}
          <div className={`relative z-10 text-sm leading-relaxed ${
            isUser ? 'text-white' : 'text-slate-800 dark:text-slate-200'
          }`}>
            {message.content.split('\n').map((line: string, index: number) => (
              <React.Fragment key={index}>
                {line}
                {index < message.content.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>

          {/* Message Status for User Messages */}
          {isUser && (
            <div className="absolute bottom-2 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <svg className="w-3 h-3 text-blue-100 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Timestamp and Actions */}
        <div className={`mt-2 px-2 flex items-center gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className={`text-xs text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
            isHovered ? 'translate-y-0' : 'translate-y-1'
          }`}>
            {formatTime(message.timestamp)}
          </span>
          
          {/* Action Buttons */}
          <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
            isHovered ? 'translate-y-0' : 'translate-y-1'
          }`}>
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 tilt-hover"
              title={isCopied ? 'Copied!' : 'Copy message'}
            >
              {isCopied ? (
                <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>

            {/* Share Button */}
            <button
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 tilt-hover"
              title="Share message"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>

            {/* Reaction Button (for AI messages) */}
            {!isUser && (
              <button
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 tilt-hover"
                title="Add reaction"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 