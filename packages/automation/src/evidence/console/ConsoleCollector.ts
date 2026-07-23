import { Page, ConsoleMessage } from 'playwright';
import { ConsoleEntry, ConsoleLogCollection } from '../models/ConsoleLogCollection';

export class ConsoleCollector {
  private collection: ConsoleLogCollection = { entries: [] };
  private currentActionId?: string;

  public attach(page: Page) {
    page.on('console', (msg: ConsoleMessage) => this.onConsoleMessage(msg));
    page.on('pageerror', (exception: Error) => this.onPageError(exception));
  }

  public setCurrentActionId(actionId?: string) {
    this.currentActionId = actionId;
  }

  private onConsoleMessage(msg: ConsoleMessage) {
    const type = msg.type() as ConsoleEntry['type'];
    const text = msg.text();
    const location = msg.location().url ? `${msg.location().url}:${msg.location().lineNumber}` : undefined;

    this.collection.entries.push({
      type: ['log', 'info', 'warn', 'error', 'debug'].includes(type) ? type : 'log',
      text,
      timestamp: new Date(),
      location,
      actionId: this.currentActionId,
    });
  }

  private onPageError(exception: Error) {
    this.collection.entries.push({
      type: 'exception',
      text: exception.message || String(exception),
      timestamp: new Date(),
      location: exception.stack,
      actionId: this.currentActionId,
    });
  }

  public getCollection(): ConsoleLogCollection {
    return this.collection;
  }
}
