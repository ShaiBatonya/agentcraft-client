import React from 'react';
import { useMessages, useSelectedMessage } from '../store/chat.store';

interface ChatHeaderProps {
    onToggleSearch?: () => void;
    onToggleSettings?: () => void;
    onToggleCommands?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
    onToggleSearch,
    onToggleSettings,
    onToggleCommands
}) => {
    const messages = useMessages();
    const selectedMessageId = useSelectedMessage();

    return (
        <header className="flex-shrink-0 px-3 md:px-4 py-2.5 md:py-3 border-b border-white/10 bg-slate-900/95 backdrop-blur-sm">
            <div className="flex items-center justify-between w-full max-w-4xl mx-auto">
                {/* Thread Info */}
                <div className="flex-1 min-w-0">
                    <h1 className="text-sm md:text-base font-medium text-white truncate">
                        {selectedMessageId ? 'Active Chat' : 'New Conversation'}
                    </h1>
                    <p className="text-xs text-white/60">
                        {messages.length} message{messages.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    {/* Command Palette Button */}
                    <button
                        onClick={onToggleCommands}
                        className="p-1.5 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-200 touch-optimized focus-optimized"
                        aria-label="Open command palette"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </button>

                    {/* Search Button */}
                    <button
                        onClick={onToggleSearch}
                        className="p-1.5 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-200 touch-optimized focus-optimized"
                        aria-label="Search messages"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>

                    {/* Settings Button */}
                    <button
                        onClick={onToggleSettings}
                        className="p-1.5 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-200 touch-optimized focus-optimized"
                        aria-label="Chat settings"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
}; 