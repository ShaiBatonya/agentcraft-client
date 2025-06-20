import React from 'react';
import ChatSidebar from './ChatSidebar';
import { useChatThreads } from '../hooks/useChatThreads';
import type { Message } from '../types';

/**
 * Example component showing how to integrate ChatSidebar into your application
 * This demonstrates the basic layout and integration pattern
 */
export const ChatSidebarExample: React.FC = () => {
  const { getActiveThread } = useChatThreads();
  
  const activeThread = getActiveThread();

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Chat Sidebar */}
      <ChatSidebar isCollapsed={false} onToggleCollapse={() => {}} />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="flex-shrink-0 p-4 border-b border-muted-700 bg-muted-900">
          <div className="flex items-center justify-between">
            <div>
              {activeThread ? (
                <>
                  <h1 className="text-title-3 font-semibold text-white truncate">
                    {activeThread.title}
                  </h1>
                  <p className="text-caption-1 text-muted-400 mt-1">
                    {activeThread.messages.length} messages
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-title-3 font-semibold text-white">
                    AgentCraft Chat
                  </h1>
                  <p className="text-caption-1 text-muted-400 mt-1">
                    Select or create a conversation to get started
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Chat Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto">
          {activeThread ? (
            <div className="space-y-4">
              {activeThread.messages.length > 0 ? (
                activeThread.messages.map((message: Message) => (
                  <div 
                    key={message.id}
                    className={`
                      p-4 rounded-lg max-w-3xl
                      ${message.role === 'user' 
                        ? 'bg-accent-600 text-white ml-auto' 
                        : 'bg-muted-700 text-muted-100'
                      }
                    `}
                  >
                    <p className="text-body-2">{message.content}</p>
                    <p className="text-caption-2 opacity-70 mt-2">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-400 text-body-1 mb-2">No messages yet</p>
                  <p className="text-muted-500 text-caption-1">
                    Start the conversation below
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h2 className="text-title-2 font-semibold text-white mb-2">
                  Welcome to AgentCraft
                </h2>
                <p className="text-body-2 text-muted-400 mb-6">
                  Create a new conversation or select an existing one from the sidebar to start chatting.
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Chat Input Area */}
        {activeThread && (
          <div className="flex-shrink-0 p-4 border-t border-muted-700 bg-muted-900">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="
                  flex-1 px-4 py-2 bg-muted-800 border border-muted-600 rounded-lg
                  text-body-2 text-white placeholder-muted-400
                  focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent
                  transition-colors duration-200
                "
              />
              <button
                className="
                  px-6 py-2 bg-accent-600 hover:bg-accent-500 text-white font-medium
                  rounded-lg transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-accent-400
                "
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebarExample; 