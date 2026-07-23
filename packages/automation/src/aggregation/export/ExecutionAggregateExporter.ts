import { ExecutionAggregate } from '../models/ExecutionAggregate';

export class ExecutionAggregateExporter {
  // Must NOT generate HTML, PDF, dashboards, or analytics.
  
  public exportAsJSON(aggregate: ExecutionAggregate): string {
    return JSON.stringify(aggregate, null, 2);
  }

  public getRawAggregate(aggregate: ExecutionAggregate): ExecutionAggregate {
    return aggregate;
  }
}
