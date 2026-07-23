import { ValidationRuleEngine } from '../rules/ValidationRuleEngine';
import { ValidationResult } from '../models/ValidationResult';
import { ValidationSummary } from '../models/ValidationSummary';
import { ValidationContext } from '../rules/ValidationRule';
import { Severity } from '../severity/Severity';

import { NetworkValidator } from '../validators/NetworkValidator';
import { ConsoleValidator } from '../validators/ConsoleValidator';
import { DOMValidator } from '../validators/DOMValidator';
import { AccessibilityValidator } from '../validators/AccessibilityValidator';
import { ExecutionValidator } from '../validators/ExecutionValidator';

export class ValidationAnalyzer {
  private engine: ValidationRuleEngine;

  constructor() {
    this.engine = new ValidationRuleEngine();
    
    // Register default rules
    this.engine.registerRule(new NetworkValidator());
    this.engine.registerRule(new ConsoleValidator());
    this.engine.registerRule(new DOMValidator());
    this.engine.registerRule(new AccessibilityValidator());
    this.engine.registerRule(new ExecutionValidator());
  }

  public async analyze(context: ValidationContext): Promise<ValidationResult> {
    const startTime = Date.now();
    const findings = await this.engine.runValidation(context);
    const duration = Date.now() - startTime;

    const summary: ValidationSummary = {
      totalFindings: findings.length,
      criticalFindings: findings.filter(f => f.severity === Severity.CRITICAL).length,
      highFindings: findings.filter(f => f.severity === Severity.HIGH).length,
      mediumFindings: findings.filter(f => f.severity === Severity.MEDIUM).length,
      lowFindings: findings.filter(f => f.severity === Severity.LOW).length,
      infoFindings: findings.filter(f => f.severity === Severity.INFO).length,
      passedChecks: 0, // Placeholder, usually counted by the rule engine per check
      failedChecks: findings.length,
      validationTimeMs: duration,
    };

    return {
      executionId: context.executionResult.planId,
      timestamp: new Date(),
      summary,
      findings,
    };
  }
}
