import React, { useState, useCallback, useEffect } from 'react';
import ChatSidebar from '../components/ChatSidebar';
import ChatWindow from '../components/ChatWindow';

interface ThreadedChatPageProps {
  className?: string;
}

export const ThreadedChatPage: React.FC<ThreadedChatPageProps> = React.memo(({ 
  className = '' 
}) => {
  // Mobile-first responsive state management
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar when clicking outside on mobile
  const handleBackdropClick = useCallback(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  // Toggle sidebar - responsive behavior
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  // Close sidebar when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  return (
    <div className={`flex h-full bg-slate-900 relative ${className}`}>
      {/* Mobile Backdrop Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={handleBackdropClick}
          style={{ 
            animation: 'fadeIn 0.2s ease-out',
            WebkitTapHighlightColor: 'transparent'
          }}
        />
      )}

      {/* Chat Sidebar - Responsive */}
      <div className={`
        ${isMobile 
          ? `fixed left-0 top-0 h-full z-50 transform transition-transform duration-300 ease-out ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`
          : 'relative flex-shrink-0'
        }
      `}>
        <ChatSidebar 
          isCollapsed={false} 
          onToggleCollapse={toggleSidebar}
          isMobile={isMobile}
        />
      </div>
      
      {/* Chat Window - Full width with mobile controls */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile Header with Menu Button */}
        {isMobile && (
          <div className="flex-shrink-0 px-3 py-2 border-b border-gray-800 bg-slate-900/95 backdrop-blur-sm md:hidden">
            <div className="flex items-center justify-between">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors duration-200 touch-manipulation"
                aria-label="Open chat menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-white">AgentCraft</span>
              </div>
              
              <div className="w-9"> {/* Spacer for balance */}</div>
            </div>
          </div>
        )}
        
        {/* Main Chat Window */}
        <ChatWindow className="flex-1 min-h-0" />
      </div>
    </div>
  );
});

ThreadedChatPage.displayName = 'ThreadedChatPage';

export default ThreadedChatPage; 