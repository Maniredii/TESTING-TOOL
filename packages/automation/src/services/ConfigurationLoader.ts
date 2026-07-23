import { AutomationConfig } from '../types';
import { ConfigurationError } from '../errors';

export class ConfigurationLoader {
  
  /**
   * Transforms raw database configuration payload into standard AutomationConfig
   * @param rawConfig JSON payload from database API
   * @param executionId Unique ID for this execution run
   */
  public static load(rawConfig: any, executionId: string): AutomationConfig {
    try {
      if (!rawConfig.projectId || !rawConfig.id) {
        throw new ConfigurationError('Invalid raw configuration: missing projectId or configId');
      }

      const browserRaw = rawConfig.browser?.toLowerCase() || 'chromium';
      const browserType = browserRaw === 'edge' ? 'edge' : 
                          ['chromium', 'firefox', 'webkit'].includes(browserRaw) ? browserRaw : 'chromium';

      return {
        executionId,
        projectId: rawConfig.projectId,
        configId: rawConfig.id,
        browser: browserType as 'chromium' | 'firefox' | 'webkit' | 'edge',
        headless: rawConfig.headless ?? true,
        timeout: rawConfig.timeout ?? 30000,
        viewportWidth: rawConfig.viewportWidth ?? 1920,
        viewportHeight: rawConfig.viewportHeight ?? 1080,
        recordVideo: rawConfig.recordVideo ?? true,
        captureScreenshots: rawConfig.captureScreenshots ?? true,
        captureConsoleLogs: rawConfig.captureConsoleLogs ?? true,
        captureNetworkLogs: rawConfig.captureNetworkLogs ?? true,
        loginRequired: rawConfig.loginRequired ?? false,
        maxPages: rawConfig.maxPages ?? 100,
        maxNavigationDepth: rawConfig.maxNavigationDepth ?? 3,
        followExternalLinks: rawConfig.followExternalLinks ?? false,
        ignoreQueryParams: rawConfig.ignoreQueryParams ?? false,
      };
    } catch (error: any) {
      if (error instanceof ConfigurationError) throw error;
      throw new ConfigurationError(`Failed to load configuration: ${error.message}`);
    }
  }
}
