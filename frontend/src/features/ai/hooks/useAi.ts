import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiApi } from '../api/ai.api.js';

export function useAiConfig() {
  return useQuery({
    queryKey: ['ai', 'config'],
    queryFn: aiApi.getConfig
  });
}

export function useSaveAiConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: aiApi.saveConfig,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ai', 'config'] })
  });
}

export function useChatSessions() {
  return useQuery({
    queryKey: ['ai', 'sessions'],
    queryFn: aiApi.getSessions
  });
}

export function useChatSession(sessionId?: string) {
  return useQuery({
    queryKey: ['ai', 'session', sessionId],
    queryFn: () => aiApi.getSession(sessionId!),
    enabled: !!sessionId
  });
}
