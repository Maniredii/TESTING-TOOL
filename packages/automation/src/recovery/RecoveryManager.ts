import { Page } from 'playwright';
import { ActionResult, ActionStatus } from '../results/ActionResult';
import { ExecutorContext, ActionExecutor } from '../executors/ActionExecutor';
import { LocatorStrategies } from '../execution/LocatorStrategies';
import { AutomationEventEmitter } from '../events/AutomationEventEmitter';

export enum RecoveryStrategy {
  RETRY_ACTION = 'RETRY_ACTION',
  RETRY_NAVIGATION = 'RETRY_NAVIGATION',
  RELOCATE_ELEMENT = 'RELOCATE_ELEMENT',
  REFRESH_PAGE = 'REFRESH_PAGE',
  RESUME_EXECUTION = 'RESUME_EXECUTION',
  ABORT_EXECUTION = 'ABORT_EXECUTION',
}

export class RecoveryManager {
  private maxRetries = 2;

  public async attemptRecovery(
    context: ExecutorContext,
    executor: ActionExecutor,
    error: Error
  ): Promise<ActionResult> {
    const emitter = AutomationEventEmitter.getInstance();
    emitter.emit('recovery:started', { actionId: context.action.id, error: error.message });

    const strategy = this.determineStrategy(error);
    
    let result: ActionResult;

    switch (strategy) {
      case RecoveryStrategy.RETRY_ACTION:
        result = await this.retryAction(context, executor);
        break;
      case RecoveryStrategy.RELOCATE_ELEMENT:
        result = await this.relocateAndRetry(context, executor);
        break;
      case RecoveryStrategy.REFRESH_PAGE:
        result = await this.refreshAndRetry(context, executor);
        break;
      case RecoveryStrategy.ABORT_EXECUTION:
      default:
        emitter.emit('recovery:failed', { actionId: context.action.id, strategy });
        throw error;
    }

    emitter.emit('recovery:completed', { actionId: context.action.id, strategy, status: result.status });
    return result;
  }

  private determineStrategy(error: Error): RecoveryStrategy {
    const msg = error.message.toLowerCase();
    if (msg.includes('timeout')) return RecoveryStrategy.RETRY_ACTION;
    if (msg.includes('detached') || msg.includes('not found')) return RecoveryStrategy.RELOCATE_ELEMENT;
    if (msg.includes('navigation') || msg.includes('network')) return RecoveryStrategy.REFRESH_PAGE;
    if (msg.includes('closed') || msg.includes('permission')) return RecoveryStrategy.ABORT_EXECUTION;
    
    return RecoveryStrategy.RETRY_ACTION; // Default
  }

  private async retryAction(context: ExecutorContext, executor: ActionExecutor): Promise<ActionResult> {
    for (let i = 0; i < this.maxRetries; i++) {
      const result = await executor.execute(context);
      if (result.status === ActionStatus.SUCCESS) {
        result.status = ActionStatus.RECOVERED;
        return result;
      }
      await context.page.waitForTimeout(1000 * (i + 1));
    }
    throw new Error('Recovery failed after max retries');
  }

  private async relocateAndRetry(context: ExecutorContext, executor: ActionExecutor): Promise<ActionResult> {
    if (context.action.targetElement) {
      context.locator = LocatorStrategies.resolveLocator(context.page, context.action.targetElement);
    }
    return this.retryAction(context, executor);
  }

  private async refreshAndRetry(context: ExecutorContext, executor: ActionExecutor): Promise<ActionResult> {
    await context.page.reload({ waitUntil: 'load' });
    if (context.action.targetElement) {
      context.locator = LocatorStrategies.resolveLocator(context.page, context.action.targetElement);
    }
    return this.retryAction(context, executor);
  }
}
