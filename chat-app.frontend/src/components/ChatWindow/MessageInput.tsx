import { useState, KeyboardEvent } from 'react';

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export const MessageInput = ({ onSend, disabled = false }: MessageInputProps) => {
  const [content, setContent] = useState('');

  const handleSend = () => {
    if (content.trim() && !disabled) {
      onSend(content.trim());
      setContent('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="message-input">
      <button className="input-icon" type="button" aria-label="Emoji">
        +
      </button>
      <button className="input-icon" type="button" aria-label="Attachment">
        +
      </button>
      <input
        type="text"
        placeholder="Type your Message"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={disabled}
        className="message-input-field"
      />
      <button className="input-icon" type="button" aria-label="Voice message">
        +
      </button>
      <button
        className="input-icon send-button"
        type="button"
        onClick={handleSend}
        disabled={disabled || !content.trim()}
        aria-label="Send message"
      >
        +
      </button>
    </div>
  );
};
