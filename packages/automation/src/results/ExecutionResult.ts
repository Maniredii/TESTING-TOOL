import { ActionResult } from './ActionResult';
import { ExecutionMetrics } from '../metrics/ExecutionMetrics';

export interface ExecutionResult {
  planId: string;
  success: boolean;
  actionResults: ActionResult[];
  metrics: ExecutionMetrics;
  error?: Error;
}
