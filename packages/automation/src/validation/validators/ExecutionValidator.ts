import { ValidationRule, ValidationContext, ValidationRuleConfig } from '../rules/ValidationRule';
import { ValidationFinding } from '../findings/ValidationFinding';
import { Severity } from '../severity/Severity';
import * as crypto from 'crypto';

export class ExecutionValidator implements ValidationRule {
  public id = 'execution-validator';
  public name = 'Execution Validator';
  public description = 'Validates execution outcomes for navigation failures, timeouts, etc.';
  public config: ValidationRuleConfig = { enabled: true };

  public async validate(context: ValidationContext): Promise<ValidationFinding[]> {
    const findings: ValidationFinding[] = [];
    const actions = context.executionResult.actionResults;

    for (const action of actions) {
      if (action.status === 'FAILED') {
        const title = action.error?.message.toLowerCase().includes('timeout') ? 'Timeout Error' : 'Action Failed';
        
        findings.push(this.createFinding(
          title,
          Severity.HIGH,
          `Action ${action.actionId} failed: ${action.error?.message || 'Unknown error'}`,
          [], // We could link to the timeline
          action.actionId
        ));
      }
    }

    return findings;
  }

  private createFinding(title: string, severity: Severity, description: string, evidenceReferences: any[], actionId?: string): ValidationFinding {
    return {
      id: crypto.randomUUID(),
      category: 'EXECUTION',
      severity: this.config.severityOverride || severity,
      title,
      description,
      evidenceReferences,
      actionId,
      timestamp: new Date(),
    };
  }
}
