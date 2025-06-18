// ChatBox component to display the chat conversation
import React, { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import type { ChatMessage as ChatMessageType } from '../types';

interface ChatBoxProps {
  messages: ChatMessageType[];
  isLoading: boolean;
}

export const ChatBox: React.FC<ChatBoxProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
          <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
          <p className="text-sm">Send a message to begin chatting with the AI assistant.</p>
        </div>
      ) : (
        messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))
      )}
      {isLoading && (
        <div className="flex justify-start mb-4">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg px-4 py-2 max-w-xs lg:max-w-md">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}; 