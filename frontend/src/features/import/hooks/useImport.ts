import { useMutation, useQueryClient } from '@tanstack/react-query';
import { importApi } from '../api/import.api.js';
import { ColumnMapping, ImportCommitRequest } from '@finsight/shared';

export function useImportPreview() {
  return useMutation({
    mutationFn: ({ file, mapping }: { file: File; mapping: ColumnMapping }) => 
      importApi.preview(file, mapping)
  });
}

export function useImportCommit() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ImportCommitRequest) => importApi.commit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });
}
