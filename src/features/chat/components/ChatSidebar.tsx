import React, { useState, useMemo, useCallback } from 'react';
import { useChatThreads, useActiveThread } from '@/features/chat/hooks/useChatThreads';
import ChatItem from './ChatItem';
import NewChatButton from './NewChatButton';

interface ChatSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobile?: boolean;
}

const ChatSidebar: React.FC<ChatSidebarProps> = React.memo(({ 
  isCollapsed, 
  onToggleCollapse,
  isMobile = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { threads, createNewThread } = useChatThreads();
  const activeThread = useActiveThread();

  // Enhanced search filtering with better performance
  const filteredThreads = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    if (!query) return threads;
    
    return threads
      .filter(thread => 
        thread.title.toLowerCase().includes(query) ||
        thread.messages.some(msg => msg.content.toLowerCase().includes(query))
      )
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [threads, searchQuery]);

  // Enhanced handlers with better performance
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleNewChat = useCallback(() => {
    createNewThread();
  }, [createNewThread]);

  const handleSearchFocus = useCallback(() => {
    setIsSearchFocused(true);
  }, []);

  const handleSearchBlur = useCallback(() => {
    setIsSearchFocused(false);
  }, []);

  // Enhanced collapsed state with modern design
  if (isCollapsed) {
    return (
      <aside 
        className="w-16 h-full glass-strong border-r border-white/10 flex flex-col hw-accelerated"
        style={{ 
          width: 'var(--sidebar-width-collapsed)',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Enhanced Collapsed Header */}
        <div className="flex flex-col items-center p-3 border-b border-white/10">
          {/* Expand Button */}
          <button
            onClick={onToggleCollapse}
            className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-300 touch-manipulation group border border-transparent hover:border-white/10"
            aria-label="Expand sidebar"
            title="Expand sidebar"
          >
            <svg className="w-4 h-4 text-white/70 group-hover:text-white transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Collapsed New Chat Button */}
        <div className="p-3">
          <button
            onClick={handleNewChat}
            className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation shadow-lg hover:shadow-xl group"
            aria-label="New chat"
            title="Start new chat"
          >
            <svg className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300" />
          </button>
        </div>

        {/* Collapsed Chat List Preview */}
        <div className="flex-1 p-2 space-y-2 overflow-y-auto scrollbar-hidden">
          {threads.slice(0, 6).map((thread) => (
            <div
              key={thread.id}
              className={`
                w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-bold
                transition-all duration-200 cursor-pointer border
                ${activeThread?.id === thread.id
                  ? 'bg-gradient-to-br from-indigo-600/20 to-purple-600/20 text-white border-indigo-500/30'
                  : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border-transparent hover:border-white/10'
                }
              `}
              title={thread.title}
            >
              {thread.title.charAt(0).toUpperCase()}
            </div>
          ))}
        </div>

        {/* Collapsed Status */}
        <div className="p-3 border-t border-white/10">
          <div className="w-10 h-2 rounded-full bg-white/10 flex items-center justify-center">
            <div className="w-6 h-1 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside 
      className={`h-full glass-strong border-r border-white/10 flex flex-col hw-accelerated animate-fade-in-right ${
        isMobile ? 'w-72 sm:w-80' : ''
      }`}
      style={{ 
        width: isMobile ? undefined : 'var(--sidebar-width)',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* Enhanced Header */}
      <header className="flex-shrink-0 p-4 sm:p-5 border-b border-white/10">
        {/* Header Top Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            
            <div>
              <h2 className="text-lg font-bold text-white">Chats</h2>
              <div className="text-xs text-white/60 font-medium">
                {threads.length} conversation{threads.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
          
          {/* Mobile Close / Desktop Collapse Button */}
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all duration-200 touch-manipulation group border border-transparent hover:border-white/10"
            aria-label={isMobile ? "Close sidebar" : "Collapse sidebar"}
            title={isMobile ? "Close sidebar" : "Collapse sidebar"}
          >
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobile ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              )}
            </svg>
          </button>
        </div>

        {/* Enhanced New Chat Button */}
        <NewChatButton onNewChat={handleNewChat} />

        {/* Enhanced Search */}
        <div className="relative mt-4">
          <div className={`
            relative rounded-2xl border transition-all duration-300 backdrop-blur-xl
            ${isSearchFocused || searchQuery
              ? 'bg-white/8 border-white/20 shadow-lg' 
              : 'bg-white/5 border-white/10'
            }
          `}>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              placeholder="Search conversations..."
              className="w-full h-11 pl-11 pr-10 bg-transparent text-white placeholder-white/50 focus:outline-none text-sm"
              style={{ 
                fontFamily: 'var(--font-family-sans)',
                fontSize: '16px' // Prevent zoom on iOS
              }}
            />
            
            {/* Enhanced Search Icon */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <svg className={`w-4 h-4 transition-colors duration-200 ${isSearchFocused ? 'text-indigo-400' : 'text-white/50'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Enhanced Clear Button */}
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-200 touch-manipulation group"
                aria-label="Clear search"
                title="Clear search"
              >
                <svg className="w-3 h-3 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Enhanced Threads List */}
      <main 
        className="flex-1 overflow-y-auto overscroll-behavior-y-contain scrollbar-thin hw-accelerated"
        style={{ 
          WebkitOverflowScrolling: 'touch',
          willChange: 'scroll-position'
        }}
      >
        {/* Search Results Indicator */}
        {searchQuery && (
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-white/80">
                {filteredThreads.length} result{filteredThreads.length === 1 ? '' : 's'} for "{searchQuery}"
              </span>
            </div>
          </div>
        )}

        <div className="p-3">
          {filteredThreads.length === 0 ? (
            /* Enhanced Empty State */
            <div className="text-center py-12 px-4">
              {searchQuery ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-white/5 flex items-center justify-center border border-white/10">
                    <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">No Results Found</h3>
                    <p className="text-white/60 text-sm mb-4 leading-relaxed">
                      No conversations match your search. Try different keywords or check your spelling.
                    </p>
                    <button
                      onClick={clearSearch}
                      className="btn-secondary text-sm px-4 py-2"
                    >
                      Clear Search
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20 flex items-center justify-center border border-indigo-500/30">
                    <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Start Your First Chat</h3>
                    <p className="text-white/60 text-sm mb-4 leading-relaxed">
                      Begin a conversation with our AI assistant. Ask questions, get help, or just chat!
                    </p>
                    <button
                      onClick={handleNewChat}
                      className="btn-primary text-sm px-4 py-2"
                    >
                      New Conversation
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Enhanced Chat List */
            <div className="space-y-1">
              {filteredThreads.map((thread, index) => (
                <div
                  key={thread.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ChatItem
                    thread={thread}
                    isActive={activeThread?.id === thread.id}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="flex-shrink-0 p-4 border-t border-white/10 glass-light">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-white/60">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono">{threads.length} chat{threads.length !== 1 ? 's' : ''}</span>
            {searchQuery && (
              <>
                <span>•</span>
                <span>{filteredThreads.length} filtered</span>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <div className="status-online text-xs">
              <div className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
              <span>Online</span>
            </div>
          </div>
        </div>
      </footer>
    </aside>
  );
});

ChatSidebar.displayName = 'ChatSidebar';

export default ChatSidebar; 