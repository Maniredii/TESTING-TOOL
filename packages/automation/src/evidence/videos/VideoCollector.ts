import { BrowserContext, Page } from 'playwright';
import * as crypto from 'crypto';
import { VideoEntry, VideoCollection } from '../models/VideoCollection';

export class VideoCollector {
  private collection: VideoCollection = { videos: [] };
  
  public async registerPage(page: Page, contextId: string) {
    const video = await page.video();
    if (video) {
      const path = await video.path();
      this.collection.videos.push({
        id: crypto.randomUUID(),
        contextId,
        path,
        startTime: new Date(),
      });
    }
  }

  public getCollection(): VideoCollection {
    return this.collection;
  }
}
