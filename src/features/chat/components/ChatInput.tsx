// Ultra-Premium ChatInput with cinematic effects and immersive design
import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { 
  useSendMessage, 
  useChatLoading, 
  useChatError 
} from '../store/chat.store';
import { useAuthStore } from '@/stores/auth.store';
import { LoadingSpinner } from '@/components/ui';

const MAX_MESSAGE_LENGTH = 4000;
const TEXTAREA_MIN_HEIGHT = 56;
const TEXTAREA_MAX_HEIGHT = 200;

export const ChatInput: React.FC = () => {
  const [input, setInput] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sendMessage = useSendMessage();
  const isLoading = useChatLoading();
  const error = useChatError();
  const { isAuthenticated } = useAuthStore();

  // Auto-resize textarea
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const scrollHeight = textarea.scrollHeight;
    const newHeight = Math.min(Math.max(scrollHeight, TEXTAREA_MIN_HEIGHT), TEXTAREA_MAX_HEIGHT);
    textarea.style.height = `${newHeight}px`;
  }, []);

  // Handle input changes with auto-resize
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    // Limit character count
    if (value.length <= MAX_MESSAGE_LENGTH) {
      setInput(value);
    }
    
    // Auto-resize
    setTimeout(adjustTextareaHeight, 0);
  }, [adjustTextareaHeight]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading || !isAuthenticated) return;

    try {
      await sendMessage(trimmedInput);
      setInput('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = `${TEXTAREA_MIN_HEIGHT}px`;
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [input, isLoading, isAuthenticated, sendMessage]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Don't handle shortcuts while composing (for IME inputs)
    if (isComposing) return;

         if (e.key === 'Enter' && !e.shiftKey) {
       e.preventDefault();
       handleSubmit(e);
     }
     
     // Ctrl/Cmd + Enter for send
     if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
       e.preventDefault();
       handleSubmit(e);
     }
  }, [isComposing, handleSubmit]);

  // Composition event handlers for IME support
  const handleCompositionStart = useCallback(() => {
    setIsComposing(true);
  }, []);

  const handleCompositionEnd = useCallback(() => {
    setIsComposing(false);
  }, []);

  // Auto-resize on mount and when content changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [adjustTextareaHeight]);

  // Character count and validation
  const characterCount = input.length;
  const isOverLimit = characterCount > MAX_MESSAGE_LENGTH;
  const isNearLimit = characterCount > MAX_MESSAGE_LENGTH * 0.8;

  // Button state
  const canSend = useMemo(() => {
    return input.trim().length > 0 && 
           !isLoading && 
           !isOverLimit && 
           isAuthenticated;
  }, [input, isLoading, isOverLimit, isAuthenticated]);

  // Status message
  const getStatusMessage = useCallback(() => {
    if (!isAuthenticated) {
      return 'Please log in to send messages';
    }
    if (error) {
      return 'Failed to send message. Please try again.';
    }
    if (isLoading) {
      return 'Sending your message...';
    }
    if (isOverLimit) {
      return `Message too long. Please reduce by ${characterCount - MAX_MESSAGE_LENGTH} characters.`;
    }
    return null;
  }, [isAuthenticated, error, isLoading, isOverLimit, characterCount]);

  const statusMessage = getStatusMessage();

  return (
    <div className="w-full space-y-3">
      {/* Main Input Container */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-end gap-3">
          {/* Textarea Container */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              placeholder={
                !isAuthenticated 
                  ? "Please log in to send messages..." 
                  : "Type your message here..."
              }
              disabled={!isAuthenticated || isLoading}
              className={`
                w-full resize-none rounded-2xl border transition-all duration-200 focus-ring
                bg-white/5 border-white/10 text-white placeholder-white/50
                px-4 py-3 pr-12
                focus:bg-white/8 focus:border-white/20
                disabled:opacity-50 disabled:cursor-not-allowed
                ${isOverLimit ? 'border-red-400 focus:border-red-400' : ''}
                ${error ? 'border-red-400/50' : ''}
              `}
              style={{ 
                minHeight: TEXTAREA_MIN_HEIGHT,
                maxHeight: TEXTAREA_MAX_HEIGHT,
                fontSize: '16px', // Prevent zoom on iOS
                lineHeight: '1.5'
              }}
              rows={1}
              aria-label="Message input"
              aria-describedby="character-count status-message"
            />

            {/* Character Count */}
            <div 
              id="character-count"
              className={`
                absolute bottom-2 right-2 text-xs font-mono
                transition-colors duration-200
                ${isOverLimit ? 'text-red-400' : isNearLimit ? 'text-yellow-400' : 'text-white/40'}
              `}
            >
              {characterCount}/{MAX_MESSAGE_LENGTH}
            </div>
          </div>

          {/* Send Button */}
          <div className="flex-shrink-0">
            <button
              type="submit"
              disabled={!canSend}
              className={`
                relative inline-flex items-center justify-center
                w-12 h-12 rounded-2xl transition-all duration-200 focus-ring
                ${canSend 
                  ? 'btn-primary hover:scale-105 active:scale-95' 
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
                }
              `}
              aria-label={isLoading ? 'Sending message' : 'Send message'}
            >
              {isLoading ? (
                <LoadingSpinner size="sm" variant="white" />
              ) : (
                <svg 
                  className={`w-5 h-5 transition-transform duration-200 ${canSend ? 'translate-x-0.5' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div 
            id="status-message"
            className={`
              mt-2 text-xs animate-in slide-in-from-bottom-2
              ${isOverLimit || error ? 'error-text' : 'text-white/60'}
            `}
          >
            {statusMessage}
          </div>
        )}
      </form>

      {/* Quick Actions Bar */}
      {isAuthenticated && !isLoading && (
        <div className="flex items-center justify-between">
          {/* Quick Prompts */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-xs text-white/40 whitespace-nowrap">Quick:</span>
            {[
              { text: 'Explain', icon: '💡' },
              { text: 'Summarize', icon: '📝' },
              { text: 'Help me', icon: '🤝' },
              { text: 'Code', icon: '💻' }
            ].map((prompt) => (
              <button
                key={prompt.text}
                onClick={() => setInput(`${prompt.text} `)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 transition-colors whitespace-nowrap"
                disabled={isLoading}
              >
                <span>{prompt.icon}</span>
                <span>{prompt.text}</span>
              </button>
            ))}
          </div>

          {/* Additional Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Voice Input (Future feature) */}
            <button
              className="p-2 text-white/40 hover:text-white/60 transition-colors disabled:opacity-50"
              title="Voice input (coming soon)"
              disabled
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>

            {/* File Upload (Future feature) */}
            <button
              className="p-2 text-white/40 hover:text-white/60 transition-colors disabled:opacity-50"
              title="File upload (coming soon)"
              disabled
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Helper */}
      <div className="sm:hidden text-center">
        <p className="text-xs text-white/40">
          {isAuthenticated ? 'Tap send button or press Enter to send' : 'Please log in to continue'}
        </p>
      </div>
    </div>
  );
}; 