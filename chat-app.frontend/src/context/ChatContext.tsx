import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { ChatDto } from '../types/chat.types';
import type { MessageDto } from '../types/message.types';

interface ChatContextType {
  chats: ChatDto[];
  setChats: (chats: ChatDto[]) => void;
  currentChat: ChatDto | null;
  setCurrentChat: (chat: ChatDto | null) => void;
  messages: Record<number, MessageDto[]>;
  setMessages: (chatId: number, messages: MessageDto[]) => void;
  addMessage: (chatId: number, message: MessageDto) => void;
  updateChat: (chatId: number, updates: Partial<ChatDto>) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chats, setChats] = useState<ChatDto[]>([]);
  const [currentChat, setCurrentChat] = useState<ChatDto | null>(null);
  const [messages, setMessagesState] = useState<Record<number, MessageDto[]>>({});

  const setMessages = useCallback((chatId: number, newMessages: MessageDto[]) => {
    setMessagesState((prev) => ({
      ...prev,
      [chatId]: newMessages,
    }));
  }, []);

  const addMessage = useCallback((chatId: number, message: MessageDto) => {
    setMessagesState((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), message],
    }));
  }, []);

  const updateChat = useCallback((chatId: number, updates: Partial<ChatDto>) => {
    setChats((prev) =>
      prev.map((chat) => (chat.id === chatId ? { ...chat, ...updates } : chat))
    );

    setCurrentChat((prev) => {
      if (prev?.id === chatId) {
        return { ...prev, ...updates };
      }
      return prev;
    });
  }, []);

  return (
    <ChatContext.Provider
      value={{
        chats,
        setChats,
        currentChat,
        setCurrentChat,
        messages,
        setMessages,
        addMessage,
        updateChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
