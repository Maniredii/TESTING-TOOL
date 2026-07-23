import { BrowserSessionManager } from '../sessions/BrowserSessionManager';
import { AutomationConfig } from '../types';
import { BrowserFactory } from '../factories/BrowserFactory';
import { ContextManager } from '../contexts/ContextManager';
import { PageManager } from '../core/PageManager';
import { SessionError } from '../errors';

jest.mock('../factories/BrowserFactory');
jest.mock('../contexts/ContextManager');
jest.mock('../core/PageManager');

describe('BrowserSessionManager', () => {
  let manager: BrowserSessionManager;

  const mockConfig: AutomationConfig = {
    executionId: 'exec-1',
    projectId: 'proj-1',
    configId: 'conf-1',
    browser: 'chromium',
    headless: true,
    timeout: 3000,
    viewportWidth: 1920,
    viewportHeight: 1080,
    recordVideo: false,
    captureScreenshots: false,
    captureConsoleLogs: false,
    captureNetworkLogs: false,
    loginRequired: false,
    maxPages: 10,
    maxNavigationDepth: 3,
    followExternalLinks: false,
  };

  beforeEach(() => {
    manager = new BrowserSessionManager();
    jest.clearAllMocks();

    (BrowserFactory.launch as jest.Mock).mockResolvedValue({ close: jest.fn() });
    (ContextManager.create as jest.Mock).mockResolvedValue({ close: jest.fn() });
    (PageManager.openPage as jest.Mock).mockResolvedValue({ close: jest.fn(), isClosed: jest.fn().mockReturnValue(false) });
  });

  it('should successfully start a session and track it', async () => {
    const session = await manager.startSession(mockConfig);
    
    expect(session.executionId).toBe('exec-1');
    expect(session.browser).toBeDefined();
    expect(session.context).toBeDefined();
    expect(session.pages.length).toBe(1);

    expect(manager.getSession('exec-1')).toBe(session);
  });

  it('should prevent starting multiple sessions with the same execution ID', async () => {
    await manager.startSession(mockConfig);
    await expect(manager.startSession(mockConfig)).rejects.toThrow(SessionError);
  });

  it('should cleanly destroy a session', async () => {
    await manager.startSession(mockConfig);
    expect(manager.getSession('exec-1')).toBeDefined();

    await manager.destroySession('exec-1');
    expect(manager.getSession('exec-1')).toBeUndefined();
  });
});
