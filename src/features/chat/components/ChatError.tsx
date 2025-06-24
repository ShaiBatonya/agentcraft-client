import React from 'react';
import { useChatError, useClearError } from '../store/chat.store';

interface ChatErrorProps {
    className?: string;
}

export const ChatError: React.FC<ChatErrorProps> = ({ className = '' }) => {
    const error = useChatError();
    const clearError = useClearError();

    if (!error) return null;

    return (
        <div
            className={`bg-red-500/10 border border-red-500/20 rounded-lg mx-3 sm:mx-4 mt-3 sm:mt-4 p-3 sm:p-4 animate-in slide-in-from-top-2 fade-in duration-300 ${className}`}
            role="alert"
            aria-live="polite"
        >
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-red-400 font-medium truncate">
                            {error}
                        </p>
                        <p className="text-xs text-red-400/70 mt-0.5">
                            Please try again or check your connection
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                        onClick={() => clearError()}
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
                        aria-label="Dismiss error"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <button
                        onClick={() => {
                            clearError();
                            // You can add retry logic here if needed
                        }}
                        className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-lg transition-colors duration-200 text-sm font-medium"
                    >
                        Retry
                    </button>
                </div>
            </div>
        </div>
    );
}; 