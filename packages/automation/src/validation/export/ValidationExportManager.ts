import { ValidationResult } from '../models/ValidationResult';

export class ValidationExportManager {
  // Do not generate HTML.
  // Do not generate PDF.
  // Provide APIs returning validation models.
  
  public exportAsJSON(result: ValidationResult): string {
    return JSON.stringify(result, null, 2);
  }

  public getRawResult(result: ValidationResult): ValidationResult {
    return result;
  }
}
