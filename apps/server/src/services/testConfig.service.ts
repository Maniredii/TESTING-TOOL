import { TestConfigRepository } from '../repositories/testConfig.repository';
import { ProjectRepository } from '../repositories/project.repository';
import { AppError } from '../utils/ErrorBuilder';
import { Role } from '@prisma/client';

export class TestConfigService {
  private static async verifyProjectAccess(projectId: string, userId: string, userRole: string) {
    const project = await ProjectRepository.findById(projectId);
    if (!project) {
      throw new AppError('Project not found', 404);
    }
    if (project.ownerId !== userId && userRole !== Role.ADMIN) {
      throw new AppError('You do not have permission to access configurations for this project', 403);
    }
    return project;
  }

  private static async verifyConfigAccess(configId: string, userId: string, userRole: string) {
    const config = await TestConfigRepository.findById(configId);
    if (!config) {
      throw new AppError('Test Configuration not found', 404);
    }
    // config.project exists because of include in repository
    const projectOwnerId = (config as any).project?.ownerId;
    
    if (projectOwnerId !== userId && userRole !== Role.ADMIN) {
      throw new AppError('You do not have permission to access this configuration', 403);
    }
    return config;
  }

  static async createConfig(userId: string, userRole: string, data: any) {
    await this.verifyProjectAccess(data.projectId, userId, userRole);
    return TestConfigRepository.create(data);
  }

  static async getConfigsByProject(projectId: string, userId: string, userRole: string) {
    await this.verifyProjectAccess(projectId, userId, userRole);
    return TestConfigRepository.findManyByProjectId(projectId);
  }

  static async getConfigById(id: string, userId: string, userRole: string) {
    return this.verifyConfigAccess(id, userId, userRole);
  }

  static async updateConfig(id: string, userId: string, userRole: string, data: any) {
    await this.verifyConfigAccess(id, userId, userRole);
    return TestConfigRepository.update(id, data);
  }

  static async deleteConfig(id: string, userId: string, userRole: string) {
    await this.verifyConfigAccess(id, userId, userRole);
    await TestConfigRepository.delete(id);
  }
}
