// Professional chat toolbar with advanced features and beautiful UX
import React, { useState, useCallback, useMemo } from 'react';
import { ChatSearch } from './ChatSearch';
import { 
  useMessages, 
  useExportChat, 
  useMessageStats, 
  useClearChat,
  useSetSearchResults 
} from '../store/chat.store';
import type { SearchResult } from '../types';

interface ChatToolbarProps {
  className?: string;
}

export const ChatToolbar: React.FC<ChatToolbarProps> = React.memo(({ className = '' }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  
  const messages = useMessages();
  const exportChat = useExportChat();
  const getStats = useMessageStats();
  const clearChat = useClearChat();
  const setSearchResults = useSetSearchResults();

  const stats = useMemo(() => getStats(), [getStats]);

  // Export handlers
  const handleExport = useCallback((format: 'json' | 'txt' | 'md') => {
    try {
      const content = exportChat(format);
      const filename = `chat-export-${new Date().toISOString().split('T')[0]}.${format}`;
      
      let mimeType = 'text/plain';
      if (format === 'json') mimeType = 'application/json';
      else if (format === 'md') mimeType = 'text/markdown';
      
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setIsExportMenuOpen(false);
    } catch (error) {
      console.error('Failed to export chat:', error);
    }
  }, [exportChat]);

  // Clear chat handler
  const handleClearChat = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all messages? This action cannot be undone.')) {
      clearChat();
    }
  }, [clearChat]);

  // Search result handler
  const handleSearchResults = useCallback((results: SearchResult[]) => {
    setSearchResults(results);
  }, [setSearchResults]);

  // Close search
  const handleCloseSearch = useCallback(() => {
    setIsSearchOpen(false);
    setSearchResults([]);
  }, [setSearchResults]);

  return (
    <>
      {/* Main Toolbar */}
      <div className={`
        flex items-center justify-between p-3 sm:p-4 
        bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50
        ${className}
      `}>
        {/* Left Section - Chat Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-white">
              {stats.total} messages
            </span>
          </div>
          {stats.unsyncedMessages > 0 && (
            <div className="flex items-center gap-1 text-xs text-amber-400">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              {stats.unsyncedMessages} unsynced
            </div>
          )}
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          {/* Search Button */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`
              p-2 rounded-lg transition-all duration-200 touch-manipulation
              ${isSearchOpen
                ? 'bg-accent-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }
            `}
            title="Search messages"
            aria-label="Search messages"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Statistics Button */}
          <button
            onClick={() => setIsStatsOpen(!isStatsOpen)}
            className={`
              p-2 rounded-lg transition-all duration-200 touch-manipulation
              ${isStatsOpen
                ? 'bg-accent-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }
            `}
            title="View statistics"
            aria-label="View statistics"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>

          {/* Export Menu */}
          <div className="relative">
            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className={`
                p-2 rounded-lg transition-all duration-200 touch-manipulation
                ${isExportMenuOpen
                  ? 'bg-accent-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }
              `}
              title="Export chat"
              aria-label="Export chat"
              disabled={stats.total === 0}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>

            {/* Export Dropdown */}
            {isExportMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => handleExport('json')}
                    className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono bg-slate-700 px-1.5 py-0.5 rounded">JSON</span>
                      <span>Structured data</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleExport('txt')}
                    className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono bg-slate-700 px-1.5 py-0.5 rounded">TXT</span>
                      <span>Plain text</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleExport('md')}
                    className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono bg-slate-700 px-1.5 py-0.5 rounded">MD</span>
                      <span>Markdown</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Clear Chat Button */}
          <button
            onClick={handleClearChat}
            className="p-2 rounded-lg transition-all duration-200 text-red-400 hover:text-red-300 hover:bg-red-900/20 touch-manipulation"
            title="Clear all messages"
            aria-label="Clear all messages"
            disabled={stats.total === 0}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search Panel */}
      {isSearchOpen && (
        <div className="border-b border-slate-700/50">
          <ChatSearch
            messages={messages}
            onSearchResults={handleSearchResults}
            onClose={handleCloseSearch}
            className="border-0 rounded-none"
          />
        </div>
      )}

      {/* Statistics Panel */}
      {isStatsOpen && (
        <div className="border-b border-slate-700/50 bg-slate-800/60 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Chat Statistics</h3>
              <button
                onClick={() => setIsStatsOpen(false)}
                className="p-1 text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
                <div className="text-2xl font-bold text-white mb-1">{stats.total}</div>
                <div className="text-xs text-slate-400">Total Messages</div>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
                <div className="text-2xl font-bold text-blue-400 mb-1">{stats.userMessages}</div>
                <div className="text-xs text-slate-400">Your Messages</div>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
                <div className="text-2xl font-bold text-purple-400 mb-1">{stats.assistantMessages}</div>
                <div className="text-xs text-slate-400">AI Responses</div>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
                <div className="text-2xl font-bold text-emerald-400 mb-1">
                  {stats.total > 0 ? Math.round((stats.assistantMessages / stats.total) * 100) : 0}%
                </div>
                <div className="text-xs text-slate-400">Response Rate</div>
              </div>

              {stats.errorMessages > 0 && (
                <div className="bg-slate-900/50 rounded-lg p-3 border border-red-500/30">
                  <div className="text-2xl font-bold text-red-400 mb-1">{stats.errorMessages}</div>
                  <div className="text-xs text-slate-400">Error Messages</div>
                </div>
              )}

              {stats.editedMessages > 0 && (
                <div className="bg-slate-900/50 rounded-lg p-3 border border-yellow-500/30">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">{stats.editedMessages}</div>
                  <div className="text-xs text-slate-400">Edited Messages</div>
                </div>
              )}

              {stats.deletedMessages > 0 && (
                <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-500/30">
                  <div className="text-2xl font-bold text-slate-400 mb-1">{stats.deletedMessages}</div>
                  <div className="text-xs text-slate-400">Deleted Messages</div>
                </div>
              )}

              {stats.unsyncedMessages > 0 && (
                <div className="bg-slate-900/50 rounded-lg p-3 border border-amber-500/30">
                  <div className="text-2xl font-bold text-amber-400 mb-1">{stats.unsyncedMessages}</div>
                  <div className="text-xs text-slate-400">Unsynced Messages</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Click outside handler for export menu */}
      {isExportMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsExportMenuOpen(false)}
        />
      )}
    </>
  );
}); 