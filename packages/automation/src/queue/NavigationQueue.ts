import { NavigationEdge } from '../graph/NavigationEdge';
import { CrawlingRules } from '../crawler/CrawlingRules';

export interface QueueItem {
  edge: NavigationEdge;
  targetDepth: number; // The depth this edge will lead to
}

export class NavigationQueue {
  private items: QueueItem[] = [];
  
  /**
   * Enqueues a potential navigation action.
   * Maintains Breadth-First Search (BFS) priority by sorting by depth.
   */
  public enqueue(item: QueueItem): void {
    // Check constraints before queueing
    if (item.targetDepth > CrawlingRules.MAX_DEPTH) {
      return;
    }

    this.items.push(item);
    // Sort to maintain BFS (lowest depth first)
    this.items.sort((a, b) => a.targetDepth - b.targetDepth);
  }

  public dequeue(): QueueItem | undefined {
    return this.items.shift();
  }

  public isEmpty(): boolean {
    return this.items.length === 0;
  }

  public size(): number {
    return this.items.length;
  }

  public clear(): void {
    this.items = [];
  }
}
