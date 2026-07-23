import { PipelineStage } from './PipelineStage';
import { PipelineContext } from './PipelineContext';
import { EventEmitter } from 'events';

export class PipelineRunner extends EventEmitter {
  private stages: PipelineStage[] = [];

  public registerStage(stage: PipelineStage): void {
    this.stages.push(stage);
  }

  public async run(context: PipelineContext): Promise<void> {
    for (const stage of this.stages) {
      this.emit('STAGE_STARTED', { stageId: stage.id, executionId: context.executionId });
      
      try {
        await stage.initialize(context);
        await stage.execute(context);
        await stage.cleanup(context);
        
        this.emit('STAGE_COMPLETED', { stageId: stage.id, executionId: context.executionId });
      } catch (error) {
        this.emit('STAGE_FAILED', { stageId: stage.id, executionId: context.executionId, error });
        throw error;
      }
    }
  }
}
