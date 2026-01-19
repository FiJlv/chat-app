export interface MessageDto {
  id: number;
  chatId: number;
  userId?: number;
  userName?: string;
  userAvatarUrl?: string;
  content: string;
  type: string;
  createdAt: string;
  isMine: boolean;
}

export interface SendMessageDto {
  chatId: number;
  content: string;
}

export type MessageType = 'Text' | 'System';
