import { ScreenshotCollection } from './ScreenshotCollection';
import { VideoCollection } from './VideoCollection';
import { ConsoleLogCollection } from './ConsoleLogCollection';
import { NetworkCollection } from './NetworkCollection';
import { Timeline } from './Timeline';
import { EvidenceMetadata } from './Metadata';

export interface EvidenceBundle {
  executionId: string;
  metadata: EvidenceMetadata;
  screenshots: ScreenshotCollection;
  videos: VideoCollection;
  consoleLogs: ConsoleLogCollection;
  network: NetworkCollection;
  timeline: Timeline;
  storage?: any; // e.g. Cookies, LocalStorage data
  domSnapshots?: any; // e.g. HTML, Accessibility Tree
}
