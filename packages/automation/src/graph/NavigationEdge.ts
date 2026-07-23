import { NavigationType } from '../navigation/NavigationEnums';
import * as crypto from 'crypto';

export class NavigationEdge {
  public id: string;
  public sourceId: string;
  public destinationId: string | null; // Null if unexplored
  public triggerElementId: string;     // UniqueId of the DOM InteractiveElement
  public navigationType: NavigationType;
  public confidence: number; // 0.0 to 1.0 (e.g., explicit <a> tag href is 1.0, <button> is 0.5)

  constructor(
    sourceId: string, 
    triggerElementId: string, 
    navigationType: NavigationType = NavigationType.SAME_TAB,
    destinationId: string | null = null,
    confidence: number = 0.5
  ) {
    this.id = crypto.randomUUID();
    this.sourceId = sourceId;
    this.destinationId = destinationId;
    this.triggerElementId = triggerElementId;
    this.navigationType = navigationType;
    this.confidence = confidence;
  }
}
