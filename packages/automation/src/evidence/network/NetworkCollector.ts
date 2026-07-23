import { Page, Request, Response } from 'playwright';
import { NetworkEntry, NetworkCollection } from '../models/NetworkCollection';

export class NetworkCollector {
  private collection: NetworkCollection = { entries: [] };
  private activeRequests = new Map<string, NetworkEntry>();

  public attach(page: Page) {
    page.on('request', (request: Request) => this.onRequest(request));
    page.on('response', (response: Response) => this.onResponse(response));
    page.on('requestfailed', (request: Request) => this.onRequestFailed(request));
  }

  private onRequest(request: Request) {
    const entry: NetworkEntry = {
      url: request.url(),
      method: request.method(),
      requestHeaders: request.headers(),
      postData: request.postData() || undefined,
      startTime: new Date(),
      isRedirect: request.isNavigationRequest() && request.redirectedFrom() !== null,
    };
    // Playwright requests don't have a unique ID exposed directly unless we use request.url() + timing as key,
    // or just store them in a list. We can use the object reference itself in a weak map if needed, or just push.
    this.collection.entries.push(entry);
    
    // Attempting a pseudo-ID using a symbol or storing in array
    (request as any)._evidenceEntry = entry;
  }

  private onResponse(response: Response) {
    const request = response.request();
    const entry = (request as any)._evidenceEntry as NetworkEntry;
    if (entry) {
      entry.responseHeaders = response.headers();
      entry.statusCode = response.status();
      entry.endTime = new Date();
      entry.duration = entry.endTime.getTime() - entry.startTime.getTime();
    }
  }

  private onRequestFailed(request: Request) {
    const entry = (request as any)._evidenceEntry as NetworkEntry;
    if (entry) {
      entry.error = request.failure()?.errorText || 'Failed';
      entry.endTime = new Date();
      entry.duration = entry.endTime.getTime() - entry.startTime.getTime();
    }
  }

  public getCollection(): NetworkCollection {
    return this.collection;
  }
}
