import { ExecutionStateMachine } from '../state/ExecutionStateMachine';
import { ExecutionState } from '../state/ExecutionState';

describe('ExecutionStateMachine', () => {
  let machine: ExecutionStateMachine;

  beforeEach(() => {
    machine = new ExecutionStateMachine();
  });

  it('should initialize in CREATED state', () => {
    expect(machine.getState()).toBe(ExecutionState.CREATED);
  });

  it('should allow valid transitions', () => {
    machine.transition(ExecutionState.INITIALIZING);
    expect(machine.getState()).toBe(ExecutionState.INITIALIZING);

    machine.transition(ExecutionState.RUNNING);
    expect(machine.getState()).toBe(ExecutionState.RUNNING);

    machine.transition(ExecutionState.PAUSED);
    expect(machine.getState()).toBe(ExecutionState.PAUSED);
  });

  it('should throw error on invalid transitions', () => {
    expect(() => {
      machine.transition(ExecutionState.COMPLETED); // Cannot go from CREATED to COMPLETED directly
    }).toThrow(/Invalid state transition/);
  });
});
