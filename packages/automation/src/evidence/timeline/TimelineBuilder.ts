import { Timeline, TimelineEntry } from '../models/Timeline';

export class TimelineBuilder {
  private timeline: Timeline = { entries: [] };
  private activeActions = new Map<string, TimelineEntry>();

  public startAction(actionId: string, actionType: string) {
    const entry: TimelineEntry = {
      actionId,
      actionType,
      timestamp: new Date(),
      evidenceIds: [],
    };
    this.activeActions.set(actionId, entry);
    this.timeline.entries.push(entry);
  }

  public finishAction(actionId: string) {
    const entry = this.activeActions.get(actionId);
    if (entry) {
      entry.duration = new Date().getTime() - entry.timestamp.getTime();
      this.activeActions.delete(actionId);
    }
  }

  public linkEvidence(actionId: string, evidenceId: string) {
    const entry = this.activeActions.get(actionId);
    if (entry) {
      entry.evidenceIds.push(evidenceId);
    } else {
      // Find historical
      const historical = this.timeline.entries.find(e => e.actionId === actionId);
      if (historical) {
        historical.evidenceIds.push(evidenceId);
      }
    }
  }

  public getTimeline(): Timeline {
    return this.timeline;
  }
}
