import { ActionCandidate } from './ActionCandidate';

export enum StepStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  SKIPPED = 'SKIPPED',
  CANCELLED = 'CANCELLED'
}

export interface ExecutionStep {
  id: string;
  order: number; // Step order in the plan
  candidate: ActionCandidate;
  status: StepStatus;
  startedAt?: Date;
  completedAt?: Date;
  errorMessage?: string;
}
