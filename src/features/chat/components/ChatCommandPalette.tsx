import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useChatStore } from '../store/chat.store';

interface ChatCommandPaletteProps {
    onClose: () => void;
}

type Command = {
    id: string;
    name: string;
    description: string;
    shortcut?: string;
    icon: React.ReactNode;
    action: () => void;
};

export const ChatCommandPalette: React.FC<ChatCommandPaletteProps> = ({ onClose }) => {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const clearChat = useChatStore(state => state.clearChat);
    const clearMessages = useChatStore(state => state.clearMessages);
    const exportChat = useChatStore(state => state.exportChat);

    const commands: Command[] = [
        {
            id: 'clear-chat',
            name: 'Clear Chat',
            description: 'Clear all messages in the current chat',
            shortcut: '⌘+⇧+K',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            ),
            action: () => {
                clearChat();
                onClose();
            }
        },
        {
            id: 'clear-messages',
            name: 'Clear Messages',
            description: 'Clear only visible messages',
            shortcut: '⌘+K',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            ),
            action: () => {
                clearMessages();
                onClose();
            }
        },
        {
            id: 'export-chat',
            name: 'Export Chat',
            description: 'Export chat history as JSON',
            shortcut: '⌘+E',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            action: () => {
                const data = exportChat('json');
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `chat-export-${new Date().toISOString()}.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                onClose();
            }
        },
    ];

    // Filter commands based on search query
    const filteredCommands = commands.filter(command => {
        const searchString = `${command.name} ${command.description}`.toLowerCase();
        return searchString.includes(query.toLowerCase());
    });

    // Handle keyboard navigation
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            filteredCommands[selectedIndex]?.action();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            onClose();
        }
    }, [filteredCommands, selectedIndex, onClose]);

    // Focus input on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Add keyboard event listeners
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Scroll selected item into view
    useEffect(() => {
        const selectedElement = listRef.current?.children[selectedIndex] as HTMLElement;
        if (selectedElement) {
            selectedElement.scrollIntoView({
                block: 'nearest',
                behavior: 'smooth'
            });
        }
    }, [selectedIndex]);

    return (
        <div className="w-full max-w-xl bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl">
            {/* Search Input */}
            <div className="p-4 border-b border-white/10">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setSelectedIndex(0);
                        }}
                        placeholder="Type a command or search..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                    />
                </div>
            </div>

            {/* Commands List */}
            <div
                ref={listRef}
                className="max-h-96 overflow-y-auto"
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent'
                }}
            >
                {filteredCommands.map((command, index) => (
                    <button
                        key={command.id}
                        onClick={() => command.action()}
                        className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${index === selectedIndex
                            ? 'bg-white/10 text-white'
                            : 'text-white/70 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <div className="flex-shrink-0 text-white/60">
                            {command.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{command.name}</span>
                                {command.shortcut && (
                                    <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-xs bg-white/10 rounded border border-white/20">
                                        {command.shortcut}
                                    </kbd>
                                )}
                            </div>
                            <p className="text-sm text-white/50 truncate">
                                {command.description}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}; 