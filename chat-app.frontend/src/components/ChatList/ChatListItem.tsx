import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { chatApi } from '../../services/api/chatApi';
import type { ChatDto } from '../../types/chat.types';
import { formatChatTime } from '../../utils/dateFormatter';
import heartIcon from '../../assets/icons/heart.svg';
import muteIcon from '../../assets/icons/mute.svg';
import pinIcon from '../../assets/icons/Pin.svg';
import threeDotIcon from '../../assets/icons/ThreeDotMenu.svg';

interface ChatListItemProps {
  chat: ChatDto;
  isSelected: boolean;
  onClick: () => void;
}

export const ChatListItem = ({ chat, isSelected, onClick }: ChatListItemProps) => {
  const { user } = useAuth();
  const { updateChat } = useChat();

  const otherMember = chat.type === 'Private' && user
    ? chat.members.find(m => m.id !== user.id)
    : null;
  
  const chatAvatarUrl = chat.avatarUrl || otherMember?.avatarUrl;
  const placeholderLetter = (otherMember?.name || chat.name).charAt(0);

  const handleFavoriteClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      const updatedChat = await chatApi.toggleFavorite(chat.id);
      updateChat(chat.id, { isFavorite: updatedChat.isFavorite });
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  return (
    <div
      className={`chat-list-item ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="chat-avatar">
        {chatAvatarUrl ? (
          <img src={chatAvatarUrl} alt={otherMember?.name || chat.name} />
        ) : (
          <div className="avatar-placeholder">
            {placeholderLetter}
          </div>
        )}
        {chat.unreadCount > 0 && (
          <span className="unread-badge">{chat.unreadCount}</span>
        )}
      </div>
      
      <div className="chat-info">
        <div className="chat-name">{chat.name}</div>
        <div className="chat-preview">
          {chat.lastMessage && (
            <>
              {chat.lastMessage.length > 50
                ? `${chat.lastMessage.substring(0, 50)}...`
                : chat.lastMessage}
            </>
          )}
        </div>
      </div>

      <div className="chat-actions">
        <div className="chat-actions-row">
          <div className="chat-time">{formatChatTime(chat.lastMessageAt)}</div>
          <button 
            className={`action-icon ${chat.isFavorite ? 'favorite' : ''}`} 
            type="button" 
            aria-label="Favorite"
            onClick={handleFavoriteClick}
          >
            <img src={heartIcon} alt="Favorite" />
          </button>
        </div>
        <div className="chat-actions-row">
          <button className="action-icon" type="button" aria-label="Mute">
            <img src={muteIcon} alt="Mute" />
          </button>
          <button className="action-icon" type="button" aria-label="Pinned">
            <img src={pinIcon} alt="Pinned" />
          </button>
        </div>
        <button className="action-icon" type="button" aria-label="More options">
          <img src={threeDotIcon} alt="More" />
        </button>
      </div>
    </div>
  );
};
