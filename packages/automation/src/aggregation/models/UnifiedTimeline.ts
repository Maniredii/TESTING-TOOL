export enum TimelineEventType {
  ACTION_START = 'ACTION_START',
  ACTION_END = 'ACTION_END',
  EVIDENCE_CAPTURED = 'EVIDENCE_CAPTURED',
  VALIDATION_FINDING = 'VALIDATION_FINDING',
  BROWSER_EVENT = 'BROWSER_EVENT',
}

export interface UnifiedTimelineEvent {
  id: string;
  type: TimelineEventType;
  timestamp: Date;
  referenceId: string; // Refers to an ActionId, EvidenceId, or FindingId
  description: string;
  metadata?: any;
}

export interface UnifiedTimeline {
  events: UnifiedTimelineEvent[];
}
