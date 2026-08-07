import { prisma } from '../../../prisma/index.js';

export class DashboardRepository {
  async getTransactionsSince(userId: string, dateFrom: Date) {
    return prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: dateFrom },
        deletedAt: null
      },
      select: {
        id: true,
        amount: true,
        date: true,
        categoryId: true,
        category: {
          select: { id: true, name: true, type: true, icon: true, color: true }
        }
      },
      orderBy: { date: 'desc' }
    });
  }

  async getRecentTransactions(userId: string, limit = 5) {
    return prisma.transaction.findMany({
      where: { userId, deletedAt: null },
      orderBy: { date: 'desc' },
      take: limit,
      select: {
        id: true,
        amount: true,
        currency: true,
        date: true,
        merchant: true,
        description: true,
        categoryId: true,
        createdAt: true,
        category: {
          select: { id: true, name: true, type: true, icon: true, color: true }
        }
      }
    });
  }
}

export const dashboardRepository = new DashboardRepository();
