import { prisma } from '../../../prisma/index.js';
import { Prisma } from '@prisma/client';
import { TransactionFilterInput } from '@finsight/shared';

export class TransactionRepository {
  async findById(id: string, userId: string) {
    return prisma.transaction.findFirst({
      where: { id, userId, deletedAt: null },
    });
  }

  async findMany(userId: string, filters: TransactionFilterInput) {
    const where: Prisma.TransactionWhereInput = {
      userId,
      deletedAt: null,
    };

    if (filters.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: filters.categoryId },
        include: { children: { select: { id: true } } },
      });
      if (category && category.children && category.children.length > 0) {
        where.categoryId = { in: [category.id, ...category.children.map(c => c.id)] };
      } else {
        where.categoryId = filters.categoryId;
      }
    }
    if (filters.merchant) where.merchant = { contains: filters.merchant };
    
    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) where.date.gte = new Date(filters.startDate);
      if (filters.endDate) where.date.lte = new Date(filters.endDate);
    }
    
    if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
      where.amount = {};
      if (filters.minAmount !== undefined) where.amount.gte = filters.minAmount;
      if (filters.maxAmount !== undefined) where.amount.lte = filters.maxAmount;
    }

    const skip = (filters.page - 1) * filters.limit;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { [filters.sortBy]: filters.sortOrder },
        skip,
        take: filters.limit,
      }),
      prisma.transaction.count({ where })
    ]);

    return { transactions, total };
  }

  async create(userId: string, data: { amount: number; currency?: string; categoryId: string; date: Date; merchant?: string | null; description?: string | null; notes?: string | null; }) {
    return prisma.transaction.create({
      data: {
        ...data,
        userId
      }
    });
  }

  async update(id: string, updateData: Record<string, unknown>) {
    return prisma.transaction.update({
      where: { id },
      data: updateData
    });
  }

  async softDelete(id: string) {
    return prisma.transaction.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
  
  async categoryExists(categoryId: string) {
    const count = await prisma.category.count({ where: { id: categoryId } });
    return count > 0;
  }
}

export const transactionRepository = new TransactionRepository();
