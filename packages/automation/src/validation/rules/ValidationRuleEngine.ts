import { ValidationRule, ValidationContext } from './ValidationRule';
import { ValidationFinding } from '../findings/ValidationFinding';

export class ValidationRuleEngine {
  private rules: Map<string, ValidationRule> = new Map();

  public registerRule(rule: ValidationRule) {
    this.rules.set(rule.id, rule);
  }

  public getRule(id: string): ValidationRule | undefined {
    return this.rules.get(id);
  }

  public async runValidation(context: ValidationContext): Promise<ValidationFinding[]> {
    const findings: ValidationFinding[] = [];

    for (const rule of this.rules.values()) {
      if (!rule.config.enabled) continue;
      
      try {
        const ruleFindings = await rule.validate(context);
        findings.push(...ruleFindings);
      } catch (e) {
        console.error(`Error running rule ${rule.id}`, e);
      }
    }

    return findings;
  }
}
