import React, { useState, useCallback, memo, useMemo } from 'react';
import type { ChatThread } from '../types';
import { useDeleteThread } from '../hooks/useThreads';
import { useMessagesByThreadRecord } from '@/stores/chat.store';
import { formatThreadTime, getThreadTitle } from '../utils/threadUtils';

interface ThreadItemProps {
  thread: ChatThread;
  isActive: boolean;
  isLoading?: boolean;
  onSelect: (threadId: string) => void;
  onMobileSelect?: () => void; // For closing mobile sidebar
  className?: string;
}

const ThreadItem: React.FC<ThreadItemProps> = memo(({
  thread,
  isActive,
  isLoading = false,
  onSelect,
  onMobileSelect,
  className = ''
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteThread = useDeleteThread();
  
  // Get access to messagesByThread record for title generation
  const messagesByThread = useMessagesByThreadRecord();
  
  // Use the new getThreadTitle function with messagesByThread access
  const displayTitle = useMemo(() => {
    return getThreadTitle(thread, messagesByThread);
  }, [thread.title, thread._id, messagesByThread]);

  const formattedTime = useMemo(() => {
    // Use updatedAt if available, otherwise use current time
    const timeToFormat = thread.updatedAt || new Date().toISOString();
    return formatThreadTime(timeToFormat);
  }, [thread.updatedAt]);

  const handleSelect = useCallback(() => {
    if (isDeleting) return;
    onSelect(thread._id);
    onMobileSelect?.();
  }, [thread._id, onSelect, onMobileSelect, isDeleting]);

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  }, []);

  const handleDeleteConfirm = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    
    try {
      console.log('🗑️ Attempting to delete thread:', thread._id);
      
      // Call the delete function and wait for it to complete
      await deleteThread(thread._id);
      
      console.log('✅ Thread deletion completed successfully');
      
      // Success is already handled by the useDeleteThread hook with toast
      
    } catch (error) {
      console.error('❌ Delete operation failed:', error);
      
      // Log detailed error information for debugging
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      
      console.error('Thread ID that failed to delete:', thread._id);
      console.error('Error object:', error);
      
      // Error toast is already handled by the useDeleteThread hook
      
    } finally {
      // Always reset the UI state
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  }, [deleteThread, thread._id]);

  const handleDeleteCancel = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  }, []);

  return (
    <div className={`group relative ${className}`}>
      <button
        onClick={handleSelect}
        disabled={isDeleting}
        className={`
          w-full p-4 rounded-2xl text-left transition-all duration-200 border
          ${isActive
            ? 'bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-indigo-500/30 text-white shadow-lg'
            : 'bg-white/5 hover:bg-white/10 border-transparent hover:border-white/10 text-white/90 hover:text-white'
          }
          ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}
          ${isLoading ? 'animate-pulse' : ''}
        `}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Thread Title/Preview */}
            <div className="font-medium text-sm line-clamp-2 mb-2 leading-relaxed">
              {displayTitle}
            </div>
            
            {/* Timestamp */}
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/60">
                {formattedTime}
              </div>
              
              {/* Active indicator */}
              {isActive && (
                <div className="flex-shrink-0 w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
              )}
            </div>
          </div>
        </div>
      </button>

      {/* Delete Button - Shows on hover for non-active threads, always visible for active thread */}
      <div className={`
        absolute top-3 right-3 transition-all duration-200
        ${isActive 
          ? 'opacity-70 hover:opacity-100' 
          : 'opacity-0 group-hover:opacity-70 hover:opacity-100'
        }
      `}>
        {showDeleteConfirm ? (
          /* Delete Confirmation */
          <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-sm rounded-lg p-1 border border-red-500/30">
            <button
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="p-1.5 rounded-md bg-red-600/80 hover:bg-red-600 text-white transition-colors duration-200 disabled:opacity-50"
              title="Confirm delete"
            >
              {isDeleting ? (
                <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <button
              onClick={handleDeleteCancel}
              className="p-1.5 rounded-md bg-slate-600/80 hover:bg-slate-600 text-white transition-colors duration-200"
              title="Cancel delete"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          /* Delete Button */
          <button
            onClick={handleDeleteClick}
            className="p-1.5 rounded-lg bg-slate-900/50 hover:bg-red-600/80 text-white/60 hover:text-white transition-all duration-200 border border-transparent hover:border-red-500/30 backdrop-blur-sm"
            title="Delete conversation"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {/* Loading overlay */}
      {isDeleting && (
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Deleting...</span>
          </div>
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Optimized comparison function to prevent infinite loops
  // Only re-render when essential props change
  return (
    prevProps.thread._id === nextProps.thread._id &&
    prevProps.thread.title === nextProps.thread.title &&
    prevProps.thread.updatedAt === nextProps.thread.updatedAt &&
    prevProps.isActive === nextProps.isActive &&
    prevProps.isLoading === nextProps.isLoading
  );
});

ThreadItem.displayName = 'ThreadItem';

export default ThreadItem; 