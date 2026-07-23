import { ValidationRule, ValidationContext, ValidationRuleConfig } from '../rules/ValidationRule';
import { ValidationFinding } from '../findings/ValidationFinding';
import { Severity } from '../severity/Severity';
import * as crypto from 'crypto';

export class AccessibilityValidator implements ValidationRule {
  public id = 'a11y-validator';
  public name = 'Accessibility Validator';
  public description = 'Validates accessibility basics like missing alt attributes.';
  public config: ValidationRuleConfig = { enabled: true };

  public async validate(context: ValidationContext): Promise<ValidationFinding[]> {
    const findings: ValidationFinding[] = [];
    const snapshots = context.evidenceBundle.domSnapshots || [];

    for (const [index, snapshot] of snapshots.entries()) {
      const evidenceRef = { type: 'DOM_SNAPSHOT' as const, id: index.toString() };
      const html = snapshot.html || '';

      // Missing alt attributes on images
      const imgNoAlt = html.match(/<img(?![^>]*alt=["'][^"']*["'])[^>]*>/gi);
      if (imgNoAlt) {
        for (const img of imgNoAlt) {
          findings.push(this.createFinding(
            'Missing Alt Attribute',
            Severity.MEDIUM,
            `Found image without alt attribute: ${img}`,
            [evidenceRef],
            snapshot.actionId
          ));
        }
      }
    }

    return findings;
  }

  private createFinding(title: string, severity: Severity, description: string, evidenceReferences: any[], actionId?: string): ValidationFinding {
    return {
      id: crypto.randomUUID(),
      category: 'ACCESSIBILITY',
      severity: this.config.severityOverride || severity,
      title,
      description,
      evidenceReferences,
      actionId,
      timestamp: new Date(),
    };
  }
}
