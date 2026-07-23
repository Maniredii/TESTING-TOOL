import { ActionQueue } from '../queue/ActionQueue';
import { ExecutionPlan } from '../planning/models/ExecutionPlan';
import { StepStatus } from '../planning/models/ExecutionStep';

describe('ActionQueue', () => {
  let queue: ActionQueue;
  let plan: ExecutionPlan;

  beforeEach(() => {
    queue = new ActionQueue();
    plan = new ExecutionPlan('Test');
    plan.addStep({ id: '1', order: 1, candidate: {} as any, status: StepStatus.PENDING });
    plan.addStep({ id: '2', order: 2, candidate: {} as any, status: StepStatus.PENDING });
  });

  it('should load a plan and dequeue steps sequentially', () => {
    queue.loadPlan(plan);
    expect(queue.isEmpty()).toBe(false);

    const step1 = queue.dequeue();
    expect(step1?.id).toBe('1');
    expect(step1?.status).toBe(StepStatus.IN_PROGRESS);

    const step2 = queue.dequeue();
    expect(step2?.id).toBe('2');
  });

  it('should pause and resume', () => {
    queue.loadPlan(plan);
    queue.pause();
    
    expect(queue.dequeue()).toBeUndefined();
    
    queue.resume();
    expect(queue.dequeue()?.id).toBe('1');
  });

  it('should cancel pending steps', () => {
    queue.loadPlan(plan);
    queue.cancel();
    
    expect(queue.isEmpty()).toBe(true);
    expect(plan.steps[0].status).toBe(StepStatus.CANCELLED);
  });

  it('should skip a step', () => {
    queue.loadPlan(plan);
    queue.skip('1');
    
    const step = queue.dequeue();
    expect(step?.id).toBe('2'); // Skipped 1
  });
});
