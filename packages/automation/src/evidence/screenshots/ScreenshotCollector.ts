import { Page } from 'playwright';
import * as crypto from 'crypto';
import { ScreenshotEntry, ScreenshotCollection } from '../models/ScreenshotCollection';

export class ScreenshotCollector {
  private collection: ScreenshotCollection = { screenshots: [] };
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async capture(
    type: ScreenshotEntry['type'],
    actionId?: string,
    format: 'png' | 'jpeg' | 'webp' = 'jpeg'
  ): Promise<ScreenshotEntry> {
    const buffer = await this.page.screenshot({
      type: format === 'webp' ? 'jpeg' : format, // playwright supports webp in some engines, fallback to jpeg if needed or handled by compression
      fullPage: type === 'FINAL' || type === 'FAILURE',
      quality: format === 'jpeg' ? 70 : undefined,
    });

    const entry: ScreenshotEntry = {
      id: crypto.randomUUID(),
      actionId,
      type,
      format,
      buffer,
      timestamp: new Date(),
    };

    this.collection.screenshots.push(entry);
    return entry;
  }

  public getCollection(): ScreenshotCollection {
    return this.collection;
  }
}
