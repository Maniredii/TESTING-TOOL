import { PageModel, InteractiveElement } from '../dom/models';
import { ElementType, ClassificationCategory } from '../dom/types';
import { PageNode } from '../graph/PageNode';
import { NavigationEdge } from '../graph/NavigationEdge';
import { URLNormalizer } from '../navigation/URLNormalizer';
import { NavigationType as NavType } from '../navigation/NavigationEnums';
import { Logger } from '../utils/Logger';

const logger = new Logger('PageDiscovery');

export class PageDiscovery {
  /**
   * Translates a DOM PageModel into a series of unexplored outbound NavigationEdges
   */
  public static extractNavigationOpportunities(
    pageModel: PageModel, 
    sourceNode: PageNode,
    baseUrl: string
  ): NavigationEdge[] {
    const edges: NavigationEdge[] = [];
    const elements = pageModel.interactiveElements;

    // Filter for elements that likely cause navigation
    const navElements = elements.filter(el => 
      el.classification === ClassificationCategory.NAVIGATION ||
      el.classification === ClassificationCategory.PAGINATION ||
      el.type === ElementType.LINK ||
      el.type === ElementType.BUTTON
    );

    for (const el of navElements) {
      // Ignore danger elements completely
      if (el.classification === ClassificationCategory.DANGER) continue;

      let destinationId: string | null = null;
      let confidence = 0.3; // Default low confidence for generic buttons

      // If it's a direct link, we have high confidence in where it goes
      if (el.tag === 'a' && el.attributes['href']) {
        const href = el.attributes['href'];
        
        // Ignore empty, anchor-only, or javascript links
        if (!href || href.startsWith('javascript:') || href.startsWith('mailto:') || href === '#') {
          continue;
        }

        confidence = 0.9;
        
        // We do not set destinationId yet, because the node might not exist in the graph.
        // The graph traversal algorithm will normalize this href and link it.
      }

      const edge = new NavigationEdge(
        sourceNode.id,
        el.uniqueId,
        NavType.SAME_TAB,
        null, // Destination is unexplored
        confidence
      );

      edges.push(edge);
    }

    logger.debug(`Extracted ${edges.length} potential navigation edges from ${sourceNode.url}`);
    return edges;
  }
}
