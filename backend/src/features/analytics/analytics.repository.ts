import { prisma } from '../../../prisma/index.js';

export class AnalyticsRepository {
  async getTransactionsInRange(userId: string, start: Date, end: Date) {
    return prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: start, lte: end },
        deletedAt: null
      },
      select: {
        id: true,
        userId: true,
        amount: true,
        currency: true,
        date: true,
        merchant: true,
        description: true,
        categoryId: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: { id: true, name: true, type: true, icon: true, color: true }
        }
      },
      orderBy: { date: 'desc' }
    });
  }

  async getMonthlyAggregations(userId: string, months: number = 6) {
    const d = new Date();
    d.setMonth(d.getMonth() - months + 1);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);

    return prisma.transaction.groupBy({
      by: ['date', 'amount', 'categoryId'],
      where: {
        userId,
        date: { gte: d },
        deletedAt: null
      }
    });
  }
}

export const analyticsRepository = new AnalyticsRepository();
