export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5121';
export const SIGNALR_HUB_URL = `${API_BASE_URL}/chathub`;

export const CHAT_TYPE_GROUP = 'Group';
export const CHAT_TYPE_PRIVATE = 'Private';

export const MESSAGE_TYPE_TEXT = 'Text';
export const MESSAGE_TYPE_SYSTEM = 'System';

export const CHAT_FILTER_ALL = 'all';
export const CHAT_FILTER_GROUPS = 'groups';
export const CHAT_FILTER_FRIENDS = 'friends';
export const CHAT_FILTER_FAVORITES = 'favorites';
