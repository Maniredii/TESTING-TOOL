import { Request, Response } from 'express';
import { ExecutionService } from '../services/ExecutionService';
import { CreateExecutionSchema } from '../dto/CreateExecutionDto';

export class ExecutionController {
  private executionService: ExecutionService;

  constructor() {
    this.executionService = new ExecutionService();
  }

  public createExecution = async (req: Request, res: Response) => {
    try {
      const validated = CreateExecutionSchema.parse(req.body);
      const execution = await this.executionService.createExecution(
        validated.projectId,
        validated.configurationId,
        (req as any).user?.id
      );
      res.status(201).json({ success: true, data: execution });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  public listExecutions = async (req: Request, res: Response) => {
    try {
      const executions = await this.executionService.listExecutions((req as any).user?.id as string);
      res.status(200).json({ success: true, data: executions });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  public getExecution = async (req: Request, res: Response) => {
    try {
      const execution = await this.executionService.getExecution(req.params.id, (req as any).user?.id as string);
      if (!execution) return res.status(404).json({ success: false, error: 'Execution not found' });
      res.status(200).json({ success: true, data: execution });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  public pauseExecution = async (req: Request, res: Response) => {
    try {
      const result = await this.executionService.pauseExecution(req.params.id);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  public resumeExecution = async (req: Request, res: Response) => {
    try {
      const result = await this.executionService.resumeExecution(req.params.id);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  public cancelExecution = async (req: Request, res: Response) => {
    try {
      const result = await this.executionService.cancelExecution(req.params.id);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  public getReport = async (req: Request, res: Response) => {
    try {
      const execution = await this.executionService.getExecution(req.params.id, (req as any).user?.id as string);
      if (!execution || !execution.reportLocation) {
        return res.status(404).json({ success: false, error: 'Report not found' });
      }
      res.status(200).json({ success: true, data: { reportLocation: execution.reportLocation } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
}
