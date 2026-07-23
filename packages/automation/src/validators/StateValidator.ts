import { Page, Locator } from 'playwright';
import { ValidationResult } from '../results/ActionResult';

export class StateValidator {
  public static async validate(
    page: Page,
    locator?: Locator,
    previousUrl?: string,
    actionError?: Error
  ): Promise<ValidationResult> {
    const checks = {
      actionCompleted: !actionError,
      elementExists: true,
      pageChanged: false,
      navigationOccurred: false,
      noUnexpectedError: true,
    };

    if (locator) {
      try {
        const count = await locator.count();
        checks.elementExists = count > 0;
      } catch (e) {
        checks.elementExists = false;
      }
    }

    if (previousUrl) {
      const currentUrl = page.url();
      checks.navigationOccurred = currentUrl !== previousUrl;
      checks.pageChanged = currentUrl !== previousUrl; // Can be extended with visual/DOM diffs later
    }

    // Check for unexpected error dialogs or known error elements
    try {
      const errorDialogs = await page.locator('.error-dialog, [role="alert"]').count();
      checks.noUnexpectedError = errorDialogs === 0;
    } catch (e) {
      // Ignore
    }

    const isValid = checks.actionCompleted && checks.noUnexpectedError;

    return {
      isValid,
      checks,
      message: isValid ? 'State is valid.' : 'State validation failed.',
    };
  }
}
