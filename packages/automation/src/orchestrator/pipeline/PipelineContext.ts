import { ExecutionResult } from '../../results/ExecutionResult';
import { EvidenceBundle } from '../../evidence/models/EvidenceBundle';
import { ValidationResult } from '../../validation/models/ValidationResult';
import { ExecutionAggregate } from '../../aggregation/models/ExecutionAggregate';
import { WebsiteGraph } from '../../graph/WebsiteGraph';
import { ReportModel } from '../../reporting/models/ReportModel';

export interface PipelineContext {
  executionId: string;
  projectId: string;
  configurationId: string;
  configuration: any;
  
  // Accumulated state
  browserSession?: any; // Mocked browser session
  websiteGraph?: WebsiteGraph;
  executionPlan?: any;
  executionResult?: ExecutionResult;
  evidenceBundle?: EvidenceBundle;
  validationResult?: ValidationResult;
  executionAggregate?: ExecutionAggregate;
  reports?: Record<string, string | Buffer>; // Format -> Report Data
}
