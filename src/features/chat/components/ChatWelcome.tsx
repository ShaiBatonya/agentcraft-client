import { useAuthStore } from '@/stores/auth.store';
import React from 'react';

interface ChatWelcomeProps {
    className?: string;
}

export const ChatWelcome: React.FC<ChatWelcomeProps> = ({ className = '' }) => {
    const { isAuthenticated } = useAuthStore();

    return (
        <div className={`flex-1 flex items-center justify-center p-6 sm:p-8 ${className}`}>
            <div className="text-center max-w-md mx-auto animate-in fade-in duration-700">
                {/* Welcome Icon */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent-500 to-purple-600 flex items-center justify-center shadow-xl animate-float">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                    </svg>
                </div>

                {/* Welcome Text */}
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                    Welcome to AgentCraft
                </h3>
                <p className="text-white/70 mb-6 text-sm sm:text-base leading-relaxed">
                    Start a conversation with our AI assistant! Ask anything, get instant intelligent responses.
                </p>

                {/* Example Prompts */}
                <div className="space-y-2 mb-6">
                    <p className="text-sm text-white/60">Try asking about:</p>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                        <button className="glass-card-subtle p-3 hover:scale-105 transition-all duration-200 cursor-pointer text-left">
                            <span className="text-white/70">
                                "What are the latest AI trends?"
                            </span>
                        </button>
                        <button className="glass-card-subtle p-3 hover:scale-105 transition-all duration-200 cursor-pointer text-left">
                            <span className="text-white/70">
                                "Help me write a creative story"
                            </span>
                        </button>
                        <button className="glass-card-subtle p-3 hover:scale-105 transition-all duration-200 cursor-pointer text-left">
                            <span className="text-white/70">
                                "Explain quantum computing in simple terms"
                            </span>
                        </button>
                    </div>
                </div>

                {/* Status Info */}
                {isAuthenticated ? (
                    <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-white/60">
                        <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span>Your conversations are saved for 7 days</span>
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-white/60">
                        <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span>Sign in to save your conversations</span>
                    </div>
                )}

                {/* Keyboard Shortcuts */}
                <div className="mt-6 text-xs text-white/50">
                    <p>Keyboard shortcuts:</p>
                    <div className="flex items-center justify-center gap-4 mt-2">
                        <div>
                            <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/20">⌘</kbd>
                            <span className="mx-1">+</span>
                            <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/20">K</kbd>
                            <span className="ml-2">to search</span>
                        </div>
                        <div>
                            <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/20">⌘</kbd>
                            <span className="mx-1">+</span>
                            <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/20">/</kbd>
                            <span className="ml-2">for commands</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 