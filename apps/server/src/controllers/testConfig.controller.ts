import { Response } from 'express';
import { TestConfigService } from '../services/testConfig.service';
import { ResponseBuilder } from '../utils/ResponseBuilder';
import { AuthRequest } from '../middlewares/auth.middleware';

export class TestConfigController {
  static async createConfig(req: AuthRequest, res: Response) {
    const config = await TestConfigService.createConfig(req.user!.id, req.user!.role, req.body);
    res.status(201).json(ResponseBuilder.success({ config }, 'Test configuration created successfully'));
  }

  static async getConfigsByProject(req: AuthRequest, res: Response) {
    const projectId = req.params.projectId; // Can come from nested route
    const configs = await TestConfigService.getConfigsByProject(projectId, req.user!.id, req.user!.role);
    res.status(200).json(ResponseBuilder.success({ configs }, 'Test configurations retrieved successfully'));
  }

  static async getConfigById(req: AuthRequest, res: Response) {
    const config = await TestConfigService.getConfigById(req.params.id, req.user!.id, req.user!.role);
    res.status(200).json(ResponseBuilder.success({ config }, 'Test configuration retrieved successfully'));
  }

  static async updateConfig(req: AuthRequest, res: Response) {
    const config = await TestConfigService.updateConfig(req.params.id, req.user!.id, req.user!.role, req.body);
    res.status(200).json(ResponseBuilder.success({ config }, 'Test configuration updated successfully'));
  }

  static async deleteConfig(req: AuthRequest, res: Response) {
    await TestConfigService.deleteConfig(req.params.id, req.user!.id, req.user!.role);
    res.status(200).json(ResponseBuilder.success(null, 'Test configuration deleted successfully'));
  }
}
