import { TimelineBuilder } from '../timeline/TimelineBuilder';

describe('TimelineBuilder', () => {
  let builder: TimelineBuilder;

  beforeEach(() => {
    builder = new TimelineBuilder();
  });

  it('should start and finish an action', () => {
    builder.startAction('action-1', 'CLICK');
    
    // Simulate some delay
    const startEntry = builder.getTimeline().entries[0];
    const originalTime = startEntry.timestamp.getTime();
    startEntry.timestamp = new Date(originalTime - 100);

    builder.finishAction('action-1');

    const timeline = builder.getTimeline();
    expect(timeline.entries).toHaveLength(1);
    expect(timeline.entries[0].actionId).toBe('action-1');
    expect(timeline.entries[0].actionType).toBe('CLICK');
    expect(timeline.entries[0].duration).toBeGreaterThanOrEqual(100);
  });

  it('should link evidence to active action', () => {
    builder.startAction('action-2', 'INPUT');
    builder.linkEvidence('action-2', 'screenshot-123');
    builder.finishAction('action-2');

    const timeline = builder.getTimeline();
    expect(timeline.entries[0].evidenceIds).toContain('screenshot-123');
  });

  it('should link evidence to historical action', () => {
    builder.startAction('action-3', 'NAVIGATION');
    builder.finishAction('action-3');
    
    builder.linkEvidence('action-3', 'delayed-screenshot-456');

    const timeline = builder.getTimeline();
    expect(timeline.entries[0].evidenceIds).toContain('delayed-screenshot-456');
  });
});
