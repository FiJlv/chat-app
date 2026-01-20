import { CHAT_FILTER_ALL, CHAT_FILTER_GROUPS, CHAT_FILTER_FRIENDS, CHAT_FILTER_FAVORITES } from '../../utils/constants';
import type { ChatFilter } from '../../types/chat.types';

interface ChatTabsProps {
  activeFilter: ChatFilter;
  onFilterChange: (filter: ChatFilter) => void;
}

export const ChatTabs = ({ activeFilter, onFilterChange }: ChatTabsProps) => {
  const tabs = [
    { id: CHAT_FILTER_ALL as ChatFilter, label: 'All Chats' },
    { id: CHAT_FILTER_GROUPS as ChatFilter, label: 'Groups' },
    { id: CHAT_FILTER_FRIENDS as ChatFilter, label: 'Friends' },
    { id: CHAT_FILTER_FAVORITES as ChatFilter, label: 'Favorites' },
  ];

  return (
    <div className="chat-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`chat-tab ${activeFilter === tab.id ? 'active' : ''}`}
          onClick={() => onFilterChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
