import { ActionExecutor, ExecutorContext } from './ActionExecutor';
import { ActionResult, ActionStatus } from '../results/ActionResult';
import { SupportedAction } from '../planning/AutomationActionEnums';

export class ScrollExecutor implements ActionExecutor {
  public async execute(context: ExecutorContext): Promise<ActionResult> {
    const { action, locator, previousUrl, page } = context;
    const startTime = new Date();

    try {
      if (action.actionType !== SupportedAction.SCROLL) {
        throw new Error(`Unsupported action type for ScrollExecutor: ${action.actionType}`);
      }

      const direction = action.payload?.direction || 'down';
      
      if (locator) {
        await locator.scrollIntoViewIfNeeded();
      } else {
        if (direction === 'down') {
          await page.evaluate(() => window.scrollBy(0, window.innerHeight));
        } else if (direction === 'up') {
          await page.evaluate(() => window.scrollBy(0, -window.innerHeight));
        } else if (direction === 'bottom') {
          await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        } else if (direction === 'top') {
          await page.evaluate(() => window.scrollTo(0, 0));
        }
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
