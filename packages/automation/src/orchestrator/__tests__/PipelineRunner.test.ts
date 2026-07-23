import { PipelineRunner } from '../pipeline/PipelineRunner';
import { PipelineStage } from '../pipeline/PipelineStage';
import { PipelineContext } from '../pipeline/PipelineContext';

class MockStage implements PipelineStage {
  id = 'mock-stage';
  name = 'Mock Stage';
  public initCalled = false;
  public execCalled = false;
  public cleanupCalled = false;

  async initialize(context: PipelineContext) { this.initCalled = true; }
  async execute(context: PipelineContext) { this.execCalled = true; }
  async cleanup(context: PipelineContext) { this.cleanupCalled = true; }
}

describe('PipelineRunner', () => {
  let runner: PipelineRunner;

  beforeEach(() => {
    runner = new PipelineRunner();
  });

  it('should execute registered stages sequentially', async () => {
    const stage1 = new MockStage();
    stage1.id = 'stage1';
    const stage2 = new MockStage();
    stage2.id = 'stage2';

    runner.registerStage(stage1);
    runner.registerStage(stage2);

    const context: any = { executionId: 'test-exec' };

    await runner.run(context);

    expect(stage1.initCalled).toBe(true);
    expect(stage1.execCalled).toBe(true);
    expect(stage1.cleanupCalled).toBe(true);
    
    expect(stage2.initCalled).toBe(true);
    expect(stage2.execCalled).toBe(true);
    expect(stage2.cleanupCalled).toBe(true);
  });
});
