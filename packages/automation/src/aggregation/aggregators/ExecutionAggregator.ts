import { ExecutionResult } from '../../results/ExecutionResult';
import { EvidenceBundle } from '../../evidence/models/EvidenceBundle';
import { ValidationResult } from '../../validation/models/ValidationResult';
import { WebsiteGraph } from '../../graph/WebsiteGraph';
import { ExecutionAggregate } from '../models/ExecutionAggregate';
import { StatisticsBuilder } from '../statistics/StatisticsBuilder';
import { SummaryBuilder } from '../summary/SummaryBuilder';
import { UnifiedTimelineBuilder } from '../timeline/UnifiedTimelineBuilder';

export class ExecutionAggregator {
  private statisticsBuilder: StatisticsBuilder;
  private summaryBuilder: SummaryBuilder;
  private timelineBuilder: UnifiedTimelineBuilder;

  constructor() {
    this.statisticsBuilder = new StatisticsBuilder();
    this.summaryBuilder = new SummaryBuilder();
    this.timelineBuilder = new UnifiedTimelineBuilder();
  }

  public aggregate(
    executionResult: ExecutionResult,
    evidenceBundle: EvidenceBundle,
    validationResult: ValidationResult,
    websiteGraph?: WebsiteGraph,
    executionPlan?: any,
    executionMetrics?: any
  ): ExecutionAggregate {
    const statistics = this.statisticsBuilder.build(executionResult, evidenceBundle);
    const summary = this.summaryBuilder.build(executionResult, evidenceBundle, validationResult);
    const timeline = this.timelineBuilder.build(executionResult, evidenceBundle, validationResult);

    return {
      metadata: {
        executionId: executionResult.planId || 'unknown',
        timestamp: new Date(),
        environment: 'unknown',
        browser: evidenceBundle.metadata?.browser || 'unknown',
      },
      projectMetadata: {}, // Placeholder
      configurationMetadata: executionPlan?.configuration || {},
      timeline,
      actionHistory: executionResult,
      evidence: evidenceBundle,
      validationFindings: validationResult,
      graphSummary: websiteGraph,
      summary,
      statistics,
    };
  }
}
