export interface ScreenshotEntry {
  id: string;
  actionId?: string;
  type: 'BEFORE_ACTION' | 'AFTER_ACTION' | 'FAILURE' | 'NAVIGATION' | 'FINAL';
  format: 'png' | 'jpeg' | 'webp';
  path?: string; // Path if saved to disk
  buffer?: Buffer; // In-memory buffer
  timestamp: Date;
}

export interface ScreenshotCollection {
  screenshots: ScreenshotEntry[];
}
