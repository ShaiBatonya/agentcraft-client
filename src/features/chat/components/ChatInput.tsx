// Ultra-Premium ChatInput with cinematic effects and immersive design
import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useSelectedThreadId, useLoading } from '@/stores/chat.store';
import { useSendMessage } from '../hooks/useMessages';
import { useCreateThread } from '../hooks/useThreads';
import { useAuthStore } from '@/stores/auth.store';

const MAX_MESSAGE_LENGTH = 4000;
const TEXTAREA_MIN_HEIGHT = 44;
const TEXTAREA_MAX_HEIGHT = 160;

const ChatInput: React.FC = React.memo(() => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Store hooks
  const selectedThreadId = useSelectedThreadId();
  const loading = useLoading();
  const { isAuthenticated, user } = useAuthStore();
  
  // Action hooks
  const sendMessage = useSendMessage();
  const createThread = useCreateThread();

  // Enhanced auto-resize with smooth transitions
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to measure content
    textarea.style.height = `${TEXTAREA_MIN_HEIGHT}px`;
    
    const scrollHeight = textarea.scrollHeight;
    const newHeight = Math.min(Math.max(scrollHeight, TEXTAREA_MIN_HEIGHT), TEXTAREA_MAX_HEIGHT);
    
    // Smooth height transition
    textarea.style.height = `${newHeight}px`;
  }, []);

  // Optimized input handler with debouncing
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    if (value.length <= MAX_MESSAGE_LENGTH) {
      setInput(value);
      
      // Clear any previous errors
      if (error) {
        setError(null);
      }
      
      // Adjust height after state update
      requestAnimationFrame(() => {
        adjustTextareaHeight();
      });
    }
  }, [adjustTextareaHeight, error]);

  // Enhanced form submission with better UX
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedInput = input.trim();
    if (!trimmedInput || loading || !isAuthenticated || isComposing) return;

    try {
      setError(null);
      console.log('ChatInput handleSubmit:', { selectedThreadId, trimmedInput });
      
      // CRITICAL FIX: Ensure we have a valid thread ID
      let threadId = selectedThreadId;
      if (!threadId) {
        console.log('🔧 No thread selected, creating new thread...');
        const newThread = await createThread();
        console.log('✅ New thread created:', newThread);
        threadId = newThread._id;
        console.log('🎯 Using new thread ID:', threadId);
      } else {
        console.log('🎯 Using existing selected thread ID:', threadId);
      }
      
      // Double-check we have a valid thread ID
      if (!threadId) {
        throw new Error('❌ Failed to get valid thread ID');
      }
      
      console.log('📤 About to send message with threadId:', threadId);
      
      // Optimistic UI update
      setInput('');
      
      // Reset textarea height immediately
      if (textareaRef.current) {
        textareaRef.current.style.height = `${TEXTAREA_MIN_HEIGHT}px`;
      }
      
      // Send message
      await sendMessage(threadId, trimmedInput);
      
      // Focus back to input for continuous typing
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
      
      // Restore input on error
      setInput(trimmedInput);
      requestAnimationFrame(() => {
        adjustTextareaHeight();
      });
    }
  }, [input, loading, isAuthenticated, isComposing, selectedThreadId, sendMessage, createThread, adjustTextareaHeight]);

  // Enhanced keyboard handler with more shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Allow new line with Shift+Enter
        return;
      } else {
        // Send message with Enter
        e.preventDefault();
        handleSubmit(e);
      }
    } else if (e.key === 'Escape') {
      // Clear input with Escape
      if (input.trim()) {
        setInput('');
        if (textareaRef.current) {
          textareaRef.current.style.height = `${TEXTAREA_MIN_HEIGHT}px`;
        }
      }
    }
  }, [handleSubmit, input]);

  // Composition handling for better IME support
  const handleCompositionStart = useCallback(() => {
    setIsComposing(true);
  }, []);

  const handleCompositionEnd = useCallback(() => {
    setIsComposing(false);
  }, []);

  // Focus management
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  // Initialize height on mount
  useEffect(() => {
    adjustTextareaHeight();
  }, [adjustTextareaHeight]);

  // Memoized validation states
  const canSend = useMemo(() => 
    input.trim().length > 0 && !loading && isAuthenticated && !isComposing,
    [input, loading, isAuthenticated, isComposing]
  );

  const isNearLimit = useMemo(() => 
    input.length > MAX_MESSAGE_LENGTH * 0.85,
    [input.length]
  );

  const characterCount = useMemo(() => 
    input.length,
    [input.length]
  );

  // Enhanced send button with better states
  const SendButton = useMemo(() => (
    <div className="relative">
      <button
        type="submit"
        disabled={!canSend}
        className={`
          relative group flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl 
          transition-all duration-300 touch-manipulation overflow-hidden
          ${canSend 
            ? 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95' 
            : 'bg-white/5 text-white/40 cursor-not-allowed border border-white/10'
          }
        `}
        aria-label={loading ? 'Sending...' : 'Send message'}
      >
        {/* Background gradient glow effect */}
        {canSend && (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300" />
        )}
        
        {/* Button content */}
        <div className="relative z-10">
          {loading ? (
            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg 
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${canSend ? 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </div>
      </button>
    </div>
  ), [canSend, loading]);

  // Enhanced attachment button (for future features)
  const AttachmentButton = useMemo(() => (
    <button
      type="button"
      className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-300 touch-manipulation group border border-transparent hover:border-white/10"
      aria-label="Attach file"
      disabled // Disabled for now, ready for future implementation
    >
      <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
      </svg>
    </button>
  ), []);

  return (
    <div className="relative w-full">
      {/* Enhanced error banner */}
      {error && (
        <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-2xl backdrop-blur-xl animate-fade-in-down">
          <div className="flex items-center gap-3">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-red-400 text-sm flex-1">{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300 transition-colors"
              aria-label="Dismiss error"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative">
        {/* Main input container with enhanced glass morphism - Mobile optimized */}
        <div className={`
          relative flex items-end gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4 md:p-5 rounded-2xl sm:rounded-3xl 
          border transition-all duration-300 backdrop-blur-xl
          ${isFocused || input.trim()
            ? 'bg-white/8 border-white/20 shadow-xl' 
            : 'bg-white/5 border-white/10 shadow-lg'
          }
          ${!isAuthenticated ? 'opacity-60' : ''}
        `}>
          {/* Character count indicator - Mobile optimized */}
          {(isNearLimit || isFocused) && (
            <div className="absolute -top-6 sm:-top-8 right-3 sm:right-4 text-xs text-white/60 animate-fade-in-down">
              <span className={characterCount > MAX_MESSAGE_LENGTH * 0.95 ? 'text-red-400' : 'text-white/60'}>
                {characterCount}/{MAX_MESSAGE_LENGTH}
              </span>
            </div>
          )}

          {/* User avatar - Mobile responsive */}
          <div className="flex-shrink-0 self-end mb-0.5 sm:mb-1">
            <div className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg border border-white/10">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="h-full w-full rounded-2xl object-cover"
                />
              ) : (
                <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4.5 md:w-4.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>

          {/* Enhanced textarea container - Mobile optimized */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              placeholder={
                !isAuthenticated 
                  ? "Please log in to send messages..." 
                  : selectedThreadId
                    ? "Type your message here..."
                    : "Start a new conversation..."
              }
              disabled={!isAuthenticated || loading}
              className={`
                w-full resize-none bg-transparent text-white placeholder-white/40 
                focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed 
                text-sm sm:text-base leading-relaxed transition-all duration-200
                ${isFocused ? 'placeholder-white/60' : ''}
              `}
              style={{ 
                minHeight: `${TEXTAREA_MIN_HEIGHT}px`,
                maxHeight: `${TEXTAREA_MAX_HEIGHT}px`,
                fontSize: '16px', // Prevent zoom on iOS
                fontFamily: 'var(--font-family-sans)',
                lineHeight: '1.5'
              }}
              rows={1}
              maxLength={MAX_MESSAGE_LENGTH}
              aria-label="Message input"
              autoComplete="off"
              autoCorrect="on"
              autoCapitalize="sentences"
              spellCheck="true"
            />

            {/* Enhanced typing indicator placeholder */}
            {!input && isFocused && (
              <div className="absolute inset-0 flex items-end pb-2 sm:pb-3 pointer-events-none">
                <div className="flex items-center gap-1 text-white/30">
                  <div className="w-1 h-1 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1 h-1 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1 h-1 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Action buttons container - Mobile optimized */}
          <div className="flex items-end gap-1.5 sm:gap-2 self-end mb-0.5 sm:mb-1">
            {/* Attachment button (for future) - Mobile responsive */}
            {input.trim() === '' && isAuthenticated && (
              <div className="animate-fade-in-right">
                {AttachmentButton}
              </div>
            )}
            
            {/* Send button - Mobile optimized */}
            <div className={input.trim() ? 'animate-fade-in-right' : ''}>
              {SendButton}
            </div>
          </div>
        </div>

        {/* Enhanced helper text - Mobile responsive */}
        <div className="mt-2 sm:mt-3 px-3 sm:px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 text-xs">
          <div className="flex items-center gap-4">
            {!isAuthenticated ? (
              <span className="text-white/50">Please log in to start chatting</span>
            ) : loading ? (
              <div className="flex items-center gap-2 text-white/60">
                <div className="w-1 h-1 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1 h-1 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1 h-1 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span>AI is thinking...</span>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-white/50">
                <span>
                  Press <kbd className="px-1.5 py-0.5 text-xs bg-white/10 rounded border border-white/20">Enter</kbd> to send
                </span>
                <span className="hidden sm:inline">•</span>
                <span>
                  <kbd className="px-1.5 py-0.5 text-xs bg-white/10 rounded border border-white/20">Shift+Enter</kbd> for new line
                </span>
              </div>
            )}
          </div>

          {/* Thread status and AI indicator - Mobile responsive */}
          {isAuthenticated && (
            <div className="flex items-center gap-3 text-white/50 self-start sm:self-auto">
              {selectedThreadId && (
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                  <span>Thread Active</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>AI Online</span>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
});

ChatInput.displayName = 'ChatInput';

export { ChatInput }; 