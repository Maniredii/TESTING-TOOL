import { prisma } from '../config/database';
import { Prisma, User } from '@prisma/client';

export class UserRepository {
  static async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  static async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  static async findByResetToken(token: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { passwordResetToken: token },
    });
  }

  static async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }

  static async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }

  static async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}
