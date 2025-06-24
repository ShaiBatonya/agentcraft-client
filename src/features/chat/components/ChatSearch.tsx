// Professional chat search component with advanced filtering and real-time search
import React, { useCallback, useEffect, useState } from 'react';
import { useSearchMessages, useSearchQuery, useSetSearchQuery, useSetSearchResults } from '../store/chat.store';
import type { SearchFilters } from '../types';

interface ChatSearchProps {
  onClose: () => void;
}

type FilterValue = string | boolean | Date | undefined;

export const ChatSearch: React.FC<ChatSearchProps> = ({ onClose }) => {
  const searchQuery = useSearchQuery();
  const setSearchQuery = useSetSearchQuery();
  const searchMessages = useSearchMessages();
  const setSearchResults = useSetSearchResults();

  // Local state for filters
  const [filters, setFilters] = useState<SearchFilters>({
    role: 'all',
    dateFrom: undefined,
    dateTo: undefined,
    hasError: undefined,
    onlyUnsynced: false
  });

  // Handle search input
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, [setSearchQuery]);

  // Handle filter changes
  const handleFilterChange = useCallback((key: keyof SearchFilters, value: FilterValue) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // Perform search when query or filters change
  useEffect(() => {
    const results = searchMessages(searchQuery, filters);
    setSearchResults(results);
  }, [searchQuery, filters, searchMessages, setSearchResults]);

  return (
    <div className="w-full max-w-2xl bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl p-6 space-y-6">
      {/* Search Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Search Messages</h2>
        <button
          onClick={onClose}
          className="p-1.5 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-200"
          aria-label="Close search"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="search"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search messages..."
          className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
        />
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-white/90">Filters</h3>

        {/* Role Filter */}
        <div className="space-y-2">
          <label className="text-sm text-white/70">Message Type</label>
          <div className="flex gap-2">
            <button
              onClick={() => handleFilterChange('role', 'all')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${filters.role === 'all'
                ? 'bg-accent-500 text-white'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange('role', 'user')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${filters.role === 'user'
                ? 'bg-accent-500 text-white'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
            >
              User
            </button>
            <button
              onClick={() => handleFilterChange('role', 'assistant')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${filters.role === 'assistant'
                ? 'bg-accent-500 text-white'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
            >
              AI
            </button>
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-white/70">From Date</label>
            <input
              type="date"
              value={filters.dateFrom?.toISOString().split('T')[0] || ''}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value ? new Date(e.target.value) : undefined)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/70">To Date</label>
            <input
              type="date"
              value={filters.dateTo?.toISOString().split('T')[0] || ''}
              onChange={(e) => handleFilterChange('dateTo', e.target.value ? new Date(e.target.value) : undefined)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
            />
          </div>
        </div>

        {/* Additional Filters */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input
              type="checkbox"
              checked={filters.hasError === true}
              onChange={(e) => handleFilterChange('hasError', e.target.checked ? true : undefined)}
              className="rounded border-white/20 bg-white/5 text-accent-500 focus:ring-accent-500"
            />
            Show Errors Only
          </label>
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input
              type="checkbox"
              checked={filters.onlyUnsynced}
              onChange={(e) => handleFilterChange('onlyUnsynced', e.target.checked)}
              className="rounded border-white/20 bg-white/5 text-accent-500 focus:ring-accent-500"
            />
            Unsynced Only
          </label>
        </div>
      </div>

      {/* Search Tips */}
      <div className="text-sm text-white/50">
        <p>Tips:</p>
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li>Use quotes for exact phrase matching</li>
          <li>Use filters to narrow down results</li>
          <li>Search is case-insensitive</li>
        </ul>
      </div>
    </div>
  );
}; 