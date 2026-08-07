import { apiClient } from '../../../lib/axios.js';
import { ImportPreviewResponse, ImportCommitRequest, ImportSessionResponse, ColumnMapping } from '@finsight/shared';

export const importApi = {
  preview: async (file: File, mapping: ColumnMapping): Promise<ImportPreviewResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mapping', JSON.stringify(mapping));
    
    const response = await apiClient.post<{ data: ImportPreviewResponse }>('/import/preview', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  commit: async (data: ImportCommitRequest): Promise<ImportSessionResponse> => {
    const response = await apiClient.post<{ data: ImportSessionResponse }>('/import/commit', data);
    return response.data.data;
  }
};
