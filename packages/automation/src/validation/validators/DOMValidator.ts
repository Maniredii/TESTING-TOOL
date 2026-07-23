import { ValidationRule, ValidationContext, ValidationRuleConfig } from '../rules/ValidationRule';
import { ValidationFinding } from '../findings/ValidationFinding';
import { Severity } from '../severity/Severity';
import * as crypto from 'crypto';

export class DOMValidator implements ValidationRule {
  public id = 'dom-validator';
  public name = 'DOM Validator';
  public description = 'Validates DOM snapshots for broken links, missing images, duplicate IDs, and empty buttons.';
  public config: ValidationRuleConfig = { enabled: true };

  public async validate(context: ValidationContext): Promise<ValidationFinding[]> {
    const findings: ValidationFinding[] = [];
    const snapshots = context.evidenceBundle.domSnapshots || [];

    for (const [index, snapshot] of snapshots.entries()) {
      const evidenceRef = { type: 'DOM_SNAPSHOT' as const, id: index.toString() };
      const html = snapshot.html || '';

      // Very rudimentary static checks via regex or simple parsing for demonstration.
      // In a real scenario, we might use JSDOM or cheerio, but we keep it simple here.

      // Broken Links (href="#" or href="")
      const emptyLinks = html.match(/<a[^>]*href=["'](?:#|)["'][^>]*>/gi);
      if (emptyLinks) {
        for (const link of emptyLinks) {
          findings.push(this.createFinding(
            'Broken Link',
            Severity.MEDIUM,
            `Found potentially broken link: ${link}`,
            [evidenceRef],
            snapshot.actionId
          ));
        }
      }

      // Missing Images (img without src)
      const emptyImages = html.match(/<img[^>]*src=["'](?:)["'][^>]*>/gi);
      if (emptyImages) {
        for (const img of emptyImages) {
          findings.push(this.createFinding(
            'Missing Image Source',
            Severity.HIGH,
            `Found image with empty src: ${img}`,
            [evidenceRef],
            snapshot.actionId
          ));
        }
      }

      // Empty Buttons (button without text)
      const emptyButtons = html.match(/<button[^>]*>\s*<\/button>/gi);
      if (emptyButtons) {
        for (const btn of emptyButtons) {
          findings.push(this.createFinding(
            'Empty Button',
            Severity.LOW,
            `Found button with no text or content`,
            [evidenceRef],
            snapshot.actionId
          ));
        }
      }

      // Duplicate IDs
      const idMatches = [...html.matchAll(/id=["']([^"']+)["']/g)];
      const ids = idMatches.map(m => m[1]);
      const duplicates = ids.filter((item, index) => ids.indexOf(item) !== index);
      if (duplicates.length > 0) {
        const uniqueDups = Array.from(new Set(duplicates));
        for (const dup of uniqueDups) {
          findings.push(this.createFinding(
            'Duplicate ID',
            Severity.MEDIUM,
            `Duplicate DOM ID found: ${dup}`,
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
      category: 'DOM',
      severity: this.config.severityOverride || severity,
      title,
      description,
      evidenceReferences,
      actionId,
      timestamp: new Date(),
    };
  }
}
