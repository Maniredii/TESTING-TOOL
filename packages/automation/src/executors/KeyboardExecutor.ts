import { ActionExecutor, ExecutorContext } from './ActionExecutor';
import { ActionResult, ActionStatus } from '../results/ActionResult';
import { SupportedAction } from '../planning/AutomationActionEnums';

export class KeyboardExecutor implements ActionExecutor {
  public async execute(context: ExecutorContext): Promise<ActionResult> {
    const { action, locator, previousUrl, page } = context;
    const startTime = new Date();

    try {
      if (action.actionType === SupportedAction.WAIT) {
        const timeout = action.payload?.timeout || 1000;
        await page.waitForTimeout(timeout);
      } else if (action.actionType === SupportedAction.HOVER) {
        if (!locator) throw new Error('Locator is required for HOVER action');
        await locator.hover();
      } else if (action.actionType === 'FOCUS' as any) {
        if (!locator) throw new Error('Locator is required for FOCUS action');
        await locator.focus();
      } else if (action.actionType === 'BLUR' as any) {
        if (!locator) throw new Error('Locator is required for BLUR action');
        await locator.blur();
      } else if (action.actionType === 'PRESS_KEY' as any) {
        const key = action.payload?.key;
        if (!key) throw new Error('key payload is required for PRESS_KEY action');
        if (locator) {
          await locator.press(key);
        } else {
          await page.keyboard.press(key);
        }
      } else {
        throw new Error(`Unsupported action type for KeyboardExecutor: ${action.actionType}`);
      }

      const endTime = new Date();
      return {
        actionId: action.id,
        actionType: action.actionType,
        status: ActionStatus.SUCCESS,
        startTime,
        endTime,
        duration: endTime.getTime() - startTime.getTime(),
        previousUrl,
        currentUrl: page.url(),
      };
    } catch (error: any) {
      const endTime = new Date();
      return {
        actionId: action.id,
        actionType: action.actionType,
        status: ActionStatus.FAILED,
        startTime,
        endTime,
        duration: endTime.getTime() - startTime.getTime(),
        previousUrl,
        currentUrl: page.url(),
        error,
      };
    }
  }
}
