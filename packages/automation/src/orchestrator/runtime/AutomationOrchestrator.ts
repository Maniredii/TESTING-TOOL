import { ExecutionCoordinator } from './ExecutionCoordinator';
import { PipelineRunner } from '../pipeline/PipelineRunner';
import { PipelineContext } from '../pipeline/PipelineContext';

export class AutomationOrchestrator {
  private coordinator: ExecutionCoordinator;
  private pipelineRunner: PipelineRunner;
  private contexts: Map<string, PipelineContext> = new Map();

  constructor() {
    this.pipelineRunner = new PipelineRunner();
    // In a real implementation, we would register the actual stages here.
    // e.g. this.pipelineRunner.registerStage(new BrowserStage());
    this.coordinator = new ExecutionCoordinator(this.pipelineRunner);
  }

  public getCoordinator(): ExecutionCoordinator {
    return this.coordinator;
  }

  public getPipelineRunner(): PipelineRunner {
    return this.pipelineRunner;
  }

  public async runExecution(projectId: string, configurationId: string): Promise<string> {
    const executionId = `exec-${Date.now()}`;
    const context: PipelineContext = {
      executionId,
      projectId,
      configurationId,
      configuration: {} // Mock configuration loading
    };
    
    this.contexts.set(executionId, context);
    
    // Fire and forget (or await depending on API needs, we'll start it asynchronously)
    this.coordinator.startExecution(context).catch(console.error);
    
    return executionId;
  }

  public pauseExecution(executionId: string): void {
    if (this.contexts.has(executionId)) {
      this.coordinator.pauseExecution();
    } else {
      throw new Error(`Execution ${executionId} not found`);
    }
  }

  public resumeExecution(executionId: string): void {
    if (this.contexts.has(executionId)) {
      this.coordinator.resumeExecution();
    } else {
      throw new Error(`Execution ${executionId} not found`);
    }
  }

  public cancelExecution(executionId: string): void {
    if (this.contexts.has(executionId)) {
      this.coordinator.cancelExecution();
    } else {
      throw new Error(`Execution ${executionId} not found`);
    }
  }
}
