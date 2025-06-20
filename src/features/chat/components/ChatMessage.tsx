// World-Class Responsive ChatMessage with advanced features and cinematic effects
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = React.memo(({ message }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);
  
  const isUser = message.role === 'user';

  // Enhanced timestamp formatting
  const formattedTime = useMemo(() => {
    try {
      const date = message.timestamp instanceof Date ? message.timestamp : new Date(message.timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      
      return date.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    }
  }, [message.timestamp]);

  // Enhanced copy handler with feedback
  const handleCopy = useCallback(async () => {
    if (isCopied) return;
    
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      
      // Haptic feedback on mobile
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.warn('Copy failed:', error);
    }
  }, [message.content, isCopied]);

  // Enhanced message bubble animation
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.style.transform = 'translateY(20px)';
      messageRef.current.style.opacity = '0';
      
      requestAnimationFrame(() => {
        if (messageRef.current) {
          messageRef.current.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
          messageRef.current.style.transform = 'translateY(0)';
          messageRef.current.style.opacity = '1';
        }
      });
    }
  }, []);

  // Enhanced user avatar
  const UserAvatar = useMemo(() => (
    <div className="relative group flex-shrink-0">
      <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg border border-white/10 group-hover:shadow-indigo-500/30 transition-all duration-300">
        <svg className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      </div>
      
      {/* Active indicator */}
      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-900 shadow-sm animate-pulse" />
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 h-8 w-8 sm:h-9 sm:w-9 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 opacity-0 blur-lg group-hover:opacity-40 transition-all duration-300" />
    </div>
  ), []);

  // Enhanced AI avatar
  const AIAvatar = useMemo(() => (
    <div className="relative group flex-shrink-0">
      <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 flex items-center justify-center shadow-lg border border-white/10 group-hover:shadow-emerald-500/30 transition-all duration-300">
        <svg className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      
      {/* AI processing indicator */}
      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-blue-500 border-2 border-slate-900 shadow-sm">
        <div className="h-full w-full rounded-full bg-blue-400 animate-ping opacity-75" />
      </div>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 h-8 w-8 sm:h-9 sm:w-9 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 opacity-0 blur-lg group-hover:opacity-40 transition-all duration-300" />
    </div>
  ), []);

  // Enhanced message actions
  const MessageActions = useMemo(() => (
    <div className={`
      flex items-center gap-1 opacity-0 transition-all duration-200 
      ${isHovered ? 'opacity-100 translate-y-0' : 'translate-y-2'}
    `}>
      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-200 touch-manipulation group relative"
        title={isCopied ? 'Copied!' : 'Copy message'}
        disabled={isCopied}
      >
        {isCopied ? (
          <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
        
        {/* Tooltip */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          {isCopied ? 'Copied!' : 'Copy'}
        </div>
      </button>

      {/* More actions button */}
      <button
        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-200 touch-manipulation group"
        title="More options"
      >
        <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>
    </div>
  ), [isCopied, isHovered, handleCopy]);

  return (
    <div 
      ref={messageRef}
      className={`group relative px-4 sm:px-6 py-3 sm:py-4 transition-all duration-200 hover:bg-white/2 ${
        isUser ? 'ml-8 sm:ml-16' : 'mr-8 sm:mr-16'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        willChange: 'background-color, transform, opacity',
        contain: 'layout style'
      }}
    >
      <div className={`flex gap-3 sm:gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Enhanced Avatar */}
        <div className="flex-shrink-0 mt-1">
          {isUser ? UserAvatar : AIAvatar}
        </div>

        {/* Message Content Container */}
        <div className="flex-1 min-w-0 space-y-1 sm:space-y-2">
          {/* Message Header */}
          <div className={`flex items-center gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <span className="text-sm font-semibold text-white/90">
              {isUser ? 'You' : 'AgentCraft AI'}
            </span>
            <div className="flex items-center gap-1">
              {!isUser && (
                <div className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/30">
                  AI
                </div>
              )}
              <span className="text-xs text-white/50 font-mono">
                {formattedTime}
              </span>
            </div>
          </div>

          {/* Enhanced Message Bubble */}
          <div className={`relative group/bubble ${isUser ? 'flex justify-end' : 'flex justify-start'}`}>
            <div className={`
              relative max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl 
              px-4 py-3 sm:px-5 sm:py-4 rounded-2xl shadow-lg
              transition-all duration-300 hover:shadow-xl
              ${isUser 
                ? 'message-bubble-user bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white' 
                : 'message-bubble-ai bg-white/5 text-white border border-white/10 backdrop-blur-xl hover:bg-white/10 hover:border-white/20'
              }
            `}>
              {/* Message Text with enhanced typography */}
              <div 
                className="leading-relaxed"
                style={{ 
                  fontFamily: 'var(--font-family-sans)',
                  fontSize: '15px',
                  lineHeight: '1.5',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word'
                }}
              >
                {/* Enhanced message content rendering */}
                {message.content.split('\n').map((line, index, array) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < array.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>

              {/* Message status indicator for user messages */}
              {isUser && (
                <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-white/20 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-white/60" />
                </div>
              )}

              {/* AI processing animation for AI messages */}
              {!isUser && (
                <div className="absolute -bottom-1 -left-1 h-3 w-3 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Actions Bar */}
          <div className={`flex items-center gap-2 mt-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {MessageActions}
          </div>
        </div>
      </div>

      {/* Reaction bar (hidden for now, ready for future implementation) */}
      <div className={`
        absolute ${isUser ? 'right-20' : 'left-20'} -bottom-2 
        flex items-center gap-1 opacity-0 transition-all duration-200
        ${isHovered ? 'opacity-100 translate-y-0' : 'translate-y-2'}
      `}>
        {/* Quick reactions */}
        {['👍', '❤️', '😊', '🔥'].map((emoji, index) => (
          <button
            key={emoji}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-sm transition-all duration-200 hover:scale-110"
            style={{ animationDelay: `${index * 50}ms` }}
            title={`React with ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';

export default ChatMessage; 