import { BrowserContext, Page } from 'playwright';
import { PageCreationError, NavigationError } from '../errors';
import { Logger } from '../utils/Logger';

const logger = new Logger('PageManager');

export class PageManager {
  /**
   * Opens a new page within the given context
   */
  public static async openPage(context: BrowserContext): Promise<Page> {
    logger.info('Opening new page');
    try {
      return await context.newPage();
    } catch (error: any) {
      logger.error('Failed to open new page', error);
      throw new PageCreationError(`Could not create new tab: ${error.message}`);
    }
  }

  /**
   * Navigates a page to a specified URL with error wrapping
   */
  public static async navigate(page: Page, url: string, timeout: number = 30000): Promise<void> {
    logger.info(`Navigating to URL: ${url}`);
    try {
      await page.goto(url, { timeout, waitUntil: 'domcontentloaded' });
    } catch (error: any) {
      logger.error(`Navigation failed for ${url}`, error);
      throw new NavigationError(`Failed to load ${url}: ${error.message}`);
    }
  }

  /**
   * Closes a page gracefully
   */
  public static async closePage(page: Page): Promise<void> {
    try {
      if (!page.isClosed()) {
        await page.close();
        logger.info('Page closed successfully');
      }
    } catch (error: any) {
      logger.warn('Failed to close page cleanly', error);
    }
  }
}
