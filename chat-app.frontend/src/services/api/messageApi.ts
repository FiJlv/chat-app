import { apiClient } from './axiosConfig';
import type { MessageDto, SendMessageDto } from '../../types/message.types';

export const messageApi = {
  
  getMessages: async (chatId: number): Promise<MessageDto[]> => {
    const response = await apiClient.get<MessageDto[]>(`/chats/${chatId}/messages`);
    return response.data;
  },

  sendMessage: async (chatId: number, dto: SendMessageDto): Promise<MessageDto> => {
    const response = await apiClient.post<MessageDto>(`/chats/${chatId}/messages`, dto);
    return response.data;
  },
};
