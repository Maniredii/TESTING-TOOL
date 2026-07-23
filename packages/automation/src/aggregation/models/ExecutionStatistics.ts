export interface ExecutionStatistics {
  successRate: number; // 0 to 1
  failureRate: number;
  averageActionTimeMs: number;
  totalNavigationTimeMs: number;
  retryCount: number;
  networkStatistics: {
    totalRequests: number;
    failedRequests: number;
    averageResponseTimeMs: number;
  };
  consoleErrorCount: number;
}
