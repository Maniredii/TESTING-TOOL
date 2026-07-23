import { ProjectRepository } from '../repositories/project.repository';
import { AppError } from '../utils/ErrorBuilder';
import { Role } from '@prisma/client';

export class ProjectService {
  static async createProject(userId: string, data: any) {
    return ProjectRepository.create({
      ...data,
      ownerId: userId,
    });
  }

  static async getProjects(user: { id: string; role: string }, query: any) {
    return ProjectRepository.findMany({
      userId: user.id,
      isAdmin: user.role === Role.ADMIN,
      search: query.search,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      pagination: {
        page: query.page,
        limit: query.limit,
      },
    });
  }

  static async getProjectById(id: string, user: { id: string; role: string }) {
    const project = await ProjectRepository.findById(id);
    
    if (!project) {
      throw new AppError('Project not found', 404);
    }

    if (project.ownerId !== user.id && user.role !== Role.ADMIN) {
      throw new AppError('You do not have permission to view this project', 403);
    }

    return project;
  }

  static async updateProject(id: string, user: { id: string; role: string }, data: any) {
    const project = await this.getProjectById(id, user); // Validates existence and ownership
    return ProjectRepository.update(project.id, data);
  }

  static async deleteProject(id: string, user: { id: string; role: string }) {
    const project = await this.getProjectById(id, user); // Validates existence and ownership
    await ProjectRepository.softDelete(project.id, user.id);
  }
}
