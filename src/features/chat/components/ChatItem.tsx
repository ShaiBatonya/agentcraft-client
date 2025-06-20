import React, { useState, useCallback, useMemo } from 'react';
import { ChatThread } from '@/features/chat/hooks/useChatThreads';
import { useSetActiveThread, useDeleteThread } from '@/features/chat/hooks/useChatThreads';

interface ChatItemProps {
  thread: ChatThread;
  isActive: boolean;
  className?: string;
}

const ChatItem: React.FC<ChatItemProps> = React.memo(({ 
  thread, 
  isActive, 
  className = '' 
}) => {
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const setActiveThread = useSetActiveThread();
  const deleteThread = useDeleteThread();

  // Memoize date formatting to prevent recalculation
  const formattedDate = useMemo(() => {
    const now = new Date();
    const messageDate = new Date(thread.updatedAt);
    const diffInHours = Math.abs(now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // Less than a week
      return messageDate.toLocaleDateString([], { weekday: 'short' });
    } else {
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  }, [thread.updatedAt]);

  // Memoize last message preview
  const lastMessagePreview = useMemo(() => {
    if (thread.messages.length === 0) return 'No messages yet';
    const lastMessage = thread.messages[thread.messages.length - 1];
    const content = lastMessage.content.trim();
    return content.length > 60 ? content.slice(0, 60) + '...' : content;
  }, [thread.messages]);

  // Memoize message count
  const messageCount = useMemo(() => thread.messages.length, [thread.messages.length]);

  const handleClick = useCallback(() => {
    setActiveThread(thread.id);
  }, [setActiveThread, thread.id]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the thread selection
    
    if (window.confirm(`Are you sure you want to delete "${thread.title}"?`)) {
      deleteThread(thread.id);
    }
  }, [deleteThread, thread.id, thread.title]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  const handleMouseEnter = useCallback(() => setShowDeleteButton(true), []);
  const handleMouseLeave = useCallback(() => setShowDeleteButton(false), []);

  return (
    <div
      className={`
        group relative flex flex-col p-3 mb-2 rounded-lg cursor-pointer
        transition-colors duration-200
        ${isActive 
          ? 'bg-indigo-600/20 border border-indigo-500/30' 
          : 'bg-slate-800/50 hover:bg-slate-800 border border-transparent hover:border-slate-700'
        }
        focus-within:ring-2 focus-within:ring-indigo-400
        ${className}
      `}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Switch to conversation: ${thread.title}`}
      aria-pressed={isActive}
    >
      {/* Header with title and actions */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className={`
          font-medium text-sm truncate flex-1
          ${isActive ? 'text-white' : 'text-gray-200'}
          group-hover:text-white transition-colors duration-200
        `}>
          {thread.title}
        </h3>
        
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Date */}
          <time 
            className={`
              text-xs whitespace-nowrap
              ${isActive ? 'text-indigo-200' : 'text-gray-400'}
              group-hover:text-gray-300 transition-colors duration-200
            `}
            dateTime={thread.updatedAt.toISOString()}
            title={new Date(thread.updatedAt).toLocaleString()}
          >
            {formattedDate}
          </time>
          
          {/* Delete button */}
          <button
            onClick={handleDelete}
            className={`
              ml-1 p-1 rounded transition-colors duration-200
              hover:bg-red-500/20 hover:text-red-400
              text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400
              ${showDeleteButton || isActive ? 'opacity-100' : 'opacity-0'}
            `}
            aria-label={`Delete conversation: ${thread.title}`}
            type="button"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
              />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Last message preview */}
      <p className={`
        text-xs mb-2
        ${isActive ? 'text-indigo-100/80' : 'text-gray-400'}
        group-hover:text-gray-300 transition-colors duration-200
        line-clamp-2
      `}>
        {lastMessagePreview}
      </p>
      
      {/* Message count indicator */}
      {messageCount > 0 && (
        <div className="flex items-center gap-2">
          <div className={`
            w-1.5 h-1.5 rounded-full
            ${isActive ? 'bg-indigo-400' : 'bg-gray-500'}
            group-hover:bg-indigo-500 transition-colors duration-200
          `} />
          <span className={`
            text-xs
            ${isActive ? 'text-indigo-200' : 'text-gray-500'}
            group-hover:text-gray-400 transition-colors duration-200
          `}>
            {messageCount} message{messageCount !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
});

ChatItem.displayName = 'ChatItem';

export default ChatItem; 