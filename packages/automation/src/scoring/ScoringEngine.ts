import { ActionCandidate } from '../planning/models/ActionCandidate';
import { PriorityScorer } from './PriorityScorer';
import { RiskScorer } from './RiskScorer';

export class ScoringEngine {
  
  /**
   * Mutates the ActionCandidate in place, assigning its calculated scores.
   */
  public static scoreCandidate(candidate: ActionCandidate): void {
    candidate.priorityScore = PriorityScorer.calculateBasePriority(candidate);
    candidate.riskScore = RiskScorer.calculateRisk(candidate);
    
    // Confidence is how sure we are this action will succeed.
    // e.g. An <a> tag with an href has high confidence of navigating. A random <div> has low.
    candidate.confidenceScore = candidate.targetElement?.tag === 'a' ? 0.9 : 0.5;

    // Benefit vs Cost heuristics (placeholders for advanced AI logic later)
    candidate.estimatedBenefit = candidate.priorityScore * 10;
    candidate.estimatedCost = candidate.riskScore * 5;
    
    candidate.reasoning = `Scored Priority: ${candidate.priorityScore}, Risk: ${candidate.riskScore.toFixed(2)}`;
  }
}
