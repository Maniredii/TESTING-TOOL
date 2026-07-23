import { EventEmitter } from 'events';

export interface ExecutionJob {
  executionId: string;
  projectId: string;
  configurationId?: string;
}

export class ExecutionQueue extends EventEmitter {
  private queue: ExecutionJob[] = [];
  
  public enqueue(job: ExecutionJob): void {
    this.queue.push(job);
    this.emit('job_added', job);
  }

  public dequeue(): ExecutionJob | undefined {
    return this.queue.shift();
  }

  public getLength(): number {
    return this.queue.length;
  }
}

// Singleton instance for the application
export const executionQueue = new ExecutionQueue();
