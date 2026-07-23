import { ScreenshotEntry } from '../models/ScreenshotCollection';

export interface CompressionOptions {
  screenshotQuality?: number; // 0-100
  screenshotFormat?: 'png' | 'jpeg' | 'webp';
  videoBitrate?: number; // Placeholders for later post-processing if needed
}

export class CompressionManager {
  private options: CompressionOptions;

  constructor(options: CompressionOptions = { screenshotFormat: 'jpeg', screenshotQuality: 70 }) {
    this.options = options;
  }

  public getScreenshotFormat(): 'png' | 'jpeg' | 'webp' {
    return this.options.screenshotFormat || 'jpeg';
  }

  // Placeholder for any post-processing compression (e.g. Sharp integration)
  public async compressScreenshot(entry: ScreenshotEntry): Promise<ScreenshotEntry> {
    // For now, Playwright handles native compression during screenshot capture
    return entry;
  }
}
