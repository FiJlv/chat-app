import { apiClient } from './axiosConfig';
import type { UserDto } from '../../types/user.types';

export const userApi = {

  getCurrentUser: async (): Promise<UserDto> => {
    const response = await apiClient.get<UserDto>('/users/me');
    return response.data;
  },
};
