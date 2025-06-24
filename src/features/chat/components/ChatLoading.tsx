import { LoadingSpinner } from '@/components/ui';
import React from 'react';

interface ChatLoadingProps {
    className?: string;
    type?: 'initial' | 'thinking';
}

export const ChatLoading: React.FC<ChatLoadingProps> = ({ className = '', type = 'initial' }) => {
    if (type === 'thinking') {
        return (
            <div className={`flex items-center justify-center py-2 ${className}`}>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg backdrop-blur-sm">
                    <LoadingSpinner size="sm" />
                    <span className="text-white/70 text-sm">AI is thinking...</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex items-center justify-center h-full ${className}`}>
            <div className="text-center space-y-4">
                {/* Loading Icon */}
                <div className="relative w-16 h-16 mx-auto">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-500 to-purple-600 animate-pulse" />
                    <div className="absolute inset-0.5 rounded-2xl bg-slate-900 flex items-center justify-center">
                        <LoadingSpinner size="lg" />
                    </div>
                </div>

                {/* Loading Text */}
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">
                        Loading Chat
                    </h3>
                    <p className="text-sm text-white/70">
                        Preparing your conversation...
                    </p>
                </div>

                {/* Loading Progress */}
                <div className="max-w-xs mx-auto space-y-2">
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-accent-500 to-purple-600 w-3/4 rounded-full animate-loading-bar" />
                    </div>
                    <div className="flex justify-between text-xs text-white/50">
                        <span>Loading messages</span>
                        <span>75%</span>
                    </div>
                </div>

                {/* Loading Animation */}
                <div className="flex items-center justify-center gap-1">
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        </div>
    );
}; 