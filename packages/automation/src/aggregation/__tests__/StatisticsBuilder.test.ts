import { StatisticsBuilder } from '../statistics/StatisticsBuilder';
import { ExecutionResult } from '../../results/ExecutionResult';
import { EvidenceBundle } from '../../evidence/models/EvidenceBundle';
import { ActionStatus } from '../../results/ActionResult';

describe('StatisticsBuilder', () => {
  let builder: StatisticsBuilder;

  beforeEach(() => {
    builder = new StatisticsBuilder();
  });

  it('should calculate statistics correctly', () => {
    const executionResult: Partial<ExecutionResult> = {
      actionResults: [
        { actionId: '1', actionType: 'CLICK', status: ActionStatus.SUCCESS, duration: 100, startTime: new Date(), endTime: new Date(), previousUrl: '', currentUrl: '' },
        { actionId: '2', actionType: 'NAVIGATE', status: ActionStatus.SUCCESS, duration: 200, startTime: new Date(), endTime: new Date(), previousUrl: '', currentUrl: '' },
        { actionId: '3', actionType: 'INPUT', status: ActionStatus.FAILED, duration: 150, startTime: new Date(), endTime: new Date(), previousUrl: '', currentUrl: '' }
      ],
      metrics: { totalExecutionTime: 450, totalActions: 3, passedActions: 2, failedActions: 1, retryCount: 1 } as any
    };

    const evidenceBundle: Partial<EvidenceBundle> = {
      network: {
        entries: [
          { url: 'http://a.com', method: 'GET', requestHeaders: {}, startTime: new Date(), duration: 100, statusCode: 200 },
          { url: 'http://b.com', method: 'GET', requestHeaders: {}, startTime: new Date(), duration: 300, statusCode: 500 }
        ]
      },
      consoleLogs: {
        entries: [
          { type: 'error', text: 'Error', timestamp: new Date() }
        ]
      }
    } as any;

    const stats = builder.build(executionResult as any, evidenceBundle as any);
    
    expect(stats.successRate).toBeCloseTo(0.667, 3);
    expect(stats.failureRate).toBeCloseTo(0.333, 3);
    expect(stats.averageActionTimeMs).toBe(150); // (100+200+150)/3
    expect(stats.totalNavigationTimeMs).toBe(200);
    expect(stats.retryCount).toBe(1);
    expect(stats.networkStatistics.totalRequests).toBe(2);
    expect(stats.networkStatistics.failedRequests).toBe(1);
    expect(stats.networkStatistics.averageResponseTimeMs).toBe(200); // (100+300)/2
    expect(stats.consoleErrorCount).toBe(1);
  });
});
