// World-Class Responsive ChatContainer with advanced features and auto-scroll
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  useChatInitialized,
  useInitializeChat,
  useMessages,
  useSetSearchResults
} from '../store/chat.store';
import type { SearchResult } from '../types';
import { ChatCommandPalette } from './ChatCommandPalette';
import { ChatError } from './ChatError';
import { ChatHeader } from './ChatHeader';
import { ChatInput } from './ChatInput';
import { ChatMessages } from './ChatMessages';
import { ChatSearch } from './ChatSearch';
import { ChatSettings } from './ChatSettings';

interface ChatContainerProps {
  className?: string;
}

export const ChatContainer: React.FC<ChatContainerProps> = React.memo(({ className = '' }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const isInitialized = useChatInitialized();
  const initializeChat = useInitializeChat();
  const messages = useMessages();
  const setSearchResults = useSetSearchResults();

  // Refs for click outside handling and focus management
  const searchRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const commandsRef = useRef<HTMLDivElement>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  // Initialize chat when component mounts
  const initRef = useRef(false);
  useEffect(() => {
    if (!initRef.current && !isInitialized) {
      initRef.current = true;
      try {
        initializeChat();
      } catch (error) {
        console.error('Failed to initialize chat:', error);
      }
    }
  }, [isInitialized, initializeChat]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close overlays with Escape
      if (e.key === 'Escape') {
        if (showSearch) setShowSearch(false);
        if (showSettings) setShowSettings(false);
        if (showCommands) setShowCommands(false);
      }
      // Toggle search with Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(prev => !prev);
        setShowSettings(false);
        setShowCommands(false);
      }
      // Toggle settings with Cmd/Ctrl + ,
      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault();
        setShowSettings(prev => !prev);
        setShowSearch(false);
        setShowCommands(false);
      }
      // Toggle command palette with Cmd/Ctrl + /
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setShowCommands(prev => !prev);
        setShowSearch(false);
        setShowSettings(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSearch, showSettings, showCommands]);

  // Lock body scroll when overlays are open
  useEffect(() => {
    if (showSearch || showSettings || showCommands) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showSearch, showSettings, showCommands]);

  // Handle click outside overlays
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (showSearch && searchRef.current && !searchRef.current.contains(e.target as Node)) {
      setShowSearch(false);
    }
    if (showSettings && settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
      setShowSettings(false);
    }
    if (showCommands && commandsRef.current && !commandsRef.current.contains(e.target as Node)) {
      setShowCommands(false);
    }
  }, [showSearch, showSettings, showCommands]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  // Manage focus when overlays open/close
  useEffect(() => {
    if (showSearch || showSettings || showCommands) {
      lastFocusedElement.current = document.activeElement as HTMLElement;

      // Focus the first focusable element in the overlay
      const overlay = showSearch ? searchRef.current : showSettings ? settingsRef.current : commandsRef.current;
      if (overlay) {
        const focusableElements = overlay.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }
    } else if (lastFocusedElement.current) {
      // Restore focus when overlay closes
      lastFocusedElement.current.focus();
      lastFocusedElement.current = null;
    }
  }, [showSearch, showSettings, showCommands]);

  // Handle focus trap in overlays
  const handleTabKey = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    const overlay = showSearch ? searchRef.current : showSettings ? settingsRef.current : commandsRef.current;
    if (!overlay) return;

    const focusableElements = overlay.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  }, [showSearch, showSettings, showCommands]);

  useEffect(() => {
    if (showSearch || showSettings || showCommands) {
      window.addEventListener('keydown', handleTabKey);
      return () => window.removeEventListener('keydown', handleTabKey);
    }
  }, [showSearch, showSettings, showCommands, handleTabKey]);

  const handleSearchResults = useCallback((results: SearchResult[]) => {
    setSearchResults(results);
  }, [setSearchResults]);

  return (
    <div
      className={`relative flex flex-col h-full bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 ${className}`}
      role="main"
      aria-label="Chat interface"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-pink-500/5 blur-2xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Main Content */}
      <div className="relative flex flex-col flex-1 z-10">
        {/* Enhanced Header */}
        <ChatHeader
          onToggleSearch={() => setShowSearch(!showSearch)}
          onToggleSettings={() => setShowSettings(!showSettings)}
          onToggleCommands={() => setShowCommands(!showCommands)}
        />

        {/* Error Banner */}
        <ChatError />

        {/* Messages Area */}
        <ChatMessages className="flex-1" />

        {/* Input Area */}
        <footer className="flex-shrink-0 p-3 md:p-4 border-t border-white/10 bg-slate-900/95 backdrop-blur-sm">
          <div className="w-full max-w-4xl mx-auto">
            <ChatInput />
          </div>
        </footer>
      </div>

      {/* Overlays */}
      {(showSearch || showSettings || showCommands) && (
        <div
          className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label={
            showSearch ? 'Search messages' :
              showSettings ? 'Chat settings' :
                'Command palette'
          }
        >
          <div
            ref={showSearch ? searchRef : showSettings ? settingsRef : commandsRef}
            className="w-full animate-in slide-in-from-bottom-4 duration-300"
          >
            {showSearch && (
              <ChatSearch
                onClose={() => setShowSearch(false)}
                messages={messages}
                onSearchResults={handleSearchResults}
                className="border-0 rounded-none"
              />
            )}
            {showSettings && <ChatSettings onClose={() => setShowSettings(false)} />}
            {showCommands && <ChatCommandPalette onClose={() => setShowCommands(false)} />}
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Help */}
      <div className="fixed bottom-4 right-4 text-xs text-white/50 pointer-events-none select-none">
        <div className="space-y-1">
          <div>
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/20">⌘</kbd>
            <span className="mx-1">+</span>
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/20">K</kbd>
            <span className="ml-2">to search</span>
          </div>
          <div>
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/20">⌘</kbd>
            <span className="mx-1">+</span>
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/20">,</kbd>
            <span className="ml-2">for settings</span>
          </div>
          <div>
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/20">⌘</kbd>
            <span className="mx-1">+</span>
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/20">/</kbd>
            <span className="ml-2">for commands</span>
          </div>
          <div>
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/20">Esc</kbd>
            <span className="ml-2">to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}); 