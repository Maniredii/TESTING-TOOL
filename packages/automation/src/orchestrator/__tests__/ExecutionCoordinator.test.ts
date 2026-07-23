import { ExecutionCoordinator } from '../runtime/ExecutionCoordinator';
import { PipelineRunner } from '../pipeline/PipelineRunner';
import { ExecutionState } from '../state/ExecutionState';

describe('ExecutionCoordinator', () => {
  let runner: PipelineRunner;
  let coordinator: ExecutionCoordinator;

  beforeEach(() => {
    runner = new PipelineRunner();
    // Stub runner to just resolve
    jest.spyOn(runner, 'run').mockResolvedValue();
    coordinator = new ExecutionCoordinator(runner);
  });

  it('should run execution and manage state', async () => {
    const context: any = { executionId: 'test-1' };
    
    // Watch events
    const startedSpy = jest.fn();
    const completedSpy = jest.fn();
    coordinator.on('EXECUTION_STARTED', startedSpy);
    coordinator.on('EXECUTION_COMPLETED', completedSpy);

    await coordinator.startExecution(context);

    expect(runner.run).toHaveBeenCalledWith(context);
    expect(startedSpy).toHaveBeenCalled();
    expect(completedSpy).toHaveBeenCalled();
    expect(coordinator.getState()).toBe(ExecutionState.COMPLETED);
  });

  it('should handle pause and resume', () => {
    const context: any = { executionId: 'test-2' };
    // Just force the internal context to be set for this test without waiting for runner
    coordinator['currentContext'] = context;
    coordinator['stateMachine'].transition(ExecutionState.INITIALIZING);
    coordinator['stateMachine'].transition(ExecutionState.RUNNING);

    coordinator.pauseExecution();
    expect(coordinator.getState()).toBe(ExecutionState.PAUSED);

    coordinator.resumeExecution();
    expect(coordinator.getState()).toBe(ExecutionState.RUNNING);
  });
});
