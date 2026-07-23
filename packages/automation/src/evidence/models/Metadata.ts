export interface EvidenceMetadata {
  browser: string;
  viewport: { width: number; height: number };
  url: string;
  pageTitle: string;
  executionId: string;
  configurationId?: string;
  timestamp: Date;
}
