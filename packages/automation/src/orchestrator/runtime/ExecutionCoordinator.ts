import { ExecutionStateMachine } from '../state/ExecutionStateMachine';
import { ExecutionState } from '../state/ExecutionState';
import { PipelineRunner } from '../pipeline/PipelineRunner';
import { PipelineContext } from '../pipeline/PipelineContext';
import { EventEmitter } from 'events';

export class ExecutionCoordinator extends EventEmitter {
  private stateMachine: ExecutionStateMachine;
  private pipelineRunner: PipelineRunner;
  private currentContext: PipelineContext | null = null;

  constructor(pipelineRunner: PipelineRunner) {
    super();
    this.stateMachine = new ExecutionStateMachine();
    this.pipelineRunner = pipelineRunner;

    // Forward pipeline events
    this.pipelineRunner.on('STAGE_STARTED', (data) => this.emit('STAGE_STARTED', data));
    this.pipelineRunner.on('STAGE_COMPLETED', (data) => this.emit('STAGE_COMPLETED', data));
    this.pipelineRunner.on('STAGE_FAILED', (data) => this.emit('STAGE_FAILED', data));
  }

  public async startExecution(context: PipelineContext): Promise<void> {
    this.currentContext = context;
    this.stateMachine.transition(ExecutionState.INITIALIZING);
    
    try {
      this.stateMachine.transition(ExecutionState.RUNNING);
      this.emit('EXECUTION_STARTED', { executionId: context.executionId });
      
      await this.pipelineRunner.run(context);
      
      this.stateMachine.transition(ExecutionState.COMPLETED);
      this.emit('EXECUTION_COMPLETED', { executionId: context.executionId });
    } catch (error) {
      this.stateMachine.transition(ExecutionState.FAILED);
      this.emit('EXECUTION_FAILED', { executionId: context.executionId, error });
    }
  }

  public pauseExecution(): void {
    this.stateMachine.transition(ExecutionState.PAUSED);
    this.emit('EXECUTION_PAUSED', { executionId: this.currentContext?.executionId });
  }

  public resumeExecution(): void {
    this.stateMachine.transition(ExecutionState.RUNNING);
    this.emit('EXECUTION_RESUMED', { executionId: this.currentContext?.executionId });
  }

  public cancelExecution(): void {
    this.stateMachine.transition(ExecutionState.CANCELLED);
    this.emit('EXECUTION_CANCELLED', { executionId: this.currentContext?.executionId });
  }
  
  public getState(): ExecutionState {
    return this.stateMachine.getState();
  }
}
