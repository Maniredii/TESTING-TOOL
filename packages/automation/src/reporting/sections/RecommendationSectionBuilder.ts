import { ExecutionAggregate } from '../../aggregation/models/ExecutionAggregate';
import { ReportSection, ReportSectionType } from '../models/ReportSection';

export class RecommendationSectionBuilder {
  public build(aggregate: ExecutionAggregate): ReportSection {
    const findings = aggregate.validationFindings?.findings || [];
    const recommendations: string[] = [];
    const uniqueFindings = new Set(findings.map(f => f.title.toLowerCase()));

    if (uniqueFindings.has('broken link')) {
      recommendations.push('Recommend verifying internal routing and ensuring all linked pages exist.');
    }
    
    if (uniqueFindings.has('javascript console error')) {
      recommendations.push('Recommend checking JavaScript bundles for syntax or runtime errors.');
    }

    if (uniqueFindings.has('unhandled exception')) {
      recommendations.push('Recommend reviewing asynchronous code and adding global error handlers.');
    }

    const networkStats = aggregate.statistics?.networkStatistics;
    if (networkStats && networkStats.failedRequests > 0) {
      recommendations.push('Recommend backend investigation. Multiple network requests failed.');
    }

    if (recommendations.length === 0) {
      recommendations.push('No critical issues found. Execution was successful.');
    }

    return {
      id: 'recommendation-section',
      type: ReportSectionType.RECOMMENDATION,
      title: 'Recommendations',
      content: {
        recommendations
      }
    };
  }
}
