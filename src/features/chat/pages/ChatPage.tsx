// Main ChatPage component that combines ChatBox and ChatInput
import React from 'react';
import { ChatBox } from '../components/ChatBox';
import { ChatInput } from '../components/ChatInput';
import { useChatStore } from '../store/chat.store';
import { Button } from '../../../shared/ui';

export const ChatPage: React.FC = () => {
  const { messages, isLoading, error, sendMessage, clearMessages, setError } = useChatStore();

  const handleSendMessage = async (prompt: string) => {
    await sendMessage(prompt);
  };

  const handleClearChat = () => {
    clearMessages();
  };

  const handleDismissError = () => {
    setError(null);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">AI Chat</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Chat with our AI assistant
          </p>
        </div>
        {messages.length > 0 && (
          <Button variant="secondary" onClick={handleClearChat}>
            Clear Chat
          </Button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-4 mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
            </div>
            <button
              onClick={handleDismissError}
              className="text-red-800 dark:text-red-200 hover:text-red-900 dark:hover:text-red-100"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <ChatBox messages={messages} isLoading={isLoading} />

      {/* Chat Input */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}; 