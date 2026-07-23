export interface TimelineEntry {
  actionId: string;
  actionType?: string;
  timestamp: Date;
  duration?: number;
  evidenceIds: string[]; // references to screenshot IDs, network entry indices, etc.
}

export interface Timeline {
  entries: TimelineEntry[];
}
