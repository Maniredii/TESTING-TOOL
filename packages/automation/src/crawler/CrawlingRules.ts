import { AutomationConfig } from '../types';

export class CrawlingRules {
  // Global absolute limits to prevent infinite runaway loops
  public static readonly ABSOLUTE_MAX_DEPTH = 10;
  public static readonly ABSOLUTE_MAX_PAGES = 500;
  public static readonly ABSOLUTE_MAX_DURATION_MS = 1000 * 60 * 30; // 30 minutes

  // Instance specific limits (can be overwritten by config)
  public static MAX_DEPTH = 3;
  public static MAX_PAGES = 100;
  public static MAX_DURATION_MS = 1000 * 60 * 5; // 5 mins

  public static initialize(config: AutomationConfig): void {
    this.MAX_DEPTH = Math.min(config.maxNavigationDepth, this.ABSOLUTE_MAX_DEPTH);
    this.MAX_PAGES = Math.min(config.maxPages, this.ABSOLUTE_MAX_PAGES);
    // Timeout limits would also be merged here
  }

  public static shouldStop(pagesCrawled: number, startTime: Date): boolean {
    if (pagesCrawled >= this.MAX_PAGES) return true;
    
    const duration = Date.now() - startTime.getTime();
    if (duration >= this.MAX_DURATION_MS) return true;

    return false;
  }
}
