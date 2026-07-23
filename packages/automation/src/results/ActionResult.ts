export enum ActionStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  SKIPPED = 'SKIPPED',
  RECOVERED = 'RECOVERED'
}

export interface ValidationResult {
  isValid: boolean;
  checks: {
    actionCompleted: boolean;
    elementExists: boolean;
    pageChanged: boolean;
    navigationOccurred: boolean;
    noUnexpectedError: boolean;
  };
  message?: string;
}

export interface ActionResult {
  actionId: string;
  actionType: string;
  status: ActionStatus;
  startTime: Date;
  endTime: Date;
  duration: number;
  previousUrl: string;
  currentUrl: string;
  elementMetadata?: any;
  validationResult?: ValidationResult;
  error?: Error;
}
