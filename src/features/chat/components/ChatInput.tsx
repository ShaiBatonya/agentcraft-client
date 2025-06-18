// Ultra-Premium ChatInput with cinematic effects and immersive design
import React, { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../store/chat.store';

export const ChatInput: React.FC = () => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
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

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement voice recording
  };

  const canSend = input.trim().length > 0 && !isLoading;
  const wordCount = input.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        {/* Ultra-Premium Input Container */}
        <div className={`relative transition-all duration-500 rounded-3xl overflow-hidden ${
          isFocused 
            ? 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-white/20 dark:border-slate-700/50 shadow-xl shadow-slate-900/5 dark:shadow-slate-900/20 scale-[1.02]' 
            : 'bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 shadow-lg shadow-slate-900/5 dark:shadow-slate-900/10'
        }`}>
          
          {/* Neural Network Background Effect */}
          {isFocused && (
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 shimmer" />
            </div>
          )}

          <div className="relative flex items-end gap-4 p-4">
            {/* Attachment Button */}
            <button
              type="button"
              className={`flex-shrink-0 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all duration-300 tilt-hover ${
                isFocused ? 'scale-110' : ''
              }`}
              title="Attach file"
              disabled={isLoading}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>

            {/* Input Field Container */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="Ask me anything..."
                disabled={isLoading}
                rows={1}
                className="w-full resize-none bg-transparent border-0 px-4 py-3 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />

              {/* Floating Label Effect */}
              {input && (
                <div className="absolute top-1 left-4 text-xs text-slate-500 dark:text-slate-400 animate-fade-in">
                  Message
                </div>
              )}

              {/* Character Counter */}
              {input.length > 0 && (
                <div className={`absolute bottom-2 right-4 text-xs transition-all duration-300 ${
                  input.length > 100 ? 'text-orange-500' : 'text-slate-400 dark:text-slate-500'
                }`}>
                  {input.length}
                </div>
              )}
            </div>

            {/* Voice Recording Button */}
            <button
              type="button"
              onClick={toggleRecording}
              className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-2xl transition-all duration-300 tilt-hover ${
                isRecording 
                  ? 'bg-red-500 text-white shadow-lg animate-pulse' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              } ${isFocused ? 'scale-110' : ''}`}
              title={isRecording ? 'Stop recording' : 'Voice input'}
              disabled={isLoading}
            >
              {isRecording ? (
                <div className="w-3 h-3 bg-white rounded-sm animate-pulse" />
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>

            {/* Ultra-Premium Send Button */}
            <div className="flex-shrink-0">
              <button
                type="submit"
                disabled={!canSend}
                className={`relative w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-500 transform ${
                  canSend 
                    ? 'btn-ultra-primary shadow-lg glow-pulse hover:scale-110 active:scale-95' 
                    : 'bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 text-slate-400 cursor-not-allowed opacity-60'
                } ${isFocused && canSend ? 'animate-bounce-gentle' : ''}`}
              >
                {/* Background Glow */}
                {canSend && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl opacity-20 blur-xl animate-pulse" />
                )}

                {/* Button Content */}
                <div className="relative z-10">
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg 
                      className={`w-5 h-5 transition-all duration-300 ${
                        canSend ? 'text-white translate-x-0' : 'translate-x-0.5'
                      }`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </div>

                {/* Send Animation Ring */}
                {canSend && !isLoading && (
                  <div className="absolute inset-0 border-2 border-white/30 rounded-2xl animate-ping opacity-0 hover:opacity-100 transition-opacity duration-300" />
                )}
              </button>
            </div>
          </div>

          {/* Typing Indicator */}
          {isTyping && !isLoading && (
            <div className="px-6 pb-3">
              <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                <div className="typing-indicator">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
                <span>Composing message...</span>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Helper Bar */}
        <div className="flex items-center justify-between mt-4 px-2">
          <div className="flex items-center space-x-6 text-xs text-slate-500 dark:text-slate-400">
            {/* Keyboard Shortcuts */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-xs font-mono">⏎</kbd>
              <span>Send</span>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-xs font-mono">⇧⏎</kbd>
              <span>New line</span>
            </div>
            
            {/* AI Status */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span>AI ready</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
            {/* Word Count */}
            {input.trim().length > 0 && (
              <div className="flex items-center gap-1">
                <span>{wordCount} word{wordCount !== 1 ? 's' : ''}</span>
              </div>
            )}

            {/* AI Thinking Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <div className="typing-indicator">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
                <span>AI is thinking...</span>
              </div>
            )}

            {/* Model Info */}
            <div className="flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity duration-300">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>GPT-4</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}; 