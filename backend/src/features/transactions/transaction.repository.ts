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
    if (filters.merchant) where.merchant = { contains: filters.merchant, mode: 'insensitive' };
    
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

    // Handle global absolute amount sorting across full dataset
    if (filters.sortBy === 'amount') {
      const rawConditions: Prisma.Sql[] = [
        Prisma.sql`t."userId" = ${userId}`,
        Prisma.sql`t."deletedAt" IS NULL`
      ];

      if (filters.merchant) {
        rawConditions.push(Prisma.sql`t."merchant" ILIKE ${'%' + filters.merchant + '%'}`);
      }

      if (filters.categoryId) {
        const category = await prisma.category.findUnique({
          where: { id: filters.categoryId },
          include: { children: { select: { id: true } } },
        });
        if (category && category.children && category.children.length > 0) {
          const ids = [category.id, ...category.children.map(c => c.id)];
          rawConditions.push(Prisma.sql`t."categoryId" IN (${Prisma.join(ids)})`);
        } else {
          rawConditions.push(Prisma.sql`t."categoryId" = ${filters.categoryId}`);
        }
      }

      if (filters.startDate) {
        rawConditions.push(Prisma.sql`t."date" >= ${new Date(filters.startDate)}`);
      }
      if (filters.endDate) {
        rawConditions.push(Prisma.sql`t."date" <= ${new Date(filters.endDate)}`);
      }

      const whereClause = Prisma.sql`WHERE ${Prisma.join(rawConditions, ' AND ')}`;
      const orderDirection = filters.sortOrder === 'asc' ? Prisma.sql`ASC` : Prisma.sql`DESC`;

      const [rawRows, total] = await Promise.all([
        prisma.$queryRaw<{ id: string }[]>`
          SELECT t.id FROM "Transaction" t
          ${whereClause}
          ORDER BY ABS(t.amount) ${orderDirection}, t.date DESC, t."createdAt" DESC, t.id DESC
          LIMIT ${filters.limit} OFFSET ${skip}
        `,
        prisma.transaction.count({ where })
      ]);

      const ids = rawRows.map(r => r.id);
      const fetchedTxs = await prisma.transaction.findMany({
        where: { id: { in: ids } },
        include: { category: true }
      });
      
      const txMap = new Map(fetchedTxs.map(t => [t.id, t]));
      const transactions = ids.map(id => txMap.get(id)!).filter(Boolean);

      return { transactions, total };
    }

    const orderByClause: Prisma.TransactionOrderByWithRelationInput[] = [];

    if (filters.sortBy === 'date') {
      orderByClause.push({ date: filters.sortOrder });
      orderByClause.push({ createdAt: 'desc' });
      orderByClause.push({ id: 'desc' });
    } else if (filters.sortBy === 'merchant') {
      orderByClause.push({ merchant: filters.sortOrder });
      orderByClause.push({ date: 'desc' });
      orderByClause.push({ id: 'desc' });
    } else {
      orderByClause.push({ [filters.sortBy]: filters.sortOrder } as Prisma.TransactionOrderByWithRelationInput);
      orderByClause.push({ date: 'desc' });
      orderByClause.push({ id: 'desc' });
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: { category: true },
        orderBy: orderByClause,
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
