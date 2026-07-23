import { ExecutionStep } from './ExecutionStep';
import * as crypto from 'crypto';

export class ExecutionPlan {
  public id: string;
  public createdAt: Date;
  public steps: ExecutionStep[];
  public goal: string; // e.g. "Complete Login", "Crawl Page"

  constructor(goal: string) {
    this.id = crypto.randomUUID();
    this.createdAt = new Date();
    this.steps = [];
    this.goal = goal;
  }

  public addStep(step: ExecutionStep): void {
    this.steps.push(step);
    // Ensure they remain sorted by intended order
    this.steps.sort((a, b) => a.order - b.order);
  }
}
