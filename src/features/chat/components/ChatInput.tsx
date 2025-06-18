// Premium ChatInput component with modern styling and features
import React, { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../store/chat.store';
import { Button } from '../../../shared/ui';

export const ChatInput: React.FC = () => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, isLoading } = useChatStore();

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput('');
    setIsTyping(false);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Allow new line with Shift+Enter
        return;
      } else {
        e.preventDefault();
        handleSubmit(e);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  const canSend = input.trim().length > 0 && !isLoading;

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-end gap-3">
        {/* Input Container */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            disabled={isLoading}
            rows={1}
            className="w-full resize-none bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 pr-12 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />

          {/* Character Counter */}
          {input.length > 0 && (
            <div className="absolute bottom-2 right-12 text-xs text-slate-400 dark:text-slate-500">
              {input.length}
            </div>
          )}

          {/* Typing Indicator */}
          {isTyping && !isLoading && (
            <div className="absolute bottom-2 left-4 flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" />
                <div className="w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce delay-100" />
                <div className="w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce delay-200" />
              </div>
              <span>Typing...</span>
            </div>
          )}
        </div>

        {/* Send Button */}
        <div className="flex-shrink-0">
          <Button
            type="submit"
            variant={canSend ? "primary" : "secondary"}
            size="md"
            disabled={!canSend}
            isLoading={isLoading}
            className={`w-12 h-12 p-0 rounded-2xl transition-all duration-300 ${
              canSend 
                ? 'shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transform hover:scale-105' 
                : 'opacity-60'
            }`}
          >
            {isLoading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg 
                className={`w-5 h-5 transition-transform duration-200 ${canSend ? 'translate-x-0' : 'translate-x-0.5'}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center space-x-2">
          {/* Attachment Button */}
          <button
            type="button"
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200"
            title="Attach file"
            disabled={isLoading}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>

          {/* Voice Input Button */}
          <button
            type="button"
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200"
            title="Voice input"
            disabled={isLoading}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
        </div>

        {/* Word Count */}
        {input.trim().length > 0 && (
          <div className="text-xs text-slate-400 dark:text-slate-500">
            {input.trim().split(/\s+/).length} word{input.trim().split(/\s+/).length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </form>
  );
}; 