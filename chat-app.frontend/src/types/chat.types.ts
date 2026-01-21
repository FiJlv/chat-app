import type { UserDto } from './user.types';

export interface ChatDto {
  id: number;
  name: string;
  avatarUrl?: string;
  type: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  isFavorite: boolean;
  isPinned: boolean;
  members: UserDto[];
}

export interface CreateChatDto {
  name: string;
  type: string;
  userIds: number[];
}

export type ChatType = 'Group' | 'Private';
export type ChatFilter = 'all' | 'groups' | 'friends' | 'favorites';
