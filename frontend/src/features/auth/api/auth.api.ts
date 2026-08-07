import { apiClient } from '../../../lib/axios.js';
import { LoginInput, RegisterInput, AuthResponse, UserResponse, UpdateProfileInput } from '@finsight/shared';

export const authApi = {
  login: async (data: LoginInput): Promise<AuthResponse> => {
    const response = await apiClient.post<{ data: AuthResponse }>('/auth/login', data);
    return response.data.data;
  },

  demoLogin: async (): Promise<AuthResponse> => {
    const response = await apiClient.post<{ data: AuthResponse }>('/auth/demo');
    return response.data.data;
  },

  register: async (data: RegisterInput): Promise<AuthResponse> => {
    const response = await apiClient.post<{ data: AuthResponse }>('/auth/register', data);
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  getMe: async (): Promise<UserResponse> => {
    const response = await apiClient.get<{ data: UserResponse }>('/auth/me');
    return response.data.data;
  },

  updateProfile: async (data: UpdateProfileInput): Promise<UserResponse> => {
    const response = await apiClient.patch<{ data: UserResponse }>('/auth/me', data);
    return response.data.data;
  },
  
  getGoogleAuthUrl: () => {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    return `${baseURL}/auth/google`;
  }
};
