import { EvidenceBundle } from '../models/EvidenceBundle';
import { ScreenshotCollection } from '../models/ScreenshotCollection';
import { VideoCollection } from '../models/VideoCollection';
import { ConsoleLogCollection } from '../models/ConsoleLogCollection';
import { NetworkCollection } from '../models/NetworkCollection';
import { Timeline } from '../models/Timeline';
import { EvidenceMetadata } from '../models/Metadata';

export class ExportManager {
  public createBundle(
    executionId: string,
    metadata: EvidenceMetadata,
    screenshots: ScreenshotCollection,
    videos: VideoCollection,
    consoleLogs: ConsoleLogCollection,
    network: NetworkCollection,
    timeline: Timeline,
    storage: any,
    domSnapshots: any
  ): EvidenceBundle {
    return {
      executionId,
      metadata,
      screenshots,
      videos,
      consoleLogs,
      network,
      timeline,
      storage,
      domSnapshots,
    };
  }
}
