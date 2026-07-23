export interface VideoEntry {
  id: string;
  contextId: string; // Identifier for the browser context
  path: string; // File path on disk
  startTime: Date;
  endTime?: Date;
}

export interface VideoCollection {
  videos: VideoEntry[];
}
