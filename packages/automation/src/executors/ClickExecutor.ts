import { ActionExecutor, ExecutorContext } from './ActionExecutor';
import { ActionResult, ActionStatus } from '../results/ActionResult';
import { SupportedAction } from '../planning/AutomationActionEnums';

export class ClickExecutor implements ActionExecutor {
  public async execute(context: ExecutorContext): Promise<ActionResult> {
    const { action, locator, previousUrl, page } = context;
    const startTime = new Date();

    try {
      if (!locator) {
        throw new Error('Locator is required for ClickExecutor');
      }

      // We expect the locator to be resolved and wait to be handled by the engine before calling this,
      // but we can also ensure visibility.
      await locator.waitFor({ state: 'visible', timeout: 10000 });

      if (action.actionType === SupportedAction.CLICK) {
        const clickType = action.payload?.clickType || 'left';
        if (clickType === 'double') {
          await locator.dblclick();
        } else if (clickType === 'right') {
          await locator.click({ button: 'right' });
        } else {
          await locator.click();
        }
      } else {
        throw new Error(`Unsupported action type for ClickExecutor: ${action.actionType}`);
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
