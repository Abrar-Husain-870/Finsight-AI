import { prisma } from '../../../prisma/index.js';
import { Prisma } from '@prisma/client';

export class AuthRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByProviderId(providerId: string) {
    return prisma.user.findUnique({ where: { providerId } });
  }

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  }

  async updateRefreshToken(userId: string, refreshToken: string | null) {
    return prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }
}

export const authRepository = new AuthRepository();
