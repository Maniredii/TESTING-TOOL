import { ExecutionAggregator } from '../aggregators/ExecutionAggregator';

describe('ExecutionAggregator', () => {
  let aggregator: ExecutionAggregator;

  beforeEach(() => {
    aggregator = new ExecutionAggregator();
  });

  it('should aggregate all components into ExecutionAggregate', () => {
    const executionResult: any = {
      planId: 'test-exec',
      actionResults: [],
      metrics: { totalDuration: 0 }
    };

    const evidenceBundle: any = {
      metadata: { browser: 'chromium' },
      network: { entries: [] },
      consoleLogs: { entries: [] },
      timeline: { entries: [] }
    };

    const validationResult: any = {
      summary: { totalFindings: 0 },
      findings: []
    };

    const graph: any = { nodes: [] };
    const plan: any = { configuration: { retries: 2 } };

    const aggregate = aggregator.aggregate(
      executionResult,
      evidenceBundle,
      validationResult,
      graph,
      plan,
      {}
    );

    expect(aggregate.metadata.executionId).toBe('test-exec');
    expect(aggregate.metadata.browser).toBe('chromium');
    expect(aggregate.configurationMetadata.retries).toBe(2);
    
    expect(aggregate.actionHistory).toBe(executionResult);
    expect(aggregate.evidence).toBe(evidenceBundle);
    expect(aggregate.validationFindings).toBe(validationResult);
    expect(aggregate.graphSummary).toBe(graph);

    expect(aggregate.statistics).toBeDefined();
    expect(aggregate.summary).toBeDefined();
    expect(aggregate.timeline).toBeDefined();
  });
});
