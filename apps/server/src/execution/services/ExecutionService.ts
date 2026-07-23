import { PrismaClient } from '@prisma/client';
import { ExecutionQueue, executionQueue } from '../queue/ExecutionQueue';
import { AutomationOrchestrator } from '@testing-platform/automation/src/orchestrator/runtime/AutomationOrchestrator';
import { ExecutionEventEmitter } from '../events/ExecutionEventEmitter';

const prisma = new PrismaClient();

export class ExecutionService {
  private orchestrator: AutomationOrchestrator;
  private eventEmitter: ExecutionEventEmitter;

  constructor() {
    this.orchestrator = new AutomationOrchestrator();
    this.eventEmitter = new ExecutionEventEmitter(this.orchestrator);
    this.setupListeners();
  }

  private setupListeners() {
    const coordinator = this.orchestrator.getCoordinator();

    coordinator.on('STAGE_STARTED', async (data) => {
      await prisma.execution.update({
        where: { id: data.executionId },
        data: { currentStage: data.stageId, status: 'RUNNING' }
      });
    });

    coordinator.on('EXECUTION_COMPLETED', async (data) => {
      await prisma.execution.update({
        where: { id: data.executionId },
        data: { status: 'PASSED', completedAt: new Date(), progress: 100 }
      });
    });

    coordinator.on('EXECUTION_FAILED', async (data) => {
      await prisma.execution.update({
        where: { id: data.executionId },
        data: { status: 'FAILED', completedAt: new Date(), errorMessage: data.error?.message }
      });
    });
  }

  public async createExecution(projectId: string, configurationId?: string, userId?: string) {
    const execution = await prisma.execution.create({
      data: {
        projectId,
        configurationId,
        userId,
        status: 'PENDING',
        browser: 'chromium' // defaulting for now
      }
    });

    executionQueue.enqueue({
      executionId: execution.id,
      projectId,
      configurationId,
    });

    return execution;
  }

  public async listExecutions(userId: string) {
    return prisma.execution.findMany({
      where: { userId },
      orderBy: { startedAt: 'desc' }
    });
  }

  public async getExecution(id: string, userId: string) {
    return prisma.execution.findFirst({
      where: { id, userId }
    });
  }

  public async pauseExecution(id: string) {
    this.orchestrator.pauseExecution(id);
    return { status: 'PAUSED' };
  }

  public async resumeExecution(id: string) {
    this.orchestrator.resumeExecution(id);
    return { status: 'RUNNING' };
  }

  public async cancelExecution(id: string) {
    this.orchestrator.cancelExecution(id);
    await prisma.execution.update({
      where: { id },
      data: { status: 'ABORTED', cancelledAt: new Date() }
    });
    return { status: 'CANCELLED' };
  }
  
  public getOrchestrator(): AutomationOrchestrator {
    return this.orchestrator;
  }
}
