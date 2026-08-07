import { apiClient } from '../../../lib/axios.js';
import { CategoryResponse, CategoryTreeNode } from '@finsight/shared';

export const categoryApi = {
  getAll: async (): Promise<CategoryResponse[]> => {
    const response = await apiClient.get<{ data: CategoryResponse[] }>('/categories');
    return response.data.data;
  },

  getTree: async (): Promise<CategoryTreeNode[]> => {
    const response = await apiClient.get<{ data: CategoryTreeNode[] }>('/categories/tree');
    return response.data.data;
  }
};
