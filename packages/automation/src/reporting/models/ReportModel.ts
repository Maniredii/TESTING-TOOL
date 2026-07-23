import { ReportSection } from './ReportSection';

export interface ReportMetadata {
  title: string;
  generatedAt: Date;
  executionId: string;
}

export interface ReportModel {
  metadata: ReportMetadata;
  sections: ReportSection[];
}
