import { ValidationFinding } from '../findings/ValidationFinding';
import { ValidationSummary } from './ValidationSummary';

export interface ValidationResult {
  executionId: string;
  timestamp: Date;
  summary: ValidationSummary;
  findings: ValidationFinding[];
}
