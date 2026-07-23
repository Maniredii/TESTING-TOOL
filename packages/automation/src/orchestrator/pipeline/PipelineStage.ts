import { PipelineContext } from './PipelineContext';

export interface PipelineStage {
  id: string;
  name: string;
  
  initialize(context: PipelineContext): Promise<void>;
  execute(context: PipelineContext): Promise<void>;
  cleanup(context: PipelineContext): Promise<void>;
}
