import { ActionCandidate } from '../planning/models/ActionCandidate';
import { ClassificationCategory } from '../dom/types';

export class SafetyRules {
  
  /**
   * Evaluates an ActionCandidate for destructive or highly risky behavior.
   * If true, the action MUST NOT be executed.
   */
  public static isDestructive(candidate: ActionCandidate): boolean {
    if (!candidate.targetElement) return false;

    // 1. Hard block on DANGER classification from the DOM Analyzer
    if (candidate.targetElement.classification === ClassificationCategory.DANGER) {
      return true;
    }

    // 2. Hard block on common destructive keywords in the payload
    if (candidate.payload && typeof candidate.payload === 'string') {
      const p = candidate.payload.toLowerCase();
      if (p.includes('delete') || p.includes('destroy') || p.includes('drop table')) {
        return true;
      }
    }

    // 3. Prevent unexpected logout loops
    // The crawler should rarely log itself out unless specifically testing logout flows.
    // For general graph building / execution, we block logouts by default.
    const combinedText = (candidate.targetElement.text + ' ' + candidate.targetElement.accessibleName).toLowerCase();
    if (combinedText.includes('logout') || combinedText.includes('sign out')) {
      return true;
    }

    // 4. Prevent actual purchases/payments
    if (combinedText.includes('pay now') || combinedText.includes('submit payment') || combinedText.includes('confirm order')) {
      return true;
    }

    return false;
  }
}
