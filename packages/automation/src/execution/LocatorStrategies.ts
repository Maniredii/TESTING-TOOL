import { Page, Locator } from 'playwright';
import { InteractiveElement } from '../dom/models';

export class LocatorStrategies {
  public static resolveLocator(page: Page, element: InteractiveElement): Locator {
    // 1. Role (Preferred if role and accessibleName are both present)
    if (element.role && element.accessibleName) {
      // Some roles might need exact match or not, we do exact by default for safety, but loosely is fine.
      try {
        return page.getByRole(element.role as any, { name: element.accessibleName, exact: true });
      } catch (e) {
        // Fallback to non-exact if exact fails or role is unsupported by Playwright natively
        return page.getByRole(element.role as any, { name: element.accessibleName });
      }
    }

    // 2. Test ID
    const testId = element.attributes['data-testid'] || element.attributes['data-test-id'];
    if (testId) {
      return page.getByTestId(testId);
    }

    // 3. Label
    if (element.label) {
      return page.getByLabel(element.label);
    }

    // 4. Placeholder
    if (element.placeholder) {
      return page.getByPlaceholder(element.placeholder);
    }

    // 5. CSS Selector
    if (element.cssSelector) {
      return page.locator(element.cssSelector);
    }

    // 6. XPath (Fallback)
    if (element.xpath) {
      return page.locator(`xpath=${element.xpath}`);
    }

    // If everything fails, use a generic fallback using tag and attributes if possible, but cssSelector should always be present.
    throw new Error(`Cannot resolve locator for element ${element.uniqueId}`);
  }
}
