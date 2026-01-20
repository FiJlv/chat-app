import { useEffect, useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { messageApi } from '../../services/api/messageApi';
import { signalRService } from '../../services/signalR/signalRService';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

export const ChatWindow = () => {
  const { currentChat, messages, setMessages, addMessage, updateChat } = useChat();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!currentChat || !user) return;

    const loadMessages = async () => {
      setLoading(true);
      try {
        const loadedMessages = await messageApi.getMessages(currentChat.id);
        setMessages(currentChat.id, loadedMessages);
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    signalRService.joinChat(currentChat.id);

    signalRService.onMessageReceived((chatId, message) => {
      if (chatId === currentChat.id) {
        addMessage(chatId, message);
      }
    });

    signalRService.onChatUpdated((chatId, lastMessage, lastMessageAt) => {
      if (chatId === currentChat.id) {
        updateChat(chatId, {
          lastMessage,
          lastMessageAt: lastMessageAt ? new Date(lastMessageAt).toISOString() : undefined,
        });
      }
    });

    return () => {
      signalRService.offMessageReceived();
      signalRService.offChatUpdated();
      signalRService.leaveChat(currentChat.id);
    };
  }, [currentChat?.id, user, setMessages, addMessage, updateChat]);

  const handleSendMessage = async (content: string) => {
    if (!currentChat || !user || sending) return;

    setSending(true);
    try {
      const newMessage = await messageApi.sendMessage(currentChat.id, {
        chatId: currentChat.id,
        content,
      });

      addMessage(currentChat.id, newMessage);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  if (!currentChat) {
    return (
      <div className="chat-window empty">
        <div className="empty-state">Select a chat to start messaging</div>
      </div>
    );
  }

  const chatMessages = messages[currentChat.id] || [];

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-header-avatar">
            {currentChat.members.length > 0 && currentChat.members[0].avatarUrl ? (
              <img src={currentChat.members[0].avatarUrl} alt={currentChat.name} />
            ) : (
              <div className="avatar-placeholder">{currentChat.name.charAt(0)}</div>
            )}
          </div>
          <div className="chat-header-text">
            <div className="chat-header-name">{currentChat.name}</div>
            <div className="chat-header-subtitle">
              {currentChat.type === 'Group'
                ? `Group Chat with ${currentChat.members.length} Users`
                : 'Private Chat'}
            </div>
          </div>
        </div>
        <div className="chat-header-actions">
          <button className="header-icon" type="button" aria-label="Add member">
            +
          </button>
          <button className="header-icon" type="button" aria-label="Mute">
            +
          </button>
          <button className="header-icon" type="button" aria-label="Settings">
            +
          </button>
        </div>
      </div>

      {loading ? (
        <div className="message-list loading">Loading messages...</div>
      ) : (
        <MessageList messages={chatMessages} />
      )}

      <MessageInput onSend={handleSendMessage} disabled={sending} />
    </div>
  );
};
