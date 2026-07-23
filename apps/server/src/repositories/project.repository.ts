import { prisma } from '../config/database';
import { Prisma, Project } from '@prisma/client';
import { PaginationParams, PaginationUtil } from '../utils/Pagination';

export class ProjectRepository {
  static async create(data: Prisma.ProjectUncheckedCreateInput): Promise<Project> {
    return prisma.project.create({ data });
  }

  static async findById(id: string): Promise<Project | null> {
    return prisma.project.findFirst({
      where: { id, deletedAt: null },
    });
  }

  static async findMany(params: {
    userId?: string;
    isAdmin: boolean;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    pagination: PaginationParams;
  }) {
    const { userId, isAdmin, search, sortBy = 'createdAt', sortOrder = 'desc', pagination } = params;

    const where: Prisma.ProjectWhereInput = {
      deletedAt: null,
      ...(isAdmin ? {} : { ownerId: userId }), // Users see own, Admins see all
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { websiteUrl: { contains: search, mode: 'insensitive' } },
      ];
    }

    const { skip, take } = PaginationUtil.getPrismaPagination(pagination);

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: sortOrder },
        include: {
          owner: { select: { firstName: true, lastName: true, email: true } },
        },
      }),
      prisma.project.count({ where }),
    ]);

    return {
      projects,
      meta: PaginationUtil.getMeta(total, pagination),
    };
  }

  static async update(id: string, data: Prisma.ProjectUpdateInput): Promise<Project> {
    return prisma.project.update({
      where: { id },
      data,
    });
  }

  static async softDelete(id: string, deletedBy: string): Promise<Project> {
    return prisma.project.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy,
      },
    });
  }
}
