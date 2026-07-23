import { ExecutionEventEmitter } from '../events/ExecutionEventEmitter';
import { AutomationOrchestrator } from '@testing-platform/automation/src/orchestrator/runtime/AutomationOrchestrator';

describe('ExecutionEventEmitter', () => {
  it('should forward orchestrator events as ws_events', (done) => {
    const orchestrator = new AutomationOrchestrator();
    const emitter = new ExecutionEventEmitter(orchestrator);
    
    emitter.on('ws_event', (event) => {
      expect(event.type).toBe('EXECUTION_STARTED');
      expect(event.payload.executionId).toBe('test-id');
      done();
    });

    orchestrator.getCoordinator().emit('EXECUTION_STARTED', { executionId: 'test-id' });
  });
});
