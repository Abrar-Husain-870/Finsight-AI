import { prisma } from '../../../prisma/index.js';
import { Prisma } from '@prisma/client';

export class ImportRepository {
  async createSession(userId: string, data: Partial<Prisma.ImportSessionCreateInput>) {
    return prisma.importSession.create({
      data: {
        ...data,
        user: { connect: { id: userId } }
      }
    });
  }

  async getSession(id: string, userId: string) {
    return prisma.importSession.findFirst({
      where: { id, userId }
    });
  }

  async updateSession(id: string, data: Prisma.ImportSessionUpdateInput) {
    return prisma.importSession.update({
      where: { id },
      data
    });
  }
}

export const importRepository = new ImportRepository();
