import { prisma } from '../../../prisma/index.js';
import { CreateGoalInput, UpdateGoalInput } from '@finsight/shared';

export class GoalRepository {
  async findAll(userId: string) {
    return prisma.goal.findMany({
      where: { userId },
      orderBy: { targetDate: 'asc' }
    });
  }

  async findById(id: string, userId: string) {
    return prisma.goal.findFirst({
      where: { id, userId }
    });
  }

  async create(userId: string, data: CreateGoalInput) {
    return prisma.goal.create({
      data: {
        userId,
        name: data.name,
        targetAmount: data.targetAmount,
        currentAmount: data.currentAmount || 0,
        targetDate: new Date(data.targetDate),
        color: data.color || '#3b82f6'
      }
    });
  }

  async update(id: string, userId: string, data: UpdateGoalInput) {
    const payload: Record<string, unknown> = {};
    if (data.name) payload.name = data.name;
    if (data.targetAmount !== undefined) payload.targetAmount = data.targetAmount;
    if (data.currentAmount !== undefined) payload.currentAmount = data.currentAmount;
    if (data.targetDate) payload.targetDate = new Date(data.targetDate);
    if (data.color) payload.color = data.color;

    // Atomically update with userId constraint to defeat BOLA / IDOR at the database level
    const result = await prisma.goal.updateMany({
      where: { id, userId },
      data: payload
    });

    if (result.count === 0) {
      return null;
    }

    return prisma.goal.findFirst({
      where: { id, userId }
    });
  }

  async delete(id: string, userId: string) {
    return prisma.goal.deleteMany({
      where: { id, userId }
    });
  }
}

export const goalRepository = new GoalRepository();
