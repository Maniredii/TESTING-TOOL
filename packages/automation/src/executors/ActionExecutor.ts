import { Page, Locator } from 'playwright';
import { ActionCandidate } from '../planning/models/ActionCandidate';
import { ActionResult } from '../results/ActionResult';

export interface ExecutorContext {
  page: Page;
  action: ActionCandidate;
  locator?: Locator;
  previousUrl: string;
}

export interface ActionExecutor {
  execute(context: ExecutorContext): Promise<ActionResult>;
}
