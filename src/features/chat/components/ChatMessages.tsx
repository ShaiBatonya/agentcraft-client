import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useChatLoading, useFilteredMessages, useMessages, useSearchQuery } from '../store/chat.store';
import { ChatLoading } from './ChatLoading';
import ChatMessage from './ChatMessage';
import { ChatWelcome } from './ChatWelcome';

interface ChatMessagesProps {
    className?: string;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ className = '' }) => {
    const messages = useMessages();
    const filteredMessages = useFilteredMessages();
    const searchQuery = useSearchQuery();
    const isLoading = useChatLoading();

    // Local state for scroll behavior
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
    const [isUserScrolling, setIsUserScrolling] = useState(false);
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);

    // Refs for scroll management
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Determine which messages to display
    const displayMessages = searchQuery.trim() && filteredMessages.length > 0
        ? filteredMessages
        : messages.filter(msg => !msg.deleted);

    // Smooth scroll to bottom
    const scrollToBottom = useCallback((smooth = true) => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({
                behavior: smooth ? 'smooth' : 'auto',
                block: 'end'
            });
        }
    }, []);

    // Enhanced scroll detection with throttling
    const handleScroll = useCallback(() => {
        if (!scrollContainerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

        setShowScrollToBottom(!isNearBottom && displayMessages.length > 0);
        setShouldAutoScroll(isNearBottom);

        // Detect if user is actively scrolling
        setIsUserScrolling(true);
        const timeoutId = setTimeout(() => setIsUserScrolling(false), 1000);

        return () => clearTimeout(timeoutId);
    }, [displayMessages.length]);

    // Auto-scroll when new messages arrive
    useEffect(() => {
        if (shouldAutoScroll && !isUserScrolling && displayMessages.length > 0 && !searchQuery.trim()) {
            const timeoutId = setTimeout(() => scrollToBottom(true), 100);
            return () => clearTimeout(timeoutId);
        }
    }, [displayMessages.length, shouldAutoScroll, isUserScrolling, scrollToBottom, searchQuery]);

    // Initial scroll to bottom
    useEffect(() => {
        if (displayMessages.length > 0 && !searchQuery.trim()) {
            scrollToBottom(false);
        }
    }, [scrollToBottom, searchQuery]);

    // Loading state
    if (isLoading && displayMessages.length === 0) {
        return <ChatLoading type="initial" />;
    }

    // Empty state
    if (displayMessages.length === 0) {
        if (searchQuery.trim()) {
            return (
                <div className="flex items-center justify-center h-full p-4 text-center">
                    <div className="max-w-md space-y-4">
                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
                            <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white">No Results Found</h3>
                        <p className="text-white/70">
                            No messages match your search criteria. Try different keywords or adjust your filters.
                        </p>
                    </div>
                </div>
            );
        }
        return <ChatWelcome />;
    }

    return (
        <div className={`relative flex-1 min-h-0 ${className}`}>
            {/* Search Results Banner */}
            {searchQuery.trim() && (
                <div className="sticky top-0 z-10 mx-3 sm:mx-4 mt-3 sm:mt-4 p-3 bg-accent-500/10 border border-accent-500/20 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-sm text-accent-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span>
                            Showing {filteredMessages.length} result{filteredMessages.length === 1 ? '' : 's'} for "{searchQuery}"
                        </span>
                    </div>
                </div>
            )}

            {/* Messages Container */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="h-full overflow-y-auto overscroll-behavior-contain scroll-smooth px-3 sm:px-4"
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent'
                }}
            >
                <div className="space-y-4 py-4">
                    {displayMessages.map((message) => (
                        <ChatMessage
                            key={message.id}
                            message={message}
                        />
                    ))}

                    {/* Loading indicator for new messages */}
                    {isLoading && !searchQuery.trim() && (
                        <ChatLoading type="thinking" />
                    )}

                    {/* Scroll anchor */}
                    <div ref={messagesEndRef} className="h-px" />
                </div>
            </div>

            {/* Scroll to Bottom Button */}
            {showScrollToBottom && !searchQuery.trim() && (
                <button
                    onClick={() => scrollToBottom(true)}
                    className="absolute bottom-4 right-4 z-10 w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center"
                    aria-label="Scroll to bottom"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </button>
            )}
        </div>
    );
}; 