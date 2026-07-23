import { Page } from 'playwright';

export interface DOMSnapshot {
  html: string;
  accessibilityTree?: any; // placeholder
  timestamp: Date;
  actionId?: string;
}

export class DOMSnapshotCollector {
  private page: Page;
  private snapshots: DOMSnapshot[] = [];

  constructor(page: Page) {
    this.page = page;
  }

  public async capture(actionId?: string): Promise<DOMSnapshot> {
    const html = await this.page.content();
    
    // Accessibility tree capturing could go here using page.accessibility.snapshot()
    let accessibilityTree;
    try {
      accessibilityTree = null; // accessibility tree disabled for now due to TS bindings
    } catch (e) {
      accessibilityTree = null;
    }

    const snapshot: DOMSnapshot = {
      html,
      accessibilityTree,
      timestamp: new Date(),
      actionId,
    };

    this.snapshots.push(snapshot);
    return snapshot;
  }

  public getSnapshots(): DOMSnapshot[] {
    return this.snapshots;
  }
}
