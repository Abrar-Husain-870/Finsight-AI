import { OpenAI } from 'openai';
import { aiRepository } from './ai.repository.js';
import { encrypt, decrypt } from './encryption.util.js';
import { SaveAiConfigInput, AiConfigResponse } from '@finsight/shared';
import { analyticsService } from '../analytics/analytics.service.js';
import { healthService } from '../health/health.service.js';
import { goalService } from '../goals/goal.service.js';
import { demoService } from '../demo/demo.service.js';
import { prisma } from '../../../prisma/index.js';
import { env } from '../../core/config/env.js';
import { Response } from 'express';
import { isSafeOutboundUrl } from '../../core/utils/ssrf.util.js';
import { ValidationError, NotFoundError } from '../../core/errors/app-error.js';

export class AiService {
  async saveConfig(userId: string, data: SaveAiConfigInput): Promise<AiConfigResponse> {
    // SSRF Prevention: Enforce strict outbound URL validation on custom endpoints
    if (data.customUrl) {
      const isDev = process.env.NODE_ENV === 'development';
      const ssrfCheck = isSafeOutboundUrl(data.customUrl, isDev);
      if (!ssrfCheck.safe) {
        throw new ValidationError(`Invalid AI provider endpoint: ${ssrfCheck.reason}`);
      }
    }

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
    if (config && config.apiKey) {
      const result: AiConfigResponse = {
        id: config.id,
        provider: config.provider,
        hasApiKey: true,
        selectedModel: config.selectedModel
      };
      if (config.customUrl) result.customUrl = config.customUrl;
      return result;
    }

    // Default pre-configured Groq model fallback for all users including demo accounts
    return {
      id: 'default',
      provider: env.DEFAULT_AI_PROVIDER || 'groq',
      hasApiKey: !!env.GROQ_API_KEY,
      selectedModel: env.DEFAULT_AI_MODEL || 'qwen/qwen3.8-27b'
    };
  }

