import { WebsiteGraph } from '../graph/WebsiteGraph';
import { PageNode } from '../graph/PageNode';
import { NavigationQueue, QueueItem } from '../queue/NavigationQueue';
import { GraphCache } from '../cache/GraphCache';
import { CrawlingRules } from '../crawler/CrawlingRules';
import { PageDiscovery } from '../planner/PageDiscovery';
import { DOMAnalyzer } from '../dom/analyzers/DOMAnalyzer';
import { URLNormalizer } from '../navigation/URLNormalizer';
import { Page } from 'playwright';
import { Logger } from '../utils/Logger';
import { AutomationConfig } from '../types';

const logger = new Logger('GraphTraversal');

export class GraphTraversal {
  private graph: WebsiteGraph;
  private queue: NavigationQueue;
  private cache: GraphCache;
  private config: AutomationConfig;
  private startTime: Date;
  private pagesCrawled: number = 0;

  constructor(config: AutomationConfig) {
    this.config = config;
    this.graph = new WebsiteGraph();
    this.queue = new NavigationQueue();
    this.cache = new GraphCache();
    this.startTime = new Date();
    CrawlingRules.initialize(config);
  }

  /**
   * Initializes the traversal with the entry point
   */
  public async initialize(initialUrl: string): Promise<PageNode> {
    const normalizedUrl = URLNormalizer.normalize(initialUrl, { ignoreQueryParams: this.config.ignoreQueryParams });
    const rootNode = new PageNode(normalizedUrl, 0, 'Entry Point');
    
    this.graph.addNode(rootNode);
    this.cache.markUrlVisited(normalizedUrl);
    
    return rootNode;
  }

  /**
   * Processes a single page during the crawl.
   * Note: Actual Playwright navigation is handled by the interaction engine,
   * this module merely processes the resulting DOM and updates the graph.
   */
  public async processPage(page: Page, currentNode: PageNode): Promise<void> {
    if (CrawlingRules.shouldStop(this.pagesCrawled, this.startTime)) {
      logger.info('Stop conditions met, halting graph expansion');
      return;
    }

    try {
      // 1. Analyze DOM
      const pageModel = await DOMAnalyzer.analyze(page);
      this.pagesCrawled++;
      currentNode.title = pageModel.title;
      currentNode.visitCount++;

      // 2. Loop Prevention (DOM Hashing)
      const domHash = this.cache.generateDOMHash(pageModel);
      if (this.cache.hasVisitedDOMHash(domHash)) {
        logger.warn(`DOM Hash collision detected for ${currentNode.url}. Possible circular pagination or dynamic ID loop.`);
        // Even if URL is unique, structural identicality halts deeper exploration from this node
        return; 
      }
      this.cache.markDOMHashVisited(domHash);
      currentNode.domHash = domHash;

      // 3. Edge Discovery
      const outboundEdges = PageDiscovery.extractNavigationOpportunities(pageModel, currentNode, pageModel.url);
      
      for (const edge of outboundEdges) {
        this.graph.addEdge(edge);
        
        // Queue the unexplored edge for future traversal
        this.queue.enqueue({
          edge,
          targetDepth: currentNode.depth + 1
        });
      }

    } catch (error: any) {
      logger.error(`Error processing page ${currentNode.url}`, error);
    }
  }

  public getGraph(): WebsiteGraph {
    return this.graph;
  }

  public getQueue(): NavigationQueue {
    return this.queue;
  }
}
