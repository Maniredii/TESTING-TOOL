import { SupportedAction, ActionPriorityLevel } from '../AutomationActionEnums';
import { InteractiveElement } from '../../dom/models';

export interface ActionCandidate {
  id: string; // Random UUID
  actionType: SupportedAction;
  targetElement?: InteractiveElement; // Nullable for global actions like BACK or WAIT
  payload?: any; // E.g., text to type into an INPUT
  
  // Scores populated by ScoringEngine
  priorityScore: ActionPriorityLevel;
  riskScore: number; // 0.0 to 1.0 (1.0 is extremely risky)
  confidenceScore: number; // 0.0 to 1.0
  estimatedBenefit: number;
  estimatedCost: number;
  
  reasoning: string; // Explains why this candidate was generated/scored this way
}
