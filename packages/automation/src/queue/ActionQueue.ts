import { ExecutionPlan } from '../planning/models/ExecutionPlan';
import { ExecutionStep, StepStatus } from '../planning/models/ExecutionStep';

export class ActionQueue {
  private steps: ExecutionStep[] = [];
  private isPaused: boolean = false;

  /**
   * Loads an entire ExecutionPlan into the queue.
   * Can optionally clear existing steps or append to them.
   */
  public loadPlan(plan: ExecutionPlan, append: boolean = false): void {
    if (!append) {
      this.steps = [];
    }
    this.steps.push(...plan.steps);
  }

  public dequeue(): ExecutionStep | undefined {
    if (this.isPaused) return undefined;
    
    // Find the first pending step
    const index = this.steps.findIndex(s => s.status === StepStatus.PENDING);
    if (index === -1) return undefined;

    const step = this.steps[index];
    step.status = StepStatus.IN_PROGRESS;
    return step;
  }

  public pause(): void {
    this.isPaused = true;
  }

  public resume(): void {
    this.isPaused = false;
  }

  public cancel(): void {
    this.steps.forEach(s => {
      if (s.status === StepStatus.PENDING) {
        s.status = StepStatus.CANCELLED;
      }
    });
  }

  public skip(stepId: string): void {
    const step = this.steps.find(s => s.id === stepId);
    if (step && step.status === StepStatus.PENDING) {
      step.status = StepStatus.SKIPPED;
    }
  }

  public retry(stepId: string): void {
    const step = this.steps.find(s => s.id === stepId);
    if (step && (step.status === StepStatus.FAILED || step.status === StepStatus.SKIPPED)) {
      step.status = StepStatus.PENDING;
    }
  }

  public isEmpty(): boolean {
    return this.steps.filter(s => s.status === StepStatus.PENDING).length === 0;
  }
}
