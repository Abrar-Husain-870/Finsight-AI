import { apiClient } from '../../../lib/axios.js';
import { AiConfigResponse, SaveAiConfigInput, ChatSessionResponse } from '@finsight/shared';

export const aiApi = {
  getConfig: async (): Promise<AiConfigResponse | null> => {
    const response = await apiClient.get<{ data: AiConfigResponse | null }>('/ai/config');
    return response.data.data;
  },
  saveConfig: async (data: SaveAiConfigInput): Promise<AiConfigResponse> => {
    const response = await apiClient.post<{ data: AiConfigResponse }>('/ai/config', data);
    return response.data.data;
  },
  getSessions: async (): Promise<{ id: string, title: string, createdAt: string, updatedAt: string }[]> => {
    const response = await apiClient.get<{ data: { id: string, title: string, createdAt: string, updatedAt: string }[] }>('/ai/sessions');
    return response.data.data;
  },
  getSession: async (id: string): Promise<ChatSessionResponse> => {
    const response = await apiClient.get<{ data: ChatSessionResponse }>(`/ai/sessions/${id}`);
    return response.data.data;
  }
};
