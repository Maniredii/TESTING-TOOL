import { ExecutionAggregate } from '../../aggregation/models/ExecutionAggregate';
import { ReportSection, ReportSectionType } from '../models/ReportSection';

export class ValidationSectionBuilder {
  public build(aggregate: ExecutionAggregate): ReportSection {
    const validationFindings = aggregate.validationFindings?.findings || [];
    
    // Group findings by severity
    const grouped = validationFindings.reduce((acc, finding) => {
      const severity = finding.severity.toString();
      if (!acc[severity]) acc[severity] = [];
      acc[severity].push(finding);
      return acc;
    }, {} as Record<string, any[]>);

    return {
      id: 'validation-section',
      type: ReportSectionType.VALIDATION,
      title: 'Validation Summary',
      content: {
        totalFindings: validationFindings.length,
        findingsBySeverity: grouped,
        rawFindings: validationFindings,
      }
    };
  }
}