  private async buildSystemContext(userId: string): Promise<string> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, currency: true }
    });

    const isDemo = user?.email === 'demo@finsight.local' || (user?.name?.toLowerCase().includes('demo') ?? false);
    const currency = user?.currency || 'USD';
    const symbol = currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';

    // Auto-seed demo workspace if demo user has no transactions yet
    if (isDemo) {
      const txCount = await prisma.transaction.count({ where: { userId } });
      if (txCount === 0) {
        await demoService.seedDemoWorkspace(userId);
      }
    }

    const analytics = await analyticsService.getSummary(userId);
    const health = healthService.calculateScoreFromAnalytics(analytics);
    const goalEngine = await goalService.getEngineSummary(userId);
    const recentTx = await prisma.transaction.findMany({
      where: { userId },
      take: 15,
      orderBy: { date: 'desc' },
      include: { category: true }
    });


    // Format category breakdown
    const categoryBreakdownText = analytics.categoryAnalysis.length > 0
      ? analytics.categoryAnalysis.slice(0, 8).map(c =>
        `- ${c.categoryName}: ${symbol}${(c.amount / 100).toFixed(2)} (${c.percentage.toFixed(1)}% of total expenses)`
      ).join('\n')
      : 'No category spending recorded yet.';

    // Format top merchants
    const topMerchantsText = (analytics.merchantAnalysis || []).slice(0, 5).map(m =>
      `- ${m.merchant}: ${symbol}${(m.amount / 100).toFixed(2)} (${m.count} purchases)`
    ).join('\n') || 'None recorded.';

    // Format goals
    const goalsText = (goalEngine.goals || []).length > 0
      ? goalEngine.goals.map(g =>
        `- ${g.name}: Target ${symbol}${(g.targetAmount / 100).toFixed(2)}, Current ${symbol}${(g.currentAmount / 100).toFixed(2)} (${Math.round(g.progress)}%), Monthly Needed: ${symbol}${(g.requiredMonthlySavings / 100).toFixed(2)}, Status: ${g.status}`
      ).join('\n')
      : 'No active savings goals set.';

    // Format recent transactions
    const recentTxText = recentTx.length > 0
      ? recentTx.map(t =>
        `- ${t.date.toISOString().split('T')[0]}: ${t.merchant || t.description || 'Transaction'} | ${t.category?.name || 'General'} | ${t.amount < 0 ? '-' : '+'}${symbol}${Math.abs(t.amount / 100).toFixed(2)}`
      ).join('\n')
      : 'No recent transactions recorded.';

    return `You are FinSight AI, the intelligent deterministic financial coach for ${user?.name || (isDemo ? 'Demo User' : 'User')}.
Your role is to provide clear, actionable, accurate financial coaching grounded STRICTLY in the user's authentic ledger data provided below.

[ENVIRONMENT]
- Account Type: ${isDemo ? 'Demo Workspace Account (Using FinSight 6-Month Synthetic Demo Dataset)' : 'Real User Account (Using Personal Verified Financial Ledger)'}
- User Name: ${user?.name || (isDemo ? 'Demo User' : 'User')}
- Currency: ${currency} (${symbol})

[DETERMINISTIC FINANCIAL METRICS (PAST 30 DAYS)]
- Total Income: ${symbol}${(analytics.income.total / 100).toFixed(2)}
- Total Expenses: ${symbol}${(analytics.expense.total / 100).toFixed(2)}
- Net Cash Flow: ${analytics.cashFlow.total >= 0 ? '+' : ''}${symbol}${(analytics.cashFlow.total / 100).toFixed(2)}
- Financial Health Score: ${health.overallScore}/100 (${health.overallScore >= 80 ? 'Excellent' : health.overallScore >= 60 ? 'Good' : 'Needs Optimization'})
- Spending Velocity / Trajectory: Daily average ${symbol}${(analytics.spendingVelocity.dailyAverage / 100).toFixed(2)}, Projected monthly ${symbol}${(analytics.spendingVelocity.projectedMonthly / 100).toFixed(2)} (${analytics.expense.trend > 0 ? `Expense trend up ${analytics.expense.trend.toFixed(1)}%` : `Expense trend down ${Math.abs(analytics.expense.trend).toFixed(1)}%`})

[SPENDING BY CATEGORY]
${categoryBreakdownText}

[TOP MERCHANTS]
${topMerchantsText}

[SAVINGS & TARGET GOALS]
- Overall Feasibility: ${goalEngine.overallFeasibility}
- Total Monthly Savings Needed for Goals: ${symbol}${(goalEngine.totalRequiredMonthly / 100).toFixed(2)}
${goalsText}

[RECENT TRANSACTIONS LEDGER]
${recentTxText}

[STRICT INSTRUCTIONS]
1. Ground all answers deterministically on the data provided above. Mention real categories, amounts (${symbol}), and merchants when explaining spending, overspending, health scores, or savings.
2. If this is a Demo Workspace (${isDemo ? 'Yes' : 'No'}), highlight insights from the loaded demo scenario (e.g. category spikes, cash flow margins). If it's a User Account, analyze their real personal records with utmost privacy and precision.
3. Be concise, structured (using bullet points and bold highlights), empathetic, and encourage positive financial habits.
4. If asked about overspending, point out the largest categories and recent transaction velocity.
5. If asked about goals, calculate realistic timeline adjustments based on their net cash flow.`;

  }

  async handleChatStream(userId: string, content: string, res: Response, sessionId?: string) {
    // 1. Authorization / BOLA Defense: Validate session ownership FIRST before any downstream checks
    let activeSessionId = sessionId;
    if (activeSessionId && activeSessionId !== 'new') {
      const existing = await aiRepository.getSession(activeSessionId, userId);
      if (!existing) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.write(`data: ${JSON.stringify({ type: 'error', message: 'Chat session not found or unauthorized' })}\n\n`);
        res.end();
        return;
      }
    }

    // 2. AI Provider Configuration Check & Default Fallback
    const userConfig = await aiRepository.getConfig(userId);
    const defaultApiKey = env.GROQ_API_KEY;
    const defaultModel = env.DEFAULT_AI_MODEL || 'qwen/qwen3.8-27b';
    const defaultProvider = env.DEFAULT_AI_PROVIDER || 'groq';

    let provider = userConfig?.provider || defaultProvider;
    let selectedModel = userConfig?.selectedModel || defaultModel;
    let apiKey = defaultApiKey;
    let baseURL = userConfig?.customUrl || undefined;

    if (userConfig?.apiKey) {
      const decrypted = decrypt(userConfig.apiKey);
      if (decrypted) {
        apiKey = decrypted;
      }
    }

    if (!apiKey) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.write(`data: ${JSON.stringify({ type: 'error', message: 'AI Provider is not configured. Please set your API key in Settings or configure GROQ_API_KEY in backend/.env.' })}\n\n`);
      res.end();
      return;
    }

    if (provider === 'groq') {
      baseURL = 'https://api.groq.com/openai/v1';
      // If user had selected the decommissioned llama3-8b-8192 or empty, fallback to the supported default qwen/qwen3.8-27b
      if (!selectedModel || selectedModel === 'llama3-8b-8192' || selectedModel === 'llama-3.3-70b-versatile') {
        selectedModel = defaultModel;
      }
    }

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
      const client = new OpenAI({ apiKey, baseURL });
      const stream = await client.chat.completions.create({
        model: selectedModel,
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

  async deleteSession(userId: string, sessionId: string) {
    const deleted = await aiRepository.deleteSession(sessionId, userId);
    if (!deleted) {
      throw new NotFoundError('Session not found');
    }
    return { success: true };
  }
}

export const aiService = new AiService();
