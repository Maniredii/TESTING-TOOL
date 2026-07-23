import { ValidationRule, ValidationContext, ValidationRuleConfig } from '../rules/ValidationRule';
import { ValidationFinding } from '../findings/ValidationFinding';
import { Severity } from '../severity/Severity';
import * as crypto from 'crypto';

export class ConsoleValidator implements ValidationRule {
  public id = 'console-validator';
  public name = 'Console Validator';
  public description = 'Validates console logs for JavaScript errors and exceptions.';
  public config: ValidationRuleConfig = { enabled: true };

  public async validate(context: ValidationContext): Promise<ValidationFinding[]> {
    const findings: ValidationFinding[] = [];
    const entries = context.evidenceBundle.consoleLogs.entries;

    for (const [index, entry] of entries.entries()) {
      const evidenceRef = { type: 'CONSOLE' as const, id: index.toString() };

      if (entry.type === 'error') {
        findings.push(this.createFinding(
          'JavaScript Console Error',
          Severity.HIGH,
          entry.text,
          [evidenceRef],
          entry.actionId
        ));
      } else if (entry.type === 'exception') {
        findings.push(this.createFinding(
          'Unhandled Exception',
          Severity.CRITICAL,
          entry.text,
          [evidenceRef],
          entry.actionId
        ));
      }
    }

    return findings;
  }

  private createFinding(title: string, severity: Severity, description: string, evidenceReferences: any[], actionId?: string): ValidationFinding {
    return {
      id: crypto.randomUUID(),
      category: 'CONSOLE',
      severity: this.config.severityOverride || severity,
      title,
      description,
      evidenceReferences,
      actionId,
      timestamp: new Date(),
    };
  }
}
