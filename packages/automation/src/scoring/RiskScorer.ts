import { ActionCandidate } from '../planning/models/ActionCandidate';

export class RiskScorer {
  
  /**
   * Calculates a risk score from 0.0 to 1.0 for a given action.
   * Higher risk actions might be avoided or deprioritized in certain execution modes.
   */
  public static calculateRisk(candidate: ActionCandidate): number {
    let risk = 0.1; // Baseline risk for any action

    if (!candidate.targetElement) {
      return risk;
    }

    const tag = candidate.targetElement.tag.toLowerCase();
    const type = candidate.targetElement.attributes['type']?.toLowerCase() || '';

    // Forms that submit data are inherently riskier than simple navigation links
    if (tag === 'form' || type === 'submit') {
      risk += 0.3;
    }

    // Inputs might trigger validation errors or state changes
    if (tag === 'input' || tag === 'textarea') {
      risk += 0.2;
    }

    return Math.min(risk, 1.0);
  }
}
