// World-Class Responsive ChatMessage with cinematic effects and mobile-first design
import React, { useState, useCallback, useMemo } from 'react';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  isAnimating?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = React.memo(({ message, isAnimating = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const isUser = message.role === 'user';

  // Memoized timestamp formatting for performance
  const formattedTime = useMemo(() => {
    try {
      let dateObj: Date;
      
      if (message.timestamp instanceof Date) {
        dateObj = message.timestamp;
      } else if (typeof message.timestamp === 'string' || typeof message.timestamp === 'number') {
        dateObj = new Date(message.timestamp);
      } else {
        dateObj = new Date();
      }
      
      if (isNaN(dateObj.getTime())) {
        dateObj = new Date();
      }
      
      return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(dateObj);
    } catch (error) {
      console.warn('Invalid date in ChatMessage:', message.timestamp, error);
      return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(new Date());
    }
  }, [message.timestamp]);

  // Optimized copy handler with feedback
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  }, [message.content]);

  // Enhanced avatar with improved mobile sizing
  const renderAvatar = useCallback(() => {
    const baseClasses = "relative group flex-shrink-0";
    const avatarClasses = `
      w-8 h-8 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center text-white 
      shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl
    `;

    if (isUser) {
      return (
        <div className={baseClasses}>
          <div className={`${avatarClasses} bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600`}>
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-75 transition-opacity duration-300 blur-sm" />
        </div>
      );
    }

    return (
      <div className={baseClasses}>
        <div className={`${avatarClasses} bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600`}>
          <div className="relative">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-3 sm:h-3">
              <div className="w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
            </div>
          </div>
        </div>
        <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-300 blur-sm animate-pulse" />
      </div>
    );
  }, [isUser]);

  // Enhanced message content with better mobile handling
  const renderMessageContent = useCallback(() => {
    const lines = message.content.split('\n');
    
    return (
      <div className={`
        relative z-10 text-sm sm:text-base leading-relaxed break-words
        ${isUser ? 'text-white' : 'text-slate-800 dark:text-slate-200'}
      `}>
        {lines.map((line: string, index: number) => (
          <React.Fragment key={index}>
            {line}
            {index < lines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </div>
    );
  }, [message.content, isUser]);

  return (
    <div
      className={`
        flex items-start gap-3 sm:gap-4 mb-6 sm:mb-8 group transition-all duration-500
        ${isUser ? 'flex-row-reverse' : 'flex-row'}
        ${isAnimating ? 'animate-in slide-in-from-bottom-4 fade-in duration-500' : ''}
        ${isHovered ? 'scale-[1.005] sm:scale-[1.01]' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar */}
      <div className="mt-1">
        {renderAvatar()}
      </div>

      {/* Message Content */}
      <div className={`
        flex flex-col max-w-[85%] sm:max-w-[80%] lg:max-w-[75%]
        ${isUser ? 'items-end' : 'items-start'}
      `}>
        {/* Message Bubble */}
        <div
          className={`
            relative px-4 py-3 sm:px-6 sm:py-4 transition-all duration-500 transform
            ${isHovered ? 'scale-[1.02] shadow-2xl' : 'shadow-lg'}
            ${isUser
              ? 'bg-gradient-to-br from-blue-500 to-purple-600 ml-auto rounded-[1.5rem] rounded-br-lg'
              : 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-[1.5rem] rounded-bl-lg border border-white/20 dark:border-slate-700/50'
            }
          `}
        >
          {/* Message tail - responsive sizing */}
          <div
            className={`
              absolute top-4 w-3 h-3 sm:w-4 sm:h-4 transform rotate-45 transition-all duration-300
              ${isUser
                ? 'right-[-6px] sm:right-[-8px] bg-gradient-to-br from-blue-500 to-purple-600'
                : 'left-[-6px] sm:left-[-8px] bg-white/90 dark:bg-slate-800/90 border-l border-b border-white/20 dark:border-slate-700/50'
              }
            `}
          />

          {/* Shimmer Effect on Hover */}
          {isHovered && (
            <div className="absolute inset-0 rounded-[1.5rem] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-full animate-shimmer" />
            </div>
          )}

          {/* Message Text */}
          {renderMessageContent()}

          {/* Message Status for User Messages */}
          {isUser && (
            <div className="absolute bottom-2 right-3 sm:right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="flex items-center gap-0.5">
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
        <div className={`
          mt-1.5 sm:mt-2 px-2 flex items-center gap-2 sm:gap-3 text-xs sm:text-sm
          ${isUser ? 'flex-row-reverse' : 'flex-row'}
        `}>
          <span className={`
            text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 
            transition-all duration-300 font-mono
            ${isHovered ? 'translate-y-0' : 'translate-y-1'}
          `}>
            {formattedTime}
          </span>
          
          {/* Action Buttons - Mobile Optimized */}
          <div className={`
            flex items-center gap-1 opacity-0 group-hover:opacity-100 
            transition-all duration-300
            ${isHovered ? 'translate-y-0' : 'translate-y-1'}
          `}>
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className={`
                p-1.5 sm:p-2 rounded-lg transition-all duration-200 
                text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 
                hover:bg-slate-100 dark:hover:bg-slate-800 
                touch-manipulation min-w-[44px] min-h-[44px] sm:min-w-auto sm:min-h-auto
                flex items-center justify-center
              `}
              title={isCopied ? 'Copied!' : 'Copy message'}
              aria-label={isCopied ? 'Copied!' : 'Copy message'}
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

            {/* Reaction Button (for AI messages) - Mobile Optimized */}
            {!isUser && (
              <button
                className={`
                  p-1.5 sm:p-2 rounded-lg transition-all duration-200 
                  text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 
                  hover:bg-slate-100 dark:hover:bg-slate-800 
                  touch-manipulation min-w-[44px] min-h-[44px] sm:min-w-auto sm:min-h-auto
                  flex items-center justify-center
                `}
                title="Add reaction"
                aria-label="Add reaction"
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
}); 