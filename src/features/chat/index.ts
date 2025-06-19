// Chat feature exports with advanced functionality

// Page components
export { ChatPage } from './pages/ChatPage';

// Components
export { ChatContainer } from './components/ChatContainer';
export { ChatMessage } from './components/ChatMessage';
export { ChatInput } from './components/ChatInput';
export { ChatBox } from './components/ChatBox';
export { ChatSearch } from './components/ChatSearch';
export { ChatToolbar } from './components/ChatToolbar';

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

// Services
export { ChatService } from './services/chat.service';

// Types - Export all types
export type * from './types'; 