import { ExecutionAggregate } from '../../aggregation/models/ExecutionAggregate';
import { ReportSection, ReportSectionType } from '../models/ReportSection';

export class SummarySectionBuilder {
  public build(aggregate: ExecutionAggregate): ReportSection {
    const summary = aggregate.summary;
    const metadata = aggregate.metadata;

    return {
      id: 'summary-section',
      type: ReportSectionType.SUMMARY,
      title: 'Executive Summary',
      content: {
        executionId: metadata.executionId,
        environment: metadata.environment,
        browser: metadata.browser,
        timestamp: metadata.timestamp,
        passCount: summary?.passCount || 0,
        failCount: summary?.failCount || 0,
        skippedCount: summary?.skippedCount || 0,
        durationMs: summary?.durationMs || 0,
      }
    };
  }
}
