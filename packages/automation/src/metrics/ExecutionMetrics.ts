export interface ExecutionMetrics {
  totalExecutionTime: number;
  totalActionTime: number;
  retryCount: number;
  failureCount: number;
  successRate: number;
}

export class MetricsTracker {
  private metrics: ExecutionMetrics;

  constructor() {
    this.metrics = {
      totalExecutionTime: 0,
      totalActionTime: 0,
      retryCount: 0,
      failureCount: 0,
      successRate: 1,
    };
  }

  public recordRetry(): void {
    this.metrics.retryCount++;
  }

  public recordFailure(): void {
    this.metrics.failureCount++;
  }

  public recordActionTime(duration: number): void {
    this.metrics.totalActionTime += duration;
  }

  public finalize(totalExecutionTime: number, totalActions: number): void {
    this.metrics.totalExecutionTime = totalExecutionTime;
    const successes = totalActions - this.metrics.failureCount;
    this.metrics.successRate = totalActions > 0 ? successes / totalActions : 1;
  }

  public getMetrics(): ExecutionMetrics {
    return { ...this.metrics };
  }
}
