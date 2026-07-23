import { AutomationOrchestrator } from '../runtime/AutomationOrchestrator';

describe('AutomationOrchestrator', () => {
  let orchestrator: AutomationOrchestrator;

  beforeEach(() => {
    orchestrator = new AutomationOrchestrator();
    // Stub internal execution coordinator to prevent actual async running
    jest.spyOn(orchestrator.getCoordinator(), 'startExecution').mockResolvedValue();
  });

  it('should initialize and run execution', async () => {
    const executionId = await orchestrator.runExecution('proj-1', 'config-1');
    expect(executionId).toBeDefined();
    expect(typeof executionId).toBe('string');
  });

  it('should throw when pausing unknown execution', () => {
    expect(() => {
      orchestrator.pauseExecution('unknown');
    }).toThrow(/not found/);
  });
});
