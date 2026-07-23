import { SummaryBuilder } from '../summary/SummaryBuilder';
import { ExecutionResult } from '../../results/ExecutionResult';
import { EvidenceBundle } from '../../evidence/models/EvidenceBundle';
import { ValidationResult } from '../../validation/models/ValidationResult';
import { ActionStatus } from '../../results/ActionResult';

describe('SummaryBuilder', () => {
  let builder: SummaryBuilder;

  beforeEach(() => {
    builder = new SummaryBuilder();
  });

  it('should build execution summary correctly', () => {
    const executionResult: Partial<ExecutionResult> = {
      planId: 'test-plan',
      actionResults: [
        { actionId: '1', actionType: 'CLICK', status: ActionStatus.SUCCESS, startTime: new Date(), endTime: new Date(), duration: 1, previousUrl: '', currentUrl: 'http://a.com' },
        { actionId: '2', actionType: 'INPUT', status: ActionStatus.FAILED, startTime: new Date(), endTime: new Date(), duration: 1, previousUrl: '', currentUrl: 'http://a.com' },
        { actionId: '3', actionType: 'NAVIGATE', status: ActionStatus.SKIPPED, startTime: new Date(), endTime: new Date(), duration: 1, previousUrl: '', currentUrl: 'http://b.com' }
      ],
      metrics: { totalExecutionTime: 1000 } as any
    };

    const evidenceBundle: Partial<EvidenceBundle> = {
      screenshots: { screenshots: [{}] } as any,
      videos: { videos: [{}, {}] } as any,
      consoleLogs: { entries: [{}, {}, {}] } as any
    };

    const validationResult: Partial<ValidationResult> = {
      summary: { totalFindings: 5 } as any
    };

    const summary = builder.build(executionResult as any, evidenceBundle as any, validationResult as any);

    expect(summary.executionId).toBe('test-plan');
    expect(summary.passCount).toBe(1);
    expect(summary.failCount).toBe(1);
    expect(summary.skippedCount).toBe(1);
    expect(summary.durationMs).toBe(1000);
    expect(summary.visitedPages).toBe(2);
    expect(summary.visitedElements).toBe(2); // CLICK, INPUT
    expect(summary.capturedScreenshots).toBe(1);
    expect(summary.capturedVideos).toBe(2);
    expect(summary.capturedLogs).toBe(3);
    expect(summary.validationSummary?.totalFindings).toBe(5);
  });
});
