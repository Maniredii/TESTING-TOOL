import { UnifiedTimelineBuilder } from '../timeline/UnifiedTimelineBuilder';
import { ExecutionResult } from '../../results/ExecutionResult';
import { EvidenceBundle } from '../../evidence/models/EvidenceBundle';
import { ValidationResult } from '../../validation/models/ValidationResult';
import { TimelineEventType } from '../models/UnifiedTimeline';
import { ActionStatus } from '../../results/ActionResult';

describe('UnifiedTimelineBuilder', () => {
  let builder: UnifiedTimelineBuilder;

  beforeEach(() => {
    builder = new UnifiedTimelineBuilder();
  });

  it('should interleave events chronologically', () => {
    const executionResult: Partial<ExecutionResult> = {
      actionResults: [
        { 
          actionId: 'a1', 
          actionType: 'CLICK', 
          status: ActionStatus.SUCCESS,
          startTime: new Date(1000), 
          endTime: new Date(2000),
          duration: 1000, previousUrl: '', currentUrl: ''
        }
      ]
    };

    const evidenceBundle: Partial<EvidenceBundle> = {
      timeline: {
        entries: [
          { actionId: 'a1', actionType: 'CLICK', timestamp: new Date(1500), evidenceIds: ['img-1'] }
        ]
      }
    };

    const validationResult: Partial<ValidationResult> = {
      findings: [
        { id: 'f1', title: 'Error', timestamp: new Date(2500) } as any
      ]
    };

    const timeline = builder.build(executionResult as any, evidenceBundle as any, validationResult as any);
    
    expect(timeline.events).toHaveLength(4);
    
    expect(timeline.events[0].type).toBe(TimelineEventType.ACTION_START);
    expect(timeline.events[0].timestamp.getTime()).toBe(1000);
    
    expect(timeline.events[1].type).toBe(TimelineEventType.EVIDENCE_CAPTURED);
    expect(timeline.events[1].timestamp.getTime()).toBe(1500);

    expect(timeline.events[2].type).toBe(TimelineEventType.ACTION_END);
    expect(timeline.events[2].timestamp.getTime()).toBe(2000);

    expect(timeline.events[3].type).toBe(TimelineEventType.VALIDATION_FINDING);
    expect(timeline.events[3].timestamp.getTime()).toBe(2500);
  });
});
