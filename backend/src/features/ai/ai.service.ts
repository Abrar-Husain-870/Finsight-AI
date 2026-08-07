import { OpenAI } from 'openai';
import { aiRepository } from './ai.repository.js';
import { encrypt, decrypt } from './encryption.util.js';
import { SaveAiConfigInput, AiConfigResponse } from '@finsight/shared';
import { analyticsService } from '../analytics/analytics.service.js';
import { healthService } from '../health/health.service.js';
import { goalService } from '../goals/goal.service.js';
import { Response } from 'express';

export class AiService {
  async saveConfig(userId: string, data: SaveAiConfigInput): Promise<AiConfigResponse> {
    const encrypted = encrypt(data.apiKey);
    const config = await aiRepository.saveConfig(userId, data, encrypted);
    const result: AiConfigResponse = {
      id: config.id,
      provider: config.provider,
      hasApiKey: true,
      selectedModel: config.selectedModel
    };
    if (config.customUrl) result.customUrl = config.customUrl;
    return result;
  }

  async getConfig(userId: string): Promise<AiConfigResponse | null> {
    const config = await aiRepository.getConfig(userId);
    if (!config) return null;
    const result: AiConfigResponse = {
      id: config.id,
      provider: config.provider,
      hasApiKey: !!config.apiKey,
      selectedModel: config.selectedModel
    };
    if (config.customUrl) result.customUrl = config.customUrl;
    return result;
  }

  private async buildSystemContext(userId: string): Promise<string> {
    const analytics = await analyticsService.getSummary(userId);
    const health = healthService.calculateScoreFromAnalytics(analytics);
    const goals = await goalService.getEngineSummary(userId);

    return `You are FinSight AI, a highly analytical and deterministic financial coach.
Your job is to analyze the user's explicit metrics and provide explainable guidance.
DO NOT hallucinate transactions, calculations, or models. Use ONLY the data provided below.
Provide short, actionable, and structured advice formatted in markdown.

[CONTEXT DATA]
- Net Cash Flow (30 days): $${(analytics.cashFlow.total / 100).toFixed(2)}
- Top Expense Category: ${analytics.categoryAnalysis[0]?.categoryName || 'None'} (${analytics.categoryAnalysis[0]?.percentage || 0}%)
- Health Score: ${health.overallScore}/100
- Goal Feasibility: ${goals.overallFeasibility}
- Total Required Monthly Goal Savings: $${(goals.totalRequiredMonthly / 100).toFixed(2)}`;
  }

  async handleChatStream(userId: string, content: string, res: Response, sessionId?: string) {
    const config = await aiRepository.getConfig(userId);
    if (!config || !config.apiKey) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.write(`data: ${JSON.stringify({ type: 'error', message: 'AI Provider not configured. Please set your API key in Settings.' })}\n\n`);
      res.end();
      return;
    }

    const apiKey = decrypt(config.apiKey);
    let baseURL = config.customUrl || undefined;
    if (config.provider === 'groq') baseURL = 'https://api.groq.com/openai/v1';
    
    const client = new OpenAI({ apiKey, baseURL });

    let activeSessionId = sessionId;
    if (!activeSessionId || activeSessionId === 'new') {
      const session = await aiRepository.createSession(userId, content.substring(0, 30) + '...');
      activeSessionId = session.id;
    }

    await aiRepository.addMessage(activeSessionId as string, 'user', content);
    const session = await aiRepository.getSession(activeSessionId as string, userId);
    
    const systemPrompt = await this.buildSystemContext(userId);
    const messages = [
      { role: 'system', content: systemPrompt },
      ...session!.messages.map((m: { role: string; content: string }) => ({ role: m.role as 'user' | 'assistant', content: m.content }))
    ];

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.write(`data: ${JSON.stringify({ type: 'session_id', sessionId: activeSessionId })}\n\n`);

    try {
      const stream = await client.chat.completions.create({
        model: config.selectedModel,
        messages: messages as import('openai').OpenAI.Chat.ChatCompletionMessageParam[],
        stream: true,
      });

      let fullResponse = '';
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || '';
        if (text) {
          fullResponse += text;
          res.write(`data: ${JSON.stringify({ type: 'chunk', text })}\n\n`);
        }
      }

      await aiRepository.addMessage(activeSessionId as string, 'assistant', fullResponse);
      res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
      res.end();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Stream failed';
      res.write(`data: ${JSON.stringify({ type: 'error', message: msg })}\n\n`);
      res.end();
    }
  }

  async getSessions(userId: string) {
    return aiRepository.getSessionsList(userId);
  }

  async getSession(userId: string, sessionId: string) {
    return aiRepository.getSession(sessionId, userId);
  }
}

export const aiService = new AiService();
