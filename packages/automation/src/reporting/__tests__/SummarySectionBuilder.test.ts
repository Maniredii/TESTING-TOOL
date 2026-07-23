import { SummarySectionBuilder } from '../sections/SummarySectionBuilder';
import { ExecutionAggregate } from '../../aggregation/models/ExecutionAggregate';
import { ReportSectionType } from '../models/ReportSection';

describe('SummarySectionBuilder', () => {
  let builder: SummarySectionBuilder;

  beforeEach(() => {
    builder = new SummarySectionBuilder();
  });

  it('should build summary section', () => {
    const aggregate: Partial<ExecutionAggregate> = {
      metadata: { executionId: '123', environment: 'prod', browser: 'chrome', timestamp: new Date() },
      summary: {
        executionId: '123',
        passCount: 5,
        failCount: 2,
        skippedCount: 0,
        durationMs: 1500,
        visitedPages: 2,
        visitedElements: 10,
        capturedScreenshots: 0,
        capturedVideos: 0,
        capturedLogs: 0
      }
    };

    const section = builder.build(aggregate as any);
    expect(section.type).toBe(ReportSectionType.SUMMARY);
    expect(section.content.passCount).toBe(5);
    expect(section.content.durationMs).toBe(1500);
  });
});
