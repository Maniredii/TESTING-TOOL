import { PageNode } from './PageNode';
import { NavigationEdge } from './NavigationEdge';
import { Logger } from '../utils/Logger';

const logger = new Logger('WebsiteGraph');

export class WebsiteGraph {
  public nodes: Map<string, PageNode> = new Map();
  public edges: Map<string, NavigationEdge> = new Map();
  
  // Quick lookup table for URL -> Node ID
  private urlLookup: Map<string, string> = new Map();

  public addNode(node: PageNode): void {
    if (this.nodes.has(node.id)) return;
    
    this.nodes.set(node.id, node);
    this.urlLookup.set(node.url, node.id);
    logger.debug(`Added node: ${node.id} (${node.url})`);
  }

  public addEdge(edge: NavigationEdge): void {
    if (this.edges.has(edge.id)) return;

    this.edges.set(edge.id, edge);

    // Update parent/child relationship if destination is known
    if (edge.destinationId) {
      const parent = this.nodes.get(edge.sourceId);
      if (parent && !parent.childrenIds.includes(edge.destinationId)) {
        parent.childrenIds.push(edge.destinationId);
      }
    }
  }

  public getNodeByUrl(normalizedUrl: string): PageNode | undefined {
    const id = this.urlLookup.get(normalizedUrl);
    return id ? this.nodes.get(id) : undefined;
  }

  public getUnexploredEdges(sourceId: string): NavigationEdge[] {
    return Array.from(this.edges.values()).filter(e => e.sourceId === sourceId && e.destinationId === null);
  }

  public getOutboundEdges(sourceId: string): NavigationEdge[] {
    return Array.from(this.edges.values()).filter(e => e.sourceId === sourceId);
  }
}
