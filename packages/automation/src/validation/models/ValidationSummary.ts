export interface ValidationSummary {
  totalFindings: number;
  criticalFindings: number;
  highFindings: number;
  mediumFindings: number;
  lowFindings: number;
  infoFindings: number;
  passedChecks: number;
  failedChecks: number;
  validationTimeMs: number;
}
