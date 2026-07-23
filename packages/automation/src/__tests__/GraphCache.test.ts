import { GraphCache } from '../cache/GraphCache';

describe('GraphCache', () => {
  let cache: GraphCache;

  beforeEach(() => {
    cache = new GraphCache();
  });

  it('should track visited URLs', () => {
    cache.markUrlVisited('https://example.com');
    expect(cache.hasVisitedUrl('https://example.com')).toBe(true);
    expect(cache.hasVisitedUrl('https://other.com')).toBe(false);
  });

  it('should generate consistent structural DOM hashes', () => {
    const pageModel1: any = {
      interactiveElements: [
        { tag: 'button', role: 'button', attributes: { type: 'submit' } }
      ]
    };
    
    const hash1 = cache.generateDOMHash(pageModel1);
    
    const pageModel2: any = {
      interactiveElements: [
        { tag: 'button', role: 'button', attributes: { type: 'submit' } }
      ]
    };

    const hash2 = cache.generateDOMHash(pageModel2);

    expect(hash1).toBe(hash2);
    expect(typeof hash1).toBe('string');
  });
});
