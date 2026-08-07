import { z } from 'zod';

export const SaveAiConfigSchema = z.object({
  provider: z.string().min(1),
  apiKey: z.string().min(1),
  customUrl: z.string().optional(),
  selectedModel: z.string().min(1)
});

export type SaveAiConfigInput = z.infer<typeof SaveAiConfigSchema>;

export interface AiConfigResponse {
  id: string;
  provider: string;
  hasApiKey: boolean;
  customUrl?: string;
  selectedModel: string;
}

export const SendMessageSchema = z.object({
  content: z.string().min(1),
  sessionId: z.string().optional()
});

export type SendMessageInput = z.infer<typeof SendMessageSchema>;

export interface ChatMessageResponse {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

export interface ChatSessionResponse {
  id: string;
  title: string;
  messages: ChatMessageResponse[];
  createdAt: string;
  updatedAt: string;
}
