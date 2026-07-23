import { Browser, BrowserContext } from 'playwright';
import { AutomationConfig } from '../types';
import { ContextCreationError } from '../errors';
import { Logger } from '../utils/Logger';

const logger = new Logger('ContextManager');

export class ContextManager {
  /**
   * Creates a highly configured BrowserContext
   */
  public static async create(browser: Browser, config: AutomationConfig): Promise<BrowserContext> {
    logger.info('Creating new BrowserContext');

    try {
      // Setup options mapping from our config to Playwright config
      const contextOptions: Parameters<Browser['newContext']>[0] = {
        viewport: { width: config.viewportWidth, height: config.viewportHeight },
        ignoreHTTPSErrors: true,
        acceptDownloads: true,
      };

      // Handle Video Recording configuration
      if (config.recordVideo) {
        contextOptions.recordVideo = {
          dir: `artifacts/videos/${config.executionId}`,
          size: { width: config.viewportWidth, height: config.viewportHeight }
        };
      }

      const context = await browser.newContext(contextOptions);

      // We can also configure network interception or default timeouts here
      context.setDefaultTimeout(config.timeout);
      context.setDefaultNavigationTimeout(config.timeout);

      return context;
    } catch (error: any) {
      logger.error('Failed to create BrowserContext', error);
      throw new ContextCreationError(`Could not build execution context: ${error.message}`);
    }
  }

  /**
   * Cleans up the context
   */
  public static async destroy(context: BrowserContext): Promise<void> {
    try {
      await context.close();
      logger.info('BrowserContext destroyed');
    } catch (error: any) {
      logger.error('Error destroying BrowserContext', error);
    }
  }
}
