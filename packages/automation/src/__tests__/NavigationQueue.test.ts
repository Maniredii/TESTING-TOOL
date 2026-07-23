import { NavigationQueue, QueueItem } from '../queue/NavigationQueue';
import { NavigationEdge } from '../graph/NavigationEdge';
import { NavigationType } from '../navigation/NavigationEnums';
import { CrawlingRules } from '../crawler/CrawlingRules';

describe('NavigationQueue', () => {
  let queue: NavigationQueue;

  const createDummyEdge = () => new NavigationEdge('source-1', 'trigger-1', NavigationType.SAME_TAB, null, 0.5);

  beforeEach(() => {
    queue = new NavigationQueue();
    CrawlingRules.MAX_DEPTH = 3;
  });

  it('should enqueue and dequeue items', () => {
    const item = { edge: createDummyEdge(), targetDepth: 1 };
    queue.enqueue(item);
    expect(queue.size()).toBe(1);
    expect(queue.dequeue()).toBe(item);
    expect(queue.size()).toBe(0);
  });

  it('should prioritize items by depth (BFS)', () => {
    const shallow = { edge: createDummyEdge(), targetDepth: 1 };
    const deep = { edge: createDummyEdge(), targetDepth: 2 };
    
    // Even if deep is queued first, shallow should pop first
    queue.enqueue(deep);
    queue.enqueue(shallow);
    
    expect(queue.dequeue()).toBe(shallow);
    expect(queue.dequeue()).toBe(deep);
  });

  it('should reject items exceeding MAX_DEPTH', () => {
    const tooDeep = { edge: createDummyEdge(), targetDepth: 4 };
    queue.enqueue(tooDeep);
    expect(queue.size()).toBe(0);
  });
});
