import { prisma } from '../../../prisma/index.js';
import { Category } from '@prisma/client';

export class CategoryRepository {
  async findAll(): Promise<Category[]> {
    return prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findTree(): Promise<Category[]> {
    return prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          orderBy: { name: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });
  }
}

export const categoryRepository = new CategoryRepository();
