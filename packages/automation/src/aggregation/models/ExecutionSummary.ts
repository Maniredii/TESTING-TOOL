import { ValidationSummary } from '../../validation/models/ValidationSummary';

export interface ExecutionSummary {
  executionId: string;
  passCount: number;
  failCount: number;
  skippedCount: number;
  durationMs: number;
  visitedPages: number;
  visitedElements: number;
  capturedScreenshots: number;
  capturedVideos: number;
  capturedLogs: number;
  validationSummary?: ValidationSummary;
}
