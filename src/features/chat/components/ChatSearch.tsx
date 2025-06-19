// Professional chat search component with advanced filtering and real-time search
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { SearchFilters, SearchResult, Message } from '../types';

interface ChatSearchProps {
  messages: Message[];
  onSearchResults: (results: SearchResult[]) => void;
  onClose: () => void;
  className?: string;
}

export const ChatSearch: React.FC<ChatSearchProps> = React.memo(({
  messages,
  onSearchResults,
  onClose,
  className = ''
}) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    role: 'all',
    dateFrom: undefined,
    dateTo: undefined,
    hasError: undefined,
    onlyUnsynced: false
  });
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Simple search implementation (simplified version of ChatSearchEngine)
  const performSearch = useCallback((searchQuery: string, searchFilters: SearchFilters) => {
    if (!searchQuery.trim() && !Object.keys(searchFilters).some(key => {
      const value = searchFilters[key as keyof SearchFilters];
      return value !== undefined && value !== 'all';
    })) {
      return [];
    }

    const normalizedQuery = searchQuery.toLowerCase().trim();
    let filteredMessages = messages.filter(msg => !msg.deleted);

    // Apply filters
    if (searchFilters.role && searchFilters.role !== 'all') {
      filteredMessages = filteredMessages.filter(msg => msg.role === searchFilters.role);
    }

    if (searchFilters.dateFrom) {
      filteredMessages = filteredMessages.filter(msg => new Date(msg.timestamp) >= searchFilters.dateFrom!);
    }

    if (searchFilters.dateTo) {
      filteredMessages = filteredMessages.filter(msg => new Date(msg.timestamp) <= searchFilters.dateTo!);
    }

    if (searchFilters.hasError !== undefined) {
      filteredMessages = filteredMessages.filter(msg => Boolean(msg.error) === searchFilters.hasError);
    }

    if (searchFilters.onlyUnsynced) {
      filteredMessages = filteredMessages.filter(msg => !msg.synced);
    }

    // Perform text search
    const results: SearchResult[] = [];

    for (const message of filteredMessages) {
      const content = message.content.toLowerCase();
      let score = 0;

      if (normalizedQuery && content.includes(normalizedQuery)) {
        score = 10;
        
        // Create simple highlights
        const highlights = [];
        let index = content.indexOf(normalizedQuery);
        while (index !== -1) {
          highlights.push({
            start: index,
            end: index + normalizedQuery.length,
            text: message.content.substring(index, index + normalizedQuery.length)
          });
          index = content.indexOf(normalizedQuery, index + 1);
        }

        results.push({
          message,
          highlights,
          relevanceScore: score
        });
      } else if (!normalizedQuery && Object.keys(searchFilters).some(key => {
        const value = searchFilters[key as keyof SearchFilters];
        return value !== undefined && value !== 'all';
      })) {
        // If only filters are applied, include all filtered messages
        results.push({
          message,
          highlights: [],
          relevanceScore: 1
        });
      }
    }

    // Sort by relevance and date
    return results.sort((a, b) => {
      const scoreDiff = b.relevanceScore - a.relevanceScore;
      if (scoreDiff !== 0) return scoreDiff;
      return new Date(b.message.timestamp).getTime() - new Date(a.message.timestamp).getTime();
    });
  }, [messages]);

  // Debounced search
  useEffect(() => {
    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      const results = performSearch(query, filters);
      setSearchResults(results);
      onSearchResults(results);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, filters, performSearch, onSearchResults]);

  // Clear search
  const handleClear = useCallback(() => {
    setQuery('');
    setFilters({
      role: 'all',
      dateFrom: undefined,
      dateTo: undefined,
      hasError: undefined,
      onlyUnsynced: false
    });
    setSearchResults([]);
    onSearchResults([]);
  }, [onSearchResults]);

  // Export search results
  const handleExport = useCallback(() => {
    if (searchResults.length === 0) return;

    const exportData = {
      query,
      filters,
      results: searchResults.map(result => ({
        timestamp: result.message.timestamp,
        role: result.message.role,
        content: result.message.content,
        relevanceScore: result.relevanceScore
      })),
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-search-results-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [searchResults, query, filters]);

  const statsText = useMemo(() => {
    if (isSearching) return 'Searching...';
    if (searchResults.length === 0 && (query.trim() || Object.keys(filters).some(key => {
      const value = filters[key as keyof SearchFilters];
      return value !== undefined && value !== 'all';
    }))) {
      return 'No results found';
    }
    if (searchResults.length > 0) {
      return `${searchResults.length} result${searchResults.length === 1 ? '' : 's'} found`;
    }
    return `Search ${messages.length} messages`;
  }, [isSearching, searchResults.length, query, filters, messages.length]);

  return (
    <div className={`bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-2xl ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-white">Search Messages</h3>
        </div>
        <div className="flex items-center gap-2">
          {searchResults.length > 0 && (
            <button
              onClick={handleExport}
              className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700/50"
              title="Export results"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700/50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-4 space-y-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search messages..."
            className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 pl-10 text-white placeholder-slate-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
          />
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">{statsText}</span>
          <button
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="flex items-center gap-2 text-sm text-accent-400 hover:text-accent-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </button>
        </div>

        {/* Advanced Filters */}
        {isAdvancedOpen && (
          <div className="space-y-4 p-4 bg-slate-900/30 rounded-lg border border-slate-700/30">
            {/* Role Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Message Role
              </label>
              <select
                value={filters.role || 'all'}
                onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value as 'user' | 'assistant' | 'all' }))}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-accent-500 focus:outline-none"
              >
                <option value="all">All Messages</option>
                <option value="user">Your Messages</option>
                <option value="assistant">AI Responses</option>
              </select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  From Date
                </label>
                <input
                  type="date"
                  value={filters.dateFrom ? filters.dateFrom.toISOString().split('T')[0] : ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    dateFrom: e.target.value ? new Date(e.target.value) : undefined 
                  }))}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-accent-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">To Date</label>
                <input
                  type="date"
                  value={filters.dateTo ? filters.dateTo.toISOString().split('T')[0] : ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    dateTo: e.target.value ? new Date(e.target.value) : undefined 
                  }))}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-accent-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Error and Sync Filters */}
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={filters.hasError === true}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    hasError: e.target.checked ? true : undefined 
                  }))}
                  className="w-4 h-4 text-accent-600 bg-slate-800 border-slate-600 rounded focus:ring-accent-500 focus:ring-2"
                />
                <span className="text-sm text-slate-300 flex items-center gap-1">
                  <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Only Error Messages
                </span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={filters.onlyUnsynced || false}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    onlyUnsynced: e.target.checked 
                  }))}
                  className="w-4 h-4 text-accent-600 bg-slate-800 border-slate-600 rounded focus:ring-accent-500 focus:ring-2"
                />
                <span className="text-sm text-slate-300">Only Unsynced Messages</span>
              </label>
            </div>

            {/* Clear Filters */}
            <button
              onClick={handleClear}
              className="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Search Results Preview */}
      {searchResults.length > 0 && (
        <div className="border-t border-slate-700/50 p-4">
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {searchResults.slice(0, 5).map((result) => (
              <div
                key={result.message.id}
                className="p-3 bg-slate-900/40 rounded-lg border border-slate-700/30 hover:border-accent-500/30 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        result.message.role === 'user' 
                          ? 'bg-blue-500/20 text-blue-300' 
                          : 'bg-purple-500/20 text-purple-300'
                      }`}>
                        {result.message.role === 'user' ? 'You' : 'AI'}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(result.message.timestamp).toLocaleDateString()}
                      </span>
                      {result.relevanceScore > 1 && (
                        <span className="text-xs text-accent-400 font-medium">
                          {result.relevanceScore.toFixed(1)}★
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-300 truncate">
                      {result.message.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {searchResults.length > 5 && (
              <div className="text-center py-2">
                <span className="text-xs text-slate-400">
                  +{searchResults.length - 5} more results
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}); 