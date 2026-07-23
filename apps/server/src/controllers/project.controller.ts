import { Response } from 'express';
import { ProjectService } from '../services/project.service';
import { ResponseBuilder } from '../utils/ResponseBuilder';
import { AuthRequest } from '../middlewares/auth.middleware';

export class ProjectController {
  static async createProject(req: AuthRequest, res: Response) {
    const project = await ProjectService.createProject(req.user!.id, req.body);
    res.status(201).json(ResponseBuilder.success({ project }, 'Project created successfully'));
  }

  static async getProjects(req: AuthRequest, res: Response) {
    const data = await ProjectService.getProjects(req.user!, req.query);
    res.status(200).json(ResponseBuilder.success(data, 'Projects retrieved successfully'));
  }

  static async getProjectById(req: AuthRequest, res: Response) {
    const project = await ProjectService.getProjectById(req.params.id, req.user!);
    res.status(200).json(ResponseBuilder.success({ project }, 'Project retrieved successfully'));
  }

  static async updateProject(req: AuthRequest, res: Response) {
    const project = await ProjectService.updateProject(req.params.id, req.user!, req.body);
    res.status(200).json(ResponseBuilder.success({ project }, 'Project updated successfully'));
  }

  static async deleteProject(req: AuthRequest, res: Response) {
    await ProjectService.deleteProject(req.params.id, req.user!);
    res.status(200).json(ResponseBuilder.success(null, 'Project deleted successfully'));
  }
}
