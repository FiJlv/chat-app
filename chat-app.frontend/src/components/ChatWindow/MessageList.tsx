import { useLayoutEffect, useRef } from 'react';
import { Message } from '../Message/Message';
import type { MessageDto } from '../../types/message.types';

interface MessageListProps {
  messages: MessageDto[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  const messageListRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (messageListRef.current && messages.length > 0) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="message-list empty">
        <div className="empty-state">No messages yet. Start the conversation!</div>
      </div>
    );
  }

  return (
    <div className="message-list" ref={messageListRef}>
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
};
