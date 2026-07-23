import { ActionCandidate } from '../planning/models/ActionCandidate';
import { SafetyRules } from './SafetyRules';
import { DuplicateActionRules } from './DuplicateActionRules';
import { Logger } from '../utils/Logger';

const logger = new Logger('RuleEngine');

export class RuleEngine {
  
  /**
   * Filters a list of ActionCandidates, rejecting any that violate strict safety or duplication rules.
   * Returns only the safe candidates.
   */
  public static filterCandidates(
    candidates: ActionCandidate[], 
    executedElementIds: Set<string>
  ): ActionCandidate[] {
    const safeCandidates: ActionCandidate[] = [];

    for (const candidate of candidates) {
      if (SafetyRules.isDestructive(candidate)) {
        logger.warn(`ActionCandidate ${candidate.id} rejected by SafetyRules (Destructive).`);
        continue;
      }

      if (DuplicateActionRules.isDuplicate(candidate, executedElementIds)) {
        logger.debug(`ActionCandidate ${candidate.id} rejected by DuplicateActionRules.`);
        continue;
      }

      // Passed all rules
      safeCandidates.push(candidate);
    }

    return safeCandidates;
  }
}
