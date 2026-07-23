export enum ReportSectionType {
  SUMMARY = 'SUMMARY',
  TIMELINE = 'TIMELINE',
  VALIDATION = 'VALIDATION',
  EVIDENCE = 'EVIDENCE',
  GRAPH = 'GRAPH',
  METRICS = 'METRICS',
  RECOMMENDATION = 'RECOMMENDATION',
}

export interface ReportSection {
  id: string;
  type: ReportSectionType;
  title: string;
  content: any; // Dependent on section type (e.g. key-value pairs, tables, charts, lists)
}
