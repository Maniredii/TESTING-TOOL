import { executionQueue, ExecutionJob } from '../queue/ExecutionQueue';
import { ExecutionService } from '../services/ExecutionService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ExecutionWorker {
  private isProcessing = false;

  constructor(private executionService: ExecutionService) {
    executionQueue.on('job_added', () => this.processNext());
  }

  private async processNext() {
    if (this.isProcessing) return;

    const job = executionQueue.dequeue();
    if (!job) return;

    this.isProcessing = true;
    try {
      await this.executeJob(job);
    } catch (error) {
      console.error(`Worker failed to process job ${job.executionId}`, error);
    } finally {
      this.isProcessing = false;
      this.processNext(); // check if more jobs exist
    }
  }

  private async executeJob(job: ExecutionJob) {
    await prisma.execution.update({
      where: { id: job.executionId },
      data: { startedAt: new Date(), status: 'RUNNING' }
    });

    const orchestrator = this.executionService.getOrchestrator();
    // Start orchestration (the orchestrator will handle its own internal state)
    await orchestrator.runExecution(job.projectId, job.configurationId || '');
  }
}
