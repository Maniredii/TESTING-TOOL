import { EventEmitter } from 'events';
import { AutomationOrchestrator } from '@testing-platform/automation/src/orchestrator/runtime/AutomationOrchestrator';

export class ExecutionEventEmitter extends EventEmitter {
  constructor(private orchestrator: AutomationOrchestrator) {
    super();
    this.setupBindings();
  }

  private setupBindings() {
    const coordinator = this.orchestrator.getCoordinator();

    coordinator.on('EXECUTION_STARTED', (data) => this.emit('ws_event', { type: 'EXECUTION_STARTED', payload: data }));
    coordinator.on('STAGE_STARTED', (data) => this.emit('ws_event', { type: 'STAGE_STARTED', payload: data }));
    coordinator.on('STAGE_COMPLETED', (data) => this.emit('ws_event', { type: 'STAGE_COMPLETED', payload: data }));
    coordinator.on('EXECUTION_COMPLETED', (data) => this.emit('ws_event', { type: 'EXECUTION_COMPLETED', payload: data }));
    coordinator.on('EXECUTION_FAILED', (data) => this.emit('ws_event', { type: 'EXECUTION_FAILED', payload: data }));
  }
}
