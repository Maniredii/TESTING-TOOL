import { Browser, BrowserContext, Page } from 'playwright';
import { AutomationConfig } from '../types';

export class Session {
  public executionId: string;
  public projectId: string;
  public configId: string;
  
  public browser: Browser | null = null;
  public context: BrowserContext | null = null;
  public pages: Page[] = [];
  
  public startTime: Date;
  public endTime: Date | null = null;
  
  public config: AutomationConfig;

  constructor(config: AutomationConfig) {
    this.config = config;
    this.executionId = config.executionId;
    this.projectId = config.projectId;
    this.configId = config.configId;
    this.startTime = new Date();
  }

  public getActivePage(): Page | null {
    if (this.pages.length === 0) return null;
    return this.pages[this.pages.length - 1]; // Assume last opened is active for now
  }
}
