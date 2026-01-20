import searchIcon from '../../assets/icons/search.svg';
import messageIcon from '../../assets/icons/message.svg';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ value, onChange, placeholder = 'Search chats by Username' }: SearchBarProps) => {
  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="search-input"
        />
        <img src={searchIcon} alt="Search" className="search-icon" />
      </div>
      <button className="new-chat-icon" type="button" aria-label="New chat">
        <img src={messageIcon} alt="New chat" />
      </button>
    </div>
  );
};
