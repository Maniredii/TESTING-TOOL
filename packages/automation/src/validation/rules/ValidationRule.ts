import { ValidationFinding } from '../findings/ValidationFinding';
import { ExecutionResult } from '../../results/ExecutionResult';
import { EvidenceBundle } from '../../evidence/models/EvidenceBundle';
import { WebsiteGraph } from '../../graph/WebsiteGraph'; // Assuming it's in graph module

export interface ValidationRuleConfig {
  enabled: boolean;
  severityOverride?: any;
  customThresholds?: Record<string, any>;
}

export interface ValidationContext {
  executionResult: ExecutionResult;
  evidenceBundle: EvidenceBundle;
  websiteGraph?: WebsiteGraph;
}

export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  config: ValidationRuleConfig;
  
  validate(context: ValidationContext): Promise<ValidationFinding[]>;
}
