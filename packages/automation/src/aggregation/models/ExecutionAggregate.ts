import { ExecutionResult } from '../../results/ExecutionResult';
import { EvidenceBundle } from '../../evidence/models/EvidenceBundle';
import { ValidationResult } from '../../validation/models/ValidationResult';
import { WebsiteGraph } from '../../graph/WebsiteGraph';
import { ExecutionSummary } from './ExecutionSummary';
import { ExecutionStatistics } from './ExecutionStatistics';
import { UnifiedTimeline } from './UnifiedTimeline';

// Assuming we have an ExecutionPlan type somewhere, we'll use 'any' as a placeholder if not
// ExecutionMetrics is part of ExecutionResult

export interface ExecutionMetadata {
  executionId: string;
  timestamp: Date;
  environment: string; // e.g., 'staging', 'production'
  browser: string;
}

export interface ExecutionAggregate {
  metadata: ExecutionMetadata;
  projectMetadata?: any;
  configurationMetadata?: any;
  
  timeline: UnifiedTimeline;
  actionHistory: ExecutionResult;
  evidence: EvidenceBundle;
  validationFindings: ValidationResult;
  graphSummary?: WebsiteGraph;
  
  summary: ExecutionSummary;
  statistics: ExecutionStatistics;
}
