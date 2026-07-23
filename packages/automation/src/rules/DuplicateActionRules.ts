import { ActionCandidate } from '../planning/models/ActionCandidate';

export class DuplicateActionRules {
  
  /**
   * Evaluates if this candidate is an exact duplicate of a previously executed action
   * within the current session's state context.
   */
  public static isDuplicate(candidate: ActionCandidate, previouslyExecutedElementIds: Set<string>): boolean {
    if (!candidate.targetElement) return false;

    // If we've already clicked this exact element on this page, it's likely a duplicate.
    // In complex SPAs, elements might be recreated with new IDs, but DOMAnalyzer maintains uniqueIds per scan.
    if (previouslyExecutedElementIds.has(candidate.targetElement.uniqueId)) {
      return true;
    }

    return false;
  }
}
