import { useState, KeyboardEvent } from 'react';
import stickersIcon from '../../assets/icons/stickers.svg';
import filesIcon from '../../assets/icons/files.svg';
import microphoneIcon from '../../assets/icons/Microphone.svg';
import sendIcon from '../../assets/icons/send.svg';

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
      <button className="input-icon" type="button" aria-label="Stickers">
        <img src={stickersIcon} alt="Stickers" />
      </button>
      <button className="input-icon" type="button" aria-label="Files">
        <img src={filesIcon} alt="Files" />
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
      <button className="input-icon microphone-button" type="button" aria-label="Voice message">
        <img src={microphoneIcon} alt="Microphone" />
      </button>
      <button
        className="input-icon send-button"
        type="button"
        onClick={handleSend}
        disabled={disabled || !content.trim()}
        aria-label="Send message"
      >
        <img src={sendIcon} alt="Send" />
      </button>
    </div>
  );
};
