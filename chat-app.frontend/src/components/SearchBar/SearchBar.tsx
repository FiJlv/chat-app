interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ value, onChange, placeholder = 'Search chats by Username' }: SearchBarProps) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search-input"
      />
      <div className="search-actions">
        <button className="search-icon" type="button" aria-label="Search">
          +
        </button>
        <button className="new-chat-icon" type="button" aria-label="New chat">
          +
        </button>
      </div>
    </div>
  );
};
