import { ExecutionState } from './ExecutionState';

export class ExecutionStateMachine {
  private currentState: ExecutionState;
  private allowedTransitions: Record<ExecutionState, ExecutionState[]>;

  constructor() {
    this.currentState = ExecutionState.CREATED;
    
    this.allowedTransitions = {
      [ExecutionState.CREATED]: [ExecutionState.INITIALIZING, ExecutionState.CANCELLED],
      [ExecutionState.INITIALIZING]: [ExecutionState.RUNNING, ExecutionState.FAILED, ExecutionState.CANCELLED],
      [ExecutionState.RUNNING]: [ExecutionState.PAUSED, ExecutionState.WAITING_FOR_USER, ExecutionState.FAILED, ExecutionState.COMPLETED, ExecutionState.CANCELLED],
      [ExecutionState.PAUSED]: [ExecutionState.RUNNING, ExecutionState.CANCELLED],
      [ExecutionState.WAITING_FOR_USER]: [ExecutionState.RUNNING, ExecutionState.CANCELLED],
      [ExecutionState.RETRYING]: [ExecutionState.RUNNING, ExecutionState.FAILED, ExecutionState.CANCELLED],
      [ExecutionState.FAILED]: [ExecutionState.RETRYING, ExecutionState.CANCELLED],
      [ExecutionState.COMPLETED]: [],
      [ExecutionState.CANCELLED]: [],
    };
  }

  public getState(): ExecutionState {
    return this.currentState;
  }

  public transition(newState: ExecutionState): void {
    const allowed = this.allowedTransitions[this.currentState];
    if (allowed.includes(newState)) {
      this.currentState = newState;
    } else {
      throw new Error(`Invalid state transition from ${this.currentState} to ${newState}`);
    }
  }
}
