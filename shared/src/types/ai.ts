import { z } from 'zod';

export const SaveAiConfigSchema = z.object({
  provider: z.string().min(1).max(50),
  apiKey: z.string().min(1).max(500),
  customUrl: z.string().url('Must be a valid URL').max(500).optional(),
  selectedModel: z.string().min(1).max(100)
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
  content: z.string().min(1, 'Content is required').max(5000, 'Message cannot exceed 5000 characters'),
  sessionId: z.string().max(100).optional()
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
