import { ReportGenerator } from '../ReportGenerator';
import { ExecutionAggregate } from '../../aggregation/models/ExecutionAggregate';
import { ReportFormat } from '../renderers/RendererFactory';

describe('ReportGenerator', () => {
  let generator: ReportGenerator;

  beforeEach(() => {
    generator = new ReportGenerator();
  });

  it('should generate a JSON report', async () => {
    const aggregate: Partial<ExecutionAggregate> = {
      metadata: { executionId: 'test-1', timestamp: new Date(), environment: 'test', browser: 'chrome' },
      summary: {} as any,
      validationFindings: {} as any
    };

    const reportStr = await generator.generateReport(aggregate as any, ReportFormat.JSON);
    const parsed = JSON.parse(reportStr as string);
    
    expect(parsed.metadata.executionId).toBe('test-1');
    expect(parsed.sections).toBeDefined();
    expect(parsed.sections.length).toBeGreaterThan(0);
  });
});
