export interface AutomationConfig {
  executionId: string;
  projectId: string;
  configId: string;
  
  // Browser settings
  browser: 'chromium' | 'firefox' | 'webkit' | 'edge';
  headless: boolean;
  timeout: number;

  // Context settings
  viewportWidth: number;
  viewportHeight: number;
  recordVideo: boolean;
  captureScreenshots: boolean;
  captureConsoleLogs: boolean;
  captureNetworkLogs: boolean;
  
  // Auth & Storage
  loginRequired: boolean;
  
  // Crawler/Engine settings (passed down for future)
  maxPages: number;
  maxNavigationDepth: number;
  followExternalLinks: boolean;
  ignoreQueryParams: boolean;
}
