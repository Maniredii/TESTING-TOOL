import * as crypto from 'crypto';
import { PageModel } from '../dom/models';

export class GraphCache {
  private visitedUrls: Set<string> = new Set();
  private visitedDOMHashes: Set<string> = new Set();

  public markUrlVisited(normalizedUrl: string): void {
    this.visitedUrls.add(normalizedUrl);
  }

  public hasVisitedUrl(normalizedUrl: string): boolean {
    return this.visitedUrls.has(normalizedUrl);
  }

  public markDOMHashVisited(hash: string): void {
    this.visitedDOMHashes.add(hash);
  }

  public hasVisitedDOMHash(hash: string): boolean {
    return this.visitedDOMHashes.has(hash);
  }

  /**
   * Generates a structural hash of the page to detect dynamic/identical pages under different URLs.
   * Strips out text content to focus strictly on the layout of interactive elements.
   */
  public generateDOMHash(pageModel: PageModel): string {
    // We only care about the structural layout of interactive elements for uniqueness
    const structuralString = pageModel.interactiveElements
      .map(el => `${el.tag}|${el.role}|${el.attributes['type'] || ''}|${el.attributes['name'] || ''}`)
      .join('::');

    return require('crypto').createHash('sha256').update(structuralString).digest('hex');
  }
}
