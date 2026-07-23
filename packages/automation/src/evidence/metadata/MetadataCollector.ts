import { Page } from 'playwright';
import { EvidenceMetadata } from '../models/Metadata';

export class MetadataCollector {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async collect(executionId: string, configurationId?: string): Promise<EvidenceMetadata> {
    const browser = this.page.context().browser()?.browserType().name() || 'unknown';
    const viewportSize = this.page.viewportSize();
    const viewport = viewportSize || { width: 0, height: 0 };
    
    let pageTitle = '';
    try {
      pageTitle = await this.page.title();
    } catch (e) {
      // Ignored
    }

    return {
      browser,
      viewport,
      url: this.page.url(),
      pageTitle,
      executionId,
      configurationId,
      timestamp: new Date(),
    };
  }
}
