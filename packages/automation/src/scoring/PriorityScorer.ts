import { ActionCandidate } from '../planning/models/ActionCandidate';
import { ActionPriorityLevel } from '../planning/AutomationActionEnums';
import { ClassificationCategory } from '../dom/types';

export class PriorityScorer {
  
  /**
   * Assigns a base priority to an action based on its DOM Classification.
   */
  public static calculateBasePriority(candidate: ActionCandidate): ActionPriorityLevel {
    if (!candidate.targetElement) {
      // Global actions (like BACK/FORWARD) need situational scoring
      return ActionPriorityLevel.LOW;
    }

    switch (candidate.targetElement.classification) {
      case ClassificationCategory.AUTHENTICATION:
        return ActionPriorityLevel.VERY_HIGH;
      
      case ClassificationCategory.NAVIGATION:
      case ClassificationCategory.FORM_INPUT:
      case ClassificationCategory.SUBMISSION:
        return ActionPriorityLevel.HIGH;
        
      case ClassificationCategory.SEARCH:
      case ClassificationCategory.PAGINATION:
        return ActionPriorityLevel.MEDIUM;

      case ClassificationCategory.DOWNLOAD:
      case ClassificationCategory.UPLOAD:
      case ClassificationCategory.MEDIA:
        return ActionPriorityLevel.LOW;

      case ClassificationCategory.DANGER:
        return ActionPriorityLevel.BLOCKED;

      default:
        return ActionPriorityLevel.LOW;
    }
  }
}
