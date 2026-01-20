import { useEffect, useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { messageApi } from '../../services/api/messageApi';
import { signalRService } from '../../services/signalR/signalRService';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import socialActionIcon from '../../assets/icons/SocialAction.svg';
import mute2Icon from '../../assets/icons/mute2.svg';
import socialActionSetIcon from '../../assets/icons/SocialActionsSet.svg';
import threeDotMenuIcon from '../../assets/icons/ThreeDotMenu.svg';
import type { MessageDto } from '../../types/message.types';

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

    const chatId = currentChat.id;
    signalRService.joinChat(chatId);

    const handleMessageReceived = (receivedChatId: number, message: MessageDto) => {
      if (receivedChatId === chatId) {
        addMessage(receivedChatId, message);
      }
    };

    const handleChatUpdated = (
      updatedChatId: number,
      lastMessage: string,
      lastMessageAt: string
    ) => {
      if (updatedChatId === chatId) {
        updateChat(updatedChatId, {
          lastMessage,
          lastMessageAt: lastMessageAt ? new Date(lastMessageAt).toISOString() : undefined,
        });
      }
    };

    signalRService.onMessageReceived(handleMessageReceived);
    signalRService.onChatUpdated(handleChatUpdated);

    return () => {
      signalRService.offMessageReceived();
      signalRService.offChatUpdated();
      signalRService.leaveChat(chatId);
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
        <div className="chat-header-left">
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
              {currentChat.type === 'Group' ? (
                <>
                  Group Chat with <span className="user-count">{currentChat.members.length} Users</span>
                </>
              ) : (
                'Private Chat'
              )}
            </div>
          </div>
        </div>
        <div className="chat-header-right">
          <button className="header-icon" type="button" aria-label="Social action">
            <img src={socialActionIcon} alt="Social action" />
          </button>
          <button className="header-icon" type="button" aria-label="Mute">
            <img src={mute2Icon} alt="Mute" />
          </button>
          <button className="header-icon" type="button" aria-label="Social actions set">
            <img src={socialActionSetIcon} alt="Social actions" />
          </button>
          <button className="header-icon" type="button" aria-label="More">
            <img src={threeDotMenuIcon} alt="More" />
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
