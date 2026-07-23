import { ValidationRule, ValidationContext, ValidationRuleConfig } from '../rules/ValidationRule';
import { ValidationFinding } from '../findings/ValidationFinding';
import { Severity } from '../severity/Severity';
import * as crypto from 'crypto';

export class NetworkValidator implements ValidationRule {
  public id = 'network-validator';
  public name = 'Network Validator';
  public description = 'Validates network requests for failures, status codes, broken downloads, and mixed content.';
  public config: ValidationRuleConfig = { enabled: true };

  public async validate(context: ValidationContext): Promise<ValidationFinding[]> {
    const findings: ValidationFinding[] = [];
    const entries = context.evidenceBundle.network.entries;

    for (const [index, entry] of entries.entries()) {
      const evidenceRef = { type: 'NETWORK' as const, id: index.toString() };

      // Failed Requests
      if (entry.error) {
        findings.push(this.createFinding(
          'Failed Network Request',
          Severity.HIGH,
          `Request to ${entry.url} failed with error: ${entry.error}`,
          [evidenceRef],
          entry.url
        ));
      }

      // HTTP Status Codes
      if (entry.statusCode && entry.statusCode >= 400) {
        const severity = entry.statusCode >= 500 ? Severity.CRITICAL : Severity.MEDIUM;
        findings.push(this.createFinding(
          'HTTP Error Status Code',
          severity,
          `Request to ${entry.url} responded with status ${entry.statusCode}`,
          [evidenceRef],
          entry.url
        ));
      }

      // Mixed Content (HTTPS page loading HTTP resources)
      if (context.evidenceBundle.metadata.url.startsWith('https://') && entry.url.startsWith('http://')) {
        findings.push(this.createFinding(
          'Mixed Content',
          Severity.HIGH,
          `Insecure resource ${entry.url} loaded on a secure page.`,
          [evidenceRef],
          entry.url
        ));
      }
    }

    return findings;
  }

  private createFinding(title: string, severity: Severity, description: string, evidenceReferences: any[], url: string): ValidationFinding {
    return {
      id: crypto.randomUUID(),
      category: 'NETWORK',
      severity: this.config.severityOverride || severity,
      title,
      description,
      evidenceReferences,
      affectedUrl: url,
      timestamp: new Date(),
    };
  }
}
