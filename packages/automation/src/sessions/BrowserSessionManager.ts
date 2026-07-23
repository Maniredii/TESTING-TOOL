import { AutomationConfig } from '../types';
import { Session } from '../models/Session';
import { BrowserFactory } from '../factories/BrowserFactory';
import { ContextManager } from '../contexts/ContextManager';
import { PageManager } from '../core/PageManager';
import { AutomationEventEmitter } from '../events/AutomationEventEmitter';
import { AutomationEvents } from '../events/events';
import { SessionError } from '../errors';
import { Logger } from '../utils/Logger';

const logger = new Logger('BrowserSessionManager');

export class BrowserSessionManager {
  private activeSessions: Map<string, Session> = new Map();
  private emitter = AutomationEventEmitter.getInstance();

  /**
   * Initializes a brand new automation session.
   * This handles the entire lifecycle of spinning up the browser.
   */
  public async startSession(config: AutomationConfig): Promise<Session> {
    logger.info(`Starting new session for Execution ID: ${config.executionId}`);
    
    if (this.activeSessions.has(config.executionId)) {
      throw new SessionError(`Session already active for Execution ID: ${config.executionId}`);
    }

    const session = new Session(config);

    try {
      // 1. Launch Browser
      session.browser = await BrowserFactory.launch(config);
      this.emitter.emit(AutomationEvents.BROWSER_STARTED, { executionId: config.executionId });

      // 2. Create Context
      session.context = await ContextManager.create(session.browser, config);
      this.emitter.emit(AutomationEvents.CONTEXT_CREATED, { executionId: config.executionId });

      // 3. Open Initial Page
      const page = await PageManager.openPage(session.context);
      session.pages.push(page);
      this.emitter.emit(AutomationEvents.PAGE_OPENED, { executionId: config.executionId });

      // Track the active session
      this.activeSessions.set(config.executionId, session);
      
      this.emitter.emit(AutomationEvents.EXECUTION_STARTED, { executionId: config.executionId });
      
      return session;

    } catch (error: any) {
      // If setup fails halfway, we must aggressively clean up to prevent memory leaks
      logger.error('Failed to start session, initiating emergency cleanup', error);
      await this.cleanupFailedSession(session);
      throw new SessionError(`Session initialization failed: ${error.message}`);
    }
  }

  /**
   * Retrieves an active session by Execution ID
   */
  public getSession(executionId: string): Session | undefined {
    return this.activeSessions.get(executionId);
  }

  /**
   * Gracefully shuts down a session, closing all pages, contexts, and browsers.
   */
  public async destroySession(executionId: string): Promise<void> {
    const session = this.activeSessions.get(executionId);
    if (!session) {
      logger.warn(`Attempted to destroy non-existent session: ${executionId}`);
      return;
    }

    logger.info(`Destroying session for Execution ID: ${executionId}`);

    try {
      // Close all pages
      for (const page of session.pages) {
        await PageManager.closePage(page);
      }
      this.emitter.emit(AutomationEvents.PAGE_CLOSED, { executionId });

      // Close context
      if (session.context) {
        await ContextManager.destroy(session.context);
        this.emitter.emit(AutomationEvents.CONTEXT_DESTROYED, { executionId });
      }

      // Close browser
      if (session.browser) {
        await session.browser.close();
        this.emitter.emit(AutomationEvents.BROWSER_CLOSED, { executionId });
      }

      session.endTime = new Date();
      this.activeSessions.delete(executionId);
      
      this.emitter.emit(AutomationEvents.EXECUTION_FINISHED, { executionId });
      logger.info(`Successfully destroyed session ${executionId}`);
      
    } catch (error: any) {
      logger.error(`Error during session destruction for ${executionId}`, error);
    }
  }

  /**
   * Internal fail-safe to clean up partial objects if startSession throws
   */
  private async cleanupFailedSession(session: Session): Promise<void> {
    try {
      for (const page of session.pages) {
        await page.close().catch(() => {});
      }
      if (session.context) {
        await session.context.close().catch(() => {});
      }
      if (session.browser) {
        await session.browser.close().catch(() => {});
      }
    } catch (e) {
      logger.error('Critical failure during emergency cleanup', e);
    }
  }

  /**
   * Emergency global cleanup (e.g. on process exit)
   */
  public async destroyAllSessions(): Promise<void> {
    logger.warn('Initiating global session teardown');
    const promises = Array.from(this.activeSessions.keys()).map(id => this.destroySession(id));
    await Promise.allSettled(promises);
  }
}
