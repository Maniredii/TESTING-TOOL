import { ActionExecutor, ExecutorContext } from './ActionExecutor';
import { ActionResult, ActionStatus } from '../results/ActionResult';
import { SupportedAction } from '../planning/AutomationActionEnums';

export class InputExecutor implements ActionExecutor {
  public async execute(context: ExecutorContext): Promise<ActionResult> {
    const { action, locator, previousUrl, page } = context;
    const startTime = new Date();

    try {
      if (!locator) {
        throw new Error('Locator is required for InputExecutor');
      }

      await locator.waitFor({ state: 'visible', timeout: 10000 });

      switch (action.actionType) {
        case SupportedAction.INPUT:
          const text = action.payload?.text || '';
          const clearFirst = action.payload?.clear !== false;
          if (clearFirst) {
            await locator.fill('');
          }
          await locator.fill(text);
          break;

        case SupportedAction.SELECT:
          const optionValue = action.payload?.value;
          if (!optionValue) throw new Error('Value payload required for SELECT action');
          await locator.selectOption({ value: optionValue });
          break;

        case SupportedAction.CHECKBOX:
          const check = action.payload?.check ?? true;
          if (check) {
            await locator.check();
          } else {
            await locator.uncheck();
          }
          break;

        case SupportedAction.RADIO:
          await locator.check();
          break;

        default:
          throw new Error(`Unsupported action type for InputExecutor: ${action.actionType}`);
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
