import { ExecutionResult } from '../../results/ExecutionResult';
import { EvidenceBundle } from '../../evidence/models/EvidenceBundle';
import { ValidationResult } from '../../validation/models/ValidationResult';
import { UnifiedTimeline, UnifiedTimelineEvent, TimelineEventType } from '../models/UnifiedTimeline';

export class UnifiedTimelineBuilder {
  public build(
    executionResult: ExecutionResult,
    evidenceBundle: EvidenceBundle,
    validationResult: ValidationResult
  ): UnifiedTimeline {
    const events: UnifiedTimelineEvent[] = [];

    // Action Timeline
    const actions = executionResult.actionResults || [];
    for (const action of actions) {
      if (action.startTime) {
        events.push({
          id: `action-start-${action.actionId}`,
          type: TimelineEventType.ACTION_START,
          timestamp: new Date(action.startTime),
          referenceId: action.actionId,
          description: `Started action: ${action.actionType}`,
        });
      }
      if (action.endTime) {
        events.push({
          id: `action-end-${action.actionId}`,
          type: TimelineEventType.ACTION_END,
          timestamp: new Date(action.endTime),
          referenceId: action.actionId,
          description: `Ended action: ${action.actionType} with status ${action.status}`,
          metadata: { status: action.status, duration: action.duration }
        });
      }
    }

    // Evidence Timeline (from EvidenceBundle's Timeline)
    const evidenceTimeline = evidenceBundle.timeline?.entries || [];
    for (const entry of evidenceTimeline) {
      events.push({
        id: `evidence-${entry.actionId}-${entry.timestamp.getTime()}`,
        type: TimelineEventType.EVIDENCE_CAPTURED,
        timestamp: new Date(entry.timestamp),
        referenceId: entry.actionId,
        description: `Captured evidence for action ${entry.actionType}`,
        metadata: { evidenceIds: entry.evidenceIds }
      });
    }

    // Validation Timeline
    const findings = validationResult.findings || [];
    for (const finding of findings) {
      events.push({
        id: `finding-${finding.id}`,
        type: TimelineEventType.VALIDATION_FINDING,
        timestamp: new Date(finding.timestamp),
        referenceId: finding.id,
        description: `Validation finding: ${finding.title}`,
        metadata: { severity: finding.severity, category: finding.category, actionId: finding.actionId }
      });
    }

    // Sort all events chronologically
    events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    return { events };
  }
}
