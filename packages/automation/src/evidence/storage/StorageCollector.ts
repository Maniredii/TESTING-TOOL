import { Page } from 'playwright';

export interface StorageData {
  cookies: any[];
  localStorage: Record<string, string>;
  sessionStorage: Record<string, string>;
  indexedDB?: any; // placeholder
}

export class StorageCollector {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async capture(): Promise<StorageData> {
    const cookies = await this.page.context().cookies();
    
    let localStorage: Record<string, string> = {};
    let sessionStorage: Record<string, string> = {};
    
    try {
      localStorage = await this.page.evaluate(() => {
        const ls: Record<string, string> = {};
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (key) ls[key] = window.localStorage.getItem(key) || '';
        }
        return ls;
      });

      sessionStorage = await this.page.evaluate(() => {
        const ss: Record<string, string> = {};
        for (let i = 0; i < window.sessionStorage.length; i++) {
          const key = window.sessionStorage.key(i);
          if (key) ss[key] = window.sessionStorage.getItem(key) || '';
        }
        return ss;
      });
    } catch (e) {
      // Might fail on cross-origin frames or closed pages
    }

    return {
      cookies,
      localStorage,
      sessionStorage,
      indexedDB: null,
    };
  }
}
