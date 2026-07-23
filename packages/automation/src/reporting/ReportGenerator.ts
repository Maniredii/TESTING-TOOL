import { ExecutionAggregate } from '../aggregation/models/ExecutionAggregate';
import { ReportModel } from './models/ReportModel';
import { ReportSection } from './models/ReportSection';
import { SummarySectionBuilder } from './sections/SummarySectionBuilder';
import { ValidationSectionBuilder } from './sections/ValidationSectionBuilder';
import { RecommendationSectionBuilder } from './sections/RecommendationSectionBuilder';
import { RendererFactory, ReportFormat } from './renderers/RendererFactory';

export class ReportGenerator {
  private summaryBuilder: SummarySectionBuilder;
  private validationBuilder: ValidationSectionBuilder;
  private recommendationBuilder: RecommendationSectionBuilder;
  private rendererFactory: RendererFactory;

  constructor() {
    this.summaryBuilder = new SummarySectionBuilder();
    this.validationBuilder = new ValidationSectionBuilder();
    this.recommendationBuilder = new RecommendationSectionBuilder();
    this.rendererFactory = new RendererFactory();
  }

  public async generateReport(aggregate: ExecutionAggregate, format: ReportFormat = ReportFormat.JSON): Promise<string | Buffer> {
    const sections: ReportSection[] = [];
    
    sections.push(this.summaryBuilder.build(aggregate));
    sections.push(this.validationBuilder.build(aggregate));
    sections.push(this.recommendationBuilder.build(aggregate));

    const model: ReportModel = {
      metadata: {
        title: `Test Execution - ${aggregate.metadata.executionId}`,
        generatedAt: new Date(),
        executionId: aggregate.metadata.executionId,
      },
      sections
    };

    const exporter = this.rendererFactory.getRenderer(format);
    return await exporter.export(model);
  }
}
