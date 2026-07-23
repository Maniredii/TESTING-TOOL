import * as crypto from 'crypto';

export class PageNode {
  public id: string;
  public url: string;
  public title: string;
  public depth: number;
  public parentId: string | null;
  public childrenIds: string[];
  public visited: boolean;
  public visitCount: number;
  public discoveryTime: Date;
  public domHash: string | null;

  constructor(url: string, depth: number, title: string = '', parentId: string | null = null) {
    this.id = crypto.randomUUID();
    this.url = url;
    this.title = title;
    this.depth = depth;
    this.parentId = parentId;
    this.childrenIds = [];
    this.visited = false;
    this.visitCount = 0;
    this.discoveryTime = new Date();
    this.domHash = null;
  }
}
