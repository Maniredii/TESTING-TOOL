import { ValidationSectionBuilder } from '../sections/ValidationSectionBuilder';
import { ExecutionAggregate } from '../../aggregation/models/ExecutionAggregate';
import { ReportSectionType } from '../models/ReportSection';
import { Severity } from '../../validation/severity/Severity';

describe('ValidationSectionBuilder', () => {
  let builder: ValidationSectionBuilder;

  beforeEach(() => {
    builder = new ValidationSectionBuilder();
  });

  it('should build validation section and group by severity', () => {
    const aggregate: Partial<ExecutionAggregate> = {
      validationFindings: {
        summary: { totalFindings: 2 } as any,
        findings: [
          { id: '1', category: 'Net', title: 'Error', description: '', timestamp: new Date(), evidenceReferences: [], severity: Severity.CRITICAL },
          { id: '2', category: 'DOM', title: 'Link', description: '', timestamp: new Date(), evidenceReferences: [], severity: Severity.MEDIUM }
        ]
      } as any
    };

    const section = builder.build(aggregate as any);
    expect(section.type).toBe(ReportSectionType.VALIDATION);
    expect(section.content.totalFindings).toBe(2);
    expect(section.content.findingsBySeverity[Severity.CRITICAL]).toHaveLength(1);
    expect(section.content.findingsBySeverity[Severity.MEDIUM]).toHaveLength(1);
  });
});
