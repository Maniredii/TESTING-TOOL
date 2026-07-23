import { prisma } from '../config/database';
import { Prisma, TestConfiguration } from '@prisma/client';

export class TestConfigRepository {
  static async create(data: Prisma.TestConfigurationUncheckedCreateInput): Promise<TestConfiguration> {
    return prisma.testConfiguration.create({ data });
  }

  static async findById(id: string): Promise<TestConfiguration | null> {
    return prisma.testConfiguration.findUnique({
      where: { id },
      include: {
        project: {
          select: { id: true, name: true, ownerId: true }
        }
      }
    });
  }

  static async findManyByProjectId(projectId: string): Promise<TestConfiguration[]> {
    return prisma.testConfiguration.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async update(id: string, data: Prisma.TestConfigurationUpdateInput): Promise<TestConfiguration> {
    return prisma.testConfiguration.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string): Promise<void> {
    await prisma.testConfiguration.delete({
      where: { id },
    });
  }
}
