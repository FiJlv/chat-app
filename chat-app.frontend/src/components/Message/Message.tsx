import type { MessageDto } from '../../types/message.types';
import { formatMessageTime } from '../../utils/dateFormatter';
import { MESSAGE_TYPE_SYSTEM } from '../../utils/constants';

interface MessageProps {
  message: MessageDto;
}

export const Message = ({ message }: MessageProps) => {
  if (message.type === MESSAGE_TYPE_SYSTEM) {
    const isAddedMessage = message.content.toLowerCase().includes('added') || 
                           message.content.toLowerCase().includes('добавил');
    return (
      <div className={`message message-system ${isAddedMessage ? 'message-system-added' : ''}`}>
        <div className="system-message-content">{message.content}</div>
      </div>
    );
  }

  if (message.isMine) {
    return (
      <div className="message message-mine">
        <div className="message-content">
          <div className="message-text">{message.content}</div>
          <div className="message-time">{formatMessageTime(message.createdAt)}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="message message-other">
      <div className="message-avatar">
        {message.userAvatarUrl ? (
          <img src={message.userAvatarUrl} alt={message.userName || 'User'} />
        ) : (
          <div className="avatar-placeholder">
            {message.userName ? message.userName.charAt(0).toUpperCase() : 'U'}
          </div>
        )}
      </div>
      <div className="message-content">
        <div className="message-sender">{message.userName || 'Unknown'}</div>
        <div className="message-text">{message.content}</div>
        <div className="message-time">{formatMessageTime(message.createdAt)}</div>
      </div>
    </div>
  );
};
