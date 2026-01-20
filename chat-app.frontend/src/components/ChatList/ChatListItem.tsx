import { useAuth } from '../../context/AuthContext';
import { getChatAvatarMember } from '../../utils/chatAvatar';
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
  const avatarMember = getChatAvatarMember(chat, user);

  return (
    <div
      className={`chat-list-item ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="chat-avatar">
        {avatarMember?.avatarUrl ? (
          <img src={avatarMember.avatarUrl} alt={avatarMember.name || chat.name} />
        ) : (
          <div className="avatar-placeholder">
            {(avatarMember?.name || chat.name).charAt(0)}
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
