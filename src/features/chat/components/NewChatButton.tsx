import React, { memo } from 'react';

interface NewChatButtonProps {
  onNewChat: () => void;
  className?: string;
}

const NewChatButton: React.FC<NewChatButtonProps> = memo(({ onNewChat, className = '' }) => {
  return (
    <button
      onClick={onNewChat}
      className={`
        w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg
        bg-indigo-600 hover:bg-indigo-500 
        text-white font-medium text-sm
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-indigo-400
        ${className}
      `}
      type="button"
      aria-label="Start a new chat conversation"
    >
      <svg 
        width="18" 
        height="18" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      <span>New Chat</span>
    </button>
  );
});

NewChatButton.displayName = 'NewChatButton';

export default NewChatButton; 