import { apiClient } from './axiosConfig';
import type { ChatDto, CreateChatDto } from '../../types/chat.types';

export const chatApi = {

  getChats: async (
    type?: string,
    search?: string,
    favorites?: boolean
  ): Promise<ChatDto[]> => {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (search) params.append('search', search);
    if (favorites !== undefined) params.append('favorites', favorites.toString());

    const response = await apiClient.get<ChatDto[]>(`/chats?${params.toString()}`);
    return response.data;
  },

  getChatById: async (id: number): Promise<ChatDto> => {
    const response = await apiClient.get<ChatDto>(`/chats/${id}`);
    return response.data;
  },

  createChat: async (dto: CreateChatDto): Promise<ChatDto> => {
    const response = await apiClient.post<ChatDto>('/chats', dto);
    return response.data;
  },

  toggleFavorite: async (id: number): Promise<ChatDto> => {
    const response = await apiClient.patch<ChatDto>(`/chats/${id}/favorite`);
    return response.data;
  },
};
