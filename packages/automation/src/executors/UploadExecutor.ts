import { ActionExecutor, ExecutorContext } from './ActionExecutor';
import { ActionResult, ActionStatus } from '../results/ActionResult';
import { SupportedAction } from '../planning/AutomationActionEnums';

export class UploadExecutor implements ActionExecutor {
  public async execute(context: ExecutorContext): Promise<ActionResult> {
    const { action, locator, previousUrl, page } = context;
    const startTime = new Date();

    try {
      if (action.actionType === SupportedAction.UPLOAD) {
        if (!locator) throw new Error('Locator is required for UPLOAD action');
        
        const filePath = action.payload?.filePath;
        if (!filePath) throw new Error('filePath payload is required for UPLOAD action');

        await locator.setInputFiles(filePath);
      } else if (action.actionType === SupportedAction.DOWNLOAD) {
        if (!locator) throw new Error('Locator is required for DOWNLOAD action');
        
        const downloadPromise = page.waitForEvent('download');
        await locator.click();
        const download = await downloadPromise;
        const downloadPath = action.payload?.downloadPath;
        if (downloadPath) {
          await download.saveAs(downloadPath);
        }
      } else {
        throw new Error(`Unsupported action type for UploadExecutor: ${action.actionType}`);
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
