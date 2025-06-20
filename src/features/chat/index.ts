// Chat feature exports with advanced functionality

// Page components
export { ChatPage } from './pages/ChatPage';
export { default as ThreadedChatPage } from './pages/ThreadedChatPage';

// Components
export { ChatContainer } from './components/ChatContainer';
export { default as ChatMessage } from './components/ChatMessage';
export { ChatInput } from './components/ChatInput';
export { ChatBox } from './components/ChatBox';
export { ChatSearch } from './components/ChatSearch';
export { ChatToolbar } from './components/ChatToolbar';

// Sidebar components
export { default as ChatSidebar } from './components/ChatSidebar';
export { default as ChatItem } from './components/ChatItem';
export { default as NewChatButton } from './components/NewChatButton';
export { ChatSidebarExample } from './components/ChatSidebarExample';
export { default as ChatWindow } from './components/ChatWindow';

// Store and hooks
export {
  useChatStore,
  useMessages,
  useChatLoading,
  useChatError,
  useChatInitialized,
  useSearchQuery,
  useFilteredMessages,
  useSelectedMessage,
  useSendMessage,
  useLoadChatHistory,
  useClearMessages,
  useClearChat,
  useClearError,
  useSetMessages,
  useSetError,
  useInitializeChat,
  useDeleteMessage,
  useRestoreMessage,
  useEditMessage,
  useSearchMessages,
  useSetSearchQuery,
  useSetSearchResults,
  useClearSearch,
  useSetSelectedMessage,
  useExportChat,
  useMessageStats
} from './store/chat.store';

// Thread management hooks
export {
  useChatThreads,
  useThreads,
  useActiveThreadId,
  useActiveThread,
  useCreateNewThread,
  useSetActiveThread,
  useDeleteThread,
  useAddMessage,
  type ChatThread
} from './hooks/useChatThreads';

export { useChatThreadSync } from './hooks/useChatThreadSync';

// Services
export { ChatService } from './services/chat.service';

// Types - Export all types
export type * from './types'; 