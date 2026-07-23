import { ActionExecutor, ExecutorContext } from './ActionExecutor';
import { ActionResult, ActionStatus } from '../results/ActionResult';
import { SupportedAction } from '../planning/AutomationActionEnums';

export class NavigationExecutor implements ActionExecutor {
  public async execute(context: ExecutorContext): Promise<ActionResult> {
    const { action, previousUrl, page } = context;
    const startTime = new Date();

    try {
      switch (action.actionType) {
        case SupportedAction.NAVIGATION:
          const url = action.payload?.url;
          if (!url) throw new Error('URL payload required for NAVIGATION action');
          await page.goto(url, { waitUntil: 'load' });
          break;

        case SupportedAction.REFRESH:
          await page.reload({ waitUntil: 'load' });
          break;

        case SupportedAction.BACK:
          await page.goBack({ waitUntil: 'load' });
          break;

        case SupportedAction.FORWARD:
          await page.goForward({ waitUntil: 'load' });
          break;

        default:
          throw new Error(`Unsupported action type for NavigationExecutor: ${action.actionType}`);
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
