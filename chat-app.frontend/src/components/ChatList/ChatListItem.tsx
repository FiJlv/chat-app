import type { ChatDto } from '../../types/chat.types';
import { formatChatTime } from '../../utils/dateFormatter';

interface ChatListItemProps {
  chat: ChatDto;
  isSelected: boolean;
  onClick: () => void;
}

export const ChatListItem = ({ chat, isSelected, onClick }: ChatListItemProps) => {
  return (
    <div
      className={`chat-list-item ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="chat-avatar">
        {chat.members.length > 0 && chat.members[0].avatarUrl ? (
          <img src={chat.members[0].avatarUrl} alt={chat.name} />
        ) : (
          <div className="avatar-placeholder">{chat.name.charAt(0)}</div>
        )}
        {chat.unreadCount > 0 && (
          <span className="unread-badge">{chat.unreadCount}</span>
        )}
      </div>
      
      <div className="chat-info">
        <div className="chat-header">
          <span className="chat-name">{chat.name}</span>
          <span className="chat-time">{formatChatTime(chat.lastMessageAt)}</span>
        </div>
        
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
    </div>
  );
};
