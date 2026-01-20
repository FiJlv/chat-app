import { useState, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { chatApi } from '../../services/api/chatApi';
import { ChatTabs } from './ChatTabs';
import { ChatListItem } from './ChatListItem';
import { SearchBar } from '../SearchBar/SearchBar';
import separatorImage from '../../assets/icons/separator_image.svg';
import type { ChatFilter } from '../../types/chat.types';
import {
  CHAT_FILTER_ALL,
  CHAT_FILTER_GROUPS,
  CHAT_FILTER_FRIENDS,
  CHAT_FILTER_FAVORITES,
  CHAT_TYPE_GROUP,
  CHAT_TYPE_PRIVATE,
} from '../../utils/constants';

export const ChatList = () => {
  const { chats, setChats, currentChat, setCurrentChat } = useChat();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<ChatFilter>(CHAT_FILTER_ALL);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadChats = async () => {
      setLoading(true);
      try {
        let type: string | undefined;
        let favorites: boolean | undefined;

        if (activeFilter === CHAT_FILTER_GROUPS) {
          type = CHAT_TYPE_GROUP;
        } else if (activeFilter === CHAT_FILTER_FRIENDS) {
          type = CHAT_TYPE_PRIVATE;
        } else if (activeFilter === CHAT_FILTER_FAVORITES) {
          favorites = true;
        }

        const loadedChats = await chatApi.getChats(
          type,
          searchQuery || undefined,
          favorites
        );
        setChats(loadedChats);
      } catch (error) {
        console.error('Failed to load chats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, [user, activeFilter, searchQuery, setChats]);

  const handleChatClick = (chatId: number) => {
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      setCurrentChat(chat);
    }
  };

  const pinnedChats = chats.filter((chat) => chat.isPinned);
  const groupChats = chats.filter(
    (chat) => !chat.isPinned && chat.type === CHAT_TYPE_GROUP
  );
  const friendChats = chats.filter(
    (chat) => !chat.isPinned && chat.type === CHAT_TYPE_PRIVATE
  );

  return (
    <div className="chat-list">
      <ChatTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <div className="chat-list-content">
        {loading ? (
          <div className="loading">Loading chats...</div>
        ) : (
          <>

            {pinnedChats.length > 0 && (
              <div className="chat-section">
                <div className="section-separator">
                  <span className="section-title">Pinned Chats</span>
                  <img src={separatorImage} alt="" className="separator-icon" />
                </div>
                {pinnedChats.map((chat) => (
                  <ChatListItem
                    key={chat.id}
                    chat={chat}
                    isSelected={currentChat?.id === chat.id}
                    onClick={() => handleChatClick(chat.id)}
                  />
                ))}
              </div>
            )}

            {groupChats.length > 0 && (
              <div className="chat-section">
                <div className="section-separator">
                  <span className="section-title">Group Chats</span>
                  <img src={separatorImage} alt="" className="separator-icon" />
                </div>
                {groupChats.map((chat) => (
                  <ChatListItem
                    key={chat.id}
                    chat={chat}
                    isSelected={currentChat?.id === chat.id}
                    onClick={() => handleChatClick(chat.id)}
                  />
                ))}
              </div>
            )}

            {friendChats.length > 0 && (
              <div className="chat-section">
                <div className="section-separator">
                  <span className="section-title">Friend</span>
                  <img src={separatorImage} alt="" className="separator-icon" />
                </div>
                {friendChats.map((chat) => (
                  <ChatListItem
                    key={chat.id}
                    chat={chat}
                    isSelected={currentChat?.id === chat.id}
                    onClick={() => handleChatClick(chat.id)}
                  />
                ))}
              </div>
            )}

            {chats.length === 0 && !loading && (
              <div className="empty-state">No chats found</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
