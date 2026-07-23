import { Page, Locator } from 'playwright';

export enum WaitCondition {
  ELEMENT_VISIBLE = 'ELEMENT_VISIBLE',
  ELEMENT_ENABLED = 'ELEMENT_ENABLED',
  NETWORK_IDLE = 'NETWORK_IDLE',
  NAVIGATION_COMPLETE = 'NAVIGATION_COMPLETE',
  DOM_LOADED = 'DOM_LOADED',
  TIMEOUT = 'TIMEOUT',
}

export interface WaitOptions {
  timeout?: number; // Custom timeout in milliseconds
}

export class WaitStrategy {
  public static async waitFor(
    condition: WaitCondition,
    page: Page,
    locator?: Locator,
    options?: WaitOptions
  ): Promise<void> {
    const timeout = options?.timeout || 30000; // Default to 30s

    switch (condition) {
      case WaitCondition.ELEMENT_VISIBLE:
        if (!locator) throw new Error('Locator is required for ELEMENT_VISIBLE condition');
        await locator.waitFor({ state: 'visible', timeout });
        break;
      case WaitCondition.ELEMENT_ENABLED:
        if (!locator) throw new Error('Locator is required for ELEMENT_ENABLED condition');
        // Playwright handles enabled check during actions, but we can explicitly wait for it to be attached and not disabled
        await locator.waitFor({ state: 'attached', timeout });
        const isDisabled = await locator.isDisabled({ timeout });
        if (isDisabled) {
            throw new Error(`Element is still disabled after ${timeout}ms`);
        }
        break;
      case WaitCondition.NETWORK_IDLE:
        await page.waitForLoadState('networkidle', { timeout });
        break;
      case WaitCondition.NAVIGATION_COMPLETE:
        await page.waitForLoadState('load', { timeout });
        break;
      case WaitCondition.DOM_LOADED:
        await page.waitForLoadState('domcontentloaded', { timeout });
        break;
      case WaitCondition.TIMEOUT:
        await page.waitForTimeout(timeout);
        break;
      default:
        throw new Error(`Unknown wait condition: ${condition}`);
    }
  }
}
