import { prisma } from '../../../prisma/index.js';
import { SaveAiConfigInput } from '@finsight/shared';

export class AiRepository {
  async getConfig(userId: string) {
    return prisma.aiProviderConfig.findUnique({
      where: { userId }
    });
  }

  async saveConfig(userId: string, data: SaveAiConfigInput, encryptedKey: string) {
    return prisma.aiProviderConfig.upsert({
      where: { userId },
      update: {
        provider: data.provider,
        apiKey: encryptedKey,
        customUrl: data.customUrl || null,
        selectedModel: data.selectedModel
      },
      create: {
        userId,
        provider: data.provider,
        apiKey: encryptedKey,
        customUrl: data.customUrl || null,
        selectedModel: data.selectedModel
      }
    });
  }

  async getSession(sessionId: string, userId: string) {
    return prisma.chatSession.findFirst({
      where: { id: sessionId, userId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });
  }

  async getSessionsList(userId: string) {
    return prisma.chatSession.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async createSession(userId: string, title: string) {
    return prisma.chatSession.create({
      data: {
        userId,
        title
      }
    });
  }

  async addMessage(sessionId: string, role: string, content: string) {
    return prisma.chatMessage.create({
      data: {
        sessionId,
        role,
        content
      }
    });
  }
}

export const aiRepository = new AiRepository();
