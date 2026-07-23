import { ExecutionResult } from '../../results/ExecutionResult';
import { EvidenceBundle } from '../../evidence/models/EvidenceBundle';
import { ValidationResult } from '../../validation/models/ValidationResult';
import { ExecutionSummary } from '../models/ExecutionSummary';

export class SummaryBuilder {
  public build(
    executionResult: ExecutionResult,
    evidenceBundle: EvidenceBundle,
    validationResult: ValidationResult
  ): ExecutionSummary {
    const actions = executionResult.actionResults || [];
    
    const passCount = actions.filter(a => a.status.toString().toUpperCase() === 'SUCCESS').length;
    const failCount = actions.filter(a => a.status.toString().toUpperCase() === 'FAILED').length;
    const skippedCount = actions.filter(a => a.status.toString().toUpperCase() === 'SKIPPED').length;
    
    const durationMs = executionResult.metrics?.totalExecutionTime || 0;
    
    // In a real implementation, visitedPages might come from GraphCache or unique URLs in actions
    const visitedPages = new Set(actions.map(a => a.currentUrl).filter(Boolean)).size;
    
    // Element interactions can be approximated by number of interactive actions
    const visitedElements = actions.filter(a => !['WAIT', 'NAVIGATE'].includes(a.actionType)).length;
    
    const capturedScreenshots = evidenceBundle.screenshots?.screenshots?.length || 0;
    const capturedVideos = evidenceBundle.videos?.videos?.length || 0;
    const capturedLogs = evidenceBundle.consoleLogs?.entries?.length || 0;

    return {
      executionId: executionResult.planId || 'unknown',
      passCount,
      failCount,
      skippedCount,
      durationMs,
      visitedPages,
      visitedElements,
      capturedScreenshots,
      capturedVideos,
      capturedLogs,
      validationSummary: validationResult.summary,
    };
  }
}
