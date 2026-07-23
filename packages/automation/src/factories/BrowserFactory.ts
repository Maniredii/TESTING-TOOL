import { chromium, firefox, webkit, Browser } from 'playwright';
import { AutomationConfig } from '../types';
import { BrowserLaunchError } from '../errors';
import { Logger } from '../utils/Logger';

const logger = new Logger('BrowserFactory');

export class BrowserFactory {
  /**
   * Launches the appropriate Playwright browser instance based on configuration
   */
  public static async launch(config: AutomationConfig): Promise<Browser> {
    logger.info(`Launching browser: ${config.browser} (Headless: ${config.headless})`);
    
    try {
      const launchOptions = {
        headless: config.headless,
        timeout: config.timeout,
      };

      switch (config.browser) {
        case 'firefox':
          return await firefox.launch(launchOptions);
        case 'webkit':
          return await webkit.launch(launchOptions);
        case 'edge':
          return await chromium.launch({
            ...launchOptions,
            channel: 'msedge'
          });
        case 'chromium':
        default:
          return await chromium.launch(launchOptions);
      }
    } catch (error: any) {
      logger.error(`Failed to launch browser: ${config.browser}`, error);
      throw new BrowserLaunchError(`Engine failed to start ${config.browser}: ${error.message}`);
    }
  }
}
